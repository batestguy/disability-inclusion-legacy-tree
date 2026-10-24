# Project handoff

## Resume here — dashboard focus, Phase 1 batch 002

24 October: owner no longer wants the old tree presented or worked on as product
progress; proceed with the dashboard through the agreed data-first phases.
Do not reopen or restyle the old tree. Build/validate standalone bilingual chat
before dashboard integration, following CHATBOT_SPEC.md and the shared language
contract. Preserve achievement URLs when the dashboard replaces the home page.

Batch 002 reviewed 60 awaiting passages across 20 articles. Current accounting:
142 explicit decisions, 146 exact repeats linked to reviewed originals, 1,114
unlinked exact repeats and 1,467 awaiting (total 2,869). Eighteen reviewed holds
remain. Source relevance decisions cover 25 sources: 11 included, 14 excluded.
Eight qualitative records in research/reviewed-activities.json add early policy,
political engagement, office appointment, institutional meetings and an award.
They have empty numerical measures and explicit research-only status. The eight
numerical observations from batch 001 are unchanged; do not sum the two grains.

House visit sources 1243/1245 describe one meeting; award sources 1257/1263 describe
one announcement-to-receipt sequence. Stage-specific publication dates prevent an
announcement from dating reported receipt. Meetings/cooperation intentions are
not formal executed partnerships or delivered services. Canonical duplicate links
inherit any original hold and add no observations or independent corroboration.
The numerical completeness gate still fails because review remains unfinished.

33 Python tests cover prior safeguards plus repeat linking and qualitative
activity integrity; see docs/VALIDATION.md for checkpoint checks. The frozen
exploratory NLP corpus is unchanged until the full source relevance pass is ready.
Next: continue batch 003, reconcile activities/canonical repeats and update counts.
Public data, portrait rights, human Hausa, correction contact and hosting gates
remain pending. Earlier checkpoint counts below are historical.

## Latest checkpoint — Phase 1 batch 001, commit and push requested

24 October: owner requested proceeding, committing and pushing the work. Completed
50 new source-context passage reviews across 11 articles. Cumulative accounting is
82 explicit decisions + 1,260 automatic exact repeats + 1,527 awaiting = 2,869.
Eighteen explicit decisions are reviewed holds. research/reviewed-observations.json
contains eight typed research observations, each linked by fingerprint to its
accepted decision, source and exact excerpt. Six are reported delivery, two are
targets; public_approved is false throughout. Preserve the same startup and NigWED
activity IDs; no extra activity or beneficiary total is inferred. Five unrelated
articles have full-source exclusions in research/source-decisions.json. These
partial exclusions do not yet change the exploratory topic corpus.

Added observation integrity and source-relevance freshness validation; 23 Python
synthetic tests now cover these and prior safeguards. GitHub Actions includes a
separate standard-library research-safety job without needing the ignored corpus.
See docs/VALIDATION.md for the actual checkpoint checks and Git history/Actions for
delivery evidence. Prior source collection, research pipeline, environment and
phase-plan work are included in this requested checkpoint. Full downloaded texts,
review queues and frozen model arrays remain ignored/local; preserve their backup.
Derived-analysis backup: output/office-evidence/analysis-checkpoint-2026-10-24.zip
and .zip.sha256, with ZIP integrity checked. This is a local backup, not evidence
of off-machine storage or a completed restore exercise.

Next: continue the next source-context batch under Phase 1, update accounting and
resolve canonical repeats. Do not advance to public headline selection or call
milestone 1 complete. No chatbot/dashboard/PWA implementation or website deployment
is claimed. Cloudflare/reveal, portrait, human Hausa and correction-contact gates
remain open. Older checkpoint counts below are historical.

## Current owner steering — proceed step by step

The owner asked whether the environments/tools are available and requested a
phased Markdown plan. Read docs/IMPLEMENTATION_PHASES.md for the execution
checklist, verified versions, phase exits and four owner review milestones. The
local JS/Python/NLP dependencies, archive and saved model artifacts are present;
preflight and saved-analysis integrity passed again. Python currently uses the
machine-wide installation; a dedicated research virtual environment is a recorded
reproducibility improvement, not a blocker for current review. The matching
Playwright Chromium was missing during the smoke check; see docs/VALIDATION.md
for installation/retest results. Cloudflare account access, genuine portrait
rights, human Hausa review and correction contact remain unverified release
prerequisites. Next substantive step is a small source-context review batch under
Phase 1, followed by updated counts and audits; the owner is not being asked to
clean or classify the data.

## Dashboard implementation checkpoint — 24 October 2026

