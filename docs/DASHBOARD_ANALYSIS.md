# The Work in Numbers — research implementation

24 October 2026, updated through Phase 1 batch 002. This is a **partial first-milestone packet**, not approval of the
complete numerical review or a release candidate. The accepted product is a
timeline-led English/Hausa dashboard with a deterministic chatbot and whole-app
offline support. No new research observation or model result has been imported
into the public application.

## Coverage and decision grain

The frozen archive contains 639 posts and seven pages, with 2,869 candidate
passages. A candidate is a passage, not a number, person or activity; one passage
can contain several quantities with different meanings. Dates are source
publication timestamps unless an event date is independently recorded. The API
does not establish the publisher's local timezone; retain both original date
fields rather than silently converting them. Collection completeness concerns
this archive, not lifetime career coverage.

Exact full-text SHA-256 grouping yields 396 distinct texts, including seven pages
and 389 posts. All source IDs remain in an alias map. Matching titles alone never
merge documents or activities. Near duplicates and multiple reports about one
activity still require editorial reconciliation. Two 2013 timestamps belong to
the Contact and News and Updates pages, not documented career events. Pages are
excluded from topic training and publication-period charts.

## Numerical accounting

| State | Passages | Meaning |
| --- | ---: | --- |
| Source-context decisions recorded | 142 | Eight research observations, 116 exclusions/repeats/context decisions and 18 explicit unresolved holds |
| Exact repeats linked to reviewed originals | 146 | Inherit the canonical decision, including any hold; no new observation or corroboration |
| Automatic exact repeats still unlinked | 1,114 | Same passage within an identical-full-text group; canonical passage still needs review |
| Awaiting editorial review | 1,467 | Not accepted or represented as completed review |
| Total | 2,869 | Complete accounting, **incomplete substantive review** |

The 142 decisions are in [numerical-decisions.json](../research/numerical-decisions.json).
They are tied to passage fingerprints including source text hash, location and
wording, publication timestamp and citation URL. Changes invalidate the decision instead of inheriting approval. These
are source-context checks by Codex, not fluent-human Hausa review or independent
confirmation of delivery. Machine repeat checks have a separate status.

The original downloaded articles and candidate exports remain unmodified. The
derived local queue records all six allowed dispositions and keeps awaiting
review distinct from a reviewed ambiguity. Eight source-context-accepted research
observations are in [reviewed-observations.json](../research/reviewed-observations.json),
with public approval explicitly false. No numerical candidates have been
newly approved for use in the public application. There is no combined beneficiary count.

Batch 001 reviewed 50 previously awaiting passages across 11 articles: eight
research observations, four repeats, six background/context passages, one
date/metadata passage, 28 irrelevant passages and three explicit holds. The
eight observations preserve six reported-delivery measures and two targets:
>500 Ramadan food recipients; >500 people at the Karu launch; a separate >=500
household target; approximately 1,000 planned Northeast beneficiaries; >50 Ayubson
participants; three FHA stall-allotment beneficiaries; >20 startup recipients;
and >45 NigWED trainees. The last two retain existing activity IDs. These are
individual office reports; neither their values nor their activity IDs establish
an additional beneficiary total or eight completed activities.

Five full-source relevance exclusions are recorded in
[source-decisions.json](../research/source-decisions.json): sources 1153, 1156,
1168, 1187 and 1194 cover other people's reporting without a documented Isa role.
The exploratory model below remains unchanged until the relevance pass is complete.
Observation fingerprints protect value, bound, unit, stage and context against
accidental edits; the audit also checks exact excerpt/source matches and dates.

Batch 002 reviewed 60 previously awaiting passages across 20 articles: 39 were
unrelated reporting, ten were dates/metadata, nine background/context and two
qualitative phrases. Source relevance decisions now cover 25 archive records:
11 included and 14 excluded. These partial exclusions have not changed the frozen
exploratory model. Disability-related reporting without a documented Isa role is
retained as context rather than credited as his activity.

