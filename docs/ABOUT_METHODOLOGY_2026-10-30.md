# About / Methodology — 30 October 2026

Owner request: write a methodology covering scraping through text analysis and
put it beneath About at `/about/methodology`.

## Delivered behaviour

- `/about/` introduces the independent sourced project and links to Methodology.
- `/about/methodology/` describes seven stages, from collection to limitations.
- `/ha/about/` and `/ha/about/methodology/` contain visibly draft Hausa translations.
- Shared header includes About. Nested Methodology highlights About as the
  current location and Methodology as the current page in its local navigation.
- Shared locale links retain the page, selected dashboard records and valid
  conversation path. Informational reading anchors leave conversation history
  intact. Native disclosure holds detailed model settings and implementation links.
- No designer biography or profile-editing facility is invented. Those previously
  requested features still need actual profile details and a subsequent implementation.

## Claim-to-implementation record

| Method described | Repository evidence |
| --- | --- |
| Public WordPress posts/pages; pagination, robots, retries, raw responses and hashes | `scripts/collect-office-evidence.py` |
| Beautiful Soup HTML extraction, paragraphs/headings/captions, original text preservation | `scripts/collect-office-evidence.py` |
| Exact-text canonical documents, aliases, preprocessing, TF-IDF and eight-topic NMF | `scripts/prepare-analysis.py` |
| Selected model: 31 source records / 30 texts; 839 features, 117 iterations; checked topics | `docs/PHASE2_FINDINGS.md`, `content/dashboard/v1/bundle.json` |
| Manual multilabel categories and distinct activity/quantity stages | `docs/PHASE2_FINDINGS.md`, `scripts/build-dashboard-bundle.py` |
| Defined phrase list, whole-phrase matching, one count per canonical report | `scripts/extract-dashboard-concepts.mjs` |
| Word size from counts; source-linked concept/activity modes | `apps/web/components/DashboardAdvocacy.tsx` |
| Source-bound connections and programmed guided chat | `apps/web/lib/dashboard-presentation.mjs`, `apps/web/lib/guided-flow.mjs` |

The full archive's historical exploratory model is not the selected current fit.
No new analysis was run for this writing task. “Checked” refers to source-context
review, not independent corroboration or certified Hausa translation. Publication
timestamps are preserved; event dates and beneficiary units are not inferred.
Source reports, category overlap, unresolved claims, sample incompleteness and
non-causal interpretation are explicitly discussed.

## Visual direction

Apply `.interface-design/system.md`: shared white/green shell, Briem Hand display
heading, Source Sans body, blue chapter top and existing semantic colours. A
single reading column has numbered stages, 70-character paragraph widths and a
native technical-settings disclosure. No extra animation or dependency. Mobile
stages stay in normal document flow; no internal scroller.

## Verification

See the About / Methodology entry in `docs/VALIDATION.md` for completed commands
and browser evidence. Existing Hausa, image-rights and public-reveal gates remain
unchanged. Owner subsequently authorised committing and pushing the completed
source checkpoint to main; public deployment remains unauthorised.
