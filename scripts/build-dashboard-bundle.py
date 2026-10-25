"""Build the data-only reviewed-subset dashboard preview; standard library only.

No full article, working queue or visitor data is exported. This is deliberately
separate from the application's public-content/reveal approval mechanism.
"""
import argparse
import copy
import csv
import hashlib
import io
import itertools
import json
import math
from pathlib import Path
import re
import unicodedata
from urllib.parse import urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parents[1]
CATEGORIES = {"policy-accessibility", "livelihoods", "education-training", "healthcare-welfare",
              "digital-assistive-technology", "sport", "political-engagement", "honours-ceremonial"}
BRANCH_CATEGORIES = {"economic": ["livelihoods"], "policy": ["policy-accessibility"],
                     "digital": ["digital-assistive-technology"], "assistive": ["digital-assistive-technology"]}
PARTNERSHIP_KINDS = {"reported-programme-collaboration", "signed-mou-reported", "stated-cooperation"}
# Explicitly reconciled in the source-context reviews, not a fuzzy cohort match.
COHORT_ALIASES = {
    "startup-support-march-2024": {"PWD recipients in the March startup-support activity",
                                    "Women with disabilities receiving POS equipment and startup kits"},
    "nigwed-skills-2024": {"Women with disabilities in reusable sanitary-pad training",
                           "Women with disabilities trained in reusable sanitary-pad production"},
}


def json_bytes(value):
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2, allow_nan=False) + "\n").encode("utf-8")


def digest(value):
    return hashlib.sha256(json_bytes(value)).hexdigest()


def normalize(text):
    text = unicodedata.normalize("NFKC", text).casefold()
    text = re.sub(r"[\u2010-\u2015\u2212-]", " ", text)
    text = re.sub(r"[\u2018\u2019\u02bc']", "'", text)
    return " ".join(text.split())


def url_key(url):
    parts = urlsplit(url)
    if parts.scheme not in {"http", "https"} or not parts.netloc or parts.username or parts.password:
        raise ValueError("Source URL must be a public HTTP(S) citation")
    return urlunsplit((parts.scheme.lower(), parts.netloc.lower(), parts.path.rstrip("/"), parts.query, ""))


def unique_ids(rows, field="id"):
    identifiers = [r[field] for r in rows]
    if len(identifiers) != len(set(identifiers)):
        raise ValueError(f"Duplicate {field}")


def check_categories(values):
    if not values or not set(values) <= CATEGORIES:
        raise ValueError("Invalid or missing reviewed categories")
    return sorted(set(values))


def is_author_byline(line):
    """Recognize short author names, preserving narrative paragraphs starting By."""
    match = re.fullmatch(r"(?i:by)\s+(.+)", line.strip())
    if not match:
        return False
    name = match[1].strip()
    if name.casefold() in {"our correspondent", "reporter"}:
        return True
    tokens = name.split()
    if not 2 <= len(tokens) <= 6:
        return False
    for token in tokens:
        if not token or not token[0].isupper() or not all(c.isalpha() or c in "'\u2019-." for c in token):
            return False
    return True


def entity_matches(text, entities):
    """Match story-body aliases; standalone bylines are not story connections."""
    body = "\n".join(line for line in text.splitlines() if not is_author_byline(line))
    haystack = normalize(body)
    matches = []
    for entity in sorted(entities, key=lambda e: e["id"]):
        if entity["kind"] not in {"person", "organisation", "place"} or not entity.get("label"):
            raise ValueError("Invalid entity dictionary")
        aliases = sorted(set([entity["label"], *entity.get("aliases", [])]))
        hits = [alias for alias in aliases if normalize(alias) and
                re.search(r"(?<!\w)" + re.escape(normalize(alias)) + r"(?!\w)", haystack)]
        if hits:
            matches.append({"entity_id": entity["id"], "matched_aliases": hits})
    return matches


