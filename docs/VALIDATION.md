# Validation evidence - 22 October 2026

## Presentation brief and checkpoint validation — 28 October 2026

Owner requested documenting the agreed dashboard design and committing/pushing
for next time. Added docs/DASHBOARD_PRESENTATION_BRIEF.md; updated HANDOFF.md,
PROJECT_PLAN.md, DASHBOARD_NEXT_ITERATION.md, CHATBOT_SPEC.md and the interface
design system. Preserved original update.txt. Category-based KPI layout and the
speaking-photo/cloud direction are agreed; collaborations and guided chatbot
remain pending. The separate evidence block and report-year activity chart are
excluded from the future layout, not removed from current application code.

No new app, data/model, dependency, portrait approval, Hausa approval or public
release change was made in this session. The checkpoint also preserves the prior
uncommitted implementation, portrait provenance and browser artifacts described
in the 27 October validation below. Frozen bundle still has 33 activities, 11
observations and 30 canonical model documents; public_reveal_approved is false.

Executed and passed on 28 October:

- npm.cmd run preflight
- npm.cmd run lint
- npm.cmd run typecheck
- npm.cmd test: 60 passed, zero failures
- npm.cmd run build: web static export and Sanity Studio passed
- python -m unittest discover -s scripts -p '*_test.py': 69 passed
- python scripts/audit-dashboard-bundle.py: integrity_passed true
- Local Markdown links: 32 resolved; both pending design decisions retained
- git diff --cached --check: passed before final commit

Browser suites were not rerun: new edits in this session are Markdown only.
Existing 27 October screenshots/results are retained as evidence of the previous
implementation, not evidence that the next design has been built. Remote main
matched local HEAD before this checkpoint. The checked-in GitHub workflow runs
verification and uploads a static-preview artifact; it has no deployment step.


## Portrait, report-year graph and green scorecard — 27 October 2026

Completed the queued next iteration locally from checkpoint 2273642. Major
portrait/quote occupy the left opening rows, target KPIs sit right, and eight
achievement figures fill the board below. Mobile reading order is portrait/quote
then all figures in document flow; first mobile KPI is intentionally lower now.
Green–white–green replaces gold plans, including embedded chat surface/focus.
All eleven sourced figures retain values, units, bounds and stages.

Official office homepage and gallery were read; two original gallery photographs
were visually inspected. The About Us portrait was selected and its exact source
hash verified before 540×600 WebP encoding (27,182 bytes). Quote uses only the
first attributed homepage sentence, in original English with lang=en on both
locales. Exact excerpt, attribution context, asset hashes, photographer/reuse
limits and false public approval are in content/dashboard-portrait.json.

Report graph counts selected activity records by report year (8/10/11/4 at full
selection), with zero-based ticks, explicit partial 2026 coverage, accessible
text/table and year filter buttons. It does not calculate event dates, people
sums or cumulative impact. All eight populated catalogue categories remain
selectable; current category chart omits zero rows. Regression test verifies
unused categories and empty AND selections without losing clearable controls.

Cursor keeps its existing genuine smiling source and native 48×64 arrow/hotspot
4/3. Portrait crop is now 161×235 and fits proportionally into 24×35; builder
checks all 37,835 decoded crop pixels against the source. Final cursor is 3,710
bytes; SHA-256 8e14b5b7f54fcf2aaa6f3a495b4ab370894ab86bd2cb8f7d64d206f18c7cf79f.
Native/enlarged PNG inspected; screenshots do not capture the OS pointer.

Passed npm.cmd run preflight, lint, typecheck, **60 tests**, full web/Studio
build and final web rebuild after portrait/embedded-chat CSS adjustments.
Final dashboard browser started **2026-10-27T07:07:17.594Z**; standalone chat started
**2026-10-27T07:04:02.835Z**. Both completed:true, eight journey groups each,
five zero-violation axe states each, no page errors, failed HTTP responses or
external requests. Final dashboard test waits for fonts after locale changes
before geometry/screenshots. Responsive/200%/forced-colour, both locales, exact
source URLs, empty filtering, export recovery, evidence focus, shared locale/chat/
cursor history and loaded offline interactions pass. Screenshots inspected:
dashboard-overview.png, dashboard-mobile.png, dashboard-mobile-hausa.png and
dashboard-time-series.png under output/playwright/. The mobile full-page capture
also records figure placement below the portrait. Desktop first figure y=344.77;
phone first figure y=899.36; supporting phone row height=111.59 (sampled pixels).

Frozen bundle SHA-256 remains
166d42785cf3a12256c0207399d3d6cd5c4facaa0d7a75116a0feb181ea62db2.
No dependency, numerical data, approval, commit, push or deployment change.
Hausa remains draft; no public photograph licence, human review certification,
causal-impact result or full offline reload readiness is claimed.

## Installed dashboard skills applied — 27 October 2026

Used global interface-design and kpi-dashboard-design for the owner-requested
review and implementation. Fixed oversized opening space, tall mobile cards,
uneven target unit baselines and filters detached from their figures. White
scorecard now uses aligned tabular Source Sans 3 numbers, gold plans/green
achievements, short programme labels, one Source link per KPI, a single finite
lead glint, compact phone rows and a top native Filters disclosure. Active filter
context/Clear and selected report year remain visible. Original Adobe fonts are
self-hosted with OFL licence/provenance; no production package dependency added.
Saved direction in .interface-design/system.md. Main inspected English desktop,
English/Hausa phone views and fixed the Hausa heading/date overlap. Browser
geometry now checks title/date separation as well as numeral/document overflow.

Read-only reviewer rechecked before/after English screenshots and source: all
four original issues addressed; no material regression in that sampled scope.
Before: output/playwright/dashboard-skills-before-desktop.png and
dashboard-skills-before-mobile.png. After: dashboard-overview.png,
dashboard-mobile.png and dashboard-mobile-hausa.png. Final browser measurements:
first desktop number y=343.77px (1440×1050), first English phone number y=408px;
supporting phone card height=109.59px. These are sampled geometry, not benchmarks.

Passed preflight, workspace lint/typecheck, all **59 tests**, full web/Studio build,
then web rebuild after the final heading CSS correction. Final dashboard browser
started **2026-10-27T02:33:10.278Z**: completed:true, seven journey groups and five
axe states with zero violations. Standalone chat browser started
**2026-10-27T02:28:28.255Z**: completed:true, eight journey groups and five
zero-violation axe states. Both report zero page errors, HTTP failures or external
requests. Coverage includes exact source links, category/AND filtering, empty
results, exports and download-error recovery, keyboard evidence focus/return,
shared locale/cursor/chat state, history, 1060px/phone/320px/200% geometry,
forced colours and loaded offline interactions. The final test-only correction
waits for a collapsed filter's attachment rather than visibility before opening
it; the native disclosure deliberately hides those selects initially.

Frozen numerical bundle SHA-256 remains
`166d42785cf3a12256c0207399d3d6cd5c4facaa0d7a75116a0feb181ea62db2`.
No new totals, trends, approvals, commit, push or deployment. Hausa remains draft,
portrait public reuse remains unapproved, and public reveal gates remain intact.

