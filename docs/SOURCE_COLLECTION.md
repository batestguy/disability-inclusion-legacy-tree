# Office evidence collection

Collected 24 October 2026 at the owner's request: broadly collect numerical information, retain correct references, and store the text for possible later analysis. Sentiment analysis is deferred; office-report sentiment would describe editorial tone rather than public or beneficiary opinion.

## Stored collection

Source: [OSSAP-SNEO](https://ossaposneo.org/), including the [gallery originally shared by the owner](https://ossaposneo.org/gallery/) and its public WordPress posts/pages API. This is the office-presenting site's reporting, not independent verification of outcomes.

The final snapshot is `output/office-evidence/20261024T081152242131Z/`. It contains 639 posts and seven pages, matching the API totals during collection; 2,869 numerical passages across 562 source records; and 3,236 article/image references. These are extraction and inventory counts, not activity or beneficiary counts. Images are referenced by URL, not downloaded or cleared for reuse.

`output/office-evidence/latest.json` points to the most recent completed collection. Every new run uses a separate timestamped directory. Raw full-text downloads remain local under ignored `output/`; they are not part of the public application's content or public source distribution. Preserve or back up that directory when moving machines; a Git clone alone does not contain it.

A ZIP backup is saved as `output/office-evidence/office-evidence-2026-10-24.zip`, with a companion `.zip.sha256` checksum. It includes this snapshot, QA results, the shortlist, collection documentation and collection/audit scripts. ZIP integrity was checked. It is a local research archive, not an application publication.

| File | Purpose |
| --- | --- |
| `article-index.csv` | Source titles, permanent URLs, publication dates, citations, snapshot references and text hashes |
| `articles.json` | Extracted full article text, source IDs, publication/GMT dates, category/tag IDs and attribution |
| `number-review.csv` / `candidates.json` | Numerical source passages, surrounding context, original numeric mentions and editorial review fields |
| `raw-posts-*.json` / `raw-pages-*.json` | Exact downloaded API response bytes, including rendered source HTML |
| `responses.json` | API request URLs, UTC retrieval timestamps and SHA-256 hashes of saved responses |
| `duplicate-leads.json` | 104 matching-normalised-title groups and 102 matching-text groups requiring review |
| `image-references.csv` | Source-page/image links and alt text; reuse permission remains unestablished |
| `gallery.html` / `robots.txt` | Gallery snapshot and observed robots policy |
| `linked-documents.json` | Downloadable document links found in article HTML; none found in this run |
| `manifest.json` / `qa-report.json` | Coverage, counts, automated integrity checks and interpretation limits |

The collector uses the public API, checks robots policy, spaces requests and retries transient failures. It needs Python, `requests` and `beautifulsoup4`, already available on this machine. No application dependencies were added. CSVs are UTF-8 with a BOM and escape formula-like cells; JSON preserves source strings.

## Source-checked shortlist

[research/office-evidence-shortlist.json](../research/office-evidence-shortlist.json) contains 11 manually source-text-checked observations from nine articles, with short verbatim excerpts, source text segment numbers, citations, bounds, units, reported roles and limitations. These remain outside the approved public ledger.

Examples include reported food distribution, three bank stall-allotment beneficiaries, programme participation, cash-grant counts and separately labelled training/reach targets. Existing March startup support and NigWED training are matched to existing activity IDs so another article does not create another activity. No grant amount was invented.

Two entries are explicitly held for clarification: the Near Foundation article alternates between people and households; the Queen Irene proposal alternates between more than and approximately 1,000. Source typos, including the NigWED production quantity, are not silently corrected. There is no unique-person total, monetary total, causal impact estimate or claim of complete career coverage.

## Review and analysis rules

The full candidate queue is deliberately broad. Dates, ordinals, background population estimates, quotas, targets, awards, political reporting, congratulations and unrelated news remain present for review. Numeric mentions are strings, not validated facts. Classify unit, population, bound, delivery/target stage, geography, partner, officeholder role and event/publication date before dashboard use. Deduplicate programmes across articles and retain disagreements.

Retain the full text for topic analysis and optional future sentiment research. Do not present this archive as a representative sample of public opinion. No sentiment model, sentiment score or chatbot provider was selected or run.

Coverage is public API article/page text, including titles, captions and otherwise unwrapped text. Image/video text, comments, deleted/private posts and linked-document contents were not extracted. Heuristic word-number recognition is not exhaustive natural-language understanding. Digit-run coverage passed against the saved visible article HTML text. Photo presence does not establish permission to publish it.

The accepted English/Hausa chatbot and shared language-control requirements remain in [CHATBOT_SPEC.md](CHATBOT_SPEC.md). Human Hausa approval and all public-reveal gates still apply.

## Reproduce and validate

```powershell
python scripts/collect-office-evidence.py
python scripts/audit-office-evidence.py
# To audit this exact archived snapshot instead of latest:
python scripts/audit-office-evidence.py output/office-evidence/20261024T081152242131Z
```

The audit checks raw-response hashes, complete archive counts, unique IDs, source/candidate references, publication dates, independent visible-digit coverage, approval states and spreadsheet escaping. All passed for 646 sources and 2,869 candidates. All 11 shortlist excerpts were also checked against saved text. Traceability does not independently confirm an office claim.

Repository preflight, workspace lint/typecheck, all ten existing tests, and both production builds passed on 24 October 2026. No public-ledger, application, browser or deployment changes were made.