def csv_bytes(rows, fields):
    stream = io.StringIO(newline="")
    writer = csv.DictWriter(stream, fieldnames=fields, lineterminator="\n")
    writer.writeheader()
    for row in rows:
        values = {}
        for field in fields:
            value = row.get(field)
            if isinstance(value, (list, dict)):
                value = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
            if value is None:
                value = ""
            # Leading controls/whitespace can hide spreadsheet formulas.
            if isinstance(value, str) and value.lstrip().startswith(("=", "+", "-", "@")):
                value = "'" + value
            values[field] = value
        writer.writerow(values)
    return stream.getvalue().encode("utf-8-sig")


def model_method_summary(method):
    """Retain reproducible/explainable model settings, excluding artifact paths."""
    scalar_fields = {"random_state", "n_components", "unique_full_texts", "model_posts", "features", "iterations",
                     "reconstruction_error", "method", "language", "scope", "full_archive_model",
                     "representative_review", "label_review_complete", "ha_reviewed", "zero_vector_policy", "category_policy",
                     "representative_min_topic_share", "reviewed_boilerplate_lines_removed"}
    result = {key: copy.deepcopy(value) for key, value in method.items() if key in scalar_fields}
    hash_fields = {"settings_sha256", "input_corpus_sha256", "cleaned_corpus_sha256", "model_arrays_sha256"}
    for key in hash_fields & method.keys():
        if not isinstance(method[key], str) or not re.fullmatch(r"[a-f0-9]{64}", method[key]):
            raise ValueError("Invalid model method hash")
        result[key] = method[key]
    if "environment" in method:
        environment_fields = {"python", "numpy", "scipy", "scikit-learn"}
        result["environment"] = {key: value for key, value in method["environment"].items() if key in environment_fields}
    if "tfidf" in method:
        tfidf_fields = {"ngram_range", "min_df", "max_df", "sublinear_tf", "max_features", "token_pattern", "additional_stop_words"}
        result["tfidf"] = {key: copy.deepcopy(value) for key, value in method["tfidf"].items() if key in tfidf_fields}
    if "near_duplicate_screen" in method:
        screen = method["near_duplicate_screen"]
        result["near_duplicate_screen"] = {"method": screen["method"], "threshold": screen["threshold"],
                                           "flagged_pair_count": len(screen["flagged_pairs"])}
    if result.get("n_components", 8) != 8 or result.get("random_state", 42) != 42 or result.get("full_archive_model", False) is not False:
        raise ValueError("Model settings conflict with reviewed subset/eight-topic seed-42 contract")
    return result