## Number-first simplification and replacement portrait — 27 October 2026

Owner steering: remove remaining repeated achievement bullets; use a more fitting
different photo; then simplify KPI cards to number, short main-story label and
source link, without long verification/process prose. Cards now follow that
format. Removed per-card date/Details, visible stage badges in activity rows,
repeated hero/inventory cards and the duplicate lower numerical board. Compact
counts accompany filters. Category headings and semantic labels still distinguish
targets/achievements; source data and full on-demand evidence are unchanged.
Chart captions are shorter; actual theme denominators remain visible. Hausa draft
is still labelled, with public gates unchanged.

Compared another cached office action photo and searched different named portraits.
Selected SocietyNow's smiling photograph accompanying its 9 November 2023
appointment article. The original office portrait is no longer the cursor source.
Raw source is retained locally under ignored output/portrait-cursor/; URL, identity
basis and previous photo are recorded in content/portrait-cursor.json. No public
reuse licence was established or approved.

Builder now verifies the selected source hash/dimensions from provenance and all
**24,955 pixels** in the **161×155** decoded crop against the original image region
before clipping/scaling into the existing vector arrow. Final cursor: 48×64 PNG,
4,367 bytes, tip hotspot 4/3, SHA-256
`5683ec343de2d6d5b5a58e43b673c89ec39d6cefb905d1a02c97b59bab07dc08`.
No generated facial detail. Native/enlarged previews visually inspected.

Passed preflight, lint/typecheck, **59 tests**, web/Studio builds; web rebuilt after
the final simplification. Final dashboard browser started
**2026-10-27T02:05:58.883Z**, completed:true, seven groups/five zero-violation axe
states. Standalone browser started **2026-10-27T02:06:07.082Z**, completed:true,
eight groups/five zero-violation axe states. Both have no page errors, HTTP failures
or external requests. Source URLs remain tied to all eleven observations; KPI
buttons/stage prose and duplicated figure DOM are absent. Record evidence/focus,
exports, locales, history, responsive/200% layout and loaded offline interaction
still pass. Served cursor bytes now match the recorded asset SHA-256 in addition
to dimension/hotspot and touch/forced-colour/off-switch checks.

Design research requested during this work is separately documented in
[DASHBOARD_DESIGN_RESEARCH.md](DASHBOARD_DESIGN_RESEARCH.md). External screenshots
and skill reference files remain ignored research assets; none are shipped.
No new skill installation, numerical dataset, production dependency, public
approval, commit, push or deployment. This is UI cleanup plus research, not a
claim that a complete reference-led visual redesign or human certification passed.

## Source-first cards and photo arrow cursor — 27 October 2026

Owner requested removing repetitive Planned/not-delivered bullets, adding sources
and shaping the photo pointer like a real cursor. Removed stage badges and repeated
qualifications from the opening KPI cards. Planned/Reported group headings retain
the stage distinction once; semantic number labels still identify each stage.
Every card has a direct Source link selected from that observation's evidence IDs,
plus Details for full record qualifications. Values, bounds, units and evidence
data are unchanged. Source links keep original titles and safe external-tab flags.

Replaced the person-shaped cursor with an editable native SVG arrow embedding a
crop of the unchanged office photograph. Crop x225/y180, width285/height310; white
outer edge, dark inner outline, neutral green arrow fill, 48×64 PNG and hotspot
4/3 at the upper-left tip. No AI-generated likeness or facial retouching. The
builder verifies original source SHA-256 and dimensions; the prior alpha-mask
pixel audit remains a historical lineage check rather than a claim about newly
added vector border pixels. Final PNG: 4,377 bytes; SHA-256
`b8d3e8765ec9ace98616d1a98215f17837077b2b56111345796a6fae6379c638`.
Contains 1,471 fully transparent and 1,425 fully opaque pixels. Provenance updated
in content/portrait-cursor.json; public approval remains false. Normal touch and
forced-colour pointers, whole-page scope and persistent off switch remain.

Passed original-photo/native-arrow build verification, preflight, lint/typecheck,
**59 tests**, and web/Studio builds. Dashboard browser started
**2026-10-27T01:38:57.138Z**: completed:true, seven groups, five zero-violation axe
states. Checks now assert all eleven direct source URLs belong to their specific
observation evidence and repeated stage badges are absent. Standalone browser
started **2026-10-27T01:39:08.069Z**: completed:true, eight groups, five zero-violation
axe states; checks include served PNG dimensions and computed 4/3 hotspot, plus
existing off-switch, locale, touch and forced-colour regressions. Neither run
reported page errors, failed HTTP responses or external requests.

Refreshed dashboard screenshot and native/enlarged arrow PNG were visually
inspected. Playwright does not capture the OS-rendered pointer; its shape is
checked in the actual asset and its deployment in computed styles, not a fake
overlay. No data, production dependency, public approval, commit, push or deploy.
Hausa review, portrait reuse rights and other public-release limits remain.

## White category-first KPI dashboard — 27 October 2026

Owner confirmed Tableau-style within this website and requested a separate first
section with large meaningful numbers, white background, colour/clarity/glitter.
DashboardHighlights now leads the English/Hausa home: three planned targets in
gold, then eight reported milestone measures in green. Category buttons show
all eleven, targets only or achievements only. Numbers retain exact stored values,
bound symbols and spoken bounds, units, report dates, source qualifications and
matching record evidence actions. No people sum or fabricated completion rate.

The former introductory hero follows the KPI showcase as an h2; the page retains
one h1 and one shared visible language selector. Category state belongs to the
shared session and survives locale/filter updates in memory; URL reload restores
filters/chat path and resets the category to All figures. Cards follow existing
filters, including honest empty states. Source data/graph/audit and public gates
are unchanged. Hausa draft status is visible in the new first section.

White background remains clear above the existing flag watermark. Decorative gold
stars have no pointer/semantic role; glint ends after four seconds and is disabled
for reduced motion. Forced colours retain labels and pressed-state distinction.
Numbers size to their individual card containers rather than viewport width.
Source review found no material data/stage/state issue and requested checking
actual numeral bounds in desktop columns; that browser check now passes.

Passed `npm.cmd run preflight`, `npm.cmd run lint`, `npm.cmd run typecheck`, all
**59 Node tests**, and web/Studio builds. Web was rebuilt after final typography
and status refinements; no subsequent implementation edits. Browser runs:

- Dashboard: started **2026-10-27T01:25:18.872Z**, completed:true, seven journey
  groups and zero axe violations in five states. Covers all eleven figures,
  category keyboard controls, gold target before achievement ordering, actual
  white background, matching evidence/focus return, filtered and empty cards,
  locale/category persistence, CSVs, history/reload, permanent routes, loaded
  offline interactions, reduced motion and forced colours. Numeral span bounds
  pass at 1440px, 1060px, mobile and 320px/200% text, beyond document-overflow checks.
- Standalone chat: started **2026-10-27T01:25:29.195Z**, completed:true, eight
  journey groups and zero axe violations in five states.
- Both runs: no page errors, failed HTTP responses or external requests.

