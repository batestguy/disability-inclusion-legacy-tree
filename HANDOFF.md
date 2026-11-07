# Project handoff - 7 November 2026

## README, illustrated guide and public videos - 7 November 2026

Owner requested detailed project descriptions, website/video links, methods and
reasons for using them in README, and welcomed an illustrated PDF. Replaced the
outdated tree-prototype README with the current four-language hosted-draft guide:
source-qualified figures, phrase cloud, source-bound connections, deterministic
guided chat, research pipeline, method rationale, setup, architecture, creator,
release limits and links to supporting records.

The owner explicitly confirmed permission to publish the music too. Both existing
3:16 videos and the new eight-page illustrated PDF are published as assets on:
https://github.com/batestguy/disability-inclusion-legacy-tree/releases/tag/demo-2026-11-06
The tag points to verified media-tools commit 110687102c8ade9888c57b0f4f5776ccfa0fe38f.
No website deployment or change to translation/reveal gates was performed.
See docs/VIDEO_PUBLICATION_2026-11-07.md for permission and public-download evidence.

Guide: docs/PROJECT_GUIDE.pdf; share copy under output/pdf/. Rebuild with
python scripts/build-project-guide.py using documentation-only ReportLab,
PyMuPDF and Pillow. Actual demo screenshots and provenance live in docs/images/.
Eight rendered pages visually checked; 22 PDF links and text bounds checked;
README relative links resolve. All 17 website URLs, release page and three assets
returned HTTP 200 anonymously. Full downloaded asset hashes match local originals.

Preflight, lint, typecheck, all 76 tests and web/Studio builds passed on
7 November. Owner authorised committing and pushing this documentation checkpoint
on 7 November before checking C: for disposable project files. The three authorised
media assets are already public.

## Demo delivery with tribute introduction and author ending - 6 November 2026

Owner requested commit/push and two additions to both videos: a short opening
explaining whom the tribute honours, and a short author section at the very end.
The six-second opening honours Hon. Mohammed Abba Isa's disability-inclusion
advocacy, access and equal opportunity. The ten-second ending records the
existing About creator section: Jerry Zachary Bannister's photo, name, contact
details and statistics/ML/AI purpose. Both retain the original walkthrough.

Current exports are 3:16 (196 seconds), desktop 1920x1080 and mobile 1080x1920,
with 40 English caption cues each and the supplied song's first 196 seconds.
The methods segment now runs 2:18-2:58; the author ending runs 3:06-3:16.
These supersede the earlier 3:00 exports below. File paths remain unchanged.
Local player: http://127.0.0.1:8770/; restart with node scripts/serve-demo.mjs.

Revised captures, continuous caption timing, full media decoding, non-clipping
audio and browser duration/dimension checks passed. Both videos seek correctly
to methods and author sections. Intro/author framing was visually checked on
both layouts. Syntax checks and preflight passed; the preceding full repository
lint/typecheck/76-test/web-and-Studio-build results remain applicable because
application code/data have not changed. See docs/DEMO_STORYBOARD.md and
committed docs/DEMO_DELIVERY.json for dimensions, hashes and verification.

Owner authorised committing/pushing the recording/assembly tools, title-card
and player templates, storyboard, delivery manifest and handoff. MP3, rendered
videos and raw takes stay local/ignored as specified in the accepted plan.
No change to the live website is required for this video-only delivery.


## Captioned desktop and mobile demos - 6 November 2026

Completed desktop first, then a separately captured portrait mobile version.
Each is exactly 3:00, with English captions, no narration, and the first 180
seconds of the owner-supplied African Child - Jeremiah Gyang.mp3, normalised
with opening/closing fades. Both reserve 2:12-2:52 for collection, cleaning,
deduplication/source checks, TF-IDF/NMF, manual categories, phrase counts,
limitations and how agents supported scripts, design, translations and checks.

