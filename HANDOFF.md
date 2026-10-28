# Project handoff

## Latest checkpoint — agreed dashboard presentation, 28 October 2026

Start with [docs/DASHBOARD_PRESENTATION_BRIEF.md](docs/DASHBOARD_PRESENTATION_BRIEF.md).
The owner requested recording the conversation and committing/pushing the existing
checkpoint for next time, not implementing the new layout or deploying publicly.
This brief supersedes conflicting older presentation notes below.

Agreed title: **Advancing Disability Inclusion**, with **Mohammed Abba Isa’s
contributions in figures**. Agreed order: category-based KPIs; Ideas & Advocacy
speaking-photo/cloud; collaborations (pending); guided chatbot (pending).
Category names only on the left; sourced numerical cards on the right. Preserve
figures in hundreds and separate commitments only where present. Important
milestones such as one adapted vehicle deserve figures too, after source review.
No report-year activity chart, dashboard-wide year filter, decorative sparkline,
separate Explore the Evidence block, emoji, or repeated sidebar figures.

Cloud direction is now a genuine speaking-event photo with a permanent speech-
shaped panel, replacing the silhouette proposal. Source-derived concepts are not
quotes from the pictured speech. Speaking asset selection/rights and reproducible
concept frequencies remain outstanding. Do not turn term ranks into frequencies.

Collaborations and guided chatbot remain pending owner design discussion despite
existing working components. The proposed collaboration breadth bar chart is not
approved. Preserve those components and all source/evidence records until later
scoped implementation. Hausa, photograph rights and public-release gates remain.

Current application still implements the previous iteration described below,
including the older report-year graph and evidence explorer. This documentation
checkpoint does not claim their removal or the new layout is implemented.
Checkpoint includes the previously uncommitted 27 October implementation and
its existing browser evidence, plus this conversation’s documentation and original
update.txt. Destination: main on origin, batestguy/disability-inclusion-legacy-tree.
No new application changes were made during this documentation session.

28 October validation: preflight, lint, typecheck, all 60 JavaScript tests, web
and Studio builds, all 69 Python tests, bundle integrity audit, 32 local Markdown
links and staged whitespace checks passed. Browser suites were not rerun for
these Markdown-only edits; 27 October browser evidence remains historical.
No public deployment or approval flag change. See docs/VALIDATION.md.

## Latest owner direction — documented for later, not implemented

27 October 2026. Read the new **Latest direction — contribution-first
presentation** section in docs/DASHBOARD_NEXT_ITERATION.md before continuing.
The owner requested documentation only and explicitly deferred implementation.

Lead with documented disability-inclusion contributions across the full available
selected record. Prioritize concise contribution stories, a clickable activity
cloud and separately evidenced collaborations; topic/keyword exploration is
secondary and the year heatmap is deferred. Research references, data readiness,
limits and later checks are recorded in that document.

Confirmed owner choice: **chronology only**. Later remove dashboard-wide year
filtering/year buttons and prevent legacy year URLs from silently restricting the
overview; retain dates and chronological browsing. This supersedes the older
global year-filter direction, including the implemented iteration below.

This checkpoint changes documentation only. No application, data/model, approval
gate or deployment change is claimed. Preserve existing pending implementation
work. Public portrait rights and Hausa/public-release gates remain unresolved.

Documentation checkpoint validation: diff whitespace check, preflight, lint,
typecheck, all 60 tests and web/Studio builds passed. No browser rerun was needed
for these documentation-only edits. No commit, push or deployment was made.

## Next dashboard iteration implemented — 27 October 2026

Continued from committed/pushed checkpoint `2273642` (initial tree was clean).
Implemented the six requests in docs/DASHBOARD_NEXT_ITERATION.md locally:
report-year activity-record line chart with table/year buttons; all eight populated
catalogue categories selectable with zero-count chart rows omitted; elongated,
proportion-preserving cursor crop; official-homepage portrait and short attributed
English quote left of opening target KPIs; achievements across the full width
below; green–white–green styling including the embedded chatbot surface.

Read content/dashboard-portrait.json for exact photograph/quote provenance and
context; English quote remains English on Hausa pages. Main page and gallery were
inspected, including two original gallery samples; the About Us portrait was
chosen for a clearer individual image. No reuse licence was established. Cursor
retains its genuine smiling source, 48×64 native size, tip hotspot 4/3, off switch
and touch/forced-colour fallbacks; 37,835 decoded crop pixels match the source.

