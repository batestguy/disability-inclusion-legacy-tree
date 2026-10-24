# The Work in Numbers — phased implementation

Updated 24 October 2026. This is the execution checklist for the owner's accepted
dashboard plan. [PROJECT_PLAN.md](../PROJECT_PLAN.md) retains the decisions and
historical record; [DASHBOARD_ANALYSIS.md](DASHBOARD_ANALYSIS.md) records current
research findings. Start continuations with [HANDOFF.md](../HANDOFF.md).

## Working agreement

Proceed in small, verifiable steps. Codex performs the research, review, coding
and checks; the owner supervises four concrete milestones. Do not ask the owner
to classify passages, clean data or run commands. Record progress and validation
before moving on. Routine in-scope work needs no repeated permission. A milestone
review concerns actual results, not approval of an abstract plan.

No first-milestone approval or release readiness is currently established. The
public app still shows the earlier tribute. Preserve the original briefs, existing
source/activity IDs, achievement URLs, user changes and release gates.

## Phase 0 — verify the working environment

**Status: complete for current local work.** No missing local software currently
blocks numerical review or app development. A browser-launch smoke check and
repository checks provide separate evidence from package installation.

| Capability | Verified local environment | Assessment |
| --- | --- | --- |
| Windows terminal and source control | PowerShell; Git 2.53.0; ripgrep; GitHub CLI executable | Ready for local work; remote authentication not rechecked |
| JavaScript runtime | Node 24.15.0; npm 11.16.0 | Ready; use `npm.cmd` on Windows |
| App and types | Next.js 16.4.2; React 19.3.1; TypeScript 5.9.3; installed workspace dependencies | Ready; package lock is the reproducible JS install source |
| Research runtime | Python 3.14.4 | Ready, currently machine-wide rather than a dedicated virtual environment |
| Numerical NLP | NumPy 2.4.6; SciPy 1.17.1; scikit-learn 1.9.0 | Matches research pins; existing eight-topic NMF fit ran locally |
| Source collection and parsing | requests 2.34.2; beautifulsoup4 4.15.0 | Installed; frozen source corpus already available |
| Browser automation and accessibility | Playwright 1.64.1; axe integration 4.14.0 | Installed; browser launch separately checked |
| Performance measurement | Lighthouse 13.5.0 | Installed; fresh app measurements still required in Phase 6 |
| Source and model storage | Frozen 646-source archive; derived analysis artifacts; source ZIP backup | Present; saved-analysis integrity audit passes |
| Static build and editing | Next.js export; standalone Sanity Studio 4.22.1 | Local build tooling installed; live CMS access not verified |
| Deployment | Cloudflare Pages configuration exists; standalone `wrangler` command not on PATH | Account/hosting access unverified; not required for Phases 1–6 |

No GPU, Colab runtime, database server, paid AI API or live inference service is
needed for the accepted architecture. Research runs locally; the chatbot uses
controlled query plans and deterministic calculations in the static app. Entity
review can start with reviewed dictionaries and text matching using the existing
stack; add a research package only if an identified gap justifies it.

Environment follow-ups:

- [x] Inspect installed runtimes and dependency versions.
- [x] Confirm source archive, model artifacts and source backup exist.
- [x] Run project preflight and saved-analysis integrity audit.
- [x] Install the matching Playwright browser and pass a headless launch smoke
  check. The initial check found the executable missing; Chromium/headless shell
  156.0.8078.4 is now installed and a headless launch passed.
- [ ] Create a dedicated research virtual environment and pin collection
  dependencies alongside the existing analysis pins before changing the research
  environment. The current working global installation is sufficient to proceed.
- [ ] Back up the derived analysis artifacts as well as the existing source ZIP;
  verify restore. Local presence is not off-machine backup evidence.
- [ ] Verify Cloudflare account/project access during hosting setup; install or
  invoke deployment tooling then if needed. Do not infer access from a config file.

## Phase 1 — finish source and numerical review

**Status: active; batch 001 complete, overall phase incomplete.**

Current baseline: 2,869 passages = 82 recorded source-context decisions + 1,260
automatic exact repeats + 1,527 awaiting review. Eighteen recorded decisions are
explicit unresolved holds. Exact repetition is a machine check; it does not
approve the canonical claim or identify unique beneficiaries.

Work in batches of roughly 40–60 canonical passages, keeping context from the
full source and related articles. After each batch, save fingerprint-bound
decisions, rebuild accounting, run relevant tests/audits, and update counts. Do
not mark a mixed passage accepted until every quantity in it is accounted for.