Eight qualitative activity records are in
[reviewed-activities.json](../research/reviewed-activities.json): political
congratulations, a protocol advocacy statement, the existing appointment milestone,
a House disability committee visit, one LEEX award, an NCPWD visit, an office-agenda
briefing and a health-ministry meeting. They carry reviewed categories, short
source excerpts, participant/institution names, stages and explicit limitations.
They have no invented numerical measures. A meeting or intention to cooperate
does not establish an executed partnership or service delivery.

The House courtesy-call reports 1243/1245 form one activity with two citations.
The award announcement (1257) and receipt report (1263) also form one activity;
its reported-award date uses the receipt report, not the earlier announcement.
The appointment record links existing chronology; congratulations do not create a
second appointment. These eight qualitative records and the eight numerical
observations are different grains and must not be summed into an activity total.

The repeat-resolution check now links 146 exact copies to reviewed canonical
passages. It retains the canonical disposition, so an unresolved claim stays
unresolved. Linked duplicates add neither observations nor independently verified
sources. The numerical completeness gate accepts these reviewed links but still
refuses remaining awaiting and unlinked passages.

## Claims held and proposed emphasis

- **Queen Irene training proposal:** source 3270 says both “over 1000” and
  “about 1000”. This is proposed training; the accompanying employment figure is
  also a future target. Keep the conflicting bound visible and withhold its KPI.
- **Near Foundation Ramadan distribution:** source 4975 changes from people to
  households. Neither unit can stand in for the other. Hold the public number.
- **NigWED:** source 3531 supports the existing >45 training cohort but also
  contains a malformed production quantity and a separate million-person target.
  Do not repair the production quantity or count the target as delivered training.
- **Potiskum grants:** source 5862 opens with “No fewer than 50” and later says
  50. The existing shortlist records an exact bound. Hold it for explicit
  reconciliation; preserve the inclusive lower-bound wording. The 20 FarmerMoni
  grants in the same article are a separate programme, with unresolved overlap.
  The organising CBM directorate and Isa's movement role must remain explicit.
- **FHA Mortgage Bank stalls:** source 5105 describes the bank handing over
  documents to three beneficiaries. Repeated title/body mentions are one cohort.
  Expected income improvements are not measured outcomes.
- **Karu food support:** source 2790 distinguishes >500 people reportedly
  receiving support from a household target and proposed regional expansion.
  Planned national scope is not delivered geographic coverage.
- **Ayubson event:** source 4860 describes >50 participants at a celebration
  organised with the foundation. Attendance and gifts do not establish jobs,
  income gains or a monetary support total; Isa was represented at the event.

These statements were checked against the saved full source texts. They are not
delivery-partner corroboration. The earlier eleven-observation shortlist remains
preserved as historical research, with its limitations; it has not been silently
corrected or promoted.

Proposed initial headline emphasis remains the existing, limited six-activity
ledger: programme-specific five SMEDAN participants, 15 office-reported Borno
placements, >20 startup recipients, >45 NigWED trainees, and the separately
labelled 36,551-opportunity **target**. These come from the starter ledger, not a
completed archive-wide ranking. Do not call them the largest lifetime achievements.

## Eight-topic exploratory model

The implementation fits TF-IDF word and phrase features and NMF with eight
components, seed 42, `nndsvda` initialization, 600 maximum iterations and tolerance
0.0001. This run converged after 63 iterations with 9,064 features. Exact-text
duplicates are removed before fitting. Original text is preserved; features omit
the central subject's name variants, bylines and repeated short lines. Every
removed line and stop word is saved for inspection.

| Topic | Strongest terms | Interpretation to review |
| --- | --- | --- |
| 1 | disability, act, inclusive, rights | Policy, rights and accessibility |
| 2 | birthday, service, dedication | Birthday and ceremonial coverage |
| 3 | ojo, lekan, apc, chieftain | Other-person political commentary; corpus relevance problem |
| 4 | awards, award, honoured | Honours reporting; verify award claims separately |
| 5 | mobilisation, movement, city boy | Political organisation and mobilisation |
| 6 | yobe, appointment, governor | Appointments and congratulatory coverage |
| 7 | project, pwds, office, support | Broad programme narrative; weakly specific label |
| 8 | youth, young, permanent secretary | Youth-sector and birthday coverage overlap |