Passed preflight, lint, typecheck, **60 tests**, web/Studio builds and final web
rebuild after CSS refinements. Both browser suites completed:true, eight journey
groups each and five axe states each with zero violations; no page errors, failed
responses or external requests. Desktop, phone English/Hausa, time series and
native/enlarged cursor inspected. See latest docs/VALIDATION.md.
Preview: http://127.0.0.1:8767/ and /ha/.

This iteration is uncommitted; no push or deployment. Frozen data is unchanged.
Hausa remains draft; public portrait rights/reveal flags remain false. No public
release or approval status change is implied by working local previews.

## Next owner suggestions recorded — 27 October 2026

Current instruction: commit and push this completed dashboard checkpoint, and
document further suggestions for next time. Read docs/DASHBOARD_NEXT_ITERATION.md
first on continuation. Pending: time-series timeline; all populated categories
with empty filter options dropped; elongated, better-fitted portrait cursor;
large portrait/authentic sourced quote on the left with opening KPIs to its right
and subsequent figures filling the width underneath; green–white–green throughout.
Research his genuine main page/gallery for visual references and assets before
implementing. This direction supersedes the current gold target styling for the
next iteration. These suggestions are documented, not yet implemented.

## Installed skills dashboard improvements — 27 October 2026

Owner requested using globally installed interface-design and kpi-dashboard-design
to check and improve the dashboard. Both are now installed; earlier research-only
installation notes below are historical. Review found oversized opening chrome,
long mobile cards, uneven metric baselines, and filter controls detached from
their results. Main owns implementation/browser checks; read-only reviewer owns
the visual before/after check. Preserve all pending source/cursor/chat changes.

Direction: compact public-service scorecard with a white canvas, large legible
tabular figures, green achievements/gold plans, and a number/short label/one Source
action per item. Domain: inclusion, employment, enterprise, skills, women, welfare.
Colour world: flag green, white, emblem gold, dark ink and misty neutral. Signature:
one wide planned-opportunities figure with an aligned support pair, followed by
the eight real programme figures. Replace brochure-scale serif chrome with UI
typography, card-heavy mobile stacking with compact rows, and distant filters
with a native filter disclosure and active context beside category controls.
Keep small sparkle, shared visible vertical locale control and bottom chat.
No new numerical claims, data/model change, production dependency or public release.

Implemented compact scorecard in DashboardHighlights.tsx/highlights.css, with
shorter programme labels, aligned target units, compact phone rows and a top
native Filters disclosure. Selected year/context and Clear remain visible.
Self-hosted unchanged Adobe Source Sans 3 fonts include original OFL licence and
provenance; no font CDN. Reusable direction saved in .interface-design/system.md.
Before images: output/playwright/dashboard-skills-before-{desktop,mobile}.png;
after: dashboard-overview.png and dashboard-mobile.png. Independent read-only
review found all four original issues addressed, with no material regression
in sampled English views/source. Main also inspected Hausa and fixed heading/date
overlap; browser geometry now asserts their separation. Final evidence is recorded
in the newest docs/VALIDATION.md entry. Local preview: http://127.0.0.1:8767/.

## Simpler KPIs, new portrait and design research — 27 October 2026

Owner requested removing remaining achievement bullets, a different cursor photo,
then asked for number + short story label + one source link, without long checking/
verification prose. KPI cards now contain only number/unit, short title and Source.
Removed per-card dates/Details, stage badges in activity rows, the duplicate lower
figure dashboard, repeated hero/inventory cards, and process-heavy visible copy.
Counts remain compact beside filters. Group headings distinguish targets from
achievements; underlying evidence/metadata and on-demand activity details remain.

Cursor now embeds a genuinely different smiling photo from SocietyNow's named
appointment article. Provenance records the exact asset/hash and 161×155 crop;
all 24,955 decoded crop pixels match the source region. Native arrow remains
48×64 with 4/3 tip hotspot, off switch and touch/forced-colour fallbacks. Source
public-reuse approval remains false; no generated face.

