"""Offline, fail-closed research preparation. Never changes public content.

python scripts/prepare-analysis.py [snapshot-directory]
Outputs stay under ignored output/analysis/<snapshot>/. No network or inference API.
"""
import csv
import hashlib
import json
import math
import platform
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DISPOSITIONS = {
    "accepted-observation", "repeated-claim", "background-context",
    "date-metadata", "irrelevant", "unresolved-ambiguity",
}


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True,
                                    separators=(",", ":")).encode()).hexdigest()


def read(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def canonical_sources(articles):
    """Exact-text equivalence only; never infer activity equivalence from a title."""
    groups = defaultdict(list)
    for article in articles:
        if hashlib.sha256(article["text"].encode()).hexdigest() != article["text_sha256"]:
            raise ValueError(f"Changed text: {article['source_id']}")
        groups[article["text_sha256"]].append(article)
    result, mapping = [], {}
    for group in groups.values():
        # Prefer posts: pages may have template dates, not publication chronology.
        group.sort(key=lambda a: (a["source_type"] != "posts", a["report_date"], a["source_id"]))
        chosen = group[0]
        result.append(chosen)
        for article in group:
            mapping[article["source_id"]] = chosen["source_id"]
    return sorted(result, key=lambda a: a["source_id"]), mapping


def build_queue(articles, candidates, decisions):
    by_id = {a["source_id"]: a for a in articles}
    if len(by_id) != len(articles):
        raise ValueError("Duplicate source IDs")
    by_candidate = {c["candidate_id"]: c for c in candidates}
    if len(by_candidate) != len(candidates):
        raise ValueError("Duplicate candidate IDs")
    if len({d["candidate_id"] for d in decisions}) != len(decisions):
        raise ValueError("Duplicate review decisions")
    reviewed = {d["candidate_id"]: d for d in decisions}
    if set(reviewed) - set(by_candidate):
        raise ValueError("Review refers to missing candidate")
    _, source_aliases = canonical_sources(articles)
    repeated = defaultdict(list)
    for candidate in candidates:
        repeated[(candidate["text_sha256"], candidate["paragraph"])].append(candidate)
    repeat_of = {}
    for group in repeated.values():
        group.sort(key=lambda c: (c["source_id"] != source_aliases[c["source_id"]],
                                  c["location"] == "title", c["source_id"], c["candidate_id"]))
        for other in group[1:]:
            repeat_of[other["candidate_id"]] = group[0]["candidate_id"]
    queue = []
    for candidate in candidates:
        article = by_id[candidate["source_id"]]
        if candidate["text_sha256"] != article["text_sha256"]:
            raise ValueError("Candidate source hash mismatch")
        if candidate["report_date"] != article["report_date"] or candidate["url"] != article["url"]:
            raise ValueError("Candidate citation/date mismatch")
        passage = candidate["paragraph"]
        if passage != article["title"] and passage not in article["text"]:
            raise ValueError("Candidate passage absent from source")
        fingerprint = digest({"source_id": candidate["source_id"],
                              "text_sha256": article["text_sha256"],
                              "report_date": article["report_date"], "url": article["url"],
                              "location": candidate["location"], "paragraph": passage})
        decision = reviewed.get(candidate["candidate_id"])
        if decision:
            if decision["fingerprint"] != fingerprint:
                raise ValueError(f"Stale decision: {candidate['candidate_id']}")
            if decision["disposition"] not in DISPOSITIONS or not decision.get("reason") or not decision.get("reviewer"):
                raise ValueError("Incomplete editorial decision")
            if decision["disposition"] == "accepted-observation":
                # An extraction/review decision alone cannot publish a number.
                if not decision.get("observation_id"):
                    raise ValueError("Accepted candidate needs an observation ID")
        duplicate = repeat_of.get(candidate["candidate_id"])
        queue.append({**candidate, "fingerprint": fingerprint, "exact_repeat_of": duplicate,
                      "disposition": decision["disposition"] if decision else "repeated-claim" if duplicate else "unresolved-ambiguity",
                      "decision_status": "reviewed" if decision else "automatic-exact-repeat" if duplicate else "awaiting-review",
                      "reason": decision["reason"] if decision else "Identical passage in the same exact-full-text group; no new observation. Canonical passage still needs review." if duplicate else "Context, unit, stage, relevance and overlap need editorial review.",
                      "decision": decision})
    # Close only the duplicate-to-reviewed-passage link, never create observations
    # or independent corroboration. A canonical hold stays a hold in this link.
    by_queue_id = {q["candidate_id"]: q for q in queue}
    for row in queue:
        row["canonical_decision"] = None
        if row["decision"] is None and row["exact_repeat_of"]:
            canonical = by_queue_id[row["exact_repeat_of"]]
            if canonical["decision"] is not None:
                row["decision_status"] = "linked-exact-repeat"
                row["canonical_decision"] = {
                    "candidate_id": canonical["candidate_id"],
                    "fingerprint": canonical["fingerprint"],
                    "disposition": canonical["disposition"],
                }
                row["reason"] = "Exact repeated passage linked to its reviewed canonical decision; not another observation or independent source."
    return queue


def review_complete(queue):
    return bool(queue) and all(q["decision_status"] in {"reviewed", "linked-exact-repeat"} for q in queue)


def is_author_line(line):
    parts = line.strip().split()
    if not parts or parts[0].casefold() != "by":
        return False
    author = parts[1:]
    if " ".join(author).casefold() in {"our correspondent", "reporter"}:
        return True
    return 2 <= len(author) <= 6 and all(
        token[0].isupper() and all(ch.isalpha() or ch in "'.’-" for ch in token)
        for token in author)


def clean_corpus(articles, reviewed_removed_lines=()):
    # Drop bylines and exact repeated short lines, preserving original archive.
    # Long shared narratives remain: repetition alone does not prove boilerplate.
    counts = Counter(line.strip().lower() for a in articles
                     for line in set(a["text"].splitlines()) if line.strip())
    boilerplate = sorted({line for line, count in counts.items()
                          if count >= 8 and len(line) < 180} |
                         {line.strip().lower() for line in reviewed_removed_lines})
    cleaned = []
    for article in articles:
        lines = [line for line in article["text"].splitlines()
                 if line.strip().lower() not in boilerplate
                 and not is_author_line(line)]
        cleaned.append("\n".join(lines).lower())
    return cleaned, boilerplate


def validate_observations(articles, queue, observations):
    """Check reviewed research observations; this does not approve publication."""
    by_source = {a["source_id"]: a for a in articles}
    by_candidate = {q["candidate_id"]: q for q in queue}
    ids = set()
    for observation in observations:
        identifier = observation["id"]
        if not identifier or identifier in ids:
            raise ValueError("Duplicate/missing observation ID")
        ids.add(identifier)
        candidate = by_candidate[observation["candidate_id"]]
        decision = candidate["decision"]
        if not decision or decision["disposition"] != "accepted-observation" or decision.get("observation_id") != identifier:
            raise ValueError("Observation lacks an accepted source-context decision")
        if decision.get("observation_fingerprint") != digest(observation):
            raise ValueError("Observation changed since source-context review")
        article = by_source[candidate["source_id"]]
        if observation["source_id"] != article["source_id"] or observation["source_url"] != article["url"] or observation["source_text_sha256"] != article["text_sha256"]:
            raise ValueError("Observation source mismatch")
        if observation["report_date"] != article["report_date"][:10] or observation["event_date"] is not None:
            raise ValueError("Observation date mismatch or unreviewed inferred event date")
        if not observation["evidence_excerpt"] or observation["evidence_excerpt"] not in candidate["paragraph"]:
            raise ValueError("Observation evidence absent from candidate")
        if not observation["original_numeric_wording"] or observation["original_numeric_wording"] not in observation["evidence_excerpt"]:
            raise ValueError("Original numeric wording absent from evidence")
        value = observation["value"]
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or value < 0:
            raise ValueError("Invalid observation value")
        if observation["bound"] not in {"exact", "greater-than", "at-least", "approximate"} or observation["stage"] not in {"reported-delivery", "target"}:
            raise ValueError("Invalid observation bound/stage")
        for field in ("activity_id", "unit", "population", "date_basis", "isa_role", "limitations"):
            if not observation.get(field):
                raise ValueError(f"Missing observation context: {field}")
        if not isinstance(observation.get("geography"), list) or not observation.get("partners"):
            raise ValueError("Missing observation geography/partner context")
        if observation.get("public_approved") is not False:
            raise ValueError("Research observations cannot establish public approval")
    required = {q["decision"]["observation_id"] for q in queue if q["decision"] and q["disposition"] == "accepted-observation"}
    if required != ids:
        raise ValueError("Accepted decisions have unresolved observation references")
    return observations


def validate_source_decisions(articles, decisions):
    by_id = {a["source_id"]: a for a in articles}
    if len({d["source_id"] for d in decisions}) != len(decisions):
        raise ValueError("Duplicate source relevance decisions")
    for decision in decisions:
        article = by_id[decision["source_id"]]
        if any(decision[d] != article[a] for d, a in [("text_sha256", "text_sha256"), ("source_url", "url"), ("report_date", "report_date")]):
            raise ValueError("Stale source relevance decision")
        if decision["relevance"] not in {"include-isa-reporting", "exclude-other-person-reporting", "unresolved"} or not decision.get("reason") or not decision.get("reviewer"):
            raise ValueError("Incomplete source relevance decision")
    return decisions


def validate_activities(articles, source_decisions, activities):
    """Qualitative activities carry evidence and stages, never invented measures."""
    by_source = {a["source_id"]: a for a in articles}
    relevance = {d["source_id"]: d for d in source_decisions}
    categories = {"policy-accessibility", "livelihoods", "education-training", "healthcare-welfare",
                  "digital-assistive-technology", "sport", "political-engagement", "honours-ceremonial"}
    stages = {"reported-activity", "reported-appointment", "reported-award", "announced", "stated-agenda"}
    ids = set()
    for activity in activities:
        if not activity.get("id") or activity["id"] in ids:
            raise ValueError("Duplicate/missing qualitative activity ID")
        ids.add(activity["id"])
        if not activity.get("categories") or not set(activity["categories"]) <= categories or activity["stage"] not in stages:
            raise ValueError("Invalid qualitative category/stage")
        if activity.get("measures") != [] or activity.get("public_approved") is not False:
            raise ValueError("Qualitative research activity cannot invent measures or public approval")
        if activity.get("event_date") is not None or not activity.get("date_basis"):
            raise ValueError("Qualitative event date must remain unverified")
        if not activity.get("title") or not activity.get("isa_role") or not activity.get("limitations") or not activity.get("evidence"):
            raise ValueError("Missing qualitative activity context")
        if not isinstance(activity.get("participants_or_institutions"), list) or not isinstance(activity.get("geography"), list):
            raise ValueError("Missing qualitative participant/geography context")
        for evidence in activity["evidence"]:
            article = by_source[evidence["source_id"]]
            if relevance.get(article["source_id"], {}).get("relevance") != "include-isa-reporting":
                raise ValueError("Activity evidence lacks reviewed Isa relevance")
            if evidence["source_url"] != article["url"] or evidence["source_text_sha256"] != article["text_sha256"] or evidence["report_date"] != article["report_date"][:10]:
                raise ValueError("Qualitative activity citation/date mismatch")
            if not evidence["excerpt"] or evidence["excerpt"] not in article["text"]:
                raise ValueError("Qualitative activity excerpt absent from source")
            if evidence["report_stage"] not in stages | {"duplicate-report", "congratulatory-report"}:
                raise ValueError("Invalid qualitative evidence stage")
        stage_dates = [e["report_date"] for e in activity["evidence"] if e["report_stage"] == activity["stage"]]
        if not stage_dates or activity["report_date"] != min(stage_dates):
            raise ValueError("Activity publication chronology/stage mismatch")
    return activities


def analyse(articles, folder, extra_stop_words=(), reviewed_removed_lines=()):
    import numpy as np
    import scipy
    import sklearn
    from sklearn.decomposition import NMF
    from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS, TfidfVectorizer

    unique, mapping = canonical_sources(articles)
    # Pages are retained in inventory but excluded from publication-period NLP.
    corpus = [a for a in unique if a["source_type"] == "posts"]
    texts, boilerplate = clean_corpus(corpus, reviewed_removed_lines)
    subject_tokens = {"mohammed", "muhammed", "mohammad", "muhammad", "abba", "isa", "hon", "honourable", "honorable", "ssap", "ossap", "sneo", "ossapsneo"}
    vectorizer = TfidfVectorizer(stop_words=sorted(set(ENGLISH_STOP_WORDS) | subject_tokens | set(extra_stop_words)),
                                 ngram_range=(1, 2), min_df=3, max_df=.85,
                                 sublinear_tf=True, max_features=12000,
                                 token_pattern=r"(?u)\b[a-z][a-z]+\b")
    matrix = vectorizer.fit_transform(texts)
    model = NMF(n_components=8, init="nndsvda", random_state=42,
                max_iter=600, tol=1e-4, solver="cd")
    weights = model.fit_transform(matrix)
    if model.n_iter_ == model.max_iter:
        raise ValueError("NMF failed to converge; inspect before publishing findings")
    totals = weights.sum(axis=1)
    proportions = np.divide(weights, totals[:, None], out=np.zeros_like(weights), where=totals[:, None] != 0)
    terms = vectorizer.get_feature_names_out()
    topics = []
    for index, component in enumerate(model.components_):
        strongest = [str(terms[i]) for i in np.argsort(component)[::-1][:12]]
        representatives = np.argsort(proportions[:, index])[::-1]
        representatives = [int(i) for i in representatives if totals[i] > 0][:4]
        topics.append({"id": f"topic-{index + 1}", "proposed_label": " / ".join(strongest[:3]),
                       "review_status": "model-output-awaiting-source-review",
                       "terms": strongest,
                       "representatives": [{"source_id": corpus[i]["source_id"], "title": corpus[i]["title"],
                                             "url": corpus[i]["url"], "topic_share": round(float(proportions[i, index]), 8)}
                                            for i in representatives]})
    periods = []
    for year in sorted({a["report_date"][:4] for a in corpus}):
        indices = [i for i, a in enumerate(corpus) if a["report_date"].startswith(year)]
        classified = [i for i in indices if totals[i] > 0]
        periods.append({"publication_year": year, "denominator_unique_posts": len(indices),
                        "modelled_posts": len(classified), "zero_vector_posts": len(indices) - len(classified),
                        "mean_topic_share": [round(float(x), 8) for x in proportions[classified].mean(axis=0)] if classified else None})
    settings = {"random_state": 42, "n_components": 8, "init": "nndsvda", "solver": "cd",
                "max_iter": 600, "tol": 1e-4, "ngram_range": [1, 2], "min_df": 3, "max_df": .85,
                "max_features": 12000, "sublinear_tf": True, "token_pattern": vectorizer.token_pattern,
                "stop_words": sorted(vectorizer.stop_words), "removed_lines": boilerplate,
                "deduplication": "exact full-text SHA-256, earliest post then lowest source ID",
                "pages": "excluded from topic training and publication periods",
                "language": "English source text only; no Hausa corpus analysed"}
    environment = {"python": platform.python_version(), "numpy": np.__version__,
                   "scipy": scipy.__version__, "scikit-learn": sklearn.__version__}
    write(folder / "topics.json", {"topics": topics, "periods": periods})
    write(folder / "preprocessing.json", settings)
    write(folder / "corpus.json", [{"source_id": a["source_id"], "text_sha256": a["text_sha256"],
                                    "cleaned_sha256": hashlib.sha256(t.encode()).hexdigest()}
                                   for a, t in zip(corpus, texts)])
    write(folder / "vocabulary.json", list(map(str, terms)))
    write(folder / "source-aliases.json", mapping)
    write(folder / "document-topics.json", [{"source_id": a["source_id"],
                                            "topic_share": list(map(float, p))} for a, p in zip(corpus, proportions)])
    np.savez_compressed(folder / "frozen-model.npz", components=model.components_,
                        idf=vectorizer.idf_, weights=weights, source_ids=[a["source_id"] for a in corpus])
    return {"environment": environment, "settings_sha256": digest(settings),
            "input_corpus_sha256": digest([(a["source_id"], a["text_sha256"]) for a in corpus]),
            "cleaned_corpus_sha256": digest(texts), "unique_full_texts": len(unique),
            "model_posts": len(corpus), "features": len(terms), "iterations": model.n_iter_,
            "reconstruction_error": float(model.reconstruction_err_),
            "model_arrays_sha256": hashlib.sha256(model.components_.tobytes() + weights.tobytes()).hexdigest()}


def main():
    snapshot = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "output/office-evidence" / read(ROOT / "output/office-evidence/latest.json")["run_directory"]
    folder = ROOT / "output/analysis" / snapshot.name
    folder.mkdir(parents=True, exist_ok=True)
    articles, candidates = read(snapshot / "articles.json"), read(snapshot / "candidates.json")
    decisions_file = ROOT / "research/numerical-decisions.json"
    decisions = read(decisions_file)["decisions"] if decisions_file.exists() else []
    queue = build_queue(articles, candidates, decisions)
    observations_path = ROOT / "research/reviewed-observations.json"
    observations = read(observations_path)["observations"] if observations_path.exists() else []
    validate_observations(articles, queue, observations)
    source_decisions_path = ROOT / "research/source-decisions.json"
    source_decisions = read(source_decisions_path)["decisions"] if source_decisions_path.exists() else []
    validate_source_decisions(articles, source_decisions)
    activities_path = ROOT / "research/reviewed-activities.json"
    activities = read(activities_path)["activities"] if activities_path.exists() else []
    validate_activities(articles, source_decisions, activities)
    write(folder / "review-queue.json", queue)
    # Never expose full passages or article downloads in the public app.
    with (folder / "review-queue.csv").open("w", encoding="utf-8-sig", newline="") as handle:
        keys = ["candidate_id", "source_id", "report_date", "url", "paragraph", "fingerprint", "exact_repeat_of", "disposition", "decision_status", "reason"]
        writer = csv.DictWriter(handle, fieldnames=keys)
        writer.writeheader()
        for item in queue:
            writer.writerow({key: ("'" + str(item[key]) if str(item[key]).lstrip().startswith(("=", "+", "-", "@")) else item[key]) for key in keys})
    manifest = {"schema_version": 1, "status": "research-only-not-public-approved",
                "pipeline_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
                "snapshot": snapshot.name, "source_count": len(articles),
                "source_types": dict(Counter(a["source_type"] for a in articles)),
                "publication_years_all_sources": dict(sorted(Counter(a["report_date"][:4] for a in articles).items())),
                "candidate_count": len(queue), "reviewed_candidates": len(decisions),
                "awaiting_review": sum(q["decision_status"] == "awaiting-review" for q in queue),
                "automatic_exact_repeats": sum(q["decision_status"] == "automatic-exact-repeat" for q in queue),
                "linked_exact_repeats": sum(q["decision_status"] == "linked-exact-repeat" for q in queue),
                "dispositions": dict(sorted(Counter(q["disposition"] for q in queue).items())),
                "numerical_review_complete": review_complete(queue),
                "reviewed_holds": sum(q["decision_status"] == "reviewed" and q["disposition"] == "unresolved-ambiguity" for q in queue),
                "reviewed_observations": len(observations),
                "reviewed_observations_sha256": digest(observations),
                "source_relevance_decisions": len(source_decisions),
                "source_relevance_decisions_sha256": digest(source_decisions),
                "qualitative_activities": len(activities),
                "qualitative_activities_sha256": digest(activities),
                "review_queue_sha256": digest(queue), "analysis": analyse(articles, folder)}
    manifest["artifacts"] = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(folder.iterdir()) if p.name != "manifest.json" and p.is_file()}
    write(folder / "manifest.json", manifest)
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