[Dashboard results](../output/dashboard-browser-results.json) and
[standalone results](../output/guided-browser-results.json) were refreshed.
Desktop/mobile screenshots were visually inspected. No production dependency,
Tableau service, new numerical claim, approval flag, commit, push or deployment.
These checks do not establish Hausa approval, public portrait reuse permission,
human screen-reader certification, new performance results or offline refresh.

## Phase 4 dashboard and shared chatbot — 27 October 2026

The local English/Hausa home now renders the dashboard above the compact guided
chatbot. Existing standalone chat and all ten bilingual permanent achievement
URLs remain available. No dependency, dataset, model, approval flag, external
inference service, commit, push or deployment was introduced in this continuation.
The existing reviewed-subset v1 bundle remains unchanged.

Checked activity/report-year AND category AND activity filtering; timeline/category
counts; eight reported-delivery measures and three separately labelled targets;
actual frozen English-model denominators; explicitly qualified relationships vs
shared mentions; source evidence; filtered activity/figure CSV downloads; selected
record-to-chat handoff; shared locale, cursor preference and URL context. No sum
of unique people or causal impact is inferred. A fresh read-only reviewer found
no material data defect and independently checked 170 year/activity selections.

The integration reviewer identified a real persistence bug: section anchor
navigation replaced the conversation hash and lost its active step on immediate
reload. Section navigation now scrolls/focuses without overwriting that path.
An immediate-reload regression covers both Evidence and Chatbot section links;
the reviewer cleared the fix. Evidence closing returns focus to its originating
control, or the evidence section after a locale remount. Narrow/short-screen
headers now scroll normally rather than obscuring enlarged content.

Initial dashboard browser runs exposed test issues as well: decorative arrows
were part of exact accessible export button names; locale assertions ran after
URL commit but before React effects; and the first zoom assertion required an
entire long Hausa title to fit a 720px viewport at 200% text. Decorative export/
reader symbols are now hidden from assistive technology, locale assertions wait
for rendered HTML language, and zoom checks verify the visible unobscured heading
start while allowing normal document scrolling. Download listener/click promises
are handled together so failures write completed:false evidence. Export failures
are deliberately simulated, the browser API restored, and successful recovery
verified through actual downloaded CSV cells. The final test changes received
source review; no remaining material findings were reported.

Final validation:

- `npm.cmd run preflight`: passed (legacy ledger: five records/six sources;
  this count is distinct from the reviewed dashboard bundle).
- `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd test`: passed;
  **59 tests**, including ten dashboard data tests.
- `npm.cmd run build`: web and Studio passed; web rebuilt again after the
  section-navigation correction. No later implementation edits.
- `npm.cmd run test:dashboard-browser`: completed, started
  **2026-10-27T00:55:04.914Z**; six journey groups, zero axe violations in five
  states; no page errors, failed HTTP responses or external requests.
- `npm.cmd run test:chat-browser`: completed, started
  **2026-10-27T00:52:53.618Z**; eight journey groups, zero axe violations in five
  states; no page errors, failed HTTP responses or external requests.

Browser evidence: [dashboard results](../output/dashboard-browser-results.json),
[standalone results](../output/guided-browser-results.json), and desktop/mobile/
Hausa/zoom screenshots under output/playwright/dashboard-*.png. Checks include
keyboard focus, mobile layouts, 320px/200% reflow, forced colours, reduced motion,
source language metadata, CSV dimensions, loaded offline interactions and history.

Limits: sampled automated checks and source review do not establish fluent Hausa
approval, human screen-reader certification, performance targets, public portrait
reuse permission, archive completeness or offline-refresh readiness. The research
preview still rejects public builds; owner review is next.

## Genuine photo cursor across the complete page — 25 October 2026

Owner superseded the office-logo/links-only preference: find his genuine photo
online and use a photo-shaped cursor throughout the page. Selected the 720×800
portrait published alongside the About Us text naming Mohammed Abba Isa on
https://ossaposneo.org/. A second office photograph and the State House release
were inspected; the latter's page metadata was generic State House imagery,
so it was not mistaken for his portrait. Reuse permission was not established.
The latest owner request authorizes local cursor prototyping; public approval
remains false, and neither the main portrait nor reveal gate was cleared.

Used built-in imagegen for a background-extraction candidate, with identity/
face/clothing preservation constraints. Visual review found changed fine facial
details, so the candidate was rejected and is not shipped. Final asset uses the
original office photograph and a hand-traced vector alpha mask; no generated face
or clothing is used. The packaging script checks the exact source SHA-256 and
dimensions, validates all **315,489 fully opaque pre-resize pixels** against the
original RGB values, and only then downsamples to the native-cursor size.
Shipped [cursor](../apps/web/public/branding/abba-isa-cursor.png): 48×56 PNG,
4,986 bytes, 1,136 fully transparent and 1,220 fully opaque pixels. Hotspot 24/4.
Source/mask/asset hashes, exact rejected prompt, processing and rights limits are
in [portrait-cursor.json](../content/portrait-cursor.json). Build command:
`node scripts/build-portrait-cursor.mjs`; raw source and full cutout remain in
ignored output/portrait-cursor/ for local provenance.

The chat session provider applies its preference to the HTML element and cleans
up that attribute when the layout unmounts. Fine-pointer/hover CSS applies the
native cursor across the complete document and descendants, including margins,
header, text, buttons, inputs, source reader and preferences. No cursor overlay,
animation loop or intercepted events. Off switch renamed Photo cursor / draft
Siginan hoto; its state survives language navigation. The switch remains available
in narrow mouse-driven windows; real coarse/touch pointers and forced colours
retain standard cursors. Earlier logo-only/section-limited cursor checks are
superseded by this update.

Passed: original-photo/hash/alpha verification, `npm.cmd run preflight`, workspace
lint and typecheck, **49 Node tests**, and `npm.cmd run build` (web and Studio).
Final `npm.cmd run test:chat-browser` completed at 2026-10-25T17:39:38.081Z:
eight journey groups; zero axe violations in five states; no page errors, HTTP
failures or external requests on the main test page. New assertions cover the
portrait cursor on HTML/body/workspace/header/heading/buttons/preferences, actual
margin hit testing, answer text, off-switch persistence across English/Hausa,
and an additional true touch-device context with normal cursor and hidden switch.
Forced-colour and existing 320px/200%/offline/claim/source/receipt checks pass.
Screenshots were refreshed; native operating-system cursor rendering is not
captured by Playwright screenshots, so scope is verified by computed styles and
the independently inspected PNG rather than a fabricated pointer overlay.

[Browser results](../output/guided-browser-results.json) are marked
`completed: true`. No dependency, dataset, answer graph, legacy audit, approval
flag, commit, push or deployment change. This is not human Hausa/screen-reader
certification, a new performance result, or public portrait reuse clearance.

## Committed review improvements, alternating options and cursor — 25 October

Owner requested committing before criticism/improvements. Saved the validated
data/chatbot checkpoint as local commit `c95e8d5` (79 files, including required
data/research dependencies); preserved separate owner AGENTS.md edits. Checked
staged content for common credential patterns without printing file contents;
no matches. No push was requested or performed.