Owner then requested research into actual achievement dashboards/downloadable
skills because the layout feels generic. Read docs/DASHBOARD_DESIGN_RESEARCH.md:
visually inspected actual Geckoboard charity, Tableau big-number and Microsoft
nonprofit reference screenshots. Recommended direction: compact number-first
white scoreboard, short labels and source-on-click. Best focused skill found:
dammyjay93/interface-design (30.9K installs); kpi-dashboard-design is a metric-layout
supplement. Reference skill files downloaded for inspection only; no installation
or global overwrite. A full reference-led visual redesign is not claimed.

Passed preflight, lint/typecheck, 59 tests, web/Studio builds (web rebuilt after
copy/layout simplification), and both browser suites: dashboard seven groups/five
axe states; standalone eight/five; zero violations, errors, HTTP failures or
external requests. Served cursor SHA-256 matches new provenance. No data,
dependency, approval, commit, push or deployment change. Owner review/research
direction is next; preserve all existing pending work.

## Simplified source cards and photo arrow ready — 27 October 2026

Owner rejected repeated Planned/not-delivered bullets and requested sources,
plus a conventional arrow cursor using his photo. Removed per-card stage badges
and repetitive explanatory paragraphs; stage headings/number bounds remain.
Each card now links directly to an observation-evidence source; Details opens
the existing full record with qualifications. The native editable SVG arrow
embeds an original-photo crop, with a white/dark outline and tip hotspot 4/3.
Final pointer is 48×64; whole-page scope/off switch/touch/forced-colour fallbacks
remain. Provenance updated; no generated face or rights approval. The arrow is
an editable SVG icon containing an original-photo crop, rendered with the existing
Sharp toolchain; its click point is the upper-left arrow tip rather than the head.

Passed preflight, lint/typecheck, 59 tests, both builds, dashboard browser (seven
groups/five axe states) and standalone chat browser (eight groups/five axe states).
Both completed:true with zero axe violations, page errors, HTTP failures or
external requests. Browser checks verify all eleven direct Source URLs against
their observation evidence, removed badges, actual PNG dimensions and hotspot.
Native/enlarged arrow PNG and refreshed dashboard screenshots visually inspected;
OS pointer appearance is not captured in browser screenshots. See latest
VALIDATION.md. No source data, dependency, approval, commit, push or deployment.

## White KPI showcase ready for owner review — 27 October 2026

Owner confirmed Tableau-style within this website. The first section is now a
distinct white KPI dashboard: three planned targets first, eight reported
milestone measures second, with All figures / Planned targets / Reported
achievements category controls. Existing context, charts, evidence and bottom
chatbot remain below. All values retain bounds, units, source qualifications and
matching evidence actions; no combined cohort total or completion percentage.
Category selection survives locale/filter navigation in memory; numerical cards
follow existing report-year/category/activity filters. Reload retains URL filters
and the active chat path; highlight category resets to All figures.

Owner also requested colour/clarity/glitter. Added gold planned figures, green
reported figures, restrained decorative stars with a four-second finite glint,
and reduced-motion/forced-colour fallbacks. Numerical text sizes to each card's
container to keep bound marks and six-character figures inside desktop columns.
Independent source review cleared stage/data/state changes; final browser checks
verify numeral bounds within cards at desktop, 1060px, mobile and 320px/200% text.

Passed preflight, lint/typecheck, 59 tests, web/Studio builds, dashboard browser
(seven groups/five zero-violation axe states) and standalone chat browser (eight
groups/five zero-violation axe states). Both result files completed:true; no page
errors, HTTP failures or external requests. Desktop/mobile screenshots inspected.
See latest docs/VALIDATION.md. No source data, dependency, approval, commit, push
or deployment change. Hausa remains visibly draft; public gates remain intact.
Owner review: http://127.0.0.1:8767/ or /ha/ (restart preview if needed).

## Phase 4 dashboard ready for owner review — 27 October 2026

Owner authorized completing Phase 4 dashboard work. The local English/Hausa home
dashboard and bottom compact chatbot are implemented and verified. Preserve all
pending dashboard/portrait-cursor changes; no commit, push or deployment was made.

