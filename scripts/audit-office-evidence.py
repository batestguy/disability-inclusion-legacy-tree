"""Independently check saved archive integrity and source-to-extraction coverage.

Run: python scripts/audit-office-evidence.py [snapshot-directory]
No network access. Writes qa-report.json beside the collected data.
"""

import csv
import hashlib
import json
import re
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

from bs4 import BeautifulSoup


ROOT = Path(__file__).resolve().parents[1] / "output" / "office-evidence"


def main():
    folder = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / json.loads((ROOT / "latest.json").read_text())["run_directory"]
    def read(name):
        return json.loads((folder / name).read_text(encoding="utf-8"))

    manifest = read("manifest.json")
    articles = read("articles.json")
    candidates = read("candidates.json")
    responses = read("responses.json")
    errors = []
    def check(condition, message):
        if not condition:
            errors.append(message)

    source = {}
    for response in responses:
        body = (folder / response["file"]).read_bytes()
        check(hashlib.sha256(body).hexdigest() == response["sha256"], f"Snapshot hash mismatch: {response['file']}")
        if response["file"].startswith("raw-"):
            rows = json.loads(body)
            check(len(rows) == response["item_count"], f"Snapshot item count mismatch: {response['file']}")
            for row in rows:
                check(row["id"] not in source, f"Repeated source ID: {row['id']}")
                source[row["id"]] = (row, response["file"])

    ids = [article["source_id"] for article in articles]
    check(len(set(ids)) == len(ids), "Duplicate extracted source IDs")
    check(set(ids) == set(source), "Extracted sources do not match raw snapshots")
    check(len(articles) == manifest["article_count"] == sum(manifest["api_totals"].values()), "Archive count mismatch")
    check(len(candidates) == manifest["numeric_passages"], "Candidate count mismatch")
    candidate_ids = [row["candidate_id"] for row in candidates]
    check(len(set(candidate_ids)) == len(candidate_ids), "Duplicate candidate IDs")
    by_source = {}
    for article in articles:
        original, snapshot = source[article["source_id"]]
        by_source[article["source_id"]] = article
        check(article["url"] == original["link"] and article["url"].startswith("https://ossaposneo.org/"), f"Wrong citation URL: {article['source_id']}")
        check(article["report_date"] == original["date"], f"Wrong publication date: {article['source_id']}")
        check(article["snapshot_file"] == snapshot, f"Wrong snapshot reference: {article['source_id']}")
        check(hashlib.sha256(article["text"].encode()).hexdigest() == article["text_sha256"], f"Extracted text hash mismatch: {article['source_id']}")
        check(article["review_status"] == "unreviewed" and article["event_date"] is None, f"Unexpected approval or inferred date: {article['source_id']}")

    numeric_text = {}
    for candidate in candidates:
        article = by_source.get(candidate["source_id"])
        check(article is not None, f"Unresolved candidate source: {candidate['candidate_id']}")
        if article is None:
            continue
        check(candidate["url"] == article["url"] and candidate["snapshot_file"] == article["snapshot_file"], f"Broken candidate citation: {candidate['candidate_id']}")
        check(candidate["paragraph"] == article["title"] if candidate["location"] == "title" else candidate["paragraph"] in article["text"], f"Passage not present in source text: {candidate['candidate_id']}")
        check(candidate["review_status"] == "unreviewed" and candidate["stage"] == "unclassified", f"Candidate promoted without review: {candidate['candidate_id']}")
        numeric_text.setdefault(candidate["source_id"], []).append(candidate["paragraph"])

    # Digit-run coverage is checked independently of the collector's number-matching regex.
    # This detects dropped amounts, numeric fragments and repeated parent/child extraction.
    for identifier, (original, _) in source.items():
        soup = BeautifulSoup(original["content"]["rendered"], "html.parser")
        for element in soup(["script", "style", "noscript"]):
            element.decompose()
        title = BeautifulSoup(original["title"]["rendered"], "html.parser").get_text(" ", strip=True)
        expected = Counter(re.findall(r"\d+", title + " " + soup.get_text(" ", strip=True)))
        actual = Counter(re.findall(r"\d+", " ".join(numeric_text.get(identifier, []))))
        check(expected == actual, f"Visible numeric digit coverage mismatch: {identifier}")

    for name in ("article-index.csv", "number-review.csv", "image-references.csv"):
        with (folder / name).open(encoding="utf-8-sig", newline="") as handle:
            for index, row in enumerate(csv.DictReader(handle), 2):
                check(all(not cell.lstrip().startswith(("=", "+", "-", "@")) for cell in row.values()), f"Unsafe spreadsheet cell: {name}:{index}")

    duplicates = read("duplicate-leads.json")
    report = {
        "checked_at_utc": datetime.now(timezone.utc).isoformat(),
        "snapshot_directory": folder.name, "integrity_checks_passed": not errors,
        "sources_checked": len(articles), "candidates_checked": len(candidates), "errors": errors,
        "trust_level": "Traceable office-report research corpus; not an approved outcomes dataset.",
        "qa_checklist": ["Raw response hashes", "Archive totals and unique source IDs", "Candidate/source references", "Publication dates", "Digit coverage against original HTML text", "Review gates", "Spreadsheet formula escaping"],
        "issues": [
            {"severity": "high", "issue": "Office claims are not independent outcome verification.", "correction": "Retain source attribution; corroborate selected claims with delivery partners where possible."},
            {"severity": "high", "issue": "Repeat articles and overlapping beneficiary groups.", "duplicate_title_groups": len(duplicates["same_normalized_title"]), "duplicate_text_groups": len(duplicates["same_extracted_text"]), "correction": "Assign activity IDs after editorial deduplication; do not sum unique beneficiaries."},
            {"severity": "high", "issue": "Targets, background statistics, units and dates are mixed with delivery figures.", "correction": "Review each observation's stage, bound, unit, population, role and event/report dates before using it."},
            {"severity": "medium", "issue": "Text inside images, video, linked documents and comments is outside extraction coverage.", "correction": "Manually review additional material if needed; do not claim every numerical fact on the website is captured."},
        ],
    }
    (folder / "qa-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