A fresh read-only reviewer found five required usability/accessibility fixes:
unnamed same-value programme choices, option/source paging resets, inconsistent
source screen restoration through browser history, empty summary-source readers,
and detail announcements without meaningful content. See
[review and corrections](CHATBOT_REVIEW_2026-10-25.md) for baseline file/line
references, impact and corrections. Main implemented all five. Independent
recheck confirmed the fixes, then identified two remaining details: use a short
Karu label rather than a long headline lacking its name, and tag English evidence
in the Hausa live region. Both were corrected and checked in browser regressions.

Owner's design answers: prioritise Activities and reported results; “quiz” means
design questions rather than a visitor quiz; OSSAP cursor only over buttons and
links. Visible options/source choices alternate green/white/green. Programme
labels are concise and retain figure bounds, stages and units; original source
titles/text are unchanged. Three replacing choices and no internal scrolling
remain. The optional native cursor uses the unmodified publisher 32×32 icon,
served locally, on fine hovering pointers; its switch disables it. Ordinary
text/background, touch and forced-colour cursors remain standard. Provenance,
asset hash and unverified reuse permission are in
[ossap-cursor.json](../content/ossap-cursor.json), with public approval false.

Passed: preflight, workspace lint/typecheck, **49 Node tests**, full web/Studio
production build, and subsequent final web build after label/language/cursor
refinements. Source-resolution tests check exact evidence/role/qualifications,
direct-evidence priority, cloning and honest absence. All 162 nodes, 33 activities
and 11 observations remain covered; legacy parser/frozen audit and bundle are
unchanged. No new production dependency or hosted service.

Final `npm.cmd run test:chat-browser` completed at 2026-10-25T17:18:28.076Z:
seven journey groups, zero axe violations in five states, zero page errors,
HTTP failures or external requests. New checks verify computed alternating
background/text colours, optional local cursor scope/off switch, distinguishable
Karu/Ramadan 500-person choices, retained option/source list pages after reading,
stored women-source extracts, source-list history/reload, and actual language-
tagged announcement text on reader paging. Existing source/receipt dimensions,
exact text paging, bilingual state, normal-phone fit, 320px/200% reflow, forced
colours and loaded offline navigation still pass. Results are in
[guided-browser-results.json](../output/guided-browser-results.json), marked
`completed: true`; desktop and Hausa mobile screenshots were visually reviewed.

An intermediate browser run exposed a long Karu headline that omitted its short
programme name; concise source-bound navigation titles resolved it. No evidence
was changed to satisfy a test. These checks do not certify human Hausa or actual
screen-reader speech, logo reuse rights, fresh performance or full offline reload
readiness. No public deployment or approval is claimed. Final review improvements
are saved in a separate local commit following the baseline; see Git history.

## Minimal replacing choices — owner correction, 25 October 2026

Owner rejected the previous scrollable, verbose interface. Replaced it with one
concise question/answer and up to three choices per option page. Previous / More
options replace the set. Removed the intro/sidebar, inventory, visible path,
repeated prompts, automatic full evidence blocks, endpoint messages and internal
scroll containers. Unavailable history buttons are omitted. Women-focused
figures are merged into their clickable programme cards, with separate bounds
and a short no-sum qualification. Relevant target/delivery, unit and attribution
limits remain visible. Sources and Details deliberately replace the screen;
long original evidence and metadata are paged without truncation. Downloads
remain under Details. The shared language control retains selected node,
option/source/detail page and source in memory. Reload restores the node path.

One scoped executor implemented/reviewed the concise presentation helper and
its focused tests; main reviewed it and implemented session/UI/CSS, browser
journeys and documentation. The underlying graph, reviewed bundle, legacy parser,
frozen audit and approval flags were preserved. No dependency was added.

Passed: `npm.cmd run preflight`, `npm.cmd run lint`, `npm.cmd run typecheck`,
`npm.cmd test` (**47 tests**, including six new concise-presentation groups),
and `npm.cmd run build` (web and Studio). The graph still covers all 162 nodes,
33 activities and 11 observations. Tests protect separate women-focused bounds,
typed figure labels, activity summaries, relationship attribution, exhaustive
three-item pagination and exact whitespace-preserving text segmentation.

Final `npm.cmd run test:chat-browser` completed at 2026-10-25T16:53:23.442Z:
five journey groups, five axe states with zero violations, no page errors,
HTTP failures or external requests. It verifies old choices disappear, at most
three remain visible, no internal scroller or duplicate interface sections,
Back/Next keyboard navigation, browser history, locale/source preservation,
all 11 figure/source/receipt routes, all ten 2024 activity choices across pages,
relationship attribution and exact source text versus labelled paraphrases.
The source reader's paged text/role/limitations/date basis were concatenated
and compared with the original evidence fields: no characters lost/duplicated.
English root and English/Hausa women-focused steps fit at 390×844 without page
scrolling. At 320px/200% text and forced colours, normal document reflow remains
available without internal scrolling, clipping or horizontal overflow. Loaded
navigation works offline; full offline refresh/cache readiness is still later.

Saved [browser results](../output/guided-browser-results.json) have
`completed: true`; screenshots in output/playwright/ were visually reviewed.
An initial browser assertion incorrectly expected an exact quote for a source
that is a labelled record paraphrase; corrected the assertion to check both
kinds explicitly. No source was relabelled to make the test pass. Test review
checked graph reachability, claim integrity, replaced option sets and lossless
source paging against the final interface. Automated checks are not human Hausa
or screen-reader certification. Hausa remains draft; no new performance score,
commit, push, deployment or public approval is claimed. This supersedes the
scrollable-panel presentation in the previous entry.

## Compact guided question chatbot — 25 October 2026

Owner authorized implementation before the main dashboard. `/chat/` and
`/ha/chat/` now show one answer/options step in a stable-height panel, with
internal scrolling for long answers, sources and choices. Back/Next retrace
visited steps; choosing an option starts a new forward branch; Start again clears
it. Shared language navigation preserves the active step, forward trail and
selected evidence in memory. Refresh restores the active URL path only.
The breadcrumb is bounded/scrollable; earlier-answer transcripts are removed.
The mobile introduction is compact, with the first option fully visible at
390×844 without page scrolling.

One scoped executor improved the engine/declaration/graph tests; main reviewed
the changes, implemented interface/session/CSS, and extended browser checks.
Figures lead to their record, separately qualified same-activity measurements
and sources. Evidence endpoints link back to available figures. Topics, names
and relationship endpoints offer up to three activities sharing cited reports,
explicitly qualified as shared reporting rather than partnership evidence.
No source/data/parser/audit baseline changes or production dependencies were made.

Passed: `npm.cmd run preflight`, `npm.cmd run lint`, `npm.cmd run typecheck`,
`npm.cmd test` (**41 tests**, including nine guided graph groups), and
`npm.cmd run build` (web and Studio). Subsequent mobile CSS refinements passed
fresh `npm.cmd run build -w apps/web` runs. Final handoff preflight and
`git -c safe.directory=D:/HonAbbas diff --check` passed; line-ending notices
remain informational. All 162 reachable graph nodes have resolvable choices and
sources, covering 33 activities and 11 observations. An additional all-node probe
checked the types of newly displayed original English evidence qualifications.

