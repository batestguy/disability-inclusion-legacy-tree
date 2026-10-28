# Dashboard presentation brief — 28 October 2026

Status: owner-agreed design direction for the next session; not implemented by
this documentation checkpoint. This is the current presentation source of truth.
Read HANDOFF.md and docs/CHATBOT_SPEC.md before implementation. Earlier iteration
notes remain historical where they conflict with this brief.

## Title and page order

Title: **Advancing Disability Inclusion**
Subtitle: **Mohammed Abba Isa’s contributions in figures**

| Order | Block | Decision state |
| --- | --- | --- |
| 1 | Category-based contribution KPIs | Design agreed; implementation pending |
| 2 | Ideas & Advocacy: speaking photograph and clickable cloud | Direction agreed; implementation pending |
| 3 | Collaborations | Pending; chart proposal not approved |
| 4 | Guided chatbot | Pending owner design discussion |

Remove the proposed separate **Explore the Evidence** block. Source links beside
the contributions are enough for the public layout. Preserve underlying evidence,
provenance and numerical safeguards; removing a presentation block is not deletion
of research records. Do not add a separate chronology block or report-year activity
chart to this agreed page order. Dates may remain with source material on demand.

The existing application already has collaboration and guided-chat components.
The owner explicitly marked both blocks pending for the new design: existing code
and earlier test passes do not settle their future design. Preserve them until a
later scoped decision; do not treat the conversation as approval to redesign them.

## 1. Category-based contribution KPIs

Desktop: a narrow category selector on the left and a wider KPI panel on the right.
Use category names only in the selector: repeating a number and summary both in
the selector and in the selected panel was explicitly rejected. Keep figures,
programme labels, units and Source links in the right panel. On phones, place
visible category controls above the figures without horizontal overflow.

Example category labels discussed: Health & welfare; Training & education;
Employment; Enterprise support; Accessibility. These are presentation examples,
not approval to discard the eight existing catalogue classifications or silently
change their membership. Reconcile presentation groups with the actual records
before implementing; keep overlapping memberships and deduplicate All-category
figures. Any All-category control must not invent a combined beneficiaries total.

Each category presents reported achievements first. Show a separate **Planned
support** section only where that category has a sourced commitment; no empty
planned section and no planned support repeated in every category.

Preserve the large figures in the hundreds. In the Health & welfare example:

- **>500 people** — Ramadan food support; Source.
- **>500 people** — Karu food & cash support; Source.
- **≈1,000 people** — Northeast food-support target, in Planned support; Source.

These are separate programme figures, not a unique-person sum. Keep all original
bounds, populations, units and stages, including the existing distinct Karu
household target where relevant. Other existing measures include 15 reported
Borno placements, >20 startup-support recipients, >45 women trained, five SMEDAN
participants and three FHA stall-allotment beneficiaries. Training and kits for
the same cohort do not become two beneficiary totals.

### Give important non-beneficiary contributions numerical visibility

The owner particularly values the adapted vehicle. Count tangible milestones as
well as people: vehicles demonstrated, tools unveiled or agreements signed, with
the actual role and stage preserved. A contribution numbered **1** can merit a
prominent card; numerical magnitude is not a measure of its significance.

New candidate cards found during the discussion, not yet approved observations:

