# Phase 3 — standalone chatbot

Latest correction: the owner rejected clutter and internal scrolling. The preview
now shows one concise question/answer with three replacing choices per page.
Sources/Details are separate screens; long evidence is paged. Sidebar, statistics,
visible breadcrumb and repeated explanatory material were removed. See the
latest GUIDED_CHAT_IMPLEMENTATION.md contract and VALIDATION.md entry; the
earlier fixed-height scrollable-panel description below is superseded.

## Latest implementation — compact guided conversation

The main preview now uses a clickable guided flow at `/chat/` and `/ha/chat/`,
following the owner's superseding direction. It replaces one step at a time in
a stable-height panel, with Back/Next/Start again and source/record/figure
follow-ups. The shared locale preserves the active step and forward trail in
memory. See [GUIDED_CHAT_IMPLEMENTATION.md](GUIDED_CHAT_IMPLEMENTATION.md) and the
newest [VALIDATION.md](VALIDATION.md) entry. The parser implementation and audit
described below remain preserved history; no improved language-accuracy claim
is made for the guided mode. Dashboard integration remains next; Hausa is draft.

25 October 2026. Prototype implemented over reviewed-subset v1; broad conversational
quality audit failed. See [CHATBOT_ACCURACY_AUDIT.md](CHATBOT_ACCURACY_AUDIT.md).
Existing fixtures/builds pass, but 0/34 independently authored answerable questions
received complete answers. Do not equate those fixtures with general accuracy.
Preserve the existing staged Phase 2 work. No dashboard integration or public
reveal is included in this checkpoint.

## Owner feedback — women-focused question, 25 October

The owner demonstrated that “what has he done for disabled women?” produced a
generic clarification. This was an unnecessary limitation: the reviewed bundle
contains women-specific source contexts. Added a controlled bilingual summary
intent for that question and common English/Hausa paraphrases. It shows NigWED
training (>45 women) and March startup support (>20 women) as separate reported
cohorts with source links, partner attribution and no unique-person sum or
income/employment inference. It does not claim every recipient got every asset.

Both source-specific population/stage contexts must remain present; a general
mixed-cohort measure alone cannot support a women-specific narrative. Active and
explicit report-year filters are respected, unrelated programme context clears,
and unsupported geography, age, disability subtypes, exclusions and multi-year
questions still clarify/refuse. Ambiguous year follow-ups offer the two relevant
programmes. The new starter question makes this ordinary query discoverable.
Hausa wording remains draft; human review must cover the new summary too.

Twenty-one engine test groups pass, including equivalent bilingual claims,
misleading qualifiers and damaged population evidence. A fresh read-only review
found no material issue in the new intent. The complete 32-test Node suite and
eight browser journey groups pass; five axe states have zero violations. See the
newest VALIDATION entry for build evidence and scope.

## Acceptance and plan

- [x] Shared deterministic plans, calculations and evidence-bound claims; meaningful
  English/Hausa equivalence and misleading-query tests.
- [x] Dedicated `/chat/` and `/ha/chat/` previews with an editorial ivory, forest
  and gold conversation, composer, suggestions, clarification and evidence actions.
- [x] One route-derived locale and exact visible vertical language control.
  Preserve draft, structured transcript, programme/year and evidence selection
  during client navigation; keep visitor messages unchanged. Refresh starts a
  fresh in-memory session. No question storage or external inference.
- [x] Source-linked records, draft Hausa notices, coverage limits, local receipts
  and a public-build refusal for the unapproved preview bundle.
- [x] Preflight, lint, typecheck, tests, both builds and focused browser checks.
- [x] Update handoff, phase checklist and validation evidence with actual limits.

## Scope and responsibilities

Main agent owns interface, route/session state, browser checks and documentation.
One Sol executor owns `chat-engine.mjs`, its declaration and engine tests. All
existing staged files and original briefs are preserved. Existing achievement
URLs remain available. No new production dependency, provider or deployment.

The old six-activity examples in CHATBOT_SPEC.md describe historical fixtures;
the active inventory count comes from v1's 33 distinct activities. Its 11
observations retain delivery/target distinctions. Full archive coverage, human
Hausa approval, portrait rights and reveal gates remain incomplete.

## Behaviour and supported catalogue

Use `npm.cmd run preview`, then open `http://127.0.0.1:8767/chat/` or
`http://127.0.0.1:8767/ha/chat/`. Start again clears the in-memory conversation,
context and filters. A full refresh starts a new session; no question persistence
or model service is required. Deterministic execution is synchronous, with no
network response that could arrive in an obsolete locale. Query errors fail
closed and remain localised. Browser state never contains credentials.

Supported examples: documented activity counts/lists by report year; SMEDAN,
NIGWED, March startup support, Borno employment and the Beyond Disability target;
contextual report-year follow-ups; `find: SMEDAN` / `nemo: SMEDAN`; category,
frozen-topic, organisation, place and evidenced-relationship catalogues; and
method/scope/co-occurrence explanations. Other v1 records remain discoverable by
keyword and evidence, rather than through direct numeric measures. Arbitrary
category/entity filtering, ranking, aggregation and unrestricted conversation
are not claimed. Unsupported units/stages, geography, demographics, exclusions
and compound questions clarify or refuse rather than silently drop qualifiers.

One shared session layout preserves draft input, structured answers, unchanged
visitor messages, programme/year and selected evidence across the two chat routes.
Page locale is the only language source; Back/Forward and direct loads follow it.
Assistant templates re-render from structured claims. Original English excerpts,
source titles and untranslated catalogue labels remain identifiable. Human Hausa
review must assess wording and excess clarification beyond the fixture questions.

Calculation downloads include dataset version/date, supplied manifest identity,
operation, selected IDs and complete claims, omitting raw questions and lookup
terms. The supplied hash identifies build metadata; it is not runtime independent
verification of a source claim. All raw questions remain in memory on the device.
External articles require a connection; full offline caching is still Phase 5.

The preview has its own public-build refusal in `chat-preview-gate.mjs`; older
CMS approvals cannot approve the research bundle. No public release was attempted.
No production dependency, external inference, query analytics or server was added.

## Review and validation

Fresh independent review reproduced two semantic-selection issues despite valid
arithmetic: year follow-ups dropped additional qualifiers, and programme questions
could substitute a cohort count for an unsupported outcome. Both were corrected,
regression-tested and independently rechecked. Eighteen engine test groups and
the full 29-test Node suite pass. This is development-fixture evidence, not a
held-out population accuracy estimate or human language sign-off.

The static preview server's `.txt` content type now supports Next route payloads
without forcing a reload. Language links use `prefetch={false}` because the
installed Next export's flattened segment-prefetch URLs did not match its files.
Browser tests verify the resulting actual client navigation and state preservation.
An axe issue from `aria-controls` pointing to an unmounted evidence panel was
fixed; four audited states now have zero violations. See VALIDATION for scope.
