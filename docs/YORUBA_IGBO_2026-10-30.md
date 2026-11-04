# Yoruba and Igbo — 30 October 2026

Owner requested Yoruba and Igbo in addition to English and Hausa, then explicitly
selected full-site and guided-chat translations, visibly marked draft.

## Implementation

- New `/yo/` and `/ig/` routes mirror Home, Explore, Chat, About, Methodology and
  all five permanent achievement records. Existing English/Hausa URLs remain.
- The shared visible vertical control keeps English first, Hausa second, then
  Yorùbá and Igbo. The existing bilingual instruction remains unchanged.
- Language changes preserve validated dashboard selections and the guided flow.
  Page and chat have one locale; the cursor preference remains shared.
- A prominent draft notice identifies every non-English language, including
  English wording explaining the status. Translation dictionaries are local
  files; no runtime translation service or new production dependency is added.
- Dictionaries add derived display fields; the frozen evidence bundle, numerical
  values, stages, bounds, source identifiers and approval flags remain unchanged.
- Exact source quotations, source titles, technical settings and original
  evidence details retain English language annotations. Proper names stay in
  their original form. Display translations are not certified evidence.
- Unknown future copy falls back to English. `scripts/locale-coverage.mjs` audits
  current interface literals and generated guided text; it does not certify
  translation accuracy. Dictionaries require owner feedback and language review.
- The historical free-text parser stays bilingual and unused by the four-language
  routes. The active question tree, summaries and choices support all four locales.

## Verification

Preflight, lint, typecheck, all 73 unit tests, full web/Studio build and final
web rebuild pass. The coverage audit checks 536 texts over all 162 guided nodes,
with zero missing translations (proper names/exact originals excluded). All
four browser suites pass: 26 check groups / 31 zero-violation axe states, with
zero page errors, failed responses or runtime external requests. Exact evidence
is recorded in `docs/VALIDATION.md`. No source push, public deployment or release
approval is part of this work. Existing Hausa, photo/logo reuse and public-reveal
gates remain; Yoruba and Igbo wording also require language review/owner feedback.