`npm.cmd run test:chat-browser` completed successfully against the final static
build: seven journey groups; zero axe violations across five English/Hausa,
desktop/mobile states; zero page errors, failed HTTP responses or external
requests. Checks cover fixed panel height after navigation/source expansion,
single visible answer, keyboard Next, Back/Next across locale switches, discarded
forward branches, reset, browser history, valid/invalid hash paths, reload,
all 11 numerical endpoints and receipt dimensions, source links, year units,
topic/relationship distinctions, loaded offline navigation, 320px/200% text,
forced colours and reduced motion. Results:
[guided-browser-results.json](../output/guided-browser-results.json), marked
`completed: true` at 2026-10-25T16:32:33.062Z. Failed/incomplete runs now retain
`completed: false`, so partial evidence cannot be mistaken for full completion.
Desktop, English mobile and Hausa mobile screenshots are in output/playwright/.

The first browser run exposed a missing visible toolkit attribution limitation;
the UI now displays original English evidence role/date-basis/limitations,
including “not Isa as its developer or funder.” A mobile geometry check also
identified a partly clipped first option; spacing was refined and rechecked.
Main's test review found the navigation transitions and source integrity covered
by behavioral assertions; graph coverage is not a natural-language accuracy score.
Legacy 0/34 audit remains unchanged. No human Hausa certification, screen-reader
certification, new performance score, complete offline reload/cache readiness,
commit, push, deployment or public approval is claimed. Owner review of the
guided experience precedes Phase 4 dashboard integration; Hausa remains draft.

## Free-tier modernisation research — 25 October 2026

Owner requested modern-method research, then specified free tier. Completed
[architecture/multilingual research](CHATBOT_MODERNISATION_RESEARCH.md) and
[provider verification](FREE_TIER_PROVIDER_FINDINGS.md) from opened official
documentation and primary research. One delegate independently checked provider
limits/terms; main reviewed the evidence and wrote the architecture proposal.

Recommendation is a provider-neutral semantic planner with complete reviewed
fact/measure coverage, strict plan validation, deterministic execution and
bilingual rendering; first benchmark candidate is Groq Free behind Workers Free,
with Workers AI as an alternative. No measured model-quality improvement, Hausa
approval, actual account quota, privacy configuration or deployment is claimed.
Gemini's current unpaid/audience conditions, finite shared quotas, local-model
licences and online/offline trade-offs are recorded explicitly. No credentials,
accounts, model calls, dependencies, billing or production app changes were made.
The failed fifty-question engine hash remains unchanged.

Preflight, workspace lint/typecheck, 32 Node tests and both production web/Studio
builds passed again; the root build command exited successfully. Local
links in the new research documents were checked. The proposed higher-quality
planner must still be implemented and tested on fresh unseen English/Hausa
questions. Existing development tests do not override the failed audit.

## Fifty-question natural-language audit — 25 October 2026

Owner requested 50 random questions to check accuracy. A separate author used the
bundle/specification without seeing parser/tests to supply 60 candidates. Frozen
seed 20261025 sampled 25 English and 25 draft Hausa: 17 answerable, five ambiguous
and three unsupported per language. Gold, selection and engine/bundle/candidate
hashes were saved before execution. See
[protocol](CHATBOT_EVALUATION_PROTOCOL.md) and
[full audit](CHATBOT_ACCURACY_AUDIT.md). This is random sampling from a designed
pool, not a representative visitor-traffic accuracy estimate.

Findings: **0/34 answerable questions fully answered**, 31 unnecessary
clarifications, one irrelevant refusal, one partially useful methodology
limitation and one wrong-question answer (five participants instead of year 2024).
Semantic review of all 50 found **5/50 useful complete handling** (English3,
Hausa2) plus one partial. The 13/50 coarse action matches include eight generic
clarifications and are not factual-accuracy or useful-resolution scores. All ten
ambiguous questions deferred safely; only two clarifications targeted the missing
programme. Three of six unsupported requests received a substantive limitation.
No correct full answer was hidden by rigid internal labels. The observed five is
a true source value selected for the wrong intent, not a fabricated participant
count. Native-speaker Hausa sign-off remains absent.

All 50 were also asked through the production-static web component, including
setup of preceding programme context. Every visible main reply/status matched
the engine audit; zero page errors and HTTP failures. Same-engine repeat execution
in a separate output directory reproduced all aggregate scores. Baseline outputs
are protected from overwrite; report generation checks the review/results hash.
No engine, bundle, gold or selected-question changes occurred after freezing.

Repository checks passed: preflight, lint, typecheck, 32 Node tests and both
production builds. The evaluation runner/browser/report scripts passed syntax
checks. Those development checks do not override the failed conversational audit.
No production dependency, deployment or public approval was introduced. Future
fixes must retain this baseline and use new unseen questions for fresh accuracy
claims. All existing staged changes and release gates were preserved.

## Owner-feedback correction — women-focused question, 25 October 2026

Reproduced the screenshot's unnecessary generic clarification for “what has he
done for disabled women?”. Added a controlled `summary` plan backed by the exact
women-specific contexts in sources 3531 (NigWED, >45) and 2279 (startup support,
>20). Claims retain separate cohorts, reported-delivery stages, source-specific
populations and partner attribution; no combined total or inferred later outcomes.
Unsupported subgroups/geography/negation remain blocked or clarified. Canonical
report-year filters apply; exact event dates are not inferred. Both English and
Hausa templates exist; the Hausa remains an unsigned draft.

Passed: preflight, workspace lint/typecheck, 32 Node tests (21 engine groups), and
both web/Studio production builds; the root build command exited successfully.
Three new test groups cover natural bilingual paraphrases, complete claim
equivalence, report-year/context/follow-up handling, extra qualifiers, and missing
or altered source-specific population/bound/outcome evidence. A fresh read-only
numerical review plus targeted probes found no material finding in the new intent.

The production-static browser check passed eight journey groups, including the
owner's exact lowercase question, the typed Hausa question, source evidence,
separate lower bounds, no 65-person total, and same-transcript language switching.
Five axe states had zero violations, including the new Hausa summary. No page
errors, HTTP failures or external requests occurred. The previous navigation,
mobile/reflow, reset, receipts and numerical safeguards still pass. Results are
in [chat-browser-results.json](../output/chat-browser-results.json). This does not
establish unrestricted parser coverage or human Hausa approval. No deployment,
new dependency, data-bundle change, commit or push was made.

## Standalone bilingual chatbot — 25 October 2026

Phase 3 is implemented as dedicated `/chat/` and `/ha/chat/` previews. The active
data contract remains the 33-activity reviewed-subset v1 bundle, with 11 typed
observations and 37 citations. Direct figure queries currently cover five named
programmes; the controlled catalogue and remaining limitations are recorded in
[PHASE3_IMPLEMENTATION.md](PHASE3_IMPLEMENTATION.md). No dashboard integration,
deployment or public reveal is claimed.