The owner's four-milestone Work in Numbers plan is now the source of intent; see PROJECT_PLAN.md and docs/DASHBOARD_ANALYSIS.md. This session implemented the local research foundation, not the full product. Start the next continuation with the analysis report and exact validation evidence in docs/VALIDATION.md. Do not call the first milestone complete or ask the owner to label the remaining queue.

New scripts: prepare-analysis.py (offline queue + frozen eight-topic TF-IDF/NMF); audit-analysis.py (independent artifact/source/period checks and --require-complete gate); analysis_test.py (15 synthetic tests). Python 3.14.4; research-only pins in research/analysis-requirements.txt. No production dependency or app UI changed. Full source/candidate downloads remain ignored; output/analysis/20261024T081152242131Z contains derived local artifacts and must travel with the archive backup. Research/numerical-decisions.json records 32 fingerprint-bound source-context decisions, including 15 explicit holds. Preserve the original shortlist unchanged as historical research.

Accounting: 2,869 passages = 32 source-context decisions + 1,260 automatic exact repeats + 1,577 awaiting review. Exact full-text grouping yields 396 texts; NLP uses 389 posts, excludes seven pages, and retains source aliases. Two 2013 page dates are not career events. NMF reproduced identical component/weight hashes in two runs. This exploratory model exposes other-person Lekan-Ojo reporting and near-duplicate congratulatory stories; relevance, category, entity and representative-source review are still needed before public model selection. Potiskum source 5862 says no fewer than 50 in the opening but 50 later; reconcile the original shortlist's exact bound. Queen Irene bound and Near Foundation unit conflicts remain held.

Next: finish canonical numerical review and activity reconciliation; corroborate proposed prominent figures; review source relevance/categories/entities and freeze the public bundle; prepare full milestone 1 for owner story/emphasis review. Then validate standalone bilingual chat before dashboard integration, then implement offline operation and the release-candidate checks. Do not present pipeline integrity as editorial approval. Existing six-activity ledger and public application remain unchanged. No portrait rights, Hausa approval, corrected contact or hosting gate was resolved.

## Latest checkpoint: numerical source collection — 24 October 2026

The owner requested broad numerical scraping with correct source references and stored text. Sentiment analysis was discussed and deferred; prioritise sourced numbers and useful descriptive themes. Collected the shared site's public WordPress archive: 639 posts and seven pages, with 2,869 numerical passages across 562 sources. Final snapshot: `output/office-evidence/20261024T081152242131Z/`; `output/office-evidence/latest.json` points to it. Full source downloads are local/ignored and must be separately preserved when moving machines.

Local backup: `output/office-evidence/office-evidence-2026-10-24.zip` and companion SHA-256 file; ZIP integrity checked. Contains source snapshots, source/candidate exports, QA evidence, shortlist and reproducible scripts.

Read [docs/SOURCE_COLLECTION.md](docs/SOURCE_COLLECTION.md). Collection and offline-audit scripts are in scripts/. The raw response snapshots retain request URLs, UTC retrieval times and SHA-256 hashes; CSV/JSON retain source titles, permanent links, publication dates and contextual passages. Integrity and visible-digit coverage checks passed for all 646 records and 2,869 candidates. Duplicate checks found 104 matching-title groups and 102 matching-text groups; these are review leads, not extra activities. No photos downloaded or reuse permissions established.

[research/office-evidence-shortlist.json](research/office-evidence-shortlist.json) stores 11 source-text-checked observations from nine articles, including exact excerpts/segment references and explicit ambiguities. These are research candidates outside the approved public ledger; targets, units, partner credit and overlap limits remain visible. Next data work: classify/deduplicate the queue and corroborate selected figures before admitting them to dashboard metrics. No sentiment scores, public-ledger changes, dashboard implementation or deployment. The chatbot requirements and release gates below remain applicable.

Validation on 24 October: preflight, workspace lint/typecheck, all ten tests and both production builds passed. Source integrity audit passed, and all 11 shortlist excerpts matched saved source text. No browser/performance rerun for this research-only change.

## Latest owner decisions: resume here first

The owner explicitly wants a beautifully designed conversational English/Hausa chatbot, built and validated before integration as a dedicated section of the planned dashboard. This supersedes the earlier compact question-tool presentation recommendation. The earlier numerical review still governs evidence and calculation safeguards; it does not reject the chatbot interface. Read [docs/CHATBOT_SPEC.md](docs/CHATBOT_SPEC.md) for the complete requirements, design direction, implementation recommendations, test cases and continuation sequence.

