# Phase 2 — reviewed data and analysis bundle

24 October 2026. The owner accepted the Phase 1 checkpoint and instructed moving
on. That decision authorizes progression; the numerical backlog remains recorded
as unfinished. This phase produces a usable **reviewed-subset v1 preview**, not
an exhaustive career account or permission for public reveal.

## Concrete output

The deterministic bundle is [bundle.json](../content/dashboard/v1/bundle.json),
with [activities.csv](../content/dashboard/v1/activities.csv),
[observations.csv](../content/dashboard/v1/observations.csv) and a
[hash manifest](../content/dashboard/v1/manifest.json).

| Inventory | Count | Interpretation |
| --- | ---: | --- |
| Activity records | 33 | Includes advocacy, meetings, appointments, honours, reported support and plans |
| Numerical observations | 11 | Eight reported-delivery measures and three targets; never a combined people total |
| Citations | 37 | Office sources plus preserved starter citations; not 37 independent confirmations |
| Model source records | 31 | Selected and source-context checked |
| Distinct model texts | 30 | Exact duplicate source 1245 aliases source 1243 |
| Reviewed categories | 8 | Multilabel; one report can contribute to several categories |
| Frozen model topics | 8 | Descriptive English-text patterns, not impact measurements |
| Reviewed entities | 46 | Selected people, organisations and places with explicit aliases |
| Body-text entity mentions | 149 | One entity/source occurrence, regardless of repeated spelling variants |
| Co-occurrence edges | 257 | Supporting articles available; not proof of partnership |
| Evidenced relationships | 9 | Six reported programme collaborations, two cooperation intentions, one reported MOU signing |

The source/context check does not independently verify delivery. Full downloaded
articles, editorial queues and model arrays remain outside the public bundle.
The JSON is about 245 KB before compression. No runtime model, paid AI service or
production dependency was added. The bundle is not yet integrated into the app.

## Figures and activity reconciliation

The bundle retains value, bound, unit, population, stage, publication/event date
basis, attributed role, partners, limitations and evidence. Existing achievement
slugs and source IDs survive. Source URL matches retain archive aliases.

Startup-support and NigWED follow-up reports refer to existing cohorts; their
figures are not added again. The five SMEDAN participants remain one cohort with
training and kits. Additional SMEDAN source evidence attaches to the same activity.
The digital summit office source also attaches to its existing achievement.

Karu has **both** a >500-person reported delivery observation and an at-least-500
household target. The separate approximate-1,000 Northeast target stays a target.
Activity records expose their observation IDs and all observation stages so the
first observation cannot silently define a mixed-stage record.

The 36,551 opportunities remain a target. A source-linked review note preserves
the anniversary account's differing lower-bound wording; it does not create
another observation or establish jobs delivered. Conflicting Near Foundation
units, Queen Irene bounds, the NigWED production typo and Potiskum bounds remain
outside the accepted numerical bundle.

Suggested headline emphasis for the eventual preview:

- Five SMEDAN participants: reported training and kits, with office facilitation.
- Fifteen Borno placements: office-reported government employment, with attribution
  and independent-record limitations visible.
- More than 45 NigWED trainees and more than 20 startup recipients: separate
  programmes/cohorts with preserved lower bounds, not a unique-person sum.
- Three bank stall-allotment beneficiaries: FHA Mortgage Bank handed over
  documents; subsequent income improvement is unmeasured.
- A separately labelled 36,551-opportunity target, with the source-variation note.

These are programme-specific descriptive reports, not a ranking of lifetime
achievements. Unknown monetary amounts, unique beneficiaries and causal effects
are not manufactured. Activity counts include political/ceremonial records with
clear categories rather than recasting them as service delivery.

## Reviewed categories and frozen topics

All eight reviewed categories occur in the selected source set: policy and
accessibility; livelihoods; education/training; healthcare/welfare; digital and
assistive technology; sport; political engagement; honours/ceremonial activity.
Activity categories are separately mapped so a broad retrospective article does
not assign every category to each small activity it mentions.