def build_bundle(articles, contributions, records, reviewed_observations, reviewed_activities, review, analysis):
    """Pure builder accepting synthetic inputs. Raise on stale or missing evidence."""
    if review.get("schema_version") != 1 or analysis.get("schema_version") != 1:
        raise ValueError("Unsupported input schema")
    unique_ids(articles, "source_id")
    unique_ids(review["corpus"], "source_id")
    unique_ids(review["entities"])
    unique_ids(review["partnerships"])
    unique_ids(contributions["records"])
    unique_ids(records["achievements"], "slug")
    unique_ids(reviewed_observations)
    unique_ids(reviewed_activities)
    all_articles = {a["source_id"]: a for a in articles}
    corpus_meta = {r["source_id"]: r for r in review["corpus"]}
    selected = {}
    for identifier, meta in corpus_meta.items():
        if identifier not in all_articles:
            raise ValueError("Missing reviewed corpus source")
        article = all_articles[identifier]
        if article.get("source_type") != "posts" or not meta.get("reason"):
            raise ValueError("Corpus must contain reviewed relevant posts")
        check_categories(meta["categories"])
        if hashlib.sha256(article["text"].encode()).hexdigest() != article["text_sha256"]:
            raise ValueError("Changed source text")
        reviewed_hash = meta.get("source_text_sha256", meta.get("text_sha256"))
        if reviewed_hash is not None and reviewed_hash != article["text_sha256"]:
            raise ValueError("Stale corpus review hash")
        selected[identifier] = article

    sources = {}
    by_url = {}
    for source in [*records["sources"], *contributions["sources"]]:
        key = url_key(source["url"])
        identifier = by_url.get(key, source["id"])
        if identifier in sources and url_key(sources[identifier]["url"]) != key:
            raise ValueError("Conflicting source ID")
        if identifier not in sources:
            sources[identifier] = {k: source[k] for k in ("title", "publisher", "type", "date", "url") if k in source}
            sources[identifier].update(id=identifier, archive_source_ids=[], source_id_aliases=[])
        if source["id"] != identifier:
            sources[identifier]["source_id_aliases"].append(source["id"])
        by_url[key] = identifier
    source_ids = {}
    for archive_id, article in sorted(selected.items()):
        key = url_key(article["url"])
        identifier = by_url.get(key, str(archive_id))
        if identifier in sources and url_key(sources[identifier]["url"]) != key:
            raise ValueError("Archive/starter source ID collision")
        if identifier not in sources:
            sources[identifier] = {"id": identifier, "title": article["title"], "url": article["url"],
                                   "date": article["report_date"][:10], "publisher": article.get("publisher", "Office of the SSA"),
                                   "type": "office", "archive_source_ids": [], "source_id_aliases": []}
        sources[identifier]["archive_source_ids"].append(archive_id)
        by_url[key] = identifier
        source_ids[archive_id] = identifier
    for source in sources.values():
        source["archive_source_ids"] = sorted(set(source["archive_source_ids"]))
        source["source_id_aliases"] = sorted(set(source["source_id_aliases"]))
    starter_source_aliases = {s["id"]: by_url[url_key(s["url"])] for s in [*records["sources"], *contributions["sources"]]}

    def evidence(archive_id, excerpt, expected=None):
        if archive_id not in selected:
            raise ValueError("Evidence source missing or excluded from reviewed corpus")
        article = selected[archive_id]
        if not excerpt or excerpt not in article["text"]:
            raise ValueError("Exact evidence excerpt absent from source")
        if expected:
            if (expected["source_text_sha256"] != article["text_sha256"] or
                    url_key(expected["source_url"]) != url_key(article["url"]) or
                    expected["report_date"] != article["report_date"][:10]):
                raise ValueError("Stale reviewed evidence citation/date/hash")
        return {"source_id": source_ids[archive_id], "archive_source_id": archive_id,
                "report_date": article["report_date"][:10], "text": excerpt,
                "kind": "exact-source-excerpt", "source_class": "office-reported"}

    activities = {}
    observations = []

    def category_for(identifier, archive_ids, branch=None):
        manual = review.get("activity_categories", {}).get(identifier)
        if manual:
            return check_categories(manual), "reviewed-activity-map"
        cats = sorted({c for sid in archive_ids for c in corpus_meta[sid]["categories"]})
        if cats:
            return cats, "reviewed-supporting-source-categories"
        return check_categories(BRANCH_CATEGORIES.get(branch, [])), "starter-ledger-branch-fallback"

    for record in contributions["records"]:
        if record.get("reviewed") is not True:
            raise ValueError("Unreviewed starter activity")
        cats, basis = category_for(record["id"], [], record["branch"])
        activities[record["id"]] = {
            "id": record["id"], "title": {"en": record["title"]}, "categories": cats, "category_basis": basis,
            "stage": "target" if record["measures"] and all(m["stage"] == "target" for m in record["measures"]) else "reported-activity",
            "report_date": record["reportDate"], "event_date": record["eventDate"], "date_basis": record["dateBasis"],
            "isa_role": record["role"], "partners": record["deliveryPartners"], "geography": record["geography"],
            "source_ids": sorted(starter_source_aliases[s] for s in record["sources"]),
            "limitations": [record["limitations"]], "provenance": ["reviewed-starter-ledger"],
            "public_approved": False, "ha_reviewed": False, "evidence": []}
        for measure in record["measures"]:
            observations.append({"id": record["id"] + ":" + measure["id"], "activity_id": record["id"],
                                 **{k: measure[k] for k in ("value", "bound", "unit", "population", "stage")},
                                 "population_descriptions": [measure["population"]], "observation_id_aliases": [],
                                 "report_date": record["reportDate"], "event_date": record["eventDate"],
                                 "date_basis": record["dateBasis"], "isa_role": record["role"],
                                 "partners": record["deliveryPartners"], "geography": record["geography"],
                                 "limitations": [record["limitations"]], "public_approved": False,
                                 "evidence": [{"kind": "reviewed-ledger-paraphrase", "text": measure["evidence"],
                                               "source_ids": sorted(starter_source_aliases[s] for s in record["sources"]),
                                               "report_date": record["reportDate"]}]})
    for achievement in records["achievements"]:
        if achievement.get("reviewed") is not True:
            raise ValueError("Unreviewed starter achievement")
        identifier = achievement["slug"]
        if identifier not in activities:
            cats, basis = category_for(identifier, [], achievement["branch"])
            activities[identifier] = {"id": identifier, "title": achievement["title"], "categories": cats,
                                     "category_basis": basis, "stage": achievement["status"],
                                     "report_date": achievement["date"], "event_date": None,
                                     "date_basis": "Publication date; exact event date unverified.",
                                     "isa_role": achievement["role"]["en"], "partners": [], "geography": [],
                                     "source_ids": [], "limitations": [achievement["evidenceLimits"]["en"]],
                                     "provenance": [], "evidence": [], "public_approved": False, "ha_reviewed": False}
        activity = activities[identifier]
        activity["title"] = achievement["title"]
        activity["achievement_slug"] = identifier
        activity["description"] = achievement["description"]
        activity["provenance"].append("reviewed-starter-achievement")
        activity["source_ids"] = sorted(set(activity["source_ids"]) | {starter_source_aliases[s] for s in achievement["sources"]})

    for row in sorted(reviewed_observations, key=lambda r: r["id"]):
        if row.get("public_approved") is not False or row.get("review_status") != "source-context-checked-research-only":
            raise ValueError("Research observation lacks explicit preview status")
        if row.get("event_date") is not None:
            raise ValueError("Research observation event date remains unverified")
        cite = evidence(row["source_id"], row["evidence_excerpt"], row)
        cite["original_numeric_wording"] = row["original_numeric_wording"]
        cite.update({k: copy.deepcopy(row[k]) for k in ("population", "stage", "event_date", "date_basis", "isa_role", "partners", "geography", "limitations", "corroboration")})
        if not row["original_numeric_wording"] or row["original_numeric_wording"] not in row["evidence_excerpt"]:
            raise ValueError("Numeric wording missing from evidence")
        obs = {k: copy.deepcopy(row[k]) for k in ("id", "activity_id", "value", "bound", "unit", "population", "stage",
                                                  "report_date", "event_date", "date_basis", "isa_role", "partners", "geography")}
        obs.update(population_descriptions=[row["population"]], observation_id_aliases=[],
                   limitations=[row["limitations"], row["corroboration"]], evidence=[cite], public_approved=False)
        matching = []
        for old in observations:
            same_dimensions = all(old[k] == obs[k] for k in ("activity_id", "value", "bound", "unit", "stage"))
            same_population = normalize(old["population"]) == normalize(obs["population"])
            known_aliases = COHORT_ALIASES.get(obs["activity_id"], set())
            known_same = old["population"] in known_aliases and obs["population"] in known_aliases
            if same_dimensions and (same_population or known_same):
                matching.append(old)
        if len(matching) > 1:
            raise ValueError("Ambiguous observation reconciliation")
        if matching:
            existing = matching[0]
            existing["observation_id_aliases"].append(obs["id"])
            existing["evidence"].extend(obs["evidence"])
            existing["population_descriptions"] = sorted(set(existing["population_descriptions"] + obs["population_descriptions"]))
            existing["limitations"] = sorted(set(existing["limitations"] + obs["limitations"]))
        else:
            observations.append(obs)
        identifier = obs["activity_id"]
        cats, basis = category_for(identifier, [row["source_id"]])
        if identifier not in activities:
            activities[identifier] = {"id": identifier, "title": {"en": row["source_title"]}, "stage": row["stage"],
                                     **{k: copy.deepcopy(row[k]) for k in ("report_date", "event_date", "date_basis", "isa_role", "partners", "geography")},
                                     "source_ids": [], "limitations": [], "provenance": [], "evidence": [],
                                     "public_approved": False, "ha_reviewed": False}
        activity = activities[identifier]
        activity.update(categories=cats, category_basis=basis)
        activity["source_ids"] = sorted(set(activity["source_ids"]) | {cite["source_id"]})
        activity["evidence"].append(cite)
        activity["limitations"] = sorted(set(activity["limitations"] + [row["limitations"]]))
        activity["provenance"] = sorted(set(activity["provenance"] + ["source-context-checked-research-only"]))

    for row in sorted(reviewed_activities, key=lambda r: r["id"]):
        if row.get("measures") != [] or row.get("public_approved") is not False:
            raise ValueError("Qualitative research activities cannot invent measures or approval")
        if row.get("event_date") is not None or not row.get("date_basis") or not row.get("limitations"):
            raise ValueError("Qualitative event date/context is unreviewed")
        stages = {"reported-activity", "reported-appointment", "reported-award", "announced", "stated-agenda"}
        if row["stage"] not in stages or any(e["report_stage"] not in stages | {"duplicate-report", "congratulatory-report"} for e in row["evidence"]):
            raise ValueError("Invalid qualitative stage")
        stage_dates = [e["report_date"] for e in row["evidence"] if e["report_stage"] == row["stage"]]
        if not stage_dates or row["report_date"] != min(stage_dates):
            raise ValueError("Qualitative stage-specific publication chronology mismatch")
        cites = [dict(evidence(e["source_id"], e["excerpt"], e), report_stage=e["report_stage"],
                      isa_role=row["isa_role"], event_date=row["event_date"], date_basis=row["date_basis"],
                      limitations=row["limitations"]) for e in row["evidence"]]
        if row["id"] in activities:
            activity = activities[row["id"]]
            activity["source_ids"] = sorted(set(activity["source_ids"]) | {c["source_id"] for c in cites})
            activity["limitations"] = sorted(set(activity["limitations"] + [row["limitations"]]))
            activity["provenance"] = sorted(set(activity["provenance"] + ["source-context-checked-research-only"]))
            activity["evidence"].extend(cites)
            activity["categories"] = check_categories(row["categories"])
            activity["category_basis"] = "reviewed-qualitative-activity"
            activity["participants_or_institutions"] = row["participants_or_institutions"]
            continue
        activities[row["id"]] = {k: copy.deepcopy(row[k]) for k in ("id", "stage", "report_date", "event_date", "date_basis", "isa_role", "geography")}
        activities[row["id"]].update(title={"en": row["title"]}, categories=check_categories(row["categories"]),
                                      category_basis="reviewed-qualitative-activity", partners=[],
                                      participants_or_institutions=row["participants_or_institutions"],
                                      source_ids=sorted({c["source_id"] for c in cites}), limitations=[row["limitations"]],
                                      provenance=["source-context-checked-research-only"], evidence=cites,
                                      public_approved=False, ha_reviewed=False)

    for obs in observations:
        value = obs["value"]
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or value < 0:
            raise ValueError("Invalid numeric observation")
        if obs["bound"] not in {"exact", "greater-than", "at-least", "approximate"} or obs["stage"] not in {"target", "reported-delivery"}:
            raise ValueError("Invalid observation bound/stage")
        if any(not obs.get(k) for k in ("unit", "population", "date_basis", "isa_role", "limitations")):
            raise ValueError("Missing observation context")
    for activity in activities.values():
        linked = [obs for obs in observations if obs["activity_id"] == activity["id"]]
        activity["observation_ids"] = sorted(obs["id"] for obs in linked)
        activity["observation_stages"] = sorted({obs["stage"] for obs in linked})

    # Canonical documents determine all model/network denominators, never cohorts.
    grouped = {}
    for article in selected.values():
        grouped.setdefault(article["text_sha256"], []).append(article)
    canonical = [min(group, key=lambda a: (a["report_date"], a["source_id"])) for group in grouped.values()]
    canonical.sort(key=lambda a: a["source_id"])
    canonical_ids = {a["source_id"] for a in canonical}
    if set(analysis["corpus_source_ids"]) != canonical_ids or len(analysis["corpus_source_ids"]) != len(canonical_ids):
        raise ValueError("Analysis corpus differs from canonical reviewed subset")
    documents = analysis["documents"]
    unique_ids(documents, "source_id")
    if {d["source_id"] for d in documents} != canonical_ids:
        raise ValueError("Analysis document coverage mismatch")
    topics = analysis["topics"]
    unique_ids(topics)
    if len(topics) != 8:
        raise ValueError("Expected eight frozen topics")
    for topic in topics:
        if not set(topic["representative_source_ids"]) <= canonical_ids:
            raise ValueError("Representative source outside reviewed corpus")
        if not topic["label"].get("en") or not topic["label"].get("ha"):
            raise ValueError("Bilingual draft topic labels required")
    if review.get("topic_labels"):
        reviewed_labels = {t["id"]: {"en": t["en"], "ha": t["ha"]} for t in review["topic_labels"]}
        if len(reviewed_labels) != len(topics) or any(reviewed_labels.get(t["id"]) != t["label"] for t in topics):
            raise ValueError("Topic labels differ from reviewed draft labels")
    weights = {}
    for doc in documents:
        shares = doc["topic_shares"]
        if len(shares) != len(topics) or any(isinstance(x, bool) or not isinstance(x, (int, float)) or not math.isfinite(x) or not 0 <= x <= 1 for x in shares):
            raise ValueError("Invalid topic shares")
        if not (abs(sum(shares) - 1) < 1e-6 or sum(shares) == 0):
            raise ValueError("Topic shares must sum to one or be an explicit zero vector")
        weights[doc["source_id"]] = shares
    periods = []
    for year in sorted({a["report_date"][:4] for a in canonical}):
        year_docs = [a for a in canonical if a["report_date"].startswith(year)]
        classified = [a for a in year_docs if sum(weights[a["source_id"]]) > 0]
        periods.append({"publication_year": year, "denominator_unique_posts": len(year_docs),
                        "modelled_posts": len(classified), "zero_vector_posts": len(year_docs) - len(classified),
                        "category_post_counts": {cat: sum(cat in corpus_meta[a["source_id"]]["categories"] for a in year_docs) for cat in sorted(CATEGORIES)},
                        "mean_topic_share": [round(sum(weights[a["source_id"]][i] for a in classified) / len(classified), 8) for i in range(8)] if classified else None})
    declared_periods = {str(p["publication_year"]): p for p in analysis["periods"]}
    if len(declared_periods) != len(analysis["periods"]) or set(declared_periods) != {p["publication_year"] for p in periods}:
        raise ValueError("Analysis period coverage mismatch")
    for period in periods:
        declared = declared_periods[period["publication_year"]]
        if declared["denominator_unique_posts"] != period["denominator_unique_posts"] or declared["mean_topic_share"] != period["mean_topic_share"]:
            raise ValueError("Analysis period denominator or topic mean mismatch")

    mentions, edges = [], {}
    for article in canonical:
        hits = entity_matches(article["text"], review["entities"])
        for hit in hits:
            mentions.append({**hit, "source_id": source_ids[article["source_id"]], "archive_source_id": article["source_id"]})
        for left, right in itertools.combinations(sorted(h["entity_id"] for h in hits), 2):
            edges.setdefault((left, right), set()).add(source_ids[article["source_id"]])
    partnerships = []
    entity_ids = {e["id"] for e in review["entities"]}
    for row in sorted(review["partnerships"], key=lambda r: r["id"]):
        if row["kind"] not in PARTNERSHIP_KINDS or len(set(row["entity_ids"])) < 2 or not set(row["entity_ids"]) <= entity_ids or not row.get("limitations"):
            raise ValueError("Invalid reviewed partnership metadata")
        cite = evidence(row["source_id"], row["excerpt"])
        partnerships.append({"id": row["id"], "kind": row["kind"], "entity_ids": sorted(set(row["entity_ids"])),
                             "evidence": cite, "limitations": row["limitations"], "public_approved": False})
    claim_notes = review.get("claim_notes", [])
    unique_ids(claim_notes)
    review_notes = []
    for row in sorted(claim_notes, key=lambda r: r["id"]):
        if row["activity_id"] not in activities or not row.get("note"):
            raise ValueError("Review note needs an existing activity and explanation")
        review_notes.append({"id": row["id"], "activity_id": row["activity_id"], "note": row["note"],
                             "evidence": evidence(row["source_id"], row["excerpt"]), "public_approved": False})

    # Explicitly choose output fields; working metadata is never copied wholesale.
    public_topics = [{"id": t["id"], "label": t["label"], "terms": t["terms"],
                      "representative_source_ids": [source_ids[i] for i in t["representative_source_ids"]],
                      "ha_reviewed": False} for t in topics]
    bundle = {"schema_version": 1, "dataset_version": "v1", "dataset_date": review["dataset_date"],
              "status": "reviewed-subset-preview-not-public-approved", "scope": review["scope"],
              "coverage": {"full_archive_sources": len(articles), "reviewed_corpus_source_aliases": len(selected),
                           "canonical_model_documents": len(canonical), "numerical_review_complete": False,
                           "career_coverage_complete": False, "independent_verification": False,
                           "unique_people_total_available": False,
                           "limitations": ["Checked subset only; archive-wide review remains unfinished.",
                                           "Publication periods describe reporting, not event dates or service delivery.",
                                           "Multilabel category counts may overlap; no beneficiary sum or impact score.",
                                           "Office reports and repeated coverage do not establish independent corroboration."]},
              "gates": {"public_reveal_approved": False, "hausa_human_review_complete": False, "portrait_rights_verified": False},
              "categories": [{"id": c, "label": review.get("category_labels", {}).get(c, {"en": c, "ha": None}), "ha_reviewed": False} for c in sorted(CATEGORIES)],
              "sources": sorted(sources.values(), key=lambda s: s["id"]),
              "activities": sorted(activities.values(), key=lambda a: a["id"]),
              "observations": sorted(observations, key=lambda o: o["id"]),
              "entities": [{k: e[k] for k in ("id", "label", "kind", "aliases")} for e in sorted(review["entities"], key=lambda e: e["id"])],
              "entity_mentions": mentions,
              "co_occurrences": [{"entity_ids": list(pair), "kind": "article-co-occurrence", "source_ids": sorted(ids),
                                  "supporting_unique_documents": len(ids), "is_partnership": False} for pair, ids in sorted(edges.items())],
              "partnerships": partnerships, "review_notes": review_notes, "topics": public_topics, "periods": periods,
              "model_documents": [{"source_id": source_ids[a["source_id"]], "archive_source_id": a["source_id"],
                                   "archive_source_aliases": sorted(g["source_id"] for g in grouped[a["text_sha256"]]),
                                   "publication_date": a["report_date"][:10], "categories": corpus_meta[a["source_id"]]["categories"],
                                   "topic_shares": weights[a["source_id"]]} for a in canonical],
              "method": {"topic_method": "English-source TF-IDF / eight-topic NMF; exploratory descriptive themes.",
                         "model_metadata_sha256": digest(analysis.get("method", {})),
                         "model": model_method_summary(analysis.get("method", {})),
                         "sample_limitation": "A selected source-context-checked sample; not the full archive, a representative career distribution or independent impact evaluation.",
                         "model_documents": "Exact full-text duplicates collapsed; earliest publication, then lowest archive ID.",
                         "entity_method": "Reviewed alias dictionary; case-insensitive whole-token matching after punctuation/whitespace normalization. Short name-shaped standalone author bylines and By Our Correspondent / By Reporter are excluded; narrative paragraphs starting By and in-body mentions are retained.",
                         "activity_stage_method": "Activity stage describes its reporting context. observation_ids and observation_stages enumerate linked measures; delivery and target observations can coexist in one activity and retain their own units, populations and bounds.",
                         "network_method": "Co-occurrence in canonical articles; partnerships require separate reviewed exact excerpts.",
                         "period_method": "Unique canonical posts by publication year; category denominator includes all posts; topic means exclude zero vectors.",
                         "population_reconciliation": "Exact observation dimensions/population; two explicitly reviewed starter cohort aliases retained as descriptions."}}
    accounting_fields = {"candidate_count", "reviewed_candidates", "linked_exact_repeats", "automatic_exact_repeats", "awaiting_review", "reviewed_holds"}
    accounting = {key: value for key, value in review.get("coverage_accounting", {}).items() if key in accounting_fields}
    if any(isinstance(v, bool) or not isinstance(v, int) or v < 0 for v in accounting.values()):
        raise ValueError("Invalid review coverage accounting")
    count_fields = {"reviewed_candidates", "linked_exact_repeats", "automatic_exact_repeats", "awaiting_review"}
    if count_fields | {"candidate_count"} <= set(accounting) and sum(accounting[f] for f in count_fields) != accounting["candidate_count"]:
        raise ValueError("Review coverage accounting does not balance")
    bundle["coverage"]["numerical_queue"] = accounting
    explanations = {}
    for key, item in review.get("explanations", {}).items():
        if not item.get("en") or not item.get("ha") or item.get("ha_reviewed") is not False:
            raise ValueError("Bilingual explanations require explicit draft Hausa status")
        explanations[key] = {field: item[field] for field in ("en", "ha", "ha_reviewed")}
    bundle["explanations"] = explanations
    return bundle


