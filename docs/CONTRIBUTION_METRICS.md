# Descriptive contribution metrics

Accepted direction, 22 October 2026: turn documented work into interesting descriptive numbers and KPIs. Before/after comparisons and causal estimation are not the product objective. A data-led redesign supersedes the tree-first direction; the existing application remains available while the new foundation is developed.

## Implemented foundation

content/contributions.json is a starter ledger of six distinct activities with five numeric observations. scripts/contribution-metrics.mjs validates evidence and calculates descriptive inventory statistics. npm run metrics exports a flat CSV and summary JSON under output/. This is research data awaiting dashboard and bilingual integration, not a replacement public site or an exhaustive career inventory.

Each record retains sources, report date, optional event date, date basis, branch, delivery partners, role and limitations. Measures preserve value, bound, unit, population, stage and extraction context. Missing quantities remain missing. The anniversary account's repeat reference to SMEDAN is not counted as a second activity.

## KPI dictionary

| Metric | Rule | Interpretation |
| --- | --- | --- |
| Documented activities | Distinct activity IDs | Curated record size, not all lifetime activity |
| Quantified activities | Activities with one or more measures | Numerical coverage, including separated targets |
| Activities with reported delivery | At least one reported-delivery measure | Reported delivery, not independent verification |
| Reported delivery measures | Count of delivery observations | Numerical facts, not people |
| Target measures | Count of target observations | Ambitions separate from delivery |
| Source documents | Distinct referenced source IDs | Evidence inventory, not independent corroboration |
| Records by report year | Group by reportDate year | Publication chronology, not verified event chronology |
| Unique people reached | Null / not calculated | Unresolved overlap and counting definitions |

The initial quantities are five SMEDAN participants; 15 reported Borno employment placements; >20 startup-support recipients; >45 women in training; and a separately labelled target of 36,551 opportunities. These are sourced descriptive reports. Source URLs and extraction contexts are in the ledger. Unknown geography is an empty list, not zero geographic reach.

Do not add overlapping beneficiary cohorts, treat repeat news as new activity, or turn qualitative praise into points. A documented engagement can count as one engagement, not an invented number helped. More than 45 remains >45. Monetary support requires an actual sourced amount, currency, date and purpose; advocacy gets no invented currency value. Reported training and kits for the same group are not two beneficiary totals.

## Next dashboard

Intended pipeline: source article or report → extracted activity and quantities → editorial review and deduplication → calculated KPIs → interactive charts and downloadable records. Extraction may be assisted by AI later, but the current ledger was manually curated. Do not describe this foundation as an automated research or NLP ingestion system. Reviewed text means the report has been checked, not that its delivery claims have been independently audited.

Build defined KPI cards, a source-linked activity timeline with explicit date basis, category views for training/support/employment/advocacy, filters, and accessible data tables/downloads. Targets and delivery must remain distinguishable. Do not put unlike units into one total or create an arbitrary personal impact score.

Expand the inventory of distinct programmes, formal partnerships, policy engagements, verified geography and directly stated support amounts. Attendance alone does not establish a formal partnership. Descriptive outcomes can be added where reported; causal proof is not required. The current economic-heavy starter sample must not imply the career's distribution by theme or year.

## Verification

npm run metrics regenerates exports. npm test includes checks for evidence resolution, duplicate IDs, lower bounds, targets, missing quantities, date filters and empty results. Existing tests still protect bilingual and public-release gates. No production dependencies were added.

Verified 22 October 2026: export command succeeded; all ten tests passed; preflight, workspace lint/typecheck and both production builds passed. No browser/performance rerun was needed for this non-UI foundation change. The owner requested this foundation be committed and pushed as a continuation checkpoint. See Git history for the commit and Actions for remote checks; no dashboard deployment is claimed.
