# Next dashboard iteration — owner direction, 27 October 2026

## Implementation continuation — 29 October 2026

Owner authorised building the latest documented dashboard before chatbot upgrades.
The category figures, speaking-photo/concept cloud, actor–initiative collaboration
network and preserved embedded guided chat are now implemented locally. See
[the current build record](DASHBOARD_BUILD_2026-10-29.md),
[presentation brief](DASHBOARD_PRESENTATION_BRIEF.md) and [validation](VALIDATION.md).
This supersedes conflicting pending/year-chart/evidence-explorer directions below.
No public release, approval flag, frozen-data or new dependency change.

## Latest direction — 28 October 2026; supersedes presentation order below

Read [DASHBOARD_PRESENTATION_BRIEF.md](DASHBOARD_PRESENTATION_BRIEF.md) first.
It records the owner-agreed KPI grouping, title, speaking-photo/cloud direction,
removed standalone evidence block/report-year chart and pending collaborations
and chatbot. Older recommendations below are research/history, not authority to
restore rejected sections. This checkpoint documents the next design only.

## Latest direction — contribution-first presentation, pending implementation

27 October 2026. The owner requested documenting this direction for a later
session and explicitly instructed **do not implement yet**. This section records
the next iteration; the completed iteration below remains historical evidence.

### Purpose and presentation order

Lead with Mohammed Abba Isa's documented contribution to disability inclusion
across all available years. The analysis should help visitors understand his
role and the supporting evidence, rather than make article vocabulary the main
achievement story. The available selected record is not a complete lifetime
account.

Recommended order for later implementation:

1. Contribution figures and concise programme stories, keeping reported
   achievements separate from future commitments.
2. A clickable activity-category cloud linking to the supporting records.
3. Separately evidenced collaborations and his documented role.
4. Optional topic and keyword exploration for visitors interested in the NLP.
5. The evidence explorer and existing guided chatbot.

Contribution stories should explain the disability-related need, his documented
role, the delivery/outcome/commitment actually reported, and a source. Preserve
the compact number + short label + Source presentation; put longer qualifications
and role details on demand. Do not infer outcomes from advocacy or announcements.

### Confirmed owner decision — chronology only

Remove the dashboard-wide year filter, including year buttons that narrow the
whole dashboard. The contribution overview should show the full available record
together, retaining category/programme exploration. Dates remain on milestones
and sources, and chronological browsing remains available without shrinking the
achievement overview. The owner selected **Chronology only**, rather than an
optional year filter in the evidence explorer.

This supersedes the earlier coordinated global year-filter requirement and the
year-filter buttons described below. Implementation must also neutralize legacy
year query parameters so old links do not silently restrict the dashboard. Keep
dated standalone-chat questions available; they do not justify globally filtering
the contribution overview. Continue labelling report dates and partial coverage
honestly. Do not manufacture event dates, cumulative beneficiaries or impact.

### Researched visualization options and priorities

| Option | Contribution value and recommended treatment | Data readiness |
| --- | --- | --- |
| Activity cloud / tag cloud | Priority: shows breadth of documented work; larger horizontal category labels represent more activity records. Show exact counts and let selection reveal/filter supporting activities. Offer ranked bars/table for precise comparison. This is reviewed classification, not an NLP word-frequency result. | Existing category counts support it. Across the current 33 records: policy/accessibility 14; healthcare/welfare 11; livelihoods 10; digital/assistive technology 7; education/training 4; honours/ceremonial activity 4; political engagement 3; sport 3. Categories overlap; counts must be calculated from the actual selection, not hardcoded. |
| Focused evidenced connections | Priority: explains his documented role in collaborations, cooperation intentions and agreements. Prefer one selected person/organisation and its evidence over a full network. Shared-report mentions must be a distinct mode, never implied partnerships. | Existing entity, shared-mention and relationship records support exploration. Preserve each relationship's qualifications and source links. |
| Topic explorer | Secondary: explains the eight frozen English-text themes. Select a theme to show its stored share, keywords and source-checked representative reports. Topic prominence is textual emphasis, not contribution magnitude. | Existing model shares, labels, ranked terms and representative-source IDs support it. Do not retrain on filtering or claim stored term ranks are frequency counts. |
| Keyword/phrase cloud linked to evidence | Secondary: useful discovery, weaker evidence of contribution. Prefer the number of distinct canonical reports containing a phrase over raw repetitions. Keep meaningful phrases together; clicking should reveal matching reports and short supported excerpts. | Needs a reproducible term-frequency/source-match extraction step. The current public bundle stores ranked topic terms without their term frequencies; do not size words from invented counts or ranks. |
| Theme-by-year heatmap | Defer: mainly describes differences in published coverage and does little to establish his contribution. It is not a priority for the owner's contribution-first purpose. | Stored document topic weights and report dates permit later aggregation, with report denominators and partial 2026 clearly identified. No global year filtering is authorized by this option. |

The cloud should be one wide white surface with legible green typography,
horizontal labels, exact values and keyboard/touch interaction. Preserve readable
mobile/table alternatives. A treemap grows rectangular areas rather than only
text; it is not preferred for overlapping activity categories because it can
suggest mutually exclusive portions of a whole.

Avoid a full 46-entity/257-edge network, a decorative 3D topic galaxy, or sentiment
gauges. Shared mentions do not prove collaborations; office-report sentiment
would not establish public approval, and sentiment analysis has not been run.
Activity counts, report mentions, term frequencies, model weights and delivered
quantities must remain distinct. No visualization alone establishes causal impact.