def export_bundle(bundle, folder, input_hashes=None):
    folder = Path(folder)
    folder.mkdir(parents=True, exist_ok=True)
    files = {"bundle.json": json_bytes(bundle),
             "activities.csv": csv_bytes(bundle["activities"], ["id", "title", "categories", "stage", "observation_ids", "observation_stages", "report_date", "event_date", "date_basis", "isa_role", "source_ids", "limitations", "public_approved"]),
             "observations.csv": csv_bytes(bundle["observations"], ["id", "activity_id", "value", "bound", "unit", "population", "stage", "report_date", "event_date", "date_basis", "isa_role", "limitations", "evidence", "public_approved"])}
    manifest = {"schema_version": 1, "dataset_version": "v1", "status": bundle["status"], "dataset_date": bundle["dataset_date"],
                "input_hash_basis": "Canonical JSON values; builder source decoded as UTF-8 with LF newlines",
                "bundle_sha256": hashlib.sha256(files["bundle.json"]).hexdigest(),
                "inputs_sha256": dict(sorted((input_hashes or {}).items())),
                "artifacts_sha256": {name: hashlib.sha256(data).hexdigest() for name, data in sorted(files.items())}}
    files["manifest.json"] = json_bytes(manifest)
    for name, data in files.items():
        (folder / name).write_bytes(data)
    return manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--articles", type=Path, default=ROOT / "output/office-evidence/20261024T081152242131Z/articles.json")
    parser.add_argument("--output", type=Path, default=ROOT / "content/dashboard/v1")
    args = parser.parse_args()
    paths = {"articles": args.articles, "contributions": ROOT / "content/contributions.json", "records": ROOT / "content/records.json",
             "observations": ROOT / "research/reviewed-observations.json", "activities": ROOT / "research/reviewed-activities.json",
             "review": ROOT / "research/phase2-review.json", "analysis": ROOT / "research/phase2-analysis.json"}
    inputs = {key: json.loads(path.read_text(encoding="utf-8")) for key, path in paths.items()}
    bundle = build_bundle(inputs["articles"], inputs["contributions"], inputs["records"], inputs["observations"]["observations"],
                          inputs["activities"]["activities"], inputs["review"], inputs["analysis"])
    hashes = {key: digest(value) for key, value in inputs.items()}
    hashes["builder"] = hashlib.sha256(Path(__file__).read_text(encoding="utf-8").encode("utf-8")).hexdigest()
    manifest = export_bundle(bundle, args.output, hashes)
    print(json.dumps({"status": bundle["status"], "activities": len(bundle["activities"]), "observations": len(bundle["observations"]),
                      "canonical_documents": bundle["coverage"]["canonical_model_documents"], "bundle_sha256": manifest["bundle_sha256"]}))


if __name__ == "__main__":
    main()
