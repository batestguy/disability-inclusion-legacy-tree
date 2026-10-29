# Collaboration network — recorded direction

## Local implementation — 29 October 2026

Owner authorised building the dashboard. The actor–initiative network is now
implemented with reviewed membership roles, relationship-status line styles,
category controls, keyboard/native-button selection, on-demand source context,
an equivalent list and guided-chat handoff. Phone layouts use the list. It uses
the nine evidenced relationship records, never article co-occurrences. Source
records and all approval gates remain unchanged. See
[the build record](DASHBOARD_BUILD_2026-10-29.md) and [validation](VALIDATION.md).

29 October 2026. The owner accepted documenting the proposed clickable network
after discussing alternatives for the collaborations block. This supersedes its
previously undecided network-versus-bars direction. Implementation is pending;
exact layout and the analysis below remain a design proposal to validate.

## Purpose and graph model

Help visitors explore who participated, in which initiative, in what role, and
with what source support. Use two node sets: actors (people and organisations)
and specific initiatives. Connect an actor to an initiative only where evidence
supports that actor's participation and role. Keep people and institutions
distinct; do not silently replace a minister with a ministry or Isa with his
office. Record the represented role explicitly.

This actor–initiative structure preserves the context behind a connection.
Do not automatically connect every pair of actors in a multi-actor record.
A projected actor-to-actor edge can suggest a direct relationship that the
source never established. NetworkX documents both
[bipartite graphs](https://networkx.org/documentation/stable/reference/algorithms/bipartite.html)
and [shared-neighbour projections](https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.bipartite.projection.collaboration_weighted_projected_graph.html).

## Current evidence and limits

The frozen v1 bundle contains nine relationship records: six classified as
reported programme collaborations, two stated-cooperation records, and one
reported MOU signing. These are relationship records, not nine unique partners
or nine independently verified delivered programmes. There are separately 257
article co-occurrence edges; none automatically qualifies as collaboration.
See [Phase 2 findings](PHASE2_FINDINGS.md).

Current relationship records carry entity IDs, a source excerpt, date, kind,
limitations and false public approval. They do not yet supply a complete,
reviewed actor–initiative membership table with a role on every edge. Build and
review that mapping before drawing or counting it. Repeated reports about the
same initiative must not increase its distinct-initiative count.

Examples grounded in current evidence:

- Adapted vehicle: office involvement with Elizade and JAC; demonstration and
  proposed distribution must stay distinct.
- Disability-readiness toolkit: Deaf-in-Tech and DataLead Africa are developers.
  The office's represented unveiling role comes from separate activity evidence;
  the developers' partnership record alone does not establish Isa as a developer,
  funder or contractual partner.
- NCPWD/health cooperation: preserve meeting/intention status rather than
  implying completed services.
- African Unconquered: reported MOU signing; instrument implementation and
  beneficiary outcomes remain unverified.

## Presentation proposal

- Stable labelled green-and-white network, without continuous force animation.
- Equal actor-node sizes initially; use distinct shapes/labels for actors and
  initiatives. Distinguish people from organisations in details.
- Line styles plus text identify reported collaboration, stated cooperation and
  reported MOU. An actor's role is available on selection; colour alone never
  carries status. An MOU is not a delivery outcome.
- Click/tap or keyboard selection reveals a short initiative account, actual
  roles, report date, material limitations and Source within this block.
- Contribution-area controls highlight the relevant subgraph. Preserve multiple
  category memberships without duplicating initiatives in All.
- Provide an equivalent accessible list, including a practical phone layout.
  No pan/zoom or dragging requirement for reaching sources.
- Do not centre every relationship on Isa by assumption. The toolkit developer
  relationship, for example, has its own participants and provenance.

## Useful descriptive analysis

After membership review, calculate distinct documented initiatives per actor,
distinct contribution areas per actor, and participant composition per initiative.
Separate cooperation intentions and reported signings from programme collaboration
counts. Show the denominator and selected-subset coverage on demand. Count
evidenced activities, not source mentions or unique beneficiaries.

Do not initially publish influence rankings, inferred communities, causal
attribution, partnership-strength scores or centrality as a measure of impact.
The curated sample and focus on one subject strongly constrain interpretation.
Unknown relationships remain unknown; missing edges do not prove no relationship.

## Implementation checklist

- [ ] Review initiative IDs, actor identities, roles, status and edge evidence.
- [ ] Deduplicate reports and verify all counts against complete selected records.
- [ ] Check sample initiatives above, including toolkit attribution.
- [ ] Verify category overlap and absence of unsupported actor-to-actor links.
- [ ] Verify keyboard/touch selection, list parity, narrow/zoomed layouts, motion
  preferences and English/Hausa state retention.
- [ ] Preserve the shared visible vertical language control and draft Hausa status.
- [ ] Run repository checks and relevant browser journeys after implementation.

Documentation does not alter the frozen bundle, existing components, approval
flags or public-release gates. No graph or analysis has been implemented here.