The page locale automatically controls the chatbot: English page means English chat; Hausa page means Hausa chat. One shared language control changes both together. Always display **Change language / Canja harshe**, then **English** above **Hausa**, vertically stacked and visible without opening a menu on desktop or mobile. Highlight the active language visually and accessibly. Visitors must not need to understand the current page language to find the switch. The discussion settled on Canja harshe after the owner typed Changa Harshe; human Hausa review is still required.

Localise greetings, suggestions, composer controls, answers, follow-ups, clarifications, errors and status messages. Preserve equivalent route/record context on language changes. The spec distinguishes fixed owner requirements from proposed transcript, draft-input and in-flight response handling. No independent chat locale or silent detector override. No chatbot implementation, final visual design, approved Hausa templates, model/provider selection or dashboard integration is complete. Final section placement remains unspecified. New.txt and HonAbbas.txt are preserved.

Next session: inspect Git status and preflight; read CHATBOT_SPEC.md, CONTRIBUTION_METRICS.md and NUMERICAL_QA_REVIEW.md; inspect LanguageChoice and locale routes; build the chat component and shared language behaviour before integration. Keep the descriptive KPI direction and existing public-reveal gates. This request authorises documentation, not deployment.

Documentation checkpoint validation (22 October 2026): all 15 project Markdown files contain this contract or a specification reference; local Markdown links resolve and Git whitespace checks pass. Preflight, workspace lint, workspace typecheck, all ten tests, web production build and Studio production build passed again. No browser/performance rerun or application/dependency change. The owner subsequently requested committing and pushing the documentation, New.txt and the numerical-Q&A review as the continuation checkpoint. Use Git history for the checkpoint SHA and GitHub Actions for remote validation; no website deployment is implied. The terminal sandbox failed before process startup; approved execution completed reads and checks without permission/ownership changes.

Updated 22 October 2026 after chatbot and shared-language requirements were documented across the Markdown files. Start the next session with the owner decisions above, AGENTS.md, PROJECT_PLAN.md and docs/CHATBOT_SPEC.md; preserve HonAbbas.txt and New.txt.

## Purpose and repository

Appreciate people and organisations who supported or continue to support disability causes. Hon. Mohammed Abba Isa is the first tribute. The owner explicitly authorised public source publication.

