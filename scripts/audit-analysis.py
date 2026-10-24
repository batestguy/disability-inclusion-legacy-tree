"""Independently audit saved research artifacts without fitting another model.

python scripts/audit-analysis.py [analysis-directory] [snapshot-directory]
python scripts/audit-analysis.py --require-complete
"""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("prepare", Path(__file__).with_name("prepare-analysis.py"))
prepare = importlib.util.module_from_spec(spec)
spec.loader.exec_module(prepare)


def audit(folder, snapshot, require_complete=False):
    manifest = prepare.read(folder / "manifest.json")
    if manifest["pipeline_sha256"] != hashlib.sha256(Path(__file__).with_name("prepare-analysis.py").read_bytes()).hexdigest():
        raise ValueError("Pipeline changed; regenerate artifacts")
    for name, expected in manifest["artifacts"].items():
        if Path(name).name != name or hashlib.sha256((folder / name).read_bytes()).hexdigest() != expected:
            raise ValueError(f"Artifact hash mismatch: {name}")
    articles = prepare.read(snapshot / "articles.json")
    candidates = prepare.read(snapshot / "candidates.json")
    decisions = prepare.read(ROOT / "research/numerical-decisions.json")["decisions"]
    queue = prepare.read(folder / "review-queue.json")
    if queue != prepare.build_queue(articles, candidates, decisions):
        raise ValueError("Review queue does not match source corpus and decisions")
    observations_file = ROOT / "research/reviewed-observations.json"
    observations = prepare.read(observations_file)["observations"] if observations_file.exists() else []
    prepare.validate_observations(articles, queue, observations)
    if manifest["reviewed_observations"] != len(observations) or manifest["reviewed_observations_sha256"] != prepare.digest(observations):
        raise ValueError("Observation manifest mismatch")
    source_decisions_file = ROOT / "research/source-decisions.json"
    source_decisions = prepare.read(source_decisions_file)["decisions"] if source_decisions_file.exists() else []
    prepare.validate_source_decisions(articles, source_decisions)
    if manifest["source_relevance_decisions"] != len(source_decisions) or manifest["source_relevance_decisions_sha256"] != prepare.digest(source_decisions):
        raise ValueError("Source relevance manifest mismatch")
    activities_file = ROOT / "research/reviewed-activities.json"
    activities = prepare.read(activities_file)["activities"] if activities_file.exists() else []
    prepare.validate_activities(articles, source_decisions, activities)
    if manifest["qualitative_activities"] != len(activities) or manifest["qualitative_activities_sha256"] != prepare.digest(activities):
        raise ValueError("Qualitative activity manifest mismatch")
    if len(queue) != manifest["candidate_count"] or len(articles) != manifest["source_count"]:
        raise ValueError("Manifest counts differ from archive")
    for field, status in [("reviewed_candidates", "reviewed"), ("awaiting_review", "awaiting-review"),
                          ("automatic_exact_repeats", "automatic-exact-repeat"),
                          ("linked_exact_repeats", "linked-exact-repeat")]:
        if manifest[field] != sum(q["decision_status"] == status for q in queue):
            raise ValueError(f"Review accounting mismatch: {field}")
    if manifest["numerical_review_complete"] != prepare.review_complete(queue):
        raise ValueError("False review completeness flag")
    unique, mapping = prepare.canonical_sources(articles)
    corpus = [a for a in unique if a["source_type"] == "posts"]
    if prepare.digest([(a["source_id"], a["text_sha256"]) for a in corpus]) != manifest["analysis"]["input_corpus_sha256"]:
        raise ValueError("Frozen corpus differs from archive")
    aliases = prepare.read(folder / "source-aliases.json")
    if aliases != {str(k): v for k, v in mapping.items()}:
        raise ValueError("Source alias mismatch")
    model = np.load(folder / "frozen-model.npz", allow_pickle=False)
    weights, components = model["weights"], model["components"]
    if weights.shape != (len(corpus), 8) or components.shape[0] != 8 or not np.all(np.isfinite(weights)) or np.any(weights < 0):
        raise ValueError("Invalid topic arrays")
    if list(model["source_ids"]) != [a["source_id"] for a in corpus]:
        raise ValueError("Model row/source mismatch")
    if hashlib.sha256(components.tobytes() + weights.tobytes()).hexdigest() != manifest["analysis"]["model_arrays_sha256"]:
        raise ValueError("Frozen model digest mismatch")
    documents = prepare.read(folder / "document-topics.json")
    shares = np.array([d["topic_share"] for d in documents])
    totals = weights.sum(axis=1)
    expected = np.divide(weights, totals[:, None], out=np.zeros_like(weights), where=totals[:, None] != 0)
    if [d["source_id"] for d in documents] != list(model["source_ids"]) or not np.allclose(shares, expected):
        raise ValueError("Document topic shares do not match frozen model")
    topics = prepare.read(folder / "topics.json")
    for period in topics["periods"]:
        indices = [i for i, a in enumerate(corpus) if a["report_date"].startswith(period["publication_year"])]
        classified = [i for i in indices if totals[i] > 0]
        if len(indices) != period["denominator_unique_posts"] or len(classified) != period["modelled_posts"]:
            raise ValueError("Publication-period denominator mismatch")
        if classified and not np.allclose(shares[classified].mean(axis=0), period["mean_topic_share"], atol=1e-8):
            raise ValueError("Publication-period topic shares mismatch")
    by_id = {a["source_id"]: a for a in corpus}
    for topic in topics["topics"]:
        for representative in topic["representatives"]:
            original = by_id[representative["source_id"]]
            if representative["url"] != original["url"] or representative["title"] != original["title"]:
                raise ValueError("Representative citation mismatch")
    if require_complete and not manifest["numerical_review_complete"]:
        raise ValueError("Numerical review incomplete: research artifacts cannot pass the milestone gate")
    return {"integrity_passed": True, "sources": len(articles), "candidates": len(queue),
            "numerical_review_complete": manifest["numerical_review_complete"],
            "public_ready": False,
            "limits": "Integrity is not source relevance, entity review, editorial approval or independent corroboration."}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("folder", nargs="?")
    parser.add_argument("snapshot", nargs="?")
    parser.add_argument("--require-complete", action="store_true")
    args = parser.parse_args()
    run = prepare.read(ROOT / "output/office-evidence/latest.json")["run_directory"]
    folder = Path(args.folder) if args.folder else ROOT / "output/analysis" / run
    snapshot = Path(args.snapshot) if args.snapshot else ROOT / "output/office-evidence" / run
    print(json.dumps(audit(folder, snapshot, args.require_complete), indent=2))


if __name__ == "__main__":
    main()