- [ ] Establish source relevance for all 646 records, preserving excluded
  material in the research inventory. Flag template page dates and unrelated news.
- [ ] Review remaining passages into accepted observations, repeated claims,
  background/context, dates/metadata, irrelevant passages or explicit ambiguities.
- [ ] Split accepted mixed passages into observations preserving wording, value,
  qualification/bound, unit, population, dates, geography, partners, role and source.
- [ ] Reconcile activities across nonidentical reports without inflating counts.
  Keep all citations and retain existing activity IDs where they match.
- [ ] Resolve or retain explicit holds for Queen Irene, Near Foundation, NigWED
  production wording and Potiskum grant bounds. Never repair source typos silently.
- [ ] Seek original delivery-partner material for proposed prominent claims;
  record dependence, unavailable corroboration and disagreement honestly.

**Exit evidence:** all candidates have substantive decisions or justified,
reviewed holds; machine repeats resolve to reviewed canonical passages; accepted
observations resolve to short evidence excerpts and citations; invalid units,
bounds, dates and target/delivery substitutions fail tests. No combined unique
beneficiary total or arbitrary impact score.

The current strict completeness check is intentionally conservative: automatic
repeats are not counted as completed editorial review. Extend it with tested
canonical-decision resolution before relying on it as the final archive gate.

**Immediate next step:** review the next source-context batch after batch 001, save
its decisions and publish the revised accounting in this document. No owner
classification or new credentials are needed for that step.

## Phase 2 — finish analysis and freeze reviewed data

**Status: exploratory NMF exists; reviewed analysis remains pending.**

- [ ] Review multilabel categories: policy/accessibility; livelihoods;
  education/training; healthcare/welfare; digital/assistive technology; sport;
  political engagement; honours/ceremonial activity.
- [ ] Select the relevant corpus after the source pass, reconcile near duplicates,
  document exclusions, and rerun the eight-topic TF-IDF/NMF model with seed 42.
- [ ] Save preprocessing, environment, corpus hashes, model arrays, representative
  articles and meaningful topic labels. Source-check representative findings.
- [ ] Review people, organisations, places, aliases and spelling variants.
- [ ] Build article-supported co-occurrence separately from documented partnerships.
- [ ] Calculate publication-period category/topic views with visible denominators.
- [ ] Produce a versioned compact public bundle and exports containing only
  reviewed activities, observations, citations, short excerpts and analysis results.
  Keep full articles and editorial working files outside the static export.
- [ ] Propose headline figures after review, with targets separate from delivery.

**Milestone 1 — owner reviews:** complete review accounting, accepted figures,
exclusions/holds, coverage, representative NLP findings and proposed story/emphasis.
The current research packet is partial and does not satisfy this milestone.

## Phase 3 — build and validate the standalone chatbot

**Status: not implemented.** Read [CHATBOT_SPEC.md](CHATBOT_SPEC.md) first.

- [ ] Define typed query plans and a shared calculation/filter layer, then test
  figures, activities, dates, programmes, targets/delivery, themes, keywords,
  organisations, places, connections and method explanations.
- [ ] Implement natural English/Hausa templates, composer, suggestions, follow-ups,
  targeted clarifications, unsupported responses, evidence and “Show these records”.
- [ ] Use the page locale as the only language source. Always display
  **Change language / Canja harshe**, with **English above Hausa**, vertically
  stacked and visible without a menu, on desktop and mobile.
- [ ] Preserve compatible filters, conversation context and draft input on language
  changes and browser navigation. Keep conversation state in the current browser
  session; add no server question logging or inference API.
- [ ] Test bilingual structured-answer/source equivalence, ambiguous and misleading
  questions, bounds, dates, attribution, targets and overlap safeguards.
- [ ] Check keyboard use, mobile reflow, status announcements, long transcripts,
  error/empty states and language switching. Mark Hausa wording as draft.

**Milestone 2 — owner reviews:** a working standalone bilingual chatbot with
numerical answers, follow-ups, clarification, NLP explanations and evidence actions.
Human Hausa approval remains required before public reveal.

## Phase 4 — build the coordinated visual dashboard

**Status: not implemented.** Integrate chat only after its standalone validation.

- [ ] Create the ivory/green/gold home: portrait introduction → standout numbers →
  interactive years → themes/connections → evidence explorer → chatbot.