Passed: `npm.cmd run preflight`, workspace lint and typecheck, `npm.cmd test`
(29 Node tests, including 18 engine groups and the new preview gate), compact
bundle audit, all 69 Python research tests, and both web/Studio production builds.
The final `npm.cmd run build` exited successfully. No production package
was installed. The matching Playwright headless shell was reinstalled after its
cache was unavailable; this adds no application dependency.

`npm.cmd run test:chat-browser` passed seven grouped journeys on the production
static export: English/Hausa direct routes and refresh; visible vertical language
options and active state; keyboard switching; draft/transcript/programme/report-year
and evidence preservation; Back/Forward; count and year filters; source evidence;
report-year follow-ups; private receipt download; target/overlap/wrong-grain and
geography safeguards; empty-year disclosure and context correction; reset; eight
frozen topics/method/keyword results; and a long transcript. Mobile checks cover
390px and 320px widths, 200% text reflow, reduced motion and forced-colour active
language marking. There were no page errors, external requests or HTTP failures.
Four WCAG 2 A/AA, 2.1 AA and 2.2 AA axe states had zero violations: English desktop
empty conversation, Hausa with selected evidence, English mobile long transcript
and Hausa direct mobile. These checks do not certify human screen-reader use,
translation quality, all browser combinations or performance targets.

Evidence: [browser results](../output/chat-browser-results.json),
[desktop](../output/playwright/chat-desktop.png),
[mobile conversation](../output/playwright/chat-mobile-conversation.png), and
[Hausa mobile](../output/playwright/chat-mobile-hausa.png).

Fresh independent numerical review reproduced two high-priority semantic errors:
year follow-ups discarded extra filters, and generic programme vocabulary allowed
unsupported outcomes. The executor corrected both, expanded tests to 18 groups,
and the reviewer independently rechecked the fixes with valid and misleading
English/Hausa probes. No material numerical finding remains in that reviewed
scope. This is fixture-based validation, not a measured held-out correct-plan rate.

Browser testing also caught a local static-server `.txt` content-type error that
forced document reloads and lost drafts; serving route payloads as text/plain
fixed actual client navigation. Language links disable the installed export's
unavailable segment prefetch paths. Conditional `aria-controls` fixed the initial
axe finding against an unmounted evidence panel. The final browser run passed.

The old source-data approval cannot approve this chat preview: the new explicit
public-build guard refuses it, with a separate regression test. No public build
or deployment was attempted. Hausa remains a labelled draft and
[its review packet](../research/phase3-hausa-review.md) is unsigned. Portrait,
correction-contact, hosting, human accessibility, fresh performance and offline
release evidence remain outstanding. Existing staged Phase 2 changes were
preserved; no commit/push is included in this checkpoint.

## Phase 2 reviewed-subset v1 — 24 October 2026

The owner accepted the Phase 1 checkpoint and instructed progression. Its archive
backlog remains false/incomplete in data; it does not block this agreed transition.
Built content/dashboard/v1 with 33 activity records, 11 observations (eight
reported-delivery/three targets), 37 citations, 30 canonical model documents,
46 entities and nine evidenced relationships, separately from 257 co-occurrence
edges. All eight categories/topics and seven explanations have draft Hausa;
research/phase2-hausa-review.md prepares human review without establishing approval.

Passed locally: preflight; workspace lint/typecheck; ten Node tests; 69 Python
tests; both web/Studio production builds; source integrity for 646 sources and
2,869 candidate passages; saved research-artifact audit; independent compact
bundle audit; JSON parsing and changed-document link checks; whitespace checks.
The compact artifact audit also runs in CI without scientific dependencies or
raw article downloads. New tests cover canonical corpus selection, conflicting
alias categories, byline/prose preservation, exact excerpts, source-bound review
notes, cohort reconciliation, multi-stage activity links, typed networks,
denominators, spreadsheet safety, preview gates and tampered/rehashed artifacts.

Selected corpus: 31 source records, 30 unique full texts; five-word-shingle near
duplicate screen at 0.8 flagged no additional pair. Existing same-event reports
are still reconciled by activity identity rather than fuzzy text merging. Frozen
NMF uses seed 42, eight topics, 839 features and 117 iterations. Repeated fits
reproduced component/weight SHA-256:
e823e7b0d7096bc6045dc718ef30ad7fbb92b09fd9aae587b4d0033765791b78.
Repeated bundle/CSV/manifest exports were byte-identical. Full environment,
preprocessing/corpus hashes and frozen arrays are in ignored output/phase2-analysis/.

Main review caught and corrected two issues: byline matching must preserve
substantive “By enabling...” paragraphs, and mixed delivery/target activity rows
must expose all linked observation stages. It also preserved the annual/direct
36,551-target source-bound variation as a note rather than an extra observation.
The old full-archive exploratory model was refreshed after the byline correction;
its current hash is 602533ecd992c3de191600ac8425e6daa19efea394a876ea27b7a58c7502a47a.
Earlier hashes in historical checkpoints remain evidence for their earlier code.

Saved output/office-evidence/phase2-v1-2026-10-24.zip and SHA-256 companion;
ZIP integrity checked. This is local backup evidence, not off-machine restore.
The strict numerical-completeness check still correctly refuses the unfinished
review. No app UI, browser/performance result, deployment or final reveal approval
is claimed. Next engineering work is the standalone bilingual deterministic chatbot.

## Phase 1 batch 002 and dashboard focus — 24 October 2026

Owner steering deprioritizes the old tree; this checkpoint continues dashboard
data preparation. Reviewed 60 more passages across 20 full source texts. Current
accounting: 142 explicit decisions, 146 exact repeats linked to reviewed canonical
decisions, 1,114 unlinked exact repeats and 1,467 awaiting (2,869 total). Eighteen
holds remain. Source relevance covers 25 records (11 included, 14 excluded).

Added eight qualitative research activity records, with no invented numeric
measures. Source 1243/1245 are one courtesy meeting; source 1257/1263 are one award
announcement/receipt sequence. Activity publication chronology follows evidence
for the recorded stage, so an announcement cannot date later reported receipt.
Participant/institution fields do not classify meetings as executed partnerships.
The eight earlier numerical observations and exploratory NMF corpus are unchanged.

Passed locally: preflight; workspace lint/typecheck; ten Node tests and 33 Python
tests; both web and Studio production builds; full source-archive integrity audit;
saved-analysis audit including activity evidence/stages and canonical repeat
links; research JSON and changed-document links; whitespace checks. Tests verify
that duplicate links preserve canonical holds, do not multiply observations and
leave unreviewed originals open. Tests also reject invented qualitative measures,
duplicate activity IDs, excluded evidence, absent excerpts and announcement/receipt
date substitution. NMF component/weight hash remains identical to the baseline.

The strict completeness gate correctly continues to refuse the unfinished review.
Saved output/office-evidence/analysis-batch-002-2026-10-24.zip and companion SHA-256
checksum; ZIP integrity passed. Backups remain local; no off-machine restore claim.
No new UI/browser/accessibility/performance result or public-release approval is
claimed for this research checkpoint. Remote verification is the Actions run for
the delivered commit; it does not include the ignored full source corpus.

