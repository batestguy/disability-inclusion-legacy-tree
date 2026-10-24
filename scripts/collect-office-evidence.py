"""Collect public office articles and unreviewed numeric leads, never public KPIs.

Run: python scripts/collect-office-evidence.py
Research-only dependencies: requests and beautifulsoup4 (no app dependencies).
Outputs and downloaded source text stay in ignored output/office-evidence/.
"""

import csv
import hashlib
import json
import re
import time
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from urllib import robotparser
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


BASE = "https://ossaposneo.org"
AGENT = "HonAbbasResearch/1.0 (public evidence inventory)"
ROOT = Path(__file__).resolve().parents[1] / "output" / "office-evidence"
OUT = ROOT / datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
NUMBER = re.compile(
    r"(?:[₦$£€]\s*)?\d[\d,]*(?:\.\d+)?(?:st|nd|rd|th|\s*%|\s*(?:million|billion|trillion|thousand)|[kmb](?!\w))?"
    r"|\b(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million|billion|trillion|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|half|quarter|dozen)\b",
    re.I,
)


def clean(html):
    return BeautifulSoup(html, "html.parser").get_text(" ", strip=True)


def digest(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def text_segments(soup):
    """Keep inline numbers with their paragraph and preserve otherwise unwrapped text."""
    from bs4 import Comment
    segments = []
    previous = None
    for node in soup.find_all(string=True):
        if isinstance(node, Comment) or not node.strip():
            continue
        block = node.find_parent(["p", "li", "h1", "h2", "h3", "h4", "td", "th", "figcaption", "div"])
        block = block if block is not None else node.parent
        if block is previous and segments:
            segments[-1] += " " + node.strip()
        else:
            segments.append(node.strip())
        previous = block
    return segments


def save(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def csv_safe(value):
    # Protect spreadsheet users; JSON retains original source strings.
    value = str(value)
    return "'" + value if value.lstrip().startswith(("=", "+", "-", "@")) else value


def write_csv(name, rows, fields):
    with (OUT / name).open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        for row in rows:
            writer.writerow({key: csv_safe(row.get(key, "")) for key in fields})


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    session = requests.Session()
    session.headers["User-Agent"] = AGENT
    session.mount("https://", HTTPAdapter(max_retries=Retry(
        total=3, backoff_factor=1, status_forcelist=[429, 500, 502, 503, 504],
        respect_retry_after_header=True,
    )))

    robots_response = session.get(BASE + "/robots.txt", timeout=45)
    if robots_response.status_code not in (200, 404):
        robots_response.raise_for_status()
        raise RuntimeError("Could not establish robots policy")
    (OUT / "robots.txt").write_text(robots_response.text, encoding="utf-8")
    robots = robotparser.RobotFileParser()
    robots.parse(robots_response.text.splitlines() if robots_response.status_code == 200 else [])
    delay = max(0.75, robots.crawl_delay(AGENT) or robots.crawl_delay("*") or 0)

    def get(path, **kwargs):
        url = urljoin(BASE, path)
        if urlparse(url).hostname != urlparse(BASE).hostname or not robots.can_fetch(AGENT, url):
            raise RuntimeError(f"URL outside collection scope or disallowed by robots: {url}")
        time.sleep(delay)
        response = session.get(url, timeout=60, **kwargs)
        response.raise_for_status()
        return response

    posts, totals, response_log = [], {}, []
    fields = "id,date,date_gmt,modified,modified_gmt,link,title,content,categories,tags"
    for kind in ("posts", "pages"):
        page = 1
        expected = None
        while True:
            response = get(f"/wp-json/wp/v2/{kind}", params={
                "per_page": 100, "page": page, "orderby": "id", "order": "asc", "_fields": fields,
            })
            total = int(response.headers["X-WP-Total"])
            if expected is not None and total != expected:
                raise RuntimeError("Archive changed during collection; rerun for consistent pagination")
            expected = total
            batch = response.json()
            raw_name = f"raw-{kind}-{page:03d}.json"
            # Exact response bytes and hashes retain source evidence independently of extraction.
            (OUT / raw_name).write_bytes(response.content)
            fetched_at = datetime.now(timezone.utc).isoformat()
            response_log.append({"file": raw_name, "url": response.url, "retrieved_at_utc": fetched_at,
                                 "sha256": hashlib.sha256(response.content).hexdigest(),
                                 "item_count": len(batch), "total": total})
            posts.extend(dict(post, sourceType=kind, snapshot=raw_name, retrievedAt=fetched_at) for post in batch)
            print(f"Collected {kind} page {page}: {len(batch)} items", flush=True)
            if page >= int(response.headers["X-WP-TotalPages"]):
                break
            page += 1
        totals[kind] = expected

    if len({(post["sourceType"], post["id"]) for post in posts}) != sum(totals.values()):
        raise RuntimeError("Duplicate or missing archive items; collection incomplete")

    articles, candidates, images, documents = [], [], [], []
    titles, contents = defaultdict(list), defaultdict(list)
    for post in posts:
        title = clean(post["title"]["rendered"])
        soup = BeautifulSoup(post["content"]["rendered"], "html.parser")
        for element in soup(["script", "style", "noscript"]):
            element.decompose()
        # Include captions and text outside paragraph tags; retain inline context.
        paragraphs = text_segments(soup)
        text = "\n".join(paragraphs)
        row = {
            "source_id": post["id"], "source_type": post["sourceType"], "title": title,
            "url": post["link"], "report_date": post["date"], "report_date_gmt": post.get("date_gmt"),
            "modified_date": post["modified"], "text_sha256": digest(text), "text": text,
            "review_status": "unreviewed", "event_date": None,
            "publisher": "Office of the SSA (OSSAP-SNEO)", "source_class": "office-reported",
            "snapshot_file": post["snapshot"], "retrieved_at_utc": post["retrievedAt"],
            "citation": f"Office of the SSA (OSSAP-SNEO). ({post['date'][:10]}). {title}. {post['link']}",
            "categories": post.get("categories", []), "tags": post.get("tags", []),
        }
        articles.append(row)
        titles[re.sub(r"\W+", "", title.casefold())].append(post["id"])
        if text:
            contents[digest(text)].append(post["id"])
        for index, paragraph in enumerate([title] + paragraphs):
            mentions = [match.group() for match in NUMBER.finditer(paragraph)]
            if not mentions:
                continue
            candidates.append({
                "candidate_id": f"{post['sourceType']}-{post['id']}-s{index}",
                "source_id": post["id"], "title": title, "url": post["link"],
                "report_date": post["date"], "paragraph": paragraph, "numeric_mentions": " | ".join(mentions),
                "location": "title" if index == 0 else f"text-segment-{index}",
                "context": title if index == 0 else "\n".join(paragraphs[max(0, index - 2):index + 1]),
                "snapshot_file": post["snapshot"], "retrieved_at_utc": post["retrievedAt"],
                "text_sha256": digest(text),
                "review_status": "unreviewed", "stage": "unclassified", "unit": "",
                "value": "", "bound": "", "event_date": "", "geography": "",
                "delivery_partners": "", "isa_role": "", "activity_id": "", "review_notes": "",
            })
        for image in soup.select("img[src]"):
            images.append({"source_id": post["id"], "source_url": post["link"],
                           "image_url": urljoin(post["link"], image["src"]), "alt": image.get("alt", ""),
                           "reuse_permission": "not-established"})
        for link in soup.select("a[href]"):
            url = urljoin(post["link"], link["href"])
            if re.search(r"\.(?:pdf|xlsx?|csv|docx?|pptx?)(?:[?#]|$)", url, re.I):
                documents.append({"source_id": post["id"], "source_url": post["link"],
                                  "document_url": url, "label": link.get_text(" ", strip=True),
                                  "status": "linked-document-not-downloaded"})

    gallery_response = get("/gallery/")
    (OUT / "gallery.html").write_bytes(gallery_response.content)
    response_log.append({"file": "gallery.html", "url": gallery_response.url,
                         "retrieved_at_utc": datetime.now(timezone.utc).isoformat(),
                         "sha256": hashlib.sha256(gallery_response.content).hexdigest()})
    gallery = BeautifulSoup(gallery_response.text, "html.parser")
    for image in gallery.select("img[src]"):
        images.append({"source_id": "gallery", "source_url": BASE + "/gallery/",
                       "image_url": urljoin(BASE, image["src"]), "alt": image.get("alt", ""),
                       "reuse_permission": "not-established"})
    unique_images = { (row["source_url"], row["image_url"]): row for row in images }
    duplicates = {
        "same_normalized_title": [ids for ids in titles.values() if len(ids) > 1],
        "same_extracted_text": [ids for ids in contents.values() if len(ids) > 1],
        "note": "Review leads only; different articles can describe the same activity even without matching text.",
    }
    save("articles.json", articles)
    save("candidates.json", candidates)
    save("linked-documents.json", documents)
    save("responses.json", response_log)
    save("duplicate-leads.json", duplicates)
    write_csv("article-index.csv", articles, ["source_id", "source_type", "title", "url", "report_date", "review_status", "text_sha256", "snapshot_file", "retrieved_at_utc", "citation"])
    write_csv("number-review.csv", candidates, list(candidates[0]) if candidates else ["candidate_id"])
    write_csv("image-references.csv", unique_images.values(), ["source_id", "source_url", "image_url", "alt", "reuse_permission"])
    summary = {
        "retrieved_at_utc": datetime.now(timezone.utc).isoformat(), "base_url": BASE,
        "collection_complete": True, "api_totals": totals, "article_count": len(articles),
        "numeric_passages": len(candidates), "sources_with_numeric_passages": len({row["source_id"] for row in candidates}),
        "image_references": len(unique_images), "duplicate_title_groups": len(duplicates["same_normalized_title"]),
        "linked_documents": len(documents),
        "duplicate_text_groups": len(duplicates["same_extracted_text"]),
        "review_status": "unreviewed", "public_ledger_modified": False,
        "limits": "Broad heuristic extraction includes titles, dates, ordinals, background statistics, targets and unrelated news. Numeric strings are not parsed facts or programme/beneficiary totals. Some quantities may require manual reading. Text in images, video, comments and linked documents is not extracted. Source text is office-reported, not independently audited. No photos downloaded or licensed. API coverage does not establish complete career coverage. Source publication timezone is not inferred; GMT field retained separately.",
    }
    save("manifest.json", summary)
    (ROOT / "latest.json").write_text(json.dumps({"run_directory": OUT.name}, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, indent=2), flush=True)


if __name__ == "__main__":
    main()