| Candidate display | Source and limit |
| --- | --- |
| **1 accessibility-adapted vehicle demonstrated** | [Office report](https://ossaposneo.org/hope-renewed-as-tinubus-aide-abba-isa-unveils-nigerias-first-accessibility-adapted-vehicle/), 22 February 2026. Office collaboration with Elizade/JAC; nationwide distribution remains proposed. Do not assert an independently verified national first. |
| **1 disability-readiness toolkit unveiled through his office** | [Office report](https://ossaposneo.org/ssap-abba-isa-launches-disability-readiness-toolkit-developed-by-deaf-in-tech-and-datalead-africa/), 22 May 2025. He was represented; developers were Deaf-in-Tech and DataLead Africa. Unveiling is not authorship or measured uptake. |

Review and encode these as sourced, typed milestone observations before they
become real cards. Do not silently insert them into the frozen reviewed bundle.
The toolkit report also contains an office claim of >50 employment placements;
it was not accepted into the current metric set and must not be added to the
15 Borno placements without resolving scope and overlap. Do not use another
organisation’s 1,200 trainees as his delivery figure. Find a meaningful source-
supported measure for each displayed area; never force a beneficiary estimate
or replace unknown quantities with zero merely to fill a card.

### Visual treatment

Keep green–white–green, large dark-green tabular figures, white/light-green
surfaces, restrained borders, aligned labels and Source actions. Reuse the
existing Source Sans 3 font and spacing system. Use small custom monochrome line
illustrations tied to the actual contribution, such as adapted driving controls
or a market stall. No smileys, emoji or generic decorative icons.

No report-year activity mini-chart: the owner rejected it as a poor expression
of affected lives. No decorative sparklines, percentage rings or progress bars.
A future sparkline needs genuinely comparable repeated outcome measurements;
current standalone programme figures do not establish such a series.

## 2. Ideas & Advocacy

Use a genuine photograph of him speaking at an event on one side, with a
permanent speech-shaped cloud panel beside it. A subtle tail connects the panel
to the speaker. This replaces the earlier word-cloud portrait silhouette choice.
The formal opening portrait and the speaking-event photograph should serve
different purposes; do not simply repeat the same portrait.

White cloud surface, deep green dominant words, softer greens and charcoal for
supporting words, a faint green outline, horizontal phrases and breathing room.
No lightbulb shape, popup, forced silhouette or decorative repeated words. Keep
phrases together and maintain readable keyboard/touch targets. Stack photo and
cloud naturally on phones; do not force a desktop composition into small screens.

Retain the proposed two modes: **Contribution areas** and **Concepts in reports**.
Contribution categories count classified activity records, which may overlap.
Concept size should represent distinct canonical reports containing a meaningful
phrase. The concept cloud needs a reproducible phrase/source-match extraction
step; existing ranked topic terms do not contain frequency counts. Do not invent
sizes from ranks or imply that textual prominence measures delivered impact.
Selection reveals matching sources/brief excerpts locally within this block,
not in a new standalone evidence explorer. Keep exact counts available on
selection and provide an accessible list alternative.

Caption the speech panel **Concepts from the selected reports** or equivalent:
the cloud is not a quotation or a verified transcript of the pictured speech.
Find a genuine speaking photograph and record source, context, modifications
and reuse permission before public use. No speaking asset has been selected or
licensed by this discussion. Do not generate his likeness or imply approval.

## Pending blocks and superseded ideas

- **Collaborations remains pending.** Last unapproved candidate: horizontal bars
  by organisation, counting distinct contribution areas with an evidenced
  collaboration, with role/source on selection. Example bar values 4/3/2/1 were
  fictional. The owner has not approved this metric or layout. Do not implement
  the constellation/network, table or bar chart from this conversation.
- **Guided chatbot remains pending.** Preserve the existing guided component and
  shared language contract; do not claim its next design is agreed or delete the
  implementation because its design is pending.
- update.txt is an original input, not an implementation specification. Borrow
  grouping and hierarchy, not its unsupported delivery verdicts, risk ratings,
  baseline comparisons or confidence-border encodings. No 68% delivery claim.
- Remove dashboard-wide year controls in the later redesign and neutralise old
  year query parameters so links cannot silently shrink the full overview.
  This carries forward the earlier full-record direction; the year chart itself
  is now excluded, as is the standalone evidence block.

## Research basis and next-session checks

[Geckoboard layout guidance](https://support.geckoboard.com/en/articles/10306664-planning-your-dashboard-design-and-layout)
supports related-metric grouping, size/position hierarchy and concise labels.
Its [number-widget guidance](https://support.geckoboard.com/en/articles/6055767-guide-to-the-number-visualization)
supports a dominant number with meaningful context. [GOV.UK tab guidance](https://design-system.service.gov.uk/components/tabs/)
warns about hidden content and cross-tab comparisons: keep category labels
visible, repeat the active category as the panel heading and test phone layouts.
These references inform craft; they do not approve our measures or claims.

Later implementation must validate category selection, conditional plans, exact
bounds/units, overlapping memberships, source links, empty states, shared locale,
keyboard/touch access, narrow/zoomed layouts and cloud count reproducibility.
Preserve **Change language / Canja harshe**, with English above Hausa, visible
without a menu. Hausa remains draft. Portrait/public-release gates remain false.
No new dependency, model retraining, public deployment or approval change is
part of this documentation checkpoint. Run required preflight, lint, typecheck,
tests, builds and relevant browser checks when implementation resumes.