## Phase 1 batch 001 checkpoint — 24 October 2026

Reviewed 50 additional passages across 11 source articles. Cumulative accounting:
82 explicit source-context decisions (including eight research observations and
18 reviewed holds), 1,260 automatic exact repeats and 1,527 awaiting review.
Five full-source relevance exclusions are recorded without silently changing the
exploratory NMF corpus. All eight observations are explicitly not public-approved.

Passed locally: preflight; workspace lint/typecheck; all ten Node tests and
23 Python synthetic tests; web and Studio production builds; full source-archive
audit (646 sources/2,869 passages); saved-analysis integrity audit including exact
observation excerpts, typed-observation fingerprints and source-relevance
freshness. The regenerated NMF arrays retain the prior SHA-256. Research JSON,
new documentation links, staged whitespace and credential-pattern checks passed.
The separate strict completeness gate was tested and correctly refused the
unfinished review. No fresh UI/browser/performance result is claimed for this
research-only change.

Added a GitHub Actions research-safety job running the synthetic standard-library
tests without the ignored source corpus or scientific packages. Local source
audits and model reproduction are distinct checks; a green CI run alone cannot
certify the full archive or editorial approval. Git history and the Actions run
for the delivered commit provide remote verification evidence.

Saved a separate derived-analysis ZIP and checksum at
output/office-evidence/analysis-checkpoint-2026-10-24.zip; ZIP integrity passed.
The full source archive and generated review queues/model arrays stay ignored.
This local ZIP does not establish off-machine backup or a completed restore test.
No public application figures, dashboard/chat/PWA features, website deployment,
portrait permissions or human Hausa approval changed.

## Environment and phased-plan checkpoint — 24 October 2026

Created docs/IMPLEMENTATION_PHASES.md and linked it from PROJECT_PLAN.md and
HANDOFF.md. Verified installed JS/Python/research/test versions, workspace
dependency resolution, archive/model/backup presence, project preflight and
saved-analysis integrity. Python is currently machine-wide; dedicated research
isolation is a recorded improvement. Cloudflare/account access, human reviewers,
portrait rights and correction contact remain unverified external prerequisites.

The first browser check found no matching Chromium executable. Ran
`npx.cmd playwright install chromium`; after transient DNS retries it installed
Chromium and headless shell 156.0.8078.4 (Playwright build 1248) and FFmpeg.
Retested `chromium.launch({headless:true})`: launch succeeded and reported
156.0.8078.4. Playwright, axe and Lighthouse imports succeeded. This is a browser
toolchain smoke check, not a fresh application/browser/accessibility audit.

Reran and passed: preflight, workspace lint/typecheck, all ten Node tests, all
15 Python research tests, web production build and Studio production build.
Phased-plan relative links resolve and Git whitespace checks pass. No new app
features, numerical review decisions, deployment or public-release approvals are
claimed by this environment/planning step. Next work is the Phase 1 review batch.

## Dashboard research implementation — 24 October 2026

Passed: preflight; workspace lint and typecheck; all ten existing Node tests;
web static production build and Studio production build; source-archive integrity
audit for all 646 sources and 2,869 candidate passages; all 15 new synthetic Python
research tests; independent saved-analysis artifact audit. `git diff --check`
passed. No app UI, production dependency, public content or hosting changed; no
new browser, accessibility or performance result is claimed.

The NMF component/weight SHA-256 matched across repeated fits in the recorded
Python 3.14.4 environment. Corpus hashes, all preprocessing settings, environment
versions, model arrays and topic/source assignments are saved in local ignored
output/analysis/20261024T081152242131Z/. The tracked research/analysis-baseline.json
records the artifact manifest without full articles or numerical passages.

The strict `python scripts/audit-analysis.py --require-complete` check was
exercised and **failed as expected**: substantive numerical review is incomplete.
Ordinary integrity passes are separate from editorial readiness. Queue accounting
is 32 explicit source-context decisions, 1,260 automatic exact repeats and 1,577
awaiting review. Fifteen of the explicit decisions are unresolved holds. The
exploratory model also needs source relevance and representative-article review.
No first-milestone approval, new public bundle, chatbot, dashboard, offline
operation, monthly refresh completion or release readiness is claimed. See
[DASHBOARD_ANALYSIS.md](DASHBOARD_ANALYSIS.md).

## Chatbot documentation checkpoint - 22 October 2026

Completed checks for this documentation refresh: preflight, workspace lint/typecheck, all ten tests and both web/Studio production builds passed. All 15 project Markdown files have the contract or its reference; local Markdown links resolve and whitespace checks pass. No chatbot code, browser/performance rerun, commit/push or deployment is claimed. Historical refresh results below retain their original scope.

[CHATBOT_SPEC.md](CHATBOT_SPEC.md) captures the accepted conversational dashboard section and shared page/chat language behaviour. Its checklist adds direct English/Hausa loads, vertical bilingual selector discoverability, synchronised switching, history, stale-response handling, bilingual semantic equivalence and human Hausa review. These are future acceptance tests, not passed checks. Earlier browser/performance evidence below predates the chatbot and cannot certify it. Validation commands for this documentation refresh are recorded in HANDOFF.md when completed.

## Latest handoff status

Descriptive metrics foundation, 22 October 2026: added a six-activity ledger, a source-validating KPI module, CSV/JSON export and five new tests (ten total). Export succeeds and preserves missing quantities, targets and greater-than bounds. Ten tests, preflight, workspace lint and typecheck passed. No UI routes changed and no new browser/performance claims are made. Build verification for this change is recorded in docs/CONTRIBUTION_METRICS.md. Earlier tree-interface results below retain their original scope.