Files: output/demo/desktop/Hon-Mohammed-Abba-Isa-desktop.mp4 (1920x1080)
and output/demo/mobile/Hon-Mohammed-Abba-Isa-mobile.mp4 (1080x1920).
Matching SRT files and raw WebM takes are beside them. Local review page:
http://127.0.0.1:8770/ - node scripts/serve-demo.mjs; desktop opens first.
The player supports switching, downloads and a methodology jump to 2:12.
See docs/DEMO_STORYBOARD.md for reproduction with scripts/demo-video.mjs.
The soundtrack and generated media are ignored by Git and retained locally.

Validation: 18 actual-site scenes per layout; zero capture page errors;
180-second H.264/AAC files at 30fps; 36 continuous caption cues each; full
video/audio decode passed; mean audio -19.2 dB and peak -3.7 dB in both.
Preview frames/contact sheets checked for caption placement, network flow,
methodology and agent-workflow coverage. Review player verified in Chromium,
including both dimensions/durations, methodology seeking, pause on switching,
HTTP byte ranges, HEAD, invalid ranges and path containment. Preflight, lint,
typecheck, 76 tests and web/Studio builds passed. Reports: output/demo/verification.json
and output/demo/review-verification.json. Application/data/deployment unchanged;
recording tools, storyboard and these handoff notes remain local/uncommitted.


## First hosted release - 6 November 2026

Owner authorised free Cloudflare Pages publication and explicitly confirmed:
"I have permission to publish them" for the displayed photos and organisation
logos. This supersedes their earlier local-only publication scope; it is an
owner attestation, not independent licence verification or language approval.
See docs/PUBLICATION_2026-11-06.md for the decision and operating procedure.

Live URL: https://mohammed-abba-isa-legacy.pages.dev/
Pages project: mohammed-abba-isa-legacy; direct upload, production branch main.
Application source: 0b55bdd73377fe5b55ff1d80fa96f736eefec9bf.
Deployment URL: https://a0aeeb49.mohammed-abba-isa-legacy.pages.dev/
The production web build passed. Eight live pages returned HTTP 200 and matched
local HTML byte-for-byte, including all four home locales and the main tools.
Live landing and mobile-network browser suites passed, including 13 axe states
with zero violations. See the publication record for detailed live evidence.
Initial publication retains preview-mode noindex/nofollow and visible draft
translations. Stricter indexed public-reveal gates and frozen flags are unchanged.
No domain purchased, paid plan enabled, CMS connected or automatic deploy set up.
GitHub pushes continue to validate source without deploying; upload deliberately.


## Owner-approved checkpoint - 6 November 2026

Owner approved the simplified mobile network and smaller desktop icons/labels,
and explicitly requested commit and push to main. This supersedes local-draft
status below. Mobile starts with a partner chooser; selecting one reveals its
source-backed path and initiative tiles. Show all connections and List remain.
Desktop keeps its three-column layout and connections with compact typography.

Validation passed: preflight, lint, typecheck, all 76 tests, 521-text locale
coverage, web/Studio builds, mobile network checks, final-fix checks and dashboard
regression. The three browser suites reported zero violations across 25 axe
states. Side-by-side desktop and mobile previews were opened for owner review.
No public deployment or content approval/reuse flag change is part of this push.


## Simpler mobile flow and compact desktop network - 6 November 2026

Latest owner direction supersedes the earlier exact desktop appearance requirement:
keep its three-column structure, positions and connections, but reduce only this
section's icons and labels (13px wide desktop; 12px compact desktop). Mobile now
starts with a partner chooser without a web of arrows. Selecting a partner shows
Isa, that partner and its initiative tiles. Selection retains the partner while
opening the source record. Choose another partner resets the flow; Show all
connections restores the complete measured graph. Four locales and List remain.

Preflight, lint, typecheck, 76 tests, 521-text locale coverage and web/Studio builds
passed. Browser checks passed: desktop layout/path baseline; eight phone/locale
states plus enlarged text; 18 desktop language cases; full dashboard regression.
Arrow samples clear cards/headings; all 25 full-view links match source records.
All 25 axe states across the three browser suites reported zero violations.
Local review draft after e989fbc; no commit, push or public deployment performed.


## Mobile portrait-first network draft — 6 November 2026

