# Review of New.txt: bilingual numerical questions

## Subsequent owner decision - takes precedence for presentation

After this review, the owner explicitly requested a beautiful conversational English/Hausa chatbot, built before integration as a dashboard section. That requirement supersedes the compact-tool/query-builder presentation recommendation below. The researched numerical, dependency and provenance findings remain applicable behind the chat interface.

The chatbot automatically follows the page language. Always show **Change language / Canja harshe**, then **English** above **Hausa**, vertically stacked and both visible without a menu. A single control changes page and chat together. [CHATBOT_SPEC.md](CHATBOT_SPEC.md) is the detailed continuation contract. No chatbot code or approved Hausa templates have been delivered.

Reviewed 22 October 2026. Recommendation: retain the feature concept, revise the build specification before implementation. This is a research and architecture review; none of the proposed packages was installed or executed. Published benchmarks below are maintainer-reported, not independently reproduced here. New.txt and HonAbbas.txt are preserved.

## Product verdict

A compact **Ask the data** section can help visitors find a documented contribution, understand a KPI and open its evidence. It fits the accepted descriptive dashboard direction in CONTRIBUTION_METRICS.md. It should complement KPI cards, filters, charts and a searchable evidence table. With six starter activities, five observations and incomplete career coverage, a large chatbot would promise more breadth than the data supports.

Keep deterministic computation, controlled query plans, explicit clarification and source traceability. Replace the long Python/model/verification dependency chain with a small query registry and bilingual templates over the reviewed public ledger. No causal evaluation is needed; answers must retain reported attribution and descriptive limits.

## Findings, highest importance first

### High: correct arithmetic can answer the wrong question

New.txt:3, 32-35, 73-85 and 128-138. A valid JSON plan can select an allowed but incorrect metric, year or programme. Every arithmetic verifier could then agree on an irrelevant answer. An LLM parser necessarily proposes data selection through its fields; the executor must independently decide whether that proposal is allowed and sufficiently unambiguous.

Correction: resolve a specific metric ID, counting grain, programme, delivery/target stage, date basis, period, unit and aggregation policy. Show the interpretation beside the answer. Ask a targeted clarification when any required meaning is unresolved. Do not treat model-supplied confidence as a correctness probability. Test question-to-plan accuracy separately from arithmetic.

### High: domain restrictions are missing from the generic aggregation contract

New.txt:25-35 and 73-85. COUNT can mean activities, measures, source documents or people. SUM/MEAN/TOP_N are unsafe without compatibility and overlap rules. Our >20 recipients and >45 trainees cannot become an exact 65; combining them as unique people is unsupported even if bounds are retained. The 36,551 opportunities are a target, and report year is not event year.

Correction: approve aggregation per metric. Require compatible units, population, stage, time basis and known non-overlap where totals count people. Preserve strict/inclusive bounds. Unknown values remain missing. Reject unsupported rankings and averages. The current ledger does not support a unique-person total, lifetime coverage or a delivered-jobs percentage against that target.

### High: the proposed Hausa primary parser handles a different domain