Both repository delivery workflows completed successfully: [implementation CI](https://github.com/batestguy/disability-inclusion-legacy-tree/actions/runs/39722399277) and [delivery documentation CI](https://github.com/batestguy/disability-inclusion-legacy-tree/actions/runs/39722444939), the latter at b614322584f911810be52f5cbc23766b1c3ad1fd. These ran preflight, lint, typecheck, five content tests and both builds. CI does not run browser/axe/Lighthouse or deploy the website.

This handoff refresh changes documentation only. Preflight and Git whitespace checks passed again; application builds and browser/performance tests were not rerun for this refresh. Earlier dated results below retain their original scope. Current-artwork performance, human Hausa/portrait approval, guided accessibility review and live publishing verification remain open. Start the next session with [HANDOFF.md](../HANDOFF.md).

## Result
A runnable bilingual preview is implemented. It is not release-ready. No public deployment or live CMS publishing test is claimed.

Passed: root preflight; web and Studio lint/type checks; five content/publishing tests; both production builds; Studio HTTP 200 at localhost:3333; Next development server ready at 127.0.0.1:3000; static preview HTTP 200 at 127.0.0.1:8767. The Studio placeholder build validates configuration and bundle only, not a live account.

The static export includes English and Hausa home routes, five permanent records in each language, and a 404. Studio import generation parses 15 documents with all editorial review flags false. The original HonAbbas.txt was preserved.

## Browser checks
Production static export, Chromium 148 (local Playwright chromium-1243), Windows, Node 24.15.0. See output/browser-results.json, recorded 2026-10-22T03:15:07.038Z. 13 functional checks passed, zero uncaught page errors. Desktop viewport 1440 x 1000; mobile 390 x 844; 320px reflow; 150% font preference. System reduced motion enabled during core flows. Storage-denied context checked separately.

Checks cover branch/year filtering, search and empty results, panels, Escape, focus restoration, browser Back, permanent bilingual routes, selected-story language switch, preference persistence, unavailable storage, mobile focus containment, and horizontal reflow.

Axe: zero violations across eight tested states under WCAG 2 A/AA, 2.1 AA and 2.2 AA tags. Off-screen sections are forced into layout during axe scans to avoid content-visibility hiding errors. This is not proof of WCAG conformance. The first run found small branch-number contrast and high-contrast timeline text failures; fixed. An enlarged-text mobile headline overflow was also fixed.

Screenshots: output/playwright/desktop.png, mobile.png and mobile-panel.png. Artwork is original procedural SVG; the monogram is explicitly a portrait placeholder.

## Performance ? gate remains open
Latest Lighthouse 13.5.0, 2026-10-22T03:14:18.637Z, Chromium via Playwright CDP port 8766. Compressed Node static server at 127.0.0.1:8767 (gzip, immutable asset cache headers); cold runs; mobile screen 412 x 823, DPR 1.75; simulated throttling; 4x CPU slowdown on this workstation. These are local synthetic measurements, not Cloudflare or real-user results. Full settings, timing and audits are retained in the JSON reports.

| Test | Performance | Accessibility | LCP | TBT |
| --- | ---: | ---: | ---: | ---: |
| Standard mobile (150ms RTT, 1638.4 Kbps) | 72 | 100 | 2.80s | 1142ms |
| Slower 3G-like (300ms RTT, 700 Kbps) | 77 | 100 | 4.60s | 281ms |

Targets: mobile Performance >=95 and LCP <=2.5s. The latest run does not meet them. Runs varied (one intermediate optimised run scored 85 with 2.43s LCP); use the latest retained reports, not the best score. Initial uncompressed Python serving scored 66 with 5.41s LCP and is not comparable to compressed hosting. Optimisations applied: defer GSAP/ScrollTrigger until scrolling, render botanical artwork as a static SVG asset, skip off-screen paint/layout and avoid unnecessary preference style invalidation. Remaining cost is principally style/layout and React/Next script processing. Profile on an otherwise idle reference device and real preview CDN; preserve functionality while reducing initial client work before reveal. Do not describe the performance gate as passed.

## Reproduce
```powershell
npm.cmd run preflight
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run preview
# In another terminal, with a compatible Chromium installed:
npx.cmd playwright install chromium
npm.cmd run test:browser
npm.cmd run test:performance
```

For this session an existing compatible browser was used through CHROMIUM_PATH=C:/Users/TOSHIBA/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe. The automation accepts CHROMIUM_PATH and TEST_URL. The performance script uses fixed local debugger port 8766; ensure it is free. Standalone Lighthouse launcher failed to expose its debugger in this sandbox, so the reproducible script attaches to Playwright-launched Chrome.

## Required human / live reviews
- Fluent Hausa review of all copy and controls, including source and evidence-status terms.
- Genuine portrait, photographer attribution and reuse permission; then remeasure LCP with the real image.
- Guided keyboard-only journey, 200/400% browser zoom, Windows forced-colours and screen-reader review with NVDA or VoiceOver. Automated focus/reflow checks do not substitute for these.
- Journalist task: find biography and verify three records within five minutes; not yet observed with a participant.
- Live Sanity publish/update/delete -> preview rebuild, failed-build retention, correction mailbox and backup/restore/ownership handover tests.
- Live deployment URL, name availability, CDN headers, permanent routes and production analytics check.

Source/editorial boundaries are in docs/RESEARCH.md. No top-1-percent, PhD or unverified headline statistics were published. No photograph was copied without permission.


## Owner-requested tree revision ? 22 October 2026
The preceding Lighthouse figures are from the earlier vector-tree build; they do not measure this new image-based revision and the performance release gate remains open.

Replaced the abstract tree with a realistic generated botanical cutout (desktop/mobile alpha WebP). Added branch-shaped pointer hit areas following the actual limbs, accessible labelled disclosure controls, connected story twigs, clearer English/Hausa language choices on home and record pages, a public-domain Natural Earth Nigeria watermark and a much larger stump portrait frame. The genuine photo remains pending permission/supply; no likeness was generated.

Validation: both workspace lint and type checks pass; five content/publishing tests pass; root production build passed and the latest web rebuild passed after the limb-hit update. Final production-static browser run at 2026-10-22T03:50:13.587Z passed 17 functional checks, including actual limb clicks, keyboard expansion/Tab order, twig focus restoration and retained expansion, plus previous panel, search, language, preference and reflow journeys. Zero uncaught page errors. Axe found zero violations in 9 states, including expanded story branches and mobile expanded branches at 150% text. Human review limits and launch gates still apply.

Updated screenshots: output/playwright/tree-revision-desktop.png, tree-revision-expanded.png, tree-revision-mobile-top.png and tree-revision-mobile.png. Artwork, source files, full generation prompt and method: docs/TREE_ART.md.


## Sourced Yobe baobab / full-screen flag revision
Owner authorised a grounded regional approximation when an exact hometown tree could not be verified. The displayed artwork now adapts Adamu ab's CC BY-SA 4.0 photograph, described by its uploader as Danchuwa, Yobe. Visible credit includes original source, photographer, licence, AI changes, derivative download and licence notice. Personal hometown/tree connection remains explicitly unverified. The reference's unverified age claim is omitted. Source/derivative provenance, original SHA-256 and full prompts: content/tree-art.json, docs/TREE_ART.md and docs/tree-art-generation.json.

A single CSS green-white-green flag is fixed across the entire viewport on every route while scrolling, with pointer events disabled. High-contrast and forced-colour modes hide it. Former local map watermarks were removed from the rendered tree and intro.

Final run 2026-10-22T04:07:21.929Z: 19 browser checks passed, zero page errors, zero axe violations across 9 tested states. New checks verify full-screen geometry while scrolling, high-contrast suppression, visible author/source/licence links, public derivative download and change notice. Both builds, workspace lint/typecheck and all five content tests passed. Updated screenshots remain in output/playwright/tree-revision-*.png. Earlier Lighthouse figures predate this artwork revision; performance is not newly certified and existing reveal gates remain open.

## Public repository delivery — 22 October 2026

Repository: https://github.com/batestguy/disability-inclusion-legacy-tree (PUBLIC, main). Preflight, workspace lint, typecheck, all five content/publishing tests and both production builds passed again before delivery. Staged source was inspected for credential patterns with zero matches; environment examples contain empty public identifiers. Build output, dependency caches and unused exploratory downloads are ignored. Initial implementation commit 1a1049c was pushed and its full SHA matched the GitHub commits API. GitHub Actions was queued at verification; consult its live result. No new browser, Lighthouse, translation approval or public website deployment is claimed by this documentation-only delivery.