Owner requested a mobile-only top-down draft and explicitly preserved desktop.
At widths up to 700px, Isa's portrait/office leads; recorded people and
organisations appear in two-column, content-sized cards; initiative tiles follow.
SVG arrows are measured from actual card edges, with rounded bends through
reserved centre/outer gutters and a crossing space between the two stages.
Source-to-partner, partner-to-initiative and direct-work links preserve the
existing source records. Selection, details, filters, four locales and List view
are reused. Images are existing assets; no dependency or approval flag changed.

Desktop retains the original three-column map, scroll region and paths; an
exact 1440px baseline plus the 834px layout is checked by the new mobile browser
suite. The previous horizontal mobile layout is superseded only on phones.
This is a local review draft after e989fbc; no commit/push has been requested.
Verification is recorded in docs/VALIDATION.md.


## Final fix: desktop languages and horizontal mobile network — 6 November 2026

Owner clarified the desktop issue concerns language buttons, and approved a
horizontal graph on mobile. Language choices now have high-contrast green
buttons, explicit desktop/tablet grid placement and a desktop sticky header.
Measured header height reserves scroll space so selected records and chart
controls remain below the header. All four languages stay vertical and visible.

Mobile Network view now keeps a readable three-column canvas in a local scroll
region, rather than forcing List view. SVG connections have arrowheads and keep
their source-bound solid/dashed/dotted relationship styles. Network/List controls
remain available; the camera centres on Isa on load, resize and view/locale/filter
changes. Scroll hints and graph labels have four draft locales. Source records,
roles, permissions and numerical evidence are unchanged.

This checkpoint also saves the earlier white/green, tighter solar-orbit, contact,
relative-frequency and Methodology changes. The owner authorised documenting,
committing and pushing the final fix. See docs/FINAL_FIX_2026-11-06.md and
validation records; previous local-only delivery notes below are historical.


## Latest: white/green theme and closer collision-free planets — 5 November 2026

Owner requests fully white page backgrounds, green tabs and no yellow/blue/
purple theme accents. All application styles and network display colours now
use green, white and neutral text; source photographs remain unmodified. Active
navigation uses white text on green, including the Home tab. This supersedes
the ivory/multicolour palette notes below.

The orbit now follows the outside of the portrait flag and both word lanes at
each phase, instead of expanding to the largest ellipse. Desktop planets are
190px, with a scene around 850px tall rather than 1273px. All planets retain
perspective, sphere shading and 42-second movement with hover/focus pause.
Phone words use slim vertical phrases with separated falling timing; the flag,
portrait and planet dimensions adapt to preserve clearance and usable controls.
There is no word-lane overlap exception on phones now. Reduced motion, explicit
effects-off, large-text and hidden-tab behavior remain. Desktop and phone-size
browser previews use the local static server; the phone preview is emulated.
Changes remain local after 55a6a61. See docs/VALIDATION.md for final results.


## Latest correction: preserve live solar motion — 5 November 2026

Owner rejected the responsive stationary fallback because it removed the solar
experience and falling concepts. Normal viewport sizes now keep both effects.
The orbit fitter first adapts the stationary core instead of turning animation
off. Compact phones use the live orbit with words on a rear plane and clickable
planets in front; they may cross the decorative word lanes in projection, while
the portrait stays clear. This supersedes the previous all-width 12px word-lane
clearance requirement where it would remove the requested animation. Wider
layouts retain the clearance-fitted orbit. Existing reduced-motion, explicit
effects-off and enlarged-text stationary preferences are retained.

Regression coverage now requires an orbit and visible word streams at ten widths,
including ordinary 1280/1366px windows and 320/390px phones. These changes remain
local. See docs/VALIDATION.md for final results.


## Latest: coordinated Nigerian theme and readable methodology — 5 November 2026

Owner approved warm ivory #F5F4EE across all pages, white panels, deep green
#0B5D3B headings/controls and charcoal #24352D text. The old full-page flag
watermark is replaced by green–white–green concentric portrait bands. The
portrait remains a CSS circle with original source bytes preserved.