Final checks pass: preflight, lint/typecheck, 59 tests, web and Studio builds,
dashboard browser (six groups/five axe states) and standalone chat browser (eight
groups/five axe states). Both browser results have completed:true, zero sampled
axe violations, no page errors, HTTP failures or external requests. See newest
docs/VALIDATION.md entry and output/dashboard-browser-results.json.

Fresh read-only data review found no material defect, including 170 year/activity
selection invariants. Integration review found and cleared a persistence bug:
section anchors overwrote the chat hash, so immediate reload lost the node.
Section links now scroll/focus without replacing it; the browser regression
reloads immediately after section clicks. Also corrected decorative accessible
control labels, evidence-close focus after locale remount, and narrow/short-screen
header obstruction. Browser tests cover export failure/recovery and 200% heading
start visibility with ordinary document reflow. URL changes precede locale effects,
so tests wait for actual rendered locale. No implementation changes followed the
final build; final test-only refinements were source-reviewed and executed.

Next: owner review at http://127.0.0.1:8767/ and /ha/; do not assume this preview
server survives a future session. Hausa approval, portrait reuse rights, broader
archive coverage and full offline reload/caching remain unresolved. No public
deployment is authorized, and the research preview still blocks public builds.

## Implemented scope — Phase 4 dashboard above the chatbot

Latest owner request authorizes building the main dashboard now, with the compact
chatbot at the bottom. Main owns dashboard UI/routes/shared session/language,
browser validation and final review; one executor owns the pure dashboard data
engine, declarations and focused tests. Preserve all pending photo-cursor edits.

Acceptance: English/Hausa home dashboard; one shared visible language control;
year/category/activity filters; activity-grain timeline/category counts; separate
delivery/target figures without a people total; frozen English-model text themes
with actual denominators; relationships distinguished from shared mentions;
filterable source/evidence rows and CSV exports; explicit selected-record handoff
to the embedded chatbot. Permanent achievement URLs and standalone chat remain.
The bottom chatbot keeps three replacing options and no internal scroller.
Global portrait cursor/off switch and filters/selected record survive locale
navigation. Preview-only gate stays in place; no public release is requested.

Design: ivory/green/gold, editorial title and monogram, timeline-led layout,
responsive charts with readable table alternatives, empty states, keyboard/focus,
200% text, reduced motion and forced colours. Use the existing reviewed v1 bundle
and dependencies. Validate data calculations/exports, then lint/typecheck/tests,
both builds and focused dashboard/browser regression journeys before delivery.

## Latest direction — genuine portrait cursor across the whole page

Owner superseded the organization-logo/buttons-only cursor preference. The local
English/Hausa chatbot now uses a photo-shaped portrait cursor throughout its
document: margins, header, text, buttons, sources and preferences. The provider
sets an HTML-level cursor attribute and cleans it up on leaving the chat layout.
The off switch is now Photo cursor / draft Siginan hoto; it survives locale
navigation. Fine hovering pointers only; coarse/touch and forced colours retain
standard cursors. No animated follower or pointer-event overlay was introduced.

The genuine portrait is from the office homepage's About Us section. Source,
photographer/reuse limits, hashes, processing and rejected candidate are in
content/portrait-cursor.json. An imagegen background-removal candidate changed
fine facial details and was rejected. The shipped asset uses the original photo
with a vector alpha mask, then native-cursor resizing. All 315,489 opaque pixels
of the pre-resize cutout match the original RGB values. The PNG is 48×56, 4,986
bytes, hotspot 24/4. Rebuild: node scripts/build-portrait-cursor.mjs (requires the
recorded source under ignored output/portrait-cursor/; source hash is checked).

This is owner-requested local prototype use, not a rights-holder reuse licence.
Public approval remains false and existing release gates remain. Do not replace
the main-page monogram or claim portrait rights cleared. See latest VALIDATION
entry for final checks. Earlier logo-cursor notes below are historical.

## Resume here — review fixes, alternating options and OSSAP cursor

Owner requested committing first, then criticism/improvements. Saved the complete
validated data/chatbot checkpoint locally as `c95e8d5`; preserved the owner's two
separate AGENTS.md edits. No push was requested. Read
docs/CHATBOT_REVIEW_2026-10-25.md and the latest docs/VALIDATION.md entry.

