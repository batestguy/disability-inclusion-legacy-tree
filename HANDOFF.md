# Project handoff — 4 November 2026

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
