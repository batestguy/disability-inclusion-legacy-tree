# Dashboard implementation — 29 October 2026

Status: implemented for local review. Owner now authorises building the dashboard and
showing a local preview first. This supersedes earlier documentation-only scope.
The documented chatbot improvements follow the dashboard; preserve the working
guided component in this wave. No public deployment or approval flag changes.

## Working design brief

Audience: the public, journalists and researchers exploring specific disability
inclusion contributions, their partners and supporting reports. The focal point
is the contribution figure, then the activity or relationship behind it.

Domain: accessibility, livelihoods, skills, welfare, advocacy, collaboration.
Colour world: Nigerian flag green, white paper, dark ink, pale green surfaces and
quiet neutral lines. Signature: category-led sourced figures, a speaker beside
report concepts in a permanent speech panel, and an actor–initiative network.
Avoid generic admin widgets, outcome-free year charts and decorative progress.

Use existing Source Sans 3, 4px spacing rhythm, understated borders/surface shifts,
native controls and existing language/session components. Keep the owner-approved
compact copy and show detail on selection. Source actions stay close to content.
Phone category controls wrap above figures; graph has an equivalent list.

## Ownership and evidence

Main owns dashboard components, state/URLs, CSS, asset selection/provenance,
browser verification and final integration. One bounded executor owns the pure
presentation-data module, supplemental reviewed records and focused tests. No
shared-file editing or recursive delegation. Frozen v1 and source ledgers remain.

Existing application is the previous iteration with year filters, year chart and
evidence explorer. Existing 29 October research documents are uncommitted owner
work and must be preserved. Local/public-release and Hausa/photo gates remain.

## Acceptance checklist

- [x] Correct agreed title/subtitle and category-name-only navigation.
- [x] Achievements first; plans only in categories with sourced commitments.
- [x] All original figures/bounds/units remain; supplemental milestones reviewed.
- [x] Genuine speaking photo with truthful local-only provenance and asset fallback.
- [x] Reproducible canonical-report concept counts and category activity counts.
- [x] Cloud source results stay inside the block, with accessible list alternative.
- [x] Actor–initiative network with evidenced roles/status and accessible list.
- [x] Remove dashboard-wide year chart/filter and standalone evidence explorer.
- [x] Neutralise old year URLs; locale/navigation preserve active chat and selections.
- [x] Existing guided chatbot remains usable with one shared vertical locale control.
- [x] Preflight, lint, typecheck, tests, builds, focused browser/axe/mobile checks.
- [x] Update handoff, validation and design/status documents; show local preview.

Final evidence: 68 unit tests; root preflight/lint/typecheck/build; final web rebuild;
dashboard browser six journey groups/five zero-violation axe states; standalone
chat eight groups/five states. All result files completed true, with no browser
errors, HTTP failures or external requests. Source-review findings and the mobile
header overlap were corrected and rechecked. See [validation](VALIDATION.md).
Preview: http://127.0.0.1:8767/ and /ha/. No public deployment; chatbot improvement
waves follow owner review of this dashboard.

## Validation plan

Run the new presentation-data tests and existing unit tests, then required root
checks and builds. Update the existing dashboard browser harness to the new
behaviour; keep standalone-chat regression. Check desktop, English/Hausa phone,
320px/200% text, keyboard, reduced motion, forced colours, source integrity and
malformed/old URLs. Inspect rendered screenshots before delivery. Record failures
and fixes honestly; no new model, provider, service worker or live release claim.
