# Guided conversation — current implementation task

25 October 2026. Owner steering: this is a free-tier project built by the owner
and Codex, without hiring anyone or requiring outside sign-off. Hausa remains
honestly labelled draft; owner feedback and evidence/semantic/browser checks
replace the assumption that an external reviewer must be obtained. Do not set
existing human-review or public-approval flags to true without actual evidence.
Photograph reuse rights and source/numerical truthfulness still apply.

The owner's next request is a clickable question tree/flowchart **instead of**
the unreliable free-text parser. This supersedes the earlier chat-first interface
recommendation and the unimplemented hosted-planner proposal for the current wave.
Implement a conversational sequence of questions, answers and follow-up choices,
with Back, Start again and evidence endpoints in both locales. The latest owner
correction below removes the earlier visible map/path from the interface.
No API, credentials, subscriptions, trial credits or new production dependencies.

## Latest owner direction — minimal replacing choices, no internal scrolling

Owner rejected the verbose scrollable version as inconvenient. Show one concise
question/answer and at most three options at a time. More options / Previous
replace the option set; they do not append it. Remove the sidebar, statistics,
visible breadcrumb, repeated instructions, endpoint announcements and full
evidence dumps from the normal flow. Keep only material numerical/attribution
qualifications. Merge women-focused figures into their corresponding selectable
programme cards instead of repeating the same labels above and below.

Sources and Details are deliberate separate screens, each replacing the current
screen. Source lists use three choices per page; longer source text and metadata
use bounded text segments with Previous / Continue. Never clip content or use
an internal scroll area. Normal phone steps should fit on the screen; ordinary
document reflow remains available for enlarged text/accessibility. English source
excerpts remain distinct from record paraphrases. The shared visible language
control and Back/Next/Start again remain. Do not show unavailable history actions.

## Earlier compact step navigation — superseded presentation

Build and validate this standalone component before the main dashboard. Each
choice replaces the visible answer/options. Keep a stable-height conversation
panel with internal scrolling for long records and sources; do not append a
transcript or expand earlier answers. The breadcrumb remains a bounded, scrollable
path. Back and Next retrace visited steps; Next is disabled without a forward
step. A different choice discards the forward branch. Start again clears the
path. Preserve active/forward steps when switching page/chat language in memory;
a reload restores the active URL path, not the unvisited forward trail.

Evidence endpoints offer contextual record/figure/source follow-ups. Same-record
measure comparisons retain their different units and stages. Related activities
for topics, names and relationship records share cited reports; this is labelled
explicitly and does not imply a partnership. External sources open in a new tab.

## Acceptance

- [x] Every displayed choice leads to a valid answer or another choice; no dead ends.
- [x] All 33 activities and 11 typed observations are reachable with sources.
- [x] Counts, stages, bounds, units, populations, roles and report-date basis remain correct.
- [x] Women-focused branch keeps source-specific >45/>20 cohorts separate.
- [x] Topic/category/entity/co-occurrence/relationship distinctions remain explicit.
- [x] Page and conversation share the visible vertical language selector; active
  path and selected record survive language navigation and Back/Forward.
- [x] Keyboard, mobile, 200% text, forced colours, status announcements and terminal
  source/record actions are usable. English source text stays identifiable.
- [x] Root checks and dedicated graph/browser tests pass; document actual limits.

Checks above record engineering/automated evidence and code review, not a claim
of human Hausa or assistive-technology certification. See validation limits.

Implementation evidence is recorded in the latest docs/VALIDATION.md entry and
output/guided-browser-results.json. Browser result files now include `completed`;
partial output from a failed run must not be described as a passed full run.

## Responsibilities and baseline preservation

Main agent: interface/session/navigation, browser tests, documentation and final
review. One executor: scoped presentation helper/declaration and focused tests
for the latest simplification; the existing engine/graph remain unchanged.
Preserve the existing staged work and legacy parser, frozen questions and audit
artifacts. The guided interface is a different interaction mode; path coverage
does not become a natural-language accuracy score. The historical 0/34 audit
remains true for the unchanged legacy parser.

Full offline reload/cache readiness remains a later service-worker task. This
flow itself needs no network inference and can run from already loaded data.
No public release is requested in this wave.