Root choices now prioritise Activities and reported results. Programme choices
show concise activity identity plus figure/bound/stage/unit, rather than identical
unnamed figures or long headlines. Visible choices alternate green/white/green.
Separate option/source page state survives reader/detail visits; evidence hashes
restore their source-list screen consistently. Summary routes resolve stored
source extracts; reader announcements include text and correct language metadata.

User clarified “quiz” means design questions, not a visitor quiz. The OSSAP logo
cursor is optional, restricted to links/buttons on fine hovering pointers, with
an off switch and standard touch/forced-colour/text fallbacks. The official site's
32×32 icon is unchanged and served locally. Provenance/rights limits are recorded
in content/ossap-cursor.json; public_approved remains false. No public reveal,
model service, dependency or source-bundle change. Hausa remains draft. Continue
with owner review, then the main dashboard; earlier presentation notes are history.

## Resume here — minimal replacing choices, 25 October 2026

Owner rejected the verbose scrollable version. The current `/chat/` and
`/ha/chat/` previews show one short question/answer with up to three choices.
More options / Previous replace that set. No sidebar, statistics, visible path,
repeated prompts, transcript, automatic evidence dump or internal scroll area.
Unavailable history actions are omitted. Back/Next retrace chosen questions;
Start again resets. Source lists, source findings and record details replace the
screen only when selected. Long original source text/metadata use separate pages,
with exact text preserved and source excerpts distinguished from paraphrases.

Women-focused figures are on their corresponding clickable programme cards,
with separate bounds and a short no-sum qualification. Main answers retain
necessary target/delivery, unit and attribution limits. Full record metadata
and downloads remain under Details. Shared language navigation preserves the
current node, option/source/detail page and selected source in memory; reload
restores the active node path rather than the auxiliary reader state.

See docs/GUIDED_CHAT_IMPLEMENTATION.md and the newest docs/VALIDATION.md entry.
All 162 nodes / 33 activities / 11 observations remain reachable. No graph,
bundle, legacy parser, frozen audit, approval flags or dependencies changed.
Hausa remains draft. No commit, push or deployment. Owner review of this simpler
flow precedes dashboard integration. Earlier scrollable-panel notes below are
historical and superseded by this correction.

## Earlier checkpoint — compact guided chatbot, 25 October 2026

Latest owner direction is implemented locally at `/chat/` and `/ha/chat/`:
clickable questions replace the visible step with an answer and useful follow-ups,
through to source evidence. Build this standalone flow before the main dashboard.
The conversation panel has a stable height; long answers, source disclosures and
options scroll inside it. Earlier-answer transcripts no longer expand the page.
Back/Next retrace visited steps; choosing an option starts a new forward branch;
Start again resets it. Language switching preserves active/forward steps and
selected evidence in memory. Refresh restores the active hash path only.

All 162 graph nodes, 33 activities and 11 observations are reachable. Figure
endpoints offer the activity summary, separate same-activity figures and sources;
source endpoints return to available figures. Topic/name/relationship follow-ups
lead to up to three activities sharing cited reports, explicitly qualified rather
than implying partnerships. Original English evidence qualifications are visible,
including developer attribution on the toolkit relationship. Mobile introduction
is compact so questions take priority. Hausa wording remains draft.

See docs/GUIDED_CHAT_IMPLEMENTATION.md and the newest docs/VALIDATION.md entry
for checks and limits. No API, dependency, data change, public approval, commit,
push or deployment was added. Legacy parser/frozen failed-audit artifacts remain
unchanged; graph coverage is not natural-language accuracy. Preserve all existing
staged/untracked work. Owner review of this guided flow is next, followed by the
Phase 4 dashboard. Full offline reload/cache readiness remains later work.
Earlier hosted-planner recommendations below are historical research, superseded
for this wave by the owner's guided interaction choice.

## Latest research — free-tier modernisation recommendation

Owner requested research into modern methods for a large improvement, then added
**Free tier**. Read docs/CHATBOT_MODERNISATION_RESEARCH.md and
docs/FREE_TIER_PROVIDER_FINDINGS.md (official sources checked 25 October 2026).
Recommendation for an experiment: semantic plan extraction with a free hosted
model, initially Groq GPT-OSS 120B versus 20B behind Workers Free, complete reviewed
fact cards/all 11 observations, deterministic execution and bilingual rendering.
Workers AI is an alternative to benchmark; no model's Hausa quality was tested.
Schema compliance is not semantic accuracy. Gemini unpaid-data/audience terms
are material to public use; provider/account eligibility remains unverified.