Cloud superscripts now show ×relative-frequency to two decimals: concepts /
all analysed reports, or matching activities / all recorded activities. Counts,
source excerpts and the existing size ordering remain; overlapping themes are
explained. Frequency values are included in accessible names and tooltips.
Four implementation links are visible under Sources and implementation;
model settings remain collapsed. Jerry's owner-supplied public phone/email are
clickable immediately below his name on About in every locale.

Solar paths are fitted against the portrait border and full falling-word lanes,
with 16px target clearance and full-cycle perspective checks; smaller planets
and responsive dimensions keep the core clear. Where no path fits, the existing
stationary layout keeps all destinations accessible. Orbit timing and preferences
remain. This supersedes earlier radius/size notes. All changes remain local
following 55a6a61; validation evidence is recorded in docs/VALIDATION.md.


## Commit and push checkpoint — 4 November 2026

Owner authorised committing and pushing the complete landing polish after the
circular-portrait correction. This checkpoint includes the clear subject heading,
3D planet navigation, side-falling concepts, Chat assistant wording, native cursor,
footer motion preferences and responsive circular portrait. It supersedes earlier
local/uncommitted status notes below. Validation: lint, typecheck, 75 tests, both
builds, landing/locale browser checks and complete-orbit clearance checks passed;
preflight passed again before saving. GitHub push/CI status is reported at delivery.
No public website deployment is included.


## Latest: circular portrait and clear planet paths — 4 November 2026

Owner requested a circular photograph and smaller planets so the photo cannot
block them. The original source bytes are preserved; Home now uses an explicitly
recorded CSS circular crop (cover, 50% 38%). Desktop portrait is 360px with
260px planets in a 1040–1080px arena; 1001–1200px uses 300px/240px. Tablet
remains 220px/170px; 501–700px uses 140px/112px. Compact orbital radii use
more of the available width. Below 300px of actual scene width, a stationary
portrait and separate navigation grid keep every destination unobstructed.
This supersedes earlier rectangular/full-frame Home display and size notes.
Side-falling words, 3D movement, hover/focus pause and native cursor remain.
Changes remain local; verification is recorded in docs/VALIDATION.md.


## Latest: larger portrait-first opening and identifiable title

Owner asked to enlarge the existing solar scene, beginning with the portrait,
and add a clear page heading. Home now leads with **Hon. Mohammed Abba Isa**,
**A record of inclusion**, and a short four-language subtitle explaining the
reports, figures, themes and connections. Browser title/description match the
broader sourced record rather than just numerical work.

The main Home width is up to 1600px/96%; the portrait is 420px on desktop
(previously 300px), with larger planets and an expanded orbital scene. Tablet/
phone proportions are adjusted separately. The short biography/biography link
now follow the scene, so visitors reach the portrait sooner. Source photo,
quote, side-only concept lanes, motion controls, 42-second orbit, Chat assistant
and native cursors remain. All changes stay local after d6ee2b5; verification
is recorded in docs/VALIDATION.md.

## Latest: solar-system planets, side-falling concepts and Chat assistant

Owner clarified that the four navigation bubbles are the planets; concept-cloud
words replace glitter, falling only by the portrait's sides. The portrait stays
at the centre. SolarSystem.tsx now projects 3D position/scale/depth for a 42-second
orbit, pausing on planet hover/focus and resuming from the same phase. Concept
labels come from the existing validated cloud and stay in clipped side lanes.
Footer effects preferences, reduced motion, hidden tabs and enlarged text are
handled; the stationary fallback keeps all four destinations accessible.

“Chat assistant” replaces the misleading “Interact with me” Home/Explore call
to action, with Guided questions and answers as its four-language format label.
Prepared-question chat itself, sources, conversation state, four-language
navigation and native cursors remain. No lower preview block was restored.
This direction supersedes earlier word-orbit interpretations and glitter notes.
Work remains local/uncommitted after pushed checkpoint d6ee2b5. Validation is
recorded in docs/VALIDATION.md.

## Latest owner correction: simpler Home and native cursor

