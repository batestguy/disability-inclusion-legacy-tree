# Dashboard revision — 30 October 2026

## Activity browser on demand — 30 October 2026

Owner approved removing the always-visible activity-card block from the default
network view. It now sits in a native disclosure, labelled View all 33 activities
in the full selection (filtered selections show their current count). Graph
initiative selections show their source/role detail panel immediately below the
graph and focus its heading. The direct branch opens the disclosure with the
24 other records and focuses the browser heading. Participant selection/clear
controls remain visible outside the disclosure. All records and source/guide
links are retained. Earlier uncommitted work and release gates are preserved.

Validation passed: preflight, lint, typecheck, all 69 unit tests, full web/Studio
build, and eight dashboard browser check groups with seven zero-violation axe
states. Browser checks confirm default collapse, direct source focus, all 33
records on demand and the 24-record direct branch. Zero page errors, failed
responses or external requests. No commit, push or deployment requested.
Preview remains http://127.0.0.1:8767/#collaborations.

## Superseding owner direction — three-column network

Owner preferred the former people/organisation graph and approved the terminal
layout: Isa at the far left, people/organisations in the middle, initiatives on
the right. Use the existing sourced logos/portraits, original person/building
symbols and bright participant-coloured paths. This supersedes the central
area-branch arrangement described below.

- Twelve participant nodes and nine documented initiatives; participant-to-initiative
  paths retain their recorded relationship status and solid/dashed/dotted styles.
- Selecting an organisation or initiative highlights its full path from Isa.
  Isa-to-participant lines mean a recorded connection involving him or his office,
  not necessarily personal contact or sole delivery.
- Twenty-four other activities remain reachable through a direct activity branch;
  the complete 33-record browser and source/guide actions remain below the graph.
- Phone/list mode presents participants with their actual linked initiatives.
  Preserve old links, locale state, source/rights/release boundaries and preceding
  uncommitted work. Final validation passes: preflight, lint, typecheck, all 69
  unit tests, full web/Studio build and seven dashboard browser groups/seven
  zero-violation axe states. No page errors, failed responses or external requests.
  Geometry, every actual participant edge, complete-path highlights and direct
  activity filtering have explicit browser assertions. Desktop and phone layouts
  visually inspected.

Owner approved implementation of the brighter dashboard plan. This document tracks
the work; no commit, push or public deployment is requested.

## Decisions and acceptance

- White canvas; enlarged formal portrait at top right with the existing sourced
  English quotation. Remove opening slogans. Roman section numbers; singular
  “Contribution in figures”; stronger inclusion heading.
- Six distinct cloud colours, exact count subscripts and count tooltips. Counts
  measure distinct canonical reports / classified activities, never raw mentions.
  Selection reveals and focuses sources below with measured header clearance.
- Isa stays central in a stable network. Cover all 33 activities, preserving his
  recorded role, including representation, advocacy, intentions and ceremonies.
  Only the nine reviewed relationships create participant connections. Other
  records stay reachable through an explicit additional-activities area.
- Owner chose researched logos/portraits. Use genuine images with recorded reuse
  terms; labelled initials otherwise. Never manufacture faces or infer endorsement.
- Chat frame, question bubble and 250ms dots; immediate under reduced motion.
  Cancel transitions on navigation, locale changes and restart. No model service.
- Preserve source bounds, shared visible English/Hausa control and draft/release
  flags. Frozen v1 bundle unchanged. No dependency added.

## Progress

- Read handoff, chatbot contract, design system, guided-flow implementation and
  installed Next.js image/client guides. Existing baseline has 68 unit tests.
- Implementation and validation complete; evidence recorded below and in
  VALIDATION.md / HANDOFF.md. Local owner review is next.

## Asset research

- JAC text logo: Commons file page links to manufacturer source and records
  PD-textlogo with trademark caveat. Identification only, no endorsement claim.
  https://commons.wikimedia.org/wiki/File:Jac_motors_textlogo.png
- Muhammad Ali Pate: select World Economic Forum 2012 portrait, CC BY-SA 2.0,
  verified Flickr licence review, rather than the ambiguously categorised 2022
  file. Visible attribution and same-licence derivative download required.
  https://commons.wikimedia.org/wiki/File:Muhammad_Ali_Pate_at_the_Annual_Meeting_of_the_New_Champions_in_Tianjin,_China_2012.jpg
- SMEDAN official home and DataLead Africa official about page checked; no reuse
  licence established. These use labelled initials, as do other unsupported assets.

## Implementation findings

- Frozen activity records often omit descriptions and Hausa titles. Reuse the
  existing bilingual guided catalogue through getActivityPresentation rather than
  creating new translations or reading absent fields. Regression now verifies
  bilingual titles and descriptions for all 33 network activities.
- First selected-network axe run exposed reduced text contrast from opacity-based
  dimming. Replaced it with muted borders/connector lines while retaining readable
  text. Final rebuilt browser check passes with zero contrast violations.
- Final preflight, lint, typecheck, all 69 unit tests and full web/Studio build pass.
  Dashboard browser regression passes seven groups/seven axe states; standalone
  chat passes eight groups/five axe states. All axe states have zero violations.
  Both suites report zero page errors, failed responses and external requests.
- Timed chat checks cover 250ms dots, duplicate selection, browser Back, restart,
  locale navigation and immediate reduced-motion answers. All 33 network activity
  IDs reconcile through pagination, and old collaboration deep links remain valid.
- At 390px the opening portrait remains visible at 220px wide. Forced image decode
  failure replaces the Pate photograph with MA initials while preserving his name.
- No new CI run or performance certification is claimed; changes remain local.