Repository: https://github.com/batestguy/disability-inclusion-legacy-tree
Branch: main. Verified delivery commit: b614322584f911810be52f5cbc23766b1c3ad1fd. Local and remote HEAD matched at delivery. Both CI runs have since passed; [delivery CI](https://github.com/batestguy/disability-inclusion-legacy-tree/actions/runs/39722444939). Later documentation commits may advance HEAD; use Git history for the latest SHA. Website reveal remains a separate milestone.

## Implemented

- npm workspace: static Next.js application in apps/web and standalone Sanity Studio in studio.
- Five sourced records, six sources, three roots milestones; English and visibly unreviewed Hausa drafts. Preserve distinctions between announcements, activities and measured outcomes.
- Regional Yobe baobab artwork, connected branch disclosures and story twigs, responsive layout, search/year filters, sourced panels, keyboard and browser Back, clear language choice, bilingual permanent links and persistent accessibility preferences.
- Full-screen flag watermark and enlarged portrait frame. A monogram remains until a genuine portrait has documented reuse permission.
- Reviewed public Sanity adapter, schemas, seed tools and public-mode build gates. No live Sanity project or Cloudflare deployment connected.

The regional approximation was explicitly authorised when an exact hometown tree could not be established. Do not claim a personal hometown connection. Source and adapted artwork carry CC BY-SA 4.0 attribution; see docs/TREE_ART.md and content/tree-art.json. Unused exploratory downloads stay local and ignored. No blanket licence has been granted for application code.

## Validation and next work

Repository delivery verification on 22 October 2026: preflight, workspace lint, typecheck, all five content tests and both production builds passed locally and in GitHub Actions. CI uploads a static preview artifact; it does not run browser/axe/Lighthouse or deploy the website. Earlier browser validation passed 19 journeys and axe in nine states; see docs/VALIDATION.md and output/browser-results.json. Earlier Lighthouse results predate the current artwork and miss performance targets; they are not current certification.

1. Obtain a genuine portrait with permission, fluent human Hausa review and correction mailbox.
2. Profile current artwork performance; complete screen-reader, zoom and journalist verification tasks.
3. Provision public Sanity content and Cloudflare Pages Git integration; exercise preview publication/deletion, failed-build retention and rollback using docs/CMS.md and docs/OPERATIONS.md.
4. Verify routes, attribution, contact and review gates before reveal. Do not bypass RELEASE_MODE=public checks.

## Commands and credentials

Use npm.cmd on Windows: npm run preflight, npm run lint, npm run typecheck, npm test, npm run build. For browser checks serve the export with npm run preview, install Playwright Chromium or set CHROMIUM_PATH, then npm run test:browser.

Keep credentials and deploy hooks outside the workspace. Optional creator fields may remain empty. The original sandbox created .git under a different Windows identity; if Git reports dubious ownership use the command-scoped option `git -c safe.directory=D:/HonAbbas ...`. No global safe-directory exception is needed.

## Resume here next time

Accepted steering superseding the earlier recommendation: owner wants a descriptive, data-driven contribution system that turns documented work into numbers and KPIs; no before/after or causal proof is required. Start with docs/CONTRIBUTION_METRICS.md and content/contributions.json. Starter ledger, metric calculations, CSV/JSON exporter and tests are implemented. Full dashboard redesign, bilingual integration, CMS support and career-wide research remain next work; the existing tree UI is unchanged. Preserve units, report/event date distinction, source/role, target separation and greater-than bounds. Do not invent values from qualitative praise or sum overlapping people.

Foundation validation: npm run metrics, all ten tests, preflight, workspace lint/typecheck and both builds passed. CSV and summary JSON are reproducible files in ignored output/. The owner requested committing and pushing the foundation and prior site-review notes as the next-session checkpoint; use Git history for its exact SHA and Actions for remote validation. No browser or performance rerun, dashboard release or live CMS change is claimed.

Earlier research context: owner questioned whether https://ossaposneo.org/gallery/ already fulfils the project. docs/OSSAP_SITE_REVIEW.md records the substantial biography/news/gallery/achievement overlap and the recommendation at that point. The subsequently accepted descriptive KPI direction above supersedes its no-pivot-yet status. Multi-person features remain unimplemented and unapproved. No public images were imported or permissions resolved.

Begin with Git status, preflight and latest Actions status. Performance profiling and local accessibility review can proceed without new user inputs. No multi-person archive has been implemented; the broader appreciation purpose does not establish additional tribute subjects or achievements.

Reveal still needs genuine portrait permission, human Hausa approval, correction mailbox and external Sanity/Cloudflare setup. Creator name, biography and bio link remain optional. The requested Pages name is mohammed-abba-isa-legacy; availability is unverified.

Do not assume previous servers remain running. Fresh checkout: npm.cmd ci, npm.cmd run build, then npm.cmd run preview. In another terminal run npx.cmd playwright install chromium, npm.cmd run test:browser and npm.cmd run test:performance. The static server defaults to http://127.0.0.1:8767; TEST_URL overrides browser/performance targets and CHROMIUM_PATH can specify an installed browser. Reports/screenshots are overwritten; preserve test conditions and inspect diffs before committing.

GitHub CLI was authenticated as batestguy at delivery. Recheck without printing credentials. Earlier sandbox setup-refresh errors are historical; commands and writes succeeded after access was restored. Do not repeat login or sandbox repair without a current failure.

## Documentation map

- docs/CHATBOT_SPEC.md: current accepted chatbot presentation and language-control contract; complete design brief, proposed state handling, numerical safeguards, implementation sequence and acceptance checklist. Read before applying the earlier numerical-Q&A review's presentation recommendations.

- docs/NUMERICAL_QA_REVIEW.md: 22 October technical review of New.txt with primary-source checks and specification flaws. The subsequent owner decision accepts a conversational chatbot and supersedes the earlier compact-tool presentation recommendation. Numerical safeguards remain applicable; package/service choices and implementation remain pending. Preserve New.txt; optional model parsing requires separate evaluation.

Review validation: preflight, lint/typecheck, all ten tests and both production builds passed on 22 October 2026. No browser rerun or runtime change. Initial terminal sandbox setup refresh failed; approved tool escalation completed the checks without changing permissions.

- PROJECT_PLAN.md: current phase status and historical decisions/progress.
- docs/CONTRIBUTION_METRICS.md and content/contributions.json: current KPI definitions, starter ledger and next dashboard work. npm run metrics regenerates CSV/JSON exports.
- docs/OSSAP_SITE_REVIEW.md: earlier site comparison informing the change of direction.
- docs/VALIDATION.md: local/CI evidence, test conditions and review limits.
- docs/OPERATIONS.md: Pages setup, backup, rollback and password-free transfer.
- docs/CMS.md: public dataset setup, schema contract, seed review and hooks.
- docs/RESEARCH.md: sources, omitted claims and evidence boundaries.
- docs/TREE_ART.md, content/tree-art.json and docs/tree-art-generation.json: photo provenance, rights and AI edits. TREE_ART_GENERIC.md is historical.

Before the next handoff, update this snapshot and relevant status documents together, run preflight and state which checks were rerun. Preserve evidence dates and distinguish public source publication from website reveal.