### Research references for next session

- [Jason Davies word-cloud example](https://www.jasondavies.com/wordcloud/):
  reference for variable-size word placement, not a requirement to upload data.
- [Voyant linked exploration](https://voyant.lincsproject.ca/docs/tutorial-tutorial.html):
  selecting a cloud term updates trends, surrounding context and the reader;
  borrow the linked evidence interaction rather than a static decorative cloud.
- [Gregor Aisch on word clouds](https://www.vis4.net/blog/when-its-ok-to-use-word-clouds/):
  use them for exploration while preserving precise comparison alternatives.
- [LDAvis research](https://aclanthology.org/W14-3110/): overview linked to topic
  details. Borrow the interaction; retain our existing NMF model and its meaning.
- [BERTopic visualization examples](https://maartengr.github.io/BERTopic/getting_started/visualization/visualize_topics.html):
  reference alternatives, not authorization to replace the model or add services.
- [D3 treemap definition](https://d3js.org/d3-hierarchy/treemap): distinguishes
  area-sized tiles from font-sized tag clouds.

### Later implementation checks and constraints

Before implementation, read HANDOFF.md and docs/CHATBOT_SPEC.md and inspect the
current state. Preserve pending user work, the shared visible vertical language
control, green-white-green design, compact chatbot, source links and original
figure units/bounds. English-source NLP remains English-source analysis when the
interface is Hausa; Hausa remains draft. Keep portrait rights and public-release
gates intact. No paid service, new production dependency, model replacement,
public deployment, commit or push is authorized by this documentation request.

When implementing later, verify that fresh loads, old year-filter URLs, locale
switching and chronology interactions leave the full contribution overview
available. Check category counts/overlap, evidence links, reported-versus-planned
meaning, empty selections, keyboard/touch use and responsive text. Run the
repository's required preflight, lint, typecheck, tests, builds and relevant
browser checks, and update status/evidence documents with actual results.

## Previous iteration — implemented locally

Status: implemented locally on 27 October 2026 after the committed/pushed
checkpoint 2273642. Final checks pass; see newest HANDOFF.md and VALIDATION.md.
This iteration is uncommitted and has not been deployed. Requested changes below
are retained as the acceptance criteria, with implementation notes at the end.

## Requested changes

1. Replace the timeline presentation with a time-series graph. Use supported
   dates and an explicitly defined measure; keep report dates labelled as such
   rather than inventing event dates or cumulative impact totals.
2. Populate filters with all relevant categories represented in the records.
   Drop empty categories/options. Reconcile the category list against the actual
   dataset and preserve AND filtering; ensure selected values can still be
   cleared when a combination has no matches.
3. Refit the photo cursor: his image should look elongated and properly fitted
   within the cursor. Inspect the actual source crop and native-size pointer;
   preserve a recognisable face, conventional arrow tip/hotspot and off switch.
4. Put a major portrait and an authentic quote by him before the KPI section.
   On desktop the portrait/quote should occupy the left side, with the first
   KPIs starting on the right. Subsequent KPIs should extend across the entire
   available width below the portrait, rather than leaving a permanent sidebar.
   On mobile, place portrait/quote before the figures in normal reading order.
5. Use green–white–green throughout the dashboard. This supersedes the current
   gold-target colour direction for the next redesign. Keep target/achievement
   distinctions clear through headings and labels as well as colour.
6. Study his main page and gallery for appropriate portraits, visual treatment
   and a sourced quotation before choosing assets. Resolve the genuine official
   page from existing project sources; do not substitute an unrelated gallery.

## Preserve and validate

Keep number + concise programme label + one Source link per KPI, all eleven
figures with their original units/bounds, the shared vertical English/Hausa
control, compact bottom chatbot and deliberate source detail. Use the global
interface-design skill; add kpi-dashboard-design for graph/metric organisation.

Record the exact quote and its source/context before displaying it as his words.
Record photograph provenance and reuse status. Existing Hausa/portrait/public
reveal gates remain; this note does not approve a quote, photograph or deployment.
Check responsive wrap-under layout, time-series meaning/axes, populated filters,
cursor fit and keyboard/touch/forced-colour behaviour. Update the design system,
handoff and validation evidence after implementation.

## Implemented result and evidence

- Time series uses selected activity-record counts against report year, zero-based
  count ticks, year filter buttons and an exact table. 2026 coverage is partial.
- All eight categories with records remain selectable, including when another
  AND filter creates an empty result. Current category chart drops zero rows;
  unused catalogue labels are excluded without inventing new classifications.
- Portrait crop for cursor is 161×235, fitted without stretching into 24×35 inside
  the existing 48×64 arrow. Original source pixel check passes; tip stays 4/3.
- Genuine office About Us portrait and first attributed quote sentence occupy the
  left opening rows. Opening targets sit right; achievements use full width below.
  Phone reading order is portrait/quote then figures, with ordinary page scrolling.
- Green/white palette replaces gold plans; headings retain target/achievement
  distinctions. One number, concise label and Source link remain on each KPI.
- Main page, gallery and two original gallery photos inspected; provenance and
  reuse limits recorded in content/dashboard-portrait.json. English quote is
  deliberately untranslated on Hausa routes and marked lang=en.

Final preflight, lint/typecheck, 60 tests, web/Studio builds and both browser
suites pass. Both browser result files are completed:true with five zero-violation
axe states each. No human Hausa approval or public portrait licence is claimed.