Each topic output has four representative source links and a model-derived
article share. Labels above are provisional interpretations. Neither shares nor
terms represent impact, beneficiary reach, a probability of truth or a documented
partnership. English source text was analysed; Hausa explanations do not imply a
Hausa corpus was analysed. No sentiment analysis was run.

The archive includes political interviews concerning Chief Lekan-Ojo rather than
Isa. Topic 3 makes that contamination visible. Near-duplicate congratulatory
stories also survive exact-text grouping. A relevance pass, near-duplicate review
and representative full-text checks must precede choosing the public frozen
model. Do not hide the contaminated exploratory run or publish it as a clean
whole-career thematic distribution.

Publication-period denominators after exact deduplication are 48 posts in 2023,
192 in 2024, 68 in 2025 and 81 in partial 2026. Model prevalence is the mean of
per-document normalized NMF weights within each period, with zero-vector documents
reported separately (none in this run). These are reporting patterns, not changes
in actual effort or delivery. Reviewed category coverage, entity aliases and
documented partnerships remain unimplemented; model topics do not replace them.

## Reproduction and integrity

Research environment: Python 3.14.4; dependencies pinned in
[analysis-requirements.txt](../research/analysis-requirements.txt). No web runtime
dependency was added. Run from the repository root:

```powershell
python scripts/audit-office-evidence.py output/office-evidence/20261024T081152242131Z
python -m unittest discover -s scripts -p '*_test.py'
python scripts/prepare-analysis.py output/office-evidence/20261024T081152242131Z
python scripts/audit-analysis.py
# Expected to fail until substantive review is complete:
python scripts/audit-analysis.py --require-complete
```

Outputs are local under `output/analysis/20261024T081152242131Z/`: JSON/CSV review
queue, corpus hashes, preprocessing configuration, source aliases, vocabulary,
frozen numeric model arrays, document topics, period summaries and manifest.
They are research artifacts, outside the public static export. Do not distribute
the full-text queue as the compact public bundle. Archive and backup this folder
alongside the source snapshots when moving machines.

Two runs produced identical component and weight arrays, verified by SHA-256:
`319a60ac268a139abb8289f985b96cd352d217770fa5593819529f2fc6cf1042`.
This is evidence for this environment; floating-point implementations on other
platforms may differ. The audit checks artifact hashes, source/decision freshness,
canonical references, model/source alignment, topic weights, representative
citations and publication denominators. Integrity passes while the separate
completeness check deliberately fails.

## Remaining work and monthly refresh

1. Finish the 1,467 awaiting passages; reconcile canonical passages underlying
   the automatic repeats and split mixed passages into typed observations.
2. Reconcile activity identities across different articles; preserve existing IDs,
   partner credit, units, populations, dates and disagreements. Seek original
   delivery-partner corroboration for prominent claims.
3. Review source relevance and multilabel categories; review entity spans,
   aliases and article-supported connections. Separate partnerships from
   co-occurrence. Freeze a reviewed model and compact, versioned public bundle.
4. Prepare the complete first milestone for owner review, including proposed
   headline selection. The owner is not being asked to clean or label the data.
5. Build and validate the standalone bilingual deterministic chatbot before
   dashboard integration; retain the exact shared language-control contract.
6. Build the visual dashboard, preserve achievement links and provide a secondary
   tree route. Then implement and test whole-app offline caching and exports.

For a monthly refresh, create a new timestamped source snapshot; run source QA;
diff source IDs/hashes; carry forward only unchanged, fingerprint-matching
decisions; review new and changed content; rerun analysis; inspect changed topic
terms and representative articles; validate before publishing a new bundle.
The current script rejects orphan/stale decisions rather than silently dropping
them. A refresh runner and end-to-end sample refresh are still pending. All
portrait, fluent-human Hausa, correction-contact, accessibility/performance,
hosting and final reveal gates remain open.