Owner removed the entire “A glimpse of the story” preview block from Home.
The four main navigation bubbles, motion and portrait-frame particles remain.
Preview-only state, component, adapter, styles and tests have been removed.
Owner also explicitly removed the photograph cursor: its global CSS rule,
activation state and chat checkbox are gone. Standard browser cursors now apply
throughout Home, Explore, About, permanent records and chat. Original image
assets/provenance are retained as historical records, without cursor activation.
This supersedes preview/photo-cursor requirements in earlier notes below.
Changes remain local after pushed checkpoint d6ee2b5; see docs/VALIDATION.md.

## Saved checkpoint and interactive landing implementation

Owner approved committing/pushing the existing work, then implementing the
celebratory landing plan locally. Source checkpoint **d6ee2b5** was committed
and pushed to main at batestguy/disability-inclusion-legacy-tree. Both GitHub
Actions jobs passed: https://github.com/batestguy/disability-inclusion-legacy-tree/actions/runs/41797006953.
This supersedes all older pending-save notes below.

New landing work after that checkpoint remains local/uncommitted. The prominent
Pause control is replaced by Home footer Appearance → Visual effects. New
continuous portrait-frame particles, independent bubble motion, fine-pointer
illustration tilt and keyboard emphasis respect the setting/system reduced
motion; hidden tabs suspend animation. Links stay stationary and one tap.
Connected-circle motifs and an inclusive four-language tagline frame the page.

One shared preview panel uses existing source-bound NigWED figures, actual
concept/report counts, documented vehicle collaboration and a prepared guide
question. Hover/focus and four separate preview buttons select it. Source links,
the existing locale control and record/conversation state are preserved.
Copy: content/landing-interactions.json. Preview adapter:
apps/web/lib/landing-previews.mjs. Effects and preview UI are in the matching
LandingEffects/LandingPreviews components. No new dependency, inference,
photo alteration, frozen-data change, public approval or deployment.

The accepted implementation supersedes the old Pause requirement in the earlier
landing proposal. Final verification is recorded in docs/VALIDATION.md.

## Latest: Isa-first About, agent workflow and landing plan

Owner requested more biography/photos so Isa clearly leads About, an explanation
of how agents helped the workflow, and a plan for a more interactive landing.

- About retains its three initial subject paragraphs and adds three sourced
  chapters: national mandate, women/skills, and learning/better information.
  Four subject photographs precede the creator; two full-frame documentary
  photos are new to About. Captions identify publication context honestly.
- Creator wording is unchanged. His photograph is now 168px desktop/156px phone,
  with quieter heading/prose typography; Isa's section is visibly larger.
- Methodology retains seven short steps and adds two paragraphs explaining
  coding-agent help, research/checking, draft translations, owner feedback and
  automated tests. Prepared-question chat is distinguished from live agents.
- Editable additions: `subjectSections`/`documentaryPhotos` in `content/about.json`
  and `content/methodology-workflow.json`. Source/photo provenance remains in
  `content/about-assets.json`. Regenerate new photos with
  `node scripts/prepare-about-documentary-assets.mjs`.
- Proposed landing pass: docs/LANDING_INTERACTION_PLAN_2026-11-04.md. Tighten
  opening spacing, refine living bubbles, add source-based destination glimpses,
  retain fixed targets/Pause/reduced motion and validate on phones/all languages.
  This is a plan; landing interactions are not newly implemented by this pass.

All changes remain local/uncommitted. No new dependency, frozen-data change,
source push, approval flag or public deployment. Preview runs on port 8767;
start with `/about/` and `/about/methodology/`. Validation evidence is recorded
in docs/VALIDATION.md. Existing draft footer notes remain; paid review is not
a prerequisite for continued work with the owner.

## Latest owner direction and local polish

The owner requested removal of visitor-facing review-pending wording and a
polished free-tier experience, improving language through feedback rather than
depending on paid reviewers. Shared header warning banners and duplicate Hausa
badges are removed. Non-English pages retain one discreet translation-draft
label in their footer/preferences area; permanent records retain the same label
at the bottom. No review/permission flag is changed or certification claimed.
Source and image-rights records and public-build gates remain intact.