New.txt:53 and 150. [owo's own documentation](https://github.com/LPMatrix/owo) defines financial intents: transfers, bills, airtime, data purchases, crypto sales and balances. Its offline rules do not implement dashboard COUNT, TREND or contribution filters. Its current result contract exposes field_confidence and min_confidence rather than the proposed generic confidence mapping. Payment flags cannot be directly mapped to missing dashboard dimensions.

Correction: omit owo-parse here. Write a small domain vocabulary and reviewed English/Hausa question patterns. Offer selectable example questions as a reliable route to the same plans.

### High: the verification stack is helpful tooling, not a numerical guarantee

New.txt:87-118 and 132-144. [factguard](https://github.com/Anirudh-Nadipally/factguard) documents heuristic English-first scoping; its reported numeric-error benchmark for version 0.1 has 0.406 recall and 0.611 precision. It also skips dates. A clean report does not establish that every claim was understood or grounded.

[QuantGuard](https://pypi.org/project/rag-quantguard/) documents heuristic entity binding, a 22-case benchmark, multiple unresolved statuses and nonzero default tolerances. Rejecting only CONTRADICTED permits UNSUPPORTED and AMBIGUOUS cases to escape. Its prose extraction has not been validated here for Hausa.

Correction: validate typed answer claims directly against the selected record IDs and approved operation. Require every required check to pass; unknown/unverifiable states block an answer. Counts require exact equality; rounding rules must be metric-specific. Optional prose checkers can supplement this but must not certify the result. Two libraries are not independent protection if both trust the same incorrect selection or corrupted ledger.

### High: the final narrative step reopens semantic errors

New.txt:142-144. A model can change "target" to "delivered", ">45" to "45", or the actor while retaining every numeric token. The proposed final numeric-token scan would miss those changes.

Correction: render human-reviewed bilingual templates from a typed answer containing value, bound, unit, population, stage, date basis, attribution and citations. Do not use generated narrative in the first release. If added later, validate complete structured claims after rendering, including qualifiers and attribution, and use the template on failure.

### High: the source-mutation acceptance test promises an impossible check

New.txt:169. Changing the source value and recomputing consistently need not cause a contradiction: the checker has been given the changed value as its authority.

Correction: keep trusted fixtures/snapshots separate. Test an altered candidate answer against unchanged evidence. Separately test dataset integrity against a reviewed version/hash, plus stale-cache invalidation. A hash identifies a snapshot; editorial review establishes its authority. Arithmetic agreement does not independently establish that a reported programme actually delivered its claim.

### Medium: language detection and schema compliance are overstated

New.txt:42, 55 and 124-128. [pynatlas](https://pypi.org/project/pynatlas/) does document offline detection and >99% results on its held-out benchmark, but supports only four languages and can force other languages into those labels. Valid structured output can still contain wrong fields. Its standard local setup downloads approximately 4.9 GB of quantized weights; it is not a small static-site dependency.

Correction: default to the site's explicit English/Hausa selection, allow switching, and handle mixed-language input without silent routing. Any detector needs an application-specific reject policy and short-query evaluation. Local model serving is an optional separately hosted experiment.

### Medium: the NER score belongs to a different model

New.txt:59. The 91.75 Hausa F1 is published for [Davlan/xlm-roberta-large-masakhaner](https://huggingface.co/Davlan/xlm-roberta-large-masakhaner), not the named base Hausa checkpoint. The [mbeukman base Hausa NER model](https://huggingface.co/mbeukman/xlm-roberta-base-finetuned-ner-hausa) documents research use and limited generalisation. NER performance does not measure question understanding.

Correction: omit NER for the small controlled catalogue. If later justified, pin the exact model and evaluate our entity aliases and questions separately.

### Medium: schema and confidence gates need actual semantic constraints

New.txt:30-38 and 62-70. Strings and dictionaries do not implement the stated vocabulary constraints. There are no encoded intent-specific requirements, bounded limits, sort/tie rules or date-basis fields. [Wassitai](https://pypi.org/project/wassitai/) describes its confidence as repair intervention, not correctness. [agentic-gate](https://pypi.org/project/agentic-gate/) and [promptguard-py](https://pypi.org/project/promptguard-py/) provide validation utilities; they do not supply our domain rules.

Correction: use one strict validator, reject extra fields, enforce enums and cross-field rules, and distinguish parse status from empirical accuracy. Do not silently repair semantic fields. A circuit breaker does not replace a per-request retry/deadline cap. These overlapping frameworks are unnecessary for the initial browser feature.

### Medium: deployment, licensing and logging assumptions need revision

New.txt:120-146 and 156-166. The app is a static Next.js export with JavaScript metric scripts. Python inference and request-time audit storage require additional services. [NumProof's repository](https://github.com/projecttron/numproof) explicitly identifies an open SDK/MCP client backed by a hosted verification engine. Offline receipt verification differs from offline computation. The [official N-ATLaS terms](https://huggingface.co/NCAIR1/N-ATLaS) impose a 1,000 active-end-user cap per rolling 30 days, with a commercial licence required above it. "All free/open-source" is therefore an inadequate deployment assumption.

Correction: keep the first release in the existing TypeScript/JavaScript stack with public reviewed data only. Do not rely on keyword blacklists as security boundaries; validate plans, render text safely and keep secrets off the client. Store no raw visitor questions by default. Provide a downloadable, local execution receipt with dataset version/hash, query plan, selected record/measure/source IDs, operation version and result. If server logging is later needed, define redaction, retention and access rules first.

## Proposed first-release section

Use a visible language selector, a short question field, example-question buttons and a structured query builder. On success, show the interpreted question, concise answer, qualifiers, source links and a link that opens the supporting dashboard rows. On ambiguity, show a specific choice rather than a generic error. Announce changes accessibly and preserve keyboard focus. Hausa prompts, answers and clarifications need fluent human review before public release.

Flow: language choice -> example/rule parser -> strict plan validation -> allowlisted metric function -> independent claim/invariant check -> bilingual template -> evidence and execution receipt.

The verifier should inspect the underlying selected records, not just compare an answer against the calculator's own summary. Existing functions in scripts/contribution-metrics.mjs are reusable for inventory metrics; they need domain-aware plan validation and a claim contract around them, not a replacement Python service.

| Example question | Permissible answer with the current ledger |
| --- | --- |
| How many activities are documented? | Six in this starter ledger; incomplete career coverage. |
| How many participants were supported in the SMEDAN activity? | Five reported participants; training and kits concern one cohort. |
| How many women were trained in the NIGWED activity? | More than 45 reported; no inferred income/employment effect. |
| How many employment placements are reported in Borno? | Fifteen reported by the office, with attribution and source limitations. |
| Were 36,551 jobs delivered? | The recorded number is a programme target, not documented delivery. |
| How many unique people benefited overall? | Cannot calculate because overlap and counting definitions are unresolved. |
| Show activities by year. | Group by report year unless verified event dates support the requested basis. |

Prioritise count, filtered list and single-measure lookup. Add trends/rankings/aggregations only when their metric definition and evidence permit them. Use the same plan IDs and answer claims in both languages. Treat excess Hausa clarification as safe handling but also measure it as a usability gap to improve.

## Required acceptance evidence before implementation is called ready

- Native-speaker-reviewed English/Hausa question pairs resolve to identical intended plans and claims; test paraphrases, short inputs, mixed language, spelling variants, negation and ambiguous years/programmes.
- Wrong plan, entity, measure, year basis, bound, unit, attribution or stage is blocked or clarified even when the number occurs elsewhere in the data.
- Targets never become delivery; repeated articles never create new activities; unknown geography/quantities never become zero; overlapping groups never become a unique-person total.
- Every asserted quantity has a complete claim and resolvable evidence. Empty filters distinguish zero matching documented records from unknown real-world delivery.
- Altered candidate numbers fail against trusted fixtures; ledger revisions invalidate old receipts/results; no-data and source conflicts receive defined responses.
- Both languages pass the same semantic checks. No raw question logging is required for deterministic local reproduction.
- Browser tests cover keyboard, accessible status messages, responsive layout, source links, interpretation correction and useful clarification states.

Measure correct-plan rate, incorrect answered queries, coverage/clarification rate and latency separately by language on a frozen held-out question set. Agree thresholds before evaluating; perfect scores on a small fixture suite are not a population guarantee.

Decision: this is a useful dashboard section after simplification. New.txt should remain a proposal until the domain contract, bilingual examples and failure cases are specified. Expand the evidence inventory and core dashboard first or alongside this small feature; consider a model parser only after measured rule-parser failures justify its service cost and complexity.

## Repository validation for this review

Preflight, workspace lint, workspace typecheck, all ten tests, the web production build and the Studio production build passed on 22 October 2026. Git diff whitespace check passed. Documentation changes only; no new runtime tests, browser validation, package execution or deployment is claimed. The managed terminal initially failed before process startup with a setup-refresh helper error; authorised elevated tool execution completed the reads and checks. No sandbox permissions or ownership were changed.
