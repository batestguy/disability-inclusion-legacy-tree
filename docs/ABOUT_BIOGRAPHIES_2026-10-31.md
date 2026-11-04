# Biographies and clearer entry points — 31 October 2026

## Isa-first expansion and agent workflow — 4 November 2026

The owner asked that Isa's story clearly dominate the About page. Three new
sourced sections now cover his national inclusion mandate, the NigWED women's
skills initiative, and access to learning/better disability information. The
original three paragraphs remain. Four subject photographs precede the creator:
the portrait, FHA ceremony, a full-frame NigWED speaking photograph and a second
source-published photograph of Isa greeting another attendee. The creator's
existing words remain intact, with a smaller photograph and quieter typography.

New editable fields: `subjectSections` and `documentaryPhotos` in
`content/about.json`. Each section retains a source link; all text, alt text and
captions are available in en/ha/yo/ig. New photographs are recorded in
`content/about-assets.json`; regenerate just these two with
`node scripts/prepare-about-documentary-assets.mjs`. The original preparation
script now preserves these additional manifest entries when updating the creator.

Evidence rechecked: State House appointment announcement (9 November 2023),
TheCable's education report (20 July 2024) and interview (31 May 2025), plus the
already-saved office reports for NigWED (3531) and education (3499–3501).
TheCable's image endpoint returned 403, so the second documentary photo comes
from the office report's recorded image reference. It is captioned as published
with that report; the photographed event/date is not independently established.
The original DIRECTOR MBB watermark remains visible. No new image licence or
public approval is claimed; all originals retain their frames and proportions.

Methodology keeps its seven short steps and now adds two paragraphs under
“How AI agents helped our workflow,” editable in
`content/methodology-workflow.json`. They describe scripts, application work,
draft translations, feedback, focused research/checking and automated tests.
Owner direction, original evidence and the prepared-question runtime are explicit;
no cost savings, linguistic certification or live-agent chat is claimed.

The next landing-page pass is planned in
[LANDING_INTERACTION_PLAN_2026-11-04.md](LANDING_INTERACTION_PLAN_2026-11-04.md).
Those interactions are proposed, not part of this About/Methodology change.

## Latest owner polish

The public creator profile now uses the owner's shorter researcher/Statistician
wording and concise purpose: statistics, machine learning and AI for pressing
local problems and clearer information. The AI vision is retained, followed by
one sentence naming this project's Python/scikit-learn, TF-IDF and NMF work.
Do not restore the older displayed PhD/Senior wording automatically. The Home
biography link is now bold blue. Language instructions include English, Hausa,
Yoruba and Igbo. Methodology uses seven short tool/function steps from
content/methodology-summary.json; detailed model settings are unchanged and
remain available on demand. These later owner choices supersede older copy below.

Owner approved the researched plan: a short Home introduction, explicit subtitles
on the four entry points and corresponding chapters, then his fuller biography
and new photographs on About, followed by Jerry's first-person biography/photo.

## Delivered content and layout

- Owner's subsequent copy refinement: Figures → **Achievements dashboard** /
  “Explore his work in numbers”; Themes → **Advocacy word and concept cloud** /
  “Discover the ideas behind his advocacy”; Connections → **People and
  institutions network** / “Follow the connections behind his work”; Interact
  with me → **Guided chat assistant** / “Choose a question. Explore his work.”
  Format labels repeat in the matching chapters. The new chat question starts
  “Hi! How can I help you explore his work?” without adding another screen or
  changing the replacing-choice conversation model.
- Home keeps the existing title, portrait, quote, source links and motion controls.
  A short introduction before the portrait links to About while preserving the
  dashboard selection and guided path.
- About opens with Mohammed Abba Isa's biography and a different, smiling portrait
  published with the official office's SMEDAN report. A wide photograph of the FHA
  Mortgage Bank stall-allotment ceremony follows. Jerry's profile sits beneath.
- Removed the “A record you can question” heading and its entire paragraph. The
  old generic project introduction is also replaced. Methodology remains linked.
- Use an editorial two-column biography layout (280px portrait / flexible prose,
  32px gap), stacked below 700px. Full-frame images retain their natural ratios.
  Existing white/green/blue surfaces, Source Sans and Briem Hand are reused.
- All new text and image descriptions have English/Hausa/Yoruba/Igbo fields.
  Non-English pages retain the shared visible draft status.

## Evidence and photography

Isa's background is supported by the State House appointment announcement of
9 November 2023 and TheCable's interview of 31 May 2025. Education advocacy is
source-bound to the proposed Dukku college/public hearing; no completed college
or bill sponsorship is attributed to him. SMEDAN and FHA delivery roles remain
distinct from office facilitation/engagement. The biography makes no claim of
later income gains, a unique-person total or responsibility for the 2018 Act.

Jerry's short biography is derived from the owner-supplied October 2026 master
CV: Senior Statistician at ATBU, Statistics PhD researcher, JJMB Datascience Hub,
accessible software and lived experience. His PhD is in progress, not an awarded
doctorate. The supplied full-length purple-outfit original corresponds to the
GitHub avatar and preserves the complete wheelchair and shoes. Only the selected
biography is included; the CV, contact details, birth details and referees are not
copied into the project or public assets. No personal relationship with Isa is
invented.

The owner subsequently requested a little more about ML and his view of AI's
potential for disabled people. Public GitHub documentation supports predictive
modelling, tree-based methods, optimisation and information retrieval. Following
the owner's explicit correction, the biography discusses those areas only:
individual projects are neither named nor linked. The existing general GitHub
profile link remains. The first-person AI vision discusses independence, access
to information, communication, learning and opportunity as aspirations, without
claiming measured outcomes. The opening professional paragraph is unchanged.

`content/about-assets.json` records image URLs/context, original and derivative
hashes, dimensions, resizing/encoding and rights limits. The two office images
are different from the existing Home/header/speaking photographs. Photographers
are not established by the source pages or supplied owner information. The owner
requested these local uses; this is not a broader photographers' licence. Global
and per-image public approval remain false. No facial generation/retouching,
background replacement or body cropping was performed.

## Updating your profile

1. Edit `creatorParagraphs` in `content/about.json`. Each paragraph has `en`, `ha`,
   `yo`, `ig`; `creatorPortraitAlt` and `creatorPortraitCaption` are beside them.
   Subject biography and Home introduction use the same file. Update source
   references when the facts change. Draft translations need actual review.
   Tool format labels, invitations and the assistant welcome are independently
   editable in `content/interaction-copy.json`, also with all four languages.
2. To replace your photograph, keep the original outside the repository and run:

   ```powershell
   node scripts/prepare-about-assets.mjs 'D:\path\to\your-original-photo.png'
   ```

   This regenerates the three web assets/provenance record using the existing
   Sharp installation. It proportionally resizes/encodes; it does not crop.
3. Run the root preflight, lint, typecheck, tests and build, then the translation
   coverage and About/landing browser checks. Review the preview before any
   separately authorised source push or publication. No new login/editor service
   or production dependency was added.

## Verification

Preflight, lint, typecheck, all 75 unit tests, the four-language coverage audit
and full web/Studio build pass. About/landing/dashboard/chat browser suites pass
27 groups / 24 zero-violation axe states, with zero page errors, failed responses
or runtime external requests. English About desktop/phone screenshots were
visually inspected. See the latest `docs/VALIDATION.md` entry for exact evidence.
The existing frozen bundle and approval flags are unchanged. This work is local;
no public deployment or source push is part of the request.