| Topic | Checked label | Strongest terms | Example archive IDs |
| --- | --- | --- | --- |
| 1 | SMEDAN & enterprise support | smedan, agency, business | 1801, 4881, 5105 |
| 2 | Honours & ceremonial gatherings | award, set, senate | 1257, 1263 |
| 3 | Para-sport leadership & participation | para, sports, federation | 5709, 5803, 5197 |
| 4 | Appointments & disability-rights statements | appointment, people disabilities, matters | 1240, 1278, 1222 |
| 5 | Digital access & workforce inclusion | employment, digital, tech | 5151, 5255, 5278 |
| 6 | Courtesy visits & institutional cooperation | visit, courtesy, secretary | 1307, 1291, 1243 |
| 7 | Food relief & welfare support | tejuosho, adenike, food | 2352, 2790 |
| 8 | Women, health & support partnerships | women, women disabilities, girls | 3531, 4243, 2279 |

Topic 8 also includes veterans-support collaboration text; it is a mixed textual
pattern, not a women-only programme classifier. Cross-loadings elsewhere show
why model topics and reviewed categories are complementary. Representatives are
source-checked selections from the strongest four model articles with at least
0.25 normalized topic share; ambiguous examples are omitted without changing
model weights. Shares are descriptive weights, not probabilities of truth.

The model uses TF-IDF word/phrase features and eight-topic NMF, seed 42,
`nndsvda` initialization, coordinate descent, tolerance 0.0001 and maximum 600
iterations. This fit has 839 features and converged in 117 iterations. Preprocessing
removes subject-name variants, honorific/role noise, author bylines and two checked
repeated background lines. Those lines are identified by hashes in tracked review
metadata; their full wording stays in ignored preprocessing output.

The byline detector preserves substantive paragraphs beginning with “By enabling”
or “By working”, which an earlier broad pattern incorrectly dropped. This also
refreshes the old full-archive exploratory baseline; its old model hash/table in
DASHBOARD_ANALYSIS.md is historical and is not the v1 model.

Frozen model array SHA-256:
`e823e7b0d7096bc6045dc718ef30ad7fbb92b09fd9aae587b4d0033765791b78`.
Repeated fits in the pinned local environment reproduced this hash. Filters will
select stored document weights rather than retraining the model.

## Time, entities and connections

Publication-year denominators are **10 in 2023, seven in 2024, ten in 2025 and
three in partial 2026**. These are a deliberately selected sample, not a trend in
lifetime work or actual effort. Category counts can overlap. Topic means exclude
zero-vector documents and show modelled counts; none are zero in this fit.

Alias-aware whole-token matching uses a reviewed 46-entity catalogue, not an
exhaustive named-entity recognizer. Source links and matched aliases remain
available. Author-only bylines are excluded from networks; Lanre Oloyede's four
actual body-text representative/speaker mentions remain. Co-occurrence support
counts canonical articles, not meetings or independent confirmations.

Explicit relationship evidence is separate from the co-occurrence graph. The
African Unconquered record is a reported signing, with no claim that the signed
instrument or promised services were independently audited. NCPWD and health
cooperation records retain their intention/meeting qualifications. Toolkit
developers are Deaf-in-Tech and DataLead Africa; Isa's unveiling role is distinct.

## Coverage and language status

The full numerical queue still records 142 explicit decisions, 146 linked exact
copies, 1,114 unlinked copies and 1,467 awaiting review, with 18 reviewed holds.
Source relevance decisions now cover 45 records. The owner-approved transition
does not relabel that backlog as reviewed; the strict completeness check remains
false and does not block the agreed next engineering phase.

English/Hausa category/topic labels and seven explanatory texts are bundled.
[phase2-hausa-review.md](../research/phase2-hausa-review.md) is the human-review
packet. Hausa is draft throughout. English-source text was modelled; no Hausa
corpus analysis is claimed. Portrait rights, correction contact, human Hausa and
final public-reveal gates remain outstanding.

## Reproduction and next phase

Raw corpus snapshots are local/ignored and must be preserved with backups; a Git
clone contains the compact outputs, not the full research downloads.

```powershell
python scripts/analyse-dashboard-corpus.py
python scripts/build-dashboard-bundle.py
python scripts/audit-dashboard-bundle.py
python -m unittest discover -s scripts -p '*_test.py'
```

The model environment remains Python 3.14.4 with the pins in
[analysis-requirements.txt](../research/analysis-requirements.txt). Public bundle
exports use the standard library; artifact auditing and synthetic tests run in CI
without private downloads or scientific dependencies. Repeated exports produce
identical JSON, CSV and manifest bytes.

Next is **Phase 3: standalone deterministic bilingual chatbot** using this bundle,
shared calculations and controlled query plans. It must preserve programme/year
context, qualifiers and source links, clarify ambiguous questions and retain the
exact shared language-control contract. Validate it before dashboard integration.