Navigation has clearer active/hover/focus states, the Home heading and bubble
copy have refined wrapping, and the footer offers Methodology and record context
without preview/release-process messaging. Chat Details uses concise language
notes without a pending-review prerequisite. No dependency or deployment added.
Changes remain local and uncommitted, including the earlier pending work below.
Preview is running at http://127.0.0.1:8767/.

Validation for this pass is recorded in docs/VALIDATION.md. The earlier save
request below has not been completed; do not report a commit that does not exist.

## Current checkpoint

Owner requests a local commit of all pending work since `432765a` (About/methodology
baseline). No push or public deployment is requested. Final build/browser checks
and commit are being completed; update the save status below before delivery.
Historical snapshots are preserved in [the archive](docs/handoffs/2026-10-31-history.md).

## What is implemented

- Four language route sets: English `/`, Hausa `/ha/`, Yoruba `/yo/`, Igbo `/ig/`;
  Home, Explore, guided Chat, About, Methodology and permanent records.
- Shared visible prompt: **Change language / Canja harshe / Yí èdè padà /
  Gbanwee asụsụ**. Options remain stacked English / Hausa / Yorùbá / Igbo.
  Language/page navigation preserves selected records and guided conversation.
- Home has sourced portrait/quote, a short introduction, **bold blue Read his
  biography** link, and four bubbles with explicit format labels/invitations.
  Phone bubbles grow to contain text; pause/reduced motion and stable hit areas stay.
- About has Isa's sourced biography and two different office photos, then Jerry's
  first-person profile with his full-length supplied purple-outfit wheelchair photo.
  The rejected project boilerplate is removed; Methodology stays linked.
- Latest creator wording is **researcher / Statistician**, not the older displayed
  PhD/Senior wording. Concise statistics/ML/AI purpose, unchanged AI vision, and one
  final sentence about this project's Python/scikit-learn/TF-IDF/NMF tools.
  **Do not add named individual projects or project-specific links.**
- Methodology now has seven short tool/function steps. The concept cloud counts
  reports; category mode counts activities. Existing model settings remain in the
  technical disclosure. Chat is a prepared question tree, with a brief welcome;
  it does not run a live language model.

## Editable content and entry points

- `content/about.json`: four-language biographies, Home introduction, alt/captions.
- `content/interaction-copy.json`: tool format labels, invitations, chat welcome.
- `content/methodology-summary.json`: short four-language methodology steps.
- `content/about-assets.json`: photo sources, hashes, full-frame dimensions and rights.
- Web app: `apps/web`; standalone Sanity editor: `studio`. Use `npm.cmd` on Windows.
- [Biography/profile update instructions](docs/ABOUT_BIOGRAPHIES_2026-10-31.md),
  [language implementation](docs/YORUBA_IGBO_2026-10-30.md),
  [design system](.interface-design/system.md), [chat contract](docs/CHATBOT_SPEC.md).

## Gates and operating limits

All non-English wording remains visibly draft. Image public-reuse permission,
source/review flags and public-reveal gates are unresolved; do not silently approve
or publish. Original brief `HonAbbas.txt` and frozen `content/dashboard/v1` stay
unchanged. No new scrape, model fit, production dependency or external inference.
The CV/private contact/referee details are not in public assets. The owner and
Codex are the team; progress does not depend on hiring/outside sign-off.

## Validation, preview and save status

All 75 unit tests, lint, typecheck and translation completeness checks pass.
Final build/browser evidence and save status are recorded in [VALIDATION](docs/VALIDATION.md).
Run preflight before handoff. Normal verification commands: `npm.cmd run lint`,
`npm.cmd run typecheck`, `npm.cmd test`, `npm.cmd run build`.
Preview: http://127.0.0.1:8767/ — restart with `npm.cmd run preview` if absent.
Remaining motion/final-interaction-polish work is separate; await owner direction.

Terminal sandbox startup previously failed with `helper_unknown_error: setup
refresh had errors`; approved escalated commands work. Do not change ACLs or
Git's global configuration as a workaround. Git checks/commit use per-command
`-c safe.directory=D:/HonAbbas` because `.git` is sandbox-owned.