Free quotas are finite and shared; no auto-upgrade, paid fallback or trial-credit
assumption. Keep keys outside the repository/browser. Hosted planning introduces
external processing, asynchronous replies and an online dependency; preserve a
useful local/offline path and resolve the accepted offline/privacy contract rather
than silently changing it. Proposed improvement/accuracy targets are unachieved,
not approved release gates. The failed fifty-question baseline and engine remain
unchanged. No account/key inspection, inference call, new package or deployment
was performed. Research is complete; this is not an implementation checkpoint.

## Latest checkpoint — fifty-question audit fails conversational quality

25 October: owner requested 50 random questions and an accuracy check. Completed
a seeded, stratified draw from an independently evidence-authored 60-question pool:
25 English/25 draft Hausa, with 34 answerable, ten ambiguous and six unsupported.
Engine, gold and selected set were frozen before execution; no chatbot fixes were
made during evaluation. Read docs/CHATBOT_ACCURACY_AUDIT.md and its protocol.

**Natural-language quality is not ready:** zero of 34 answerable questions received
a complete correct answer. Thirty-one got unnecessary clarification; one got an
irrelevant refusal; one got a partial methodology limitation; one SMEDAN year
follow-up got five participants instead of year 2024. The five is a true sourced
value answering the wrong question, not a fabricated number. Across all 50,
independent semantic review found five useful complete handling responses (two
targeted clarifications/three substantive limitations) plus one partial. The
13/50 coarse action-match score includes eight generic ambiguity fallbacks and
must not be advertised as factual accuracy or useful resolution.

All 50 were also asked in the production-static browser; replies/statuses matched
the baseline exactly, with no page errors/HTTP failures. Existing 32 Node tests,
lint/typecheck and both builds still pass; this contrasts their narrow fixture
scope with the broader audit and does not erase its failures. Saved candidate
pool, frozen selected gold, raw/reviewed results, CSV and independent review.
The evaluator refuses code/data drift or baseline overwrite. No production
dependency, commit/push, deployment or source-bundle change was introduced.

Next substantive work is broader evidence-driven plan selection, contextual
understanding and relevant clarification, followed by a **new unseen** bilingual
sample. The exposed 50 are now regression material. Do not patch their literal
phrases and call the retest held-out accuracy. Standalone chat remains a prototype;
milestone 2 cannot be called validated for ordinary conversation. Hausa human
approval, source coverage and existing public-reveal gates remain open. Preserve
all existing staged work. Earlier implementation checkpoints below are historical.

## Latest owner feedback — women-focused question

25 October: the owner showed the generic clarification returned for “what has he
done for disabled women?”. Fixed with a source-bound bilingual summary and natural
English/Hausa paraphrases, plus a starter suggestion. It reports NigWED >45 and
March startup support >20 separately, with exact source contexts for women,
partner attribution, no double counting or inferred income/employment. It honours
canonical report-year filters and refuses extra unsupported subgroups/geography.
The summary is a controlled intent, not unrestricted language understanding.
Twenty-one engine groups and a fresh numerical review pass; final build/browser
evidence is recorded in the newest VALIDATION entry. Human Hausa approval remains
pending. Existing staged work and release gates are unchanged. Refresh the local
preview and ask again to see the new reply; previous in-memory replies are not
silently reinterpreted. Phase 4 dashboard integration is still pending.

## Resume here — standalone chatbot ready for owner review, 25 October

Phase 3 engineering is implemented at `/chat/` and `/ha/chat/`; run the static
preview with `npm.cmd run preview` (port 8767). The existing home and permanent
achievement URLs remain. Dashboard integration has not started. Read
docs/PHASE3_IMPLEMENTATION.md and the newest docs/VALIDATION.md entry first.

The standalone interface uses the Phase 2 v1 bundle, typed deterministic plans,
evidence-bound claims, bilingual draft templates, programme/report-year context,
clarifications, keyword/source lookups, descriptive catalogues, method explanations,
record evidence and private calculation downloads. Direct figure lookup supports
the five named starter programmes; other reviewed activities are discoverable
through lists/keyword evidence. Do not imply unrestricted natural-language support
or numerical coverage of every observation. No runtime inference or query storage.

