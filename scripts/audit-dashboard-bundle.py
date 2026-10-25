"""Audit the committed compact artifact without requiring private raw downloads."""
import argparse
import csv
import hashlib
import itertools
import json
import math
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]


def audit(folder):
    manifest = json.loads((folder / "manifest.json").read_text(encoding="utf-8"))
    if set(manifest["artifacts_sha256"]) != {"bundle.json", "activities.csv", "observations.csv"}:
        raise ValueError("Unexpected bundle artifact set")
    for name, expected in manifest["artifacts_sha256"].items():
        if hashlib.sha256((folder / name).read_bytes()).hexdigest() != expected:
            raise ValueError(f"Artifact hash mismatch: {name}")
    b = json.loads((folder / "bundle.json").read_text(encoding="utf-8"))
    if manifest["bundle_sha256"] != manifest["artifacts_sha256"]["bundle.json"]:
        raise ValueError("Manifest bundle hash mismatch")
    def index(rows):
        result = {r["id"]: r for r in rows}
        if len(result) != len(rows):
            raise ValueError("Duplicate bundle IDs")
        return result
    sources, activities, observations, entities, topics = [index(b[key]) for key in ("sources", "activities", "observations", "entities", "topics")]
    for source in sources.values():
        url = urlsplit(source["url"])
        if url.scheme != "https" or not url.netloc or url.username or url.password or "text" in source or "content" in source:
            raise ValueError("Invalid source citation or exposed full text")
    if any(b["gates"].values()) or b["coverage"]["numerical_review_complete"] is not False or b["coverage"]["career_coverage_complete"] is not False:
        raise ValueError("Preview cannot establish release or full-review approval")
    accounting = b["coverage"]["numerical_queue"]
    if sum(accounting[k] for k in ("reviewed_candidates", "linked_exact_repeats", "automatic_exact_repeats", "awaiting_review")) != accounting["candidate_count"]:
        raise ValueError("Numerical queue accounting mismatch")
    def evidence(cite):
        ids = cite.get("source_ids", [cite.get("source_id")])
        if not ids or any(identifier not in sources for identifier in ids) or not cite.get("text"):
            raise ValueError("Unresolved evidence citation")
    for observation in observations.values():
        if observation["activity_id"] not in activities or observation["stage"] not in {"reported-delivery", "target"} or observation["public_approved"] is not False:
            raise ValueError("Observation activity/stage/approval mismatch")
        if not math.isfinite(observation["value"]) or observation["value"] < 0:
            raise ValueError("Invalid observation value")
        for cite in observation["evidence"]:
            evidence(cite)
    for activity in activities.values():
        expected = sorted(o["id"] for o in observations.values() if o["activity_id"] == activity["id"])
        if activity["observation_ids"] != expected or activity["observation_stages"] != sorted({observations[i]["stage"] for i in expected}):
            raise ValueError("Activity observation links/stages mismatch")
        if not set(activity["source_ids"]) <= sources.keys() or activity["public_approved"] is not False:
            raise ValueError("Activity source/approval mismatch")
        for cite in activity["evidence"]:
            evidence(cite)
    docs = b["model_documents"]
    by_source = {d["source_id"]: d for d in docs}
    if len(by_source) != len(docs) or len(docs) != b["coverage"]["canonical_model_documents"] or len(topics) != 8:
        raise ValueError("Canonical document/topic count mismatch")
    for topic in topics.values():
        if not topic["representative_source_ids"] or not set(topic["representative_source_ids"]) <= by_source.keys():
            raise ValueError("Topic representative citation mismatch")
    for period in b["periods"]:
        matching = [d for d in docs if d["publication_date"].startswith(period["publication_year"])]
        modelled = [d for d in matching if sum(d["topic_shares"]) > 0]
        if len(matching) != period["denominator_unique_posts"] or len(modelled) != period["modelled_posts"]:
            raise ValueError("Period denominator mismatch")
        for category, count in period["category_post_counts"].items():
            if count != sum(category in d["categories"] for d in matching):
                raise ValueError("Category count mismatch")
        expected = [round(sum(d["topic_shares"][i] for d in modelled) / len(modelled), 8) for i in range(8)] if modelled else None
        if period["mean_topic_share"] != expected:
            raise ValueError("Topic-period mean mismatch")
    mentions = set()
    by_document = {}
    for mention in b["entity_mentions"]:
        key = (mention["source_id"], mention["entity_id"])
        if key in mentions or key[0] not in by_source or key[1] not in entities:
            raise ValueError("Entity mention citation/identity mismatch")
        mentions.add(key)
        by_document.setdefault(key[0], set()).add(key[1])
    expected_edges = {}
    for source_id, ids in by_document.items():
        for pair in itertools.combinations(sorted(ids), 2):
            expected_edges.setdefault(pair, set()).add(source_id)
    actual_edges = {}
    for edge in b["co_occurrences"]:
        pair = tuple(edge["entity_ids"])
        if pair in actual_edges or edge["kind"] != "article-co-occurrence" or edge["is_partnership"] is not False:
            raise ValueError("Co-occurrence cannot establish partnership")
        if edge["supporting_unique_documents"] != len(set(edge["source_ids"])):
            raise ValueError("Co-occurrence count mismatch")
        actual_edges[pair] = set(edge["source_ids"])
    if actual_edges != expected_edges:
        raise ValueError("Co-occurrence support differs from entity mentions")
    for relation in b["partnerships"]:
        cite = relation["evidence"]; evidence(cite)
        if relation["kind"] not in {"signed-mou-reported", "reported-programme-collaboration", "stated-cooperation"}:
            raise ValueError("Invalid documented relationship type")
        if any((cite["source_id"], entity_id) not in mentions for entity_id in relation["entity_ids"]):
            raise ValueError("Relationship entities absent from cited story body")
    for note in b.get("review_notes", []):
        if note["activity_id"] not in activities:
            raise ValueError("Review note activity missing")
        evidence(note["evidence"])
    for filename, rows in [("activities.csv", activities), ("observations.csv", observations)]:
        with (folder / filename).open(encoding="utf-8-sig", newline="") as handle:
            exported = list(csv.DictReader(handle))
        if {r["id"] for r in exported} != rows.keys() or len(exported) != len(rows):
            raise ValueError("CSV row identity mismatch")
        if any(cell.lstrip().startswith(("=", "+", "-", "@")) for row in exported for cell in row.values()):
            raise ValueError("Unsafe spreadsheet cell")
    return {"integrity_passed": True, "activities": len(activities), "observations": len(observations),
            "canonical_documents": len(docs), "co_occurrence_edges": len(actual_edges), "public_reveal_approved": False}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("folder", nargs="?", type=Path, default=ROOT / "content/dashboard/v1")
    args = parser.parse_args()
    print(json.dumps(audit(args.folder), indent=2))