- [ ] Use the monogram until a genuine portrait has documented reuse permission.
  Verify permission for cropping/cursor use before enabling a portrait accent.
- [ ] Coordinate year/category/programme filters across timeline, charts, table,
  exports and chatbot context. Supply readable table alternatives for every chart.
- [ ] Show labels, terms and representative articles from one frozen topic model;
  filters must not silently retrain it. Explain English-source NLP in both languages.
- [ ] Preserve achievement links and move the tribute tree to a secondary view.
- [ ] Provide purposeful reduced-motion-aware animation. Any desktop portrait cursor
  accent needs an off switch, precise pointer, preserved text cursor and disabling
  on touch devices and high-contrast mode.
- [ ] Check desktop/mobile, keyboard, focus, enlarged text, reduced motion, high
  contrast, missing data and empty/error states.

**Milestone 3 — owner reviews:** the working timeline, coordinated charts and
filters, evidence, connections and portrait/monogram treatment on desktop/mobile.

## Phase 5 — implement offline use and refresh operations

**Status: not implemented.**

- [ ] Add a native service worker and installable manifest without adding a
  production dependency unless an identified need justifies it.
- [ ] Cache both languages, all required local assets, approved images, reviewed
  data and downloads. Show **Ready offline** only after the complete cache succeeds.
- [ ] Show dataset date; explain unavailable storage and external articles requiring
  a connection. Keep bundled evidence, filters, downloads and chat usable offline.
- [ ] Use versioned caches and explicit update/reload prompts; an interrupted
  update must preserve the last working version.
- [ ] Test completed first visit, offline refresh, both languages, chatbot use,
  interrupted updates, denied storage and cache/version transitions.
- [ ] Implement the monthly collect → review → analyse → validate → publish process;
  demonstrate a sample refresh and preserve unchanged decisions by fingerprint.
  Automatic ingestion and a staff editorial system remain deferred.

## Phase 6 — verify the complete release candidate

**Status: pending.**

- [ ] Run preflight, lint, typecheck, tests, both builds and source/analysis audits.
- [ ] Run browser flows, automated accessibility checks and fresh performance
  measurements against the actual candidate, including offline flows.
- [ ] Complete human screen-reader/zoom checks and record remaining limitations.
  Availability of an appropriate screen reader and human reviewer still needs
  verification; installed automated accessibility tools do not establish this.
- [ ] Prepare the Hausa review packet and obtain fluent-human approval.
- [ ] Confirm genuine portrait rights and correction contact, or retain explicit
  preview status while those reveal gates remain unresolved.
- [ ] Verify exports, evidence resolution, data versioning, backup/restore and
  sample monthly refresh. Summarize actual results rather than inherited test claims.

**Milestone 4 — owner reviews:** the complete release candidate, its evidence,
offline demonstration, exports and monthly refresh example. Final reveal follows
owner review and all existing content/accessibility/performance/hosting gates.

## Phase 7 — configure hosting and complete approved release

**Status: external access and reveal gates unverified.**

- [ ] Verify Cloudflare account access, project/domain availability and intended
  Pages deployment path. Check whether the static bundle needs any live CMS
  integration; the existing standalone editor does not establish one.
- [ ] Exercise preview publication, failed-build retention and rollback. Keep
  credentials outside the repository and public bundle.
- [ ] Deploy the approved candidate once authorization and reveal gates are met;
  verify both locales, achievements, cache updates, sources and correction contact
  on the actual URL. Do not bypass `RELEASE_MODE=public` checks.

## Progress log

- 24 October, Phase 1 batch 001: reviewed 50 previously awaiting passages across
  11 articles; cumulative 82 explicit decisions, 1,260 automatic exact repeats and
  1,527 awaiting review. Saved eight typed research observations (six delivery
  reports, two targets), with public approval false, plus five full-source
  relevance exclusions. Eighteen cumulative holds remain. Added observation
  integrity checks and synthetic CI coverage; validation is in VALIDATION.md.
  Saved a separate local derived-analysis ZIP and SHA-256 checksum; ZIP integrity
  passed. An off-machine backup and restore exercise remain open.

- 24 October: environment inventory and phased execution document created.
  Core dependencies and saved research artifacts are present; preflight and
  saved-analysis integrity pass. Missing Playwright Chromium was installed;
  headless launch passed. Lint, typecheck, all 25 tests and both production builds
  passed. No new phase-1 editorial decisions were made in this planning step.
  Results are recorded in [VALIDATION.md](VALIDATION.md).
