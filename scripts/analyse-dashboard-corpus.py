"""Freeze an eight-topic model for the explicitly reviewed selected corpus.

No app/runtime inference. Raw texts and numeric arrays stay in ignored output/.
python scripts/analyse-dashboard-corpus.py
"""
import hashlib
import importlib.util
import json
import re
from itertools import combinations
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("prepare", Path(__file__).with_name("prepare-analysis.py"))
prepare = importlib.util.module_from_spec(spec)
spec.loader.exec_module(prepare)


def select_corpus(articles, review):
    by_id = {a["source_id"]: a for a in articles}
    ids = [r["source_id"] for r in review["corpus"]]
    if len(set(ids)) != len(ids):
        raise ValueError("Duplicate reviewed corpus source ID")
    selected = []
    for item in review["corpus"]:
        article = by_id[item["source_id"]]
        if article["source_type"] != "posts" or item["text_sha256"] != article["text_sha256"]:
            raise ValueError("Stale corpus decision or non-post source")
        if not item.get("categories") or not item.get("reason"):
            raise ValueError("Missing reviewed corpus classification")
        selected.append(article)
    unique, mapping = prepare.canonical_sources(selected)
    for article in unique:
        group = [r for r in review["corpus"] if mapping[r["source_id"]] == article["source_id"]]
        if len({tuple(sorted(r["categories"])) for r in group}) != 1:
            raise ValueError("Conflicting categories for identical text")
    return selected, unique, mapping


def near_duplicate_pairs(articles, threshold=.8):
    # A screen for editorial inspection, not semantic event/activity matching.
    def shingles(text):
        words = re.findall(r"[a-z]+", text.lower())
        return {tuple(words[i:i + 5]) for i in range(max(0, len(words) - 4))}
    features = {a["source_id"]: shingles(a["text"]) for a in articles}
    result = []
    for left, right in combinations(articles, 2):
        a, b = features[left["source_id"]], features[right["source_id"]]
        score = len(a & b) / len(a | b) if a or b else 0
        if score >= threshold:
            result.append({"source_ids": [left["source_id"], right["source_id"]], "five_word_jaccard": round(score, 8)})
    return result


def main():
    review = prepare.read(ROOT / "research/phase2-review.json")
    run = prepare.read(ROOT / "output/office-evidence/latest.json")["run_directory"]
    articles = prepare.read(ROOT / "output/office-evidence" / run / "articles.json")
    selected, unique, aliases = select_corpus(articles, review)
    folder = ROOT / "output/phase2-analysis" / run
    folder.mkdir(parents=True, exist_ok=True)
    pairs = near_duplicate_pairs(unique)
    if pairs:
        prepare.write(folder / "near-duplicate-leads.json", pairs)
        raise ValueError("Near-duplicate leads require explicit review before freezing this corpus")
    extra_stops = ["ssa", "mr", "mrs", "comrade", "senior", "special", "assistant", "presidential"]
    removed_hashes = set(review.get("boilerplate_line_sha256", []))
    removed_lines = sorted({line for article in unique for line in article["text"].splitlines()
                            if hashlib.sha256(line.encode()).hexdigest() in removed_hashes})
    if {hashlib.sha256(line.encode()).hexdigest() for line in removed_lines} != removed_hashes:
        raise ValueError("Reviewed boilerplate hash absent from frozen corpus")
    analysis = prepare.analyse(selected, folder, extra_stop_words=extra_stops, reviewed_removed_lines=removed_lines)
    topics = prepare.read(folder / "topics.json")
    labels = {r["id"]: {"en": r["en"], "ha": r["ha"]} for r in review["topic_labels"]}
    label_reviews = {r["id"]: r for r in review["topic_labels"]}
    documents = prepare.read(folder / "document-topics.json")
    # Labels can be proposed only after seeing the fit; never force desired topics.
    packed_topics = [{"id": t["id"], "label": labels.get(t["id"], {"en": t["proposed_label"], "ha": t["proposed_label"]}),
                      "terms": t["terms"], "representative_source_ids": [r["source_id"] for r in t["representatives"] if r["topic_share"] >= .25]}
                     for t in topics["topics"]]
    for topic in packed_topics:
        checked = label_reviews.get(topic["id"], {}).get("representative_source_ids")
        if checked is not None:
            if not checked or not set(checked) <= set(topic["representative_source_ids"]):
                raise ValueError("Reviewed representatives must retain substantive top-source topic weight")
            topic["representative_source_ids"] = checked
    compact = {"schema_version": 1, "corpus_source_ids": [a["source_id"] for a in unique],
               "topics": packed_topics,
               "documents": [{"source_id": d["source_id"], "topic_shares": d["topic_share"]} for d in documents],
               "periods": topics["periods"],
               "method": {**analysis, "method": "Eight-topic NMF over TF-IDF word/phrase features",
                          "random_state": 42, "n_components": 8,
                          "tfidf": {"ngram_range": [1, 2], "min_df": 3, "max_df": .85, "sublinear_tf": True,
                                    "additional_stop_words": extra_stops, "max_features": 12000},
                          "reviewed_boilerplate_lines_removed": len(removed_lines),
                          "representative_min_topic_share": .25,
                          "representative_selection": "Source-checked subset of strongest model articles; ambiguous cross-loadings omitted without altering weights",
                          "language": "English-source text; Hausa labels/explanations are drafts, not Hausa-corpus analysis",
                          "scope": review["scope"], "full_archive_model": False,
                          "source_aliases": {str(k): v for k, v in aliases.items()},
                          "near_duplicate_screen": {"method": "five-word shingle Jaccard", "threshold": .8, "flagged_pairs": pairs},
                          "representative_review": "Selected texts source-context checked; see label_review_complete for term/representative interpretation status",
                          "label_review_complete": len(labels) == 8,
                          "ha_reviewed": False,
                          "zero_vector_policy": "Period topic means exclude zero-vector documents; denominators and modelled counts are explicit",
                          "category_policy": "Reviewed multi-label source coverage; category shares need not sum to 100%"}}
    prepare.write(ROOT / "research/phase2-analysis.json", compact)
    prepare.write(folder / "manifest.json", {"snapshot": run, "model_id": analysis["model_arrays_sha256"],
                  "pipeline_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
                  "review_sha256": prepare.digest(review), "analysis_sha256": prepare.digest(compact),
                  "artifacts": {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(folder.iterdir())
                                if p.is_file() and p.name != "manifest.json"}})
    print(json.dumps({"source_records": len(selected), "distinct_texts": len(unique),
                      "features": analysis["features"], "iterations": analysis["iterations"],
                      "model_id": analysis["model_arrays_sha256"], "topic_terms": [{"id": t["id"], "terms": t["terms"][:6]} for t in packed_topics]}, indent=2))


if __name__ == "__main__":
    main()