One route-derived locale controls page and chat; the visible shared instruction is
exactly **Change language / Canja harshe**, English vertically above Hausa. Drafts,
structured transcript, programme/year and selected evidence survive client language
navigation and Back/Forward. Visitor text stays unchanged, assistant templates
re-render; refreshing starts a new in-memory conversation. Computation is synchronous,
so there is no delayed old-language response. The preview server now serves `.txt`
route payloads as text/plain to preserve client navigation. Language links disable
prefetch; the installed Next static export's segment-prefetch paths were unavailable.

Latest checks: preflight, workspace lint/typecheck, 29 Node tests, 69 Python tests,
compact artifact audit and both production builds passed. Seven focused browser
journey groups passed, with no
axe violations in four states, page errors, failed responses or external requests.
Two independently reproduced semantic-routing issues were fixed and rechecked:
year follow-ups cannot discard extra filters, and programme queries cannot replace
unsupported outcomes with an existing cohort count. Existing staged Phase 2 work
was preserved; no commit, push, deployment or new production dependency was made.

Next owner milestone is reviewing the standalone chat. Then proceed to Phase 4's
coordinated visual dashboard and integration. Human Hausa review remains pending:
research/phase3-hausa-review.md covers the new wording. The preview has a separate
public-build refusal; CMS approval of older content cannot approve this bundle.
Portrait rights, correction contact, hosting, human accessibility, fresh performance
and final public-reveal gates remain open. Offline installation/cache readiness is
still Phase 5 work. Git ownership is unchanged; read-only Git commands used the
command-scoped `-c safe.directory=D:/HonAbbas` exception, no global configuration.

## Resume here — Phase 1 accepted, Phase 2 v1 ready

24 October: owner said “Phase 1 is okay, proceed”. This authorizes progression
despite the recorded backlog; do not block chatbot work on another Phase 1 approval
or silently mark unreviewed passages complete. Phase 2 produced a reviewed-subset
data bundle at content/dashboard/v1/bundle.json plus CSVs and hash manifest. Read
docs/PHASE2_FINDINGS.md and docs/IMPLEMENTATION_PHASES.md for the current contract.

Bundle: 33 activities, 11 numerical observations (eight reported-delivery, three
targets), 37 citations, eight reviewed categories and frozen topics, 46 entities,
149 body-text mentions, 257 co-occurrence edges and nine separately evidenced
relationships (six reported collaborations, two intentions, one reported signing).
The model uses 31 selected source records/30 exact-distinct texts, not the full
archive or a representative career sample. Seed 42; 839 features; 117 iterations;
model hash e823e7b0d7096bc6045dc718ef30ad7fbb92b09fd9aae587b4d0033765791b78.
Publication denominators 2023: 10; 2024: 7; 2025: 10; 2026: 3. All full-source downloads
and model arrays remain ignored/local. Category/topic labels and seven explanations
have draft Hausa; the review packet is research/phase2-hausa-review.md.

New commands: analyse-dashboard-corpus.py freezes the reviewed subset;
build-dashboard-bundle.py merges checked records without multiplying cohorts;
audit-dashboard-bundle.py independently checks the compact committed artifact.
Scientific pins unchanged; bundle/export/audit/tests use no new app dependencies.
CI now audits the committed bundle alongside synthetic research tests. The first
pipeline still records the unfinished archive and a full-archive exploratory model,
which is separate from the v1 selected model. Corrected name-shaped author removal
preserves substantive “By enabling...” prose; old exploratory hashes are historical.

Next: implement and validate the standalone English/Hausa conversational chatbot
using bundle.json and the shared deterministic calculation layer, then integrate
the dashboard. Read CHATBOT_SPEC.md. One page/chat locale; exact **Change language
/ Canja harshe**, English above Hausa, visible without menu. Preserve draft input,
filters and compatible context on switching. No runtime inference or server query
logging. No more old-tree preview or appearance work. No public reveal is implied:
portrait, fluent-human Hausa, correction contact and hosting gates remain open.
See docs/VALIDATION.md for actual checks and Git history/Actions for delivery.

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
