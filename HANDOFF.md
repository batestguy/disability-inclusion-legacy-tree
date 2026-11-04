# Project handoff — 4 November 2026

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
