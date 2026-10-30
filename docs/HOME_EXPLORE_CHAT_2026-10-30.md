# Home, Explore and Chat — 30 October 2026

Implemented the owner-approved bubbly landing-page plan locally after committing
and pushing the previous visual checkpoint as `dc77efc` to `origin/main` at
batestguy/disability-inclusion-legacy-tree. The restructuring is uncommitted and
has not been published.

## Routes and composition

- Home: `/` and `/ha/`. Original accepted title, full-frame seated portrait,
  quotation, provenance links and draft Hausa/English-original disclosure remain.
  Figures, Themes, Connections and Interact with me are four ordinary links with
  the existing local illustrations/Lucide chat mark. No new image is generated.
- Explore: `/explore/` and `/ha/explore/`. Existing figures, source disclosures,
  theme cloud, three-column network and optional 33-activity browser are reused.
  The opening portrait/intro and embedded guide have been removed from this page.
- Chat: `/chat/` and `/ha/chat/` retain the guided question tree. Explore activity
  questions explicitly open the corresponding activity in this dedicated route.
- Shared header: Home / Explore / Chat and exactly one visible, vertically stacked
  English/Hausa control, with English above Hausa and the bilingual instruction.
  Current-page navigation uses `aria-current`. Photo cursor includes Explore.
- The advocacy title is now **Themes in his advocacy.** / **Jigogin fafutukarsa.**
  Hausa remains visibly draft; changing the heading does not certify translation.

## Design decisions

Intent: welcome visitors into a sourced record through four clear starting points.
The centred genuine portrait and quotation lead; coloured bubbles introduce the
existing figures, advocacy themes, relationships and guided conversation.
The green/blue/gold/purple palette follows the existing chapters and illustrations.
White surfaces, pale bubble fills and thin coloured edges keep the established
framed identity. Source Sans remains on controls and body; Briem Hand identifies
short display labels. Spacing follows the existing four-pixel rhythm.

Desktop uses a four-column constellation with alternate vertical offsets; phones
use a two-column grid. Link hit areas stay fixed while their contents float by
four pixels over six seconds. Pointer and keyboard focus give a small lift and
highlight. Pause motion persists for the browser session. Paused or reduced-motion
settings remove floating, lift and press scaling. Forced colours retain outlines.
Hero and header image failures show named text/initials while sources and links
remain usable. No new dependency, external service or production asset is added.

## State and compatibility

`WorkspaceNavigation.tsx` centralises the existing source-bound selection
validator and URL construction. Figure area, cloud mode/concept, network area,
initiative, actor, selected activity and `#flow` survive shared links, locale
changes and refresh. Existing providers also retain guide detail/history state
through client navigation. Flow paths continue to require connected known nodes.

Explore entry points use `section=overview`, `section=advocacy` or
`section=collaborations`, independently of the conversation hash. Unknown sections
are removed. Section controls retain native link destinations and modified-click
behaviour; ordinary clicks and browser history focus/scroll the actual section.

Recognised old Home selection queries, section hashes, leaf records and flow-only
links forward to Explore; `#ask-records` forwards to Chat. Plain Home stays Home.
Because legacy dashboard queries and stateful new Home links otherwise have the
same shape, intentional Home links carry `view=home`; this prevents redirect loops
and preserves state after refresh. Static legacy forwarding runs after hydration.
Legacy year/category/activity filters continue to normalise to the full overview.

## Validation and limits

See the newest entry in [VALIDATION.md](VALIDATION.md) and the three browser-result
JSON files under `output/`. Landing screenshots are
`output/playwright/landing-desktop.png` and `landing-hausa-phone.png`.
Existing numerical/source integrity checks remain required.

Hausa wording is draft. Portrait/logo public reuse, source/public approval and
reveal gates remain unchanged. This local review does not assert unrestricted
conversational understanding, public readiness, full offline reload support,
new causal findings, human translation approval or a new permission grant.
