# Fifty-question chatbot accuracy audit

25 October 2026. Frozen seed 20261025; current reviewed-subset v1 chatbot.

**The chatbot is not ready for general conversational use.** It did not completely answer any of the 34 questions whose answers were available in the reviewed evidence. Five of 50 responses provided fully useful handling; these were two targeted clarifications and three appropriate limitations. One additional reply was partially useful. The implementation was not changed during this baseline audit.

| Measure | English | Hausa | Total |
| --- | ---: | ---: | ---: |
| Questions | 25 | 25 | 50 |
| Fully answered answerable questions | 0/17 | 0/17 | 0/34 |
| Fully useful handling, including targeted clarification/limitations | 3/25 (12%) | 2/25 (8%) | 5/50 (10%) |
| Partially answered | 1 | 0 | 1 |
| Coarse answer/clarify/refuse action matches | 7/25 | 6/25 | 13/50 (26%) |
| Wrong answer/interpretation | 1 | 0 | 1 |

The 26% action-match figure is not a claim of factual accuracy: eight matches were generic clarification messages that did not identify the missing information. Among all ten ambiguous questions, two received targeted clarification. Among six unsupported requests, three received relevant substantive limitations and three received fallback guidance. The engine asserted a substantive answer once; that answer addressed the wrong quantity. No invented source value was observed in this sample, but near-total abstention cannot establish numerical reliability.

## What failed

| Example | Expected | Actual |
| --- | --- | --- |
| And the year of that report? (SMEDAN context) | Canonical report year 2024 | Five people reportedly supported: a true number for the wrong question |
| How many records have a 2025 report date? | Eleven canonical activity records | Asks for a report-year filter even though the year is supplied |
| Can you explain the support he has offered women living with disabilities? | Separate sourced >45 training and >20 startup-support cohorts | Generic fallback despite the newly added women-summary feature |
| Wane taimako ya yi wa mata masu nakasa? | Equivalent women-focused summary | Generic fallback |
| How many PWD beneficiaries received the FHA stall-allotment documents? | Three, with bank/office attribution and outcome limits | Generic fallback |
| How did you get the eight topics, and do they measure his impact? | Explain English TF-IDF/NMF and descriptive limits | Correct partial warning about causal impact, but no topic-method explanation |

The main problem is question understanding and coverage. The [programme catalogue](../apps/web/lib/chat-engine.mjs) exposes only a subset of observations; strict vocabulary checks reject ordinary paraphrases and typos; follow-up patterns miss common year questions; and keyword refusals can override otherwise answerable methodological or recipient-count questions. Natural institution, place, theme and source questions also fall outside the literal query forms. This needs a broader plan-selection design and evidence-driven answer coverage, rather than claiming that correct arithmetic makes the chat accurate.

## Method and limits

An independent author used the bundle and requirements, without inspecting the parser or its tests, to create 60 candidates. A seeded stratified draw selected 25 per language: 17 answerable, five ambiguous and three unsupported. This is random sampling from a purpose-built candidate pool, not random sampling of real visitors. The sample contains natural paraphrases and evidence-backed questions beyond the parser's advertised forms; it contains no canonical exact-question positive control. Existing developer fixtures still pass, but measure a narrower scope. The sample does not include every candidate category, including the private-contact requests excluded by the seeded draw.

Gold expectations and selection were frozen before execution. The unchanged response engine was scored against expected meaning, facts, units, bounds, stages, population, year and evidence. An independent-of-implementation semantic review inspected all 50 outputs and found no complete correct answer hidden by internal status/kind labels. The reviewer was also the independent gold author, not a second gold author. One gold question uses 'records' to mean activity records under the declared audit grain; even if treated as ambiguous instead, it would not change the conclusion. Relevant partial content was retained as partial credit, not upgraded to a full answer.

All 50 were then asked through the production-static browser interface, with programme context set where needed. Every rendered main reply and status matched the engine baseline; there were no page errors or HTTP failures. Thus the observed failures are user-visible response behaviour. Latency measurements in the raw engine file cover local execution only, not browser/network or end-to-end performance.

Hausa questions and templates remain drafts; this is not fluent-human language validation. The evidence bundle is source-context reviewed, not independent proof of reported delivery. No population accuracy estimate, confidence interval, general safety certification or public-reveal approval follows from these 50 questions. Provisional audit targets (zero wrong answers, 80% answerable success per language, 90% handling overall) were not met. No parser patch, deployment or dependency was introduced during evaluation.

## All 50 questions and adjudications

Full replies, gold facts, structured results and rendered languages are available in the [raw JSON](../output/chat-evaluation-50.json). The [reviewed CSV](../output/chat-evaluation-50-reviewed.csv) includes every reply and semantic verdict; the [review artifact](../research/chat-evaluation-review.json) records row-level reasoning. The browser [evidence](../output/chat-evaluation-50-browser.json) confirms all 50 observed replies.

| ID | Language | Question | Gold action | Semantic result | Review note |
| --- | --- | --- | --- | --- | --- |
| ha-20 | ha | Me aka sani game da yarjejeniyar African Unconquered kan tsoffin sojoji? | answer | unanswered-answerable | No account of the reported African Unconquered MOU signing or its limits. Generic guidance is not an answer to this evidence-supported question. |
| en-02 | en | How many records have a 2025 report date? | answer | unanswered-answerable | Question already supplies 2025; reply asks for a filter instead of the 11 canonical activity records. Generic guidance is not an answer to this evidence-supported question. |
| en-11 | en | How many PWD beneficiaries received the FHA stall-allotment documents? | answer | unanswered-answerable | Does not provide the three bank stall-allotment beneficiaries or bank attribution. Generic guidance is not an answer to this evidence-supported question. |
| en-08 | en | What household target was given for the Karu support scheme? | answer | unanswered-answerable | Does not state at least 500 targeted households or distinguish target from delivery. Generic guidance is not an answer to this evidence-supported question. |
| en-22 | en | What did he do that year? | clarify | generic-clarification | Gold clarification is defensible because context is absent. Reply safely avoids guessing but does not ask which report year. Coarse disposition match only. |
| en-29 | en | How many deaf women aged 18 to 25 got the March POS kits? | unsupported | correct-limitation | Explicitly says the narrower demographic subgroup is not established; correctly avoids substituting the overall cohort. |
| ha-13 | ha | Wace shekara aka wallafa rahoton? | answer | unanswered-answerable | Established NigWED context supports report year 2024; neither template supplies it. Generic guidance is not an answer to this evidence-supported question. |
| en-14 | en | And the year of that report? | answer | wrong-question | Five SMEDAN participants is a real sourced fact, not a fabricated number. Visitor asked the report year in established SMEDAN context. Rendered answer omits 2024; an unrendered structured reportDate does not answer the conversational question. Gold report-year expectation is defensible. |
| ha-24 | ha | Su waye suka yi shi? | clarify | generic-clarification | Gold clarification is defensible because context is absent. Reply safely avoids guessing but does not ask which activity or referent. Coarse disposition match only. |
| ha-01 | ha | Akwai ayyuka nawa a wannan jerin da aka duba? | answer | unanswered-answerable | Requests an irrelevant year rather than providing 33 reviewed activities. Generic guidance is not an answer to this evidence-supported question. |
| en-23 | en | How much was the support? | clarify | generic-clarification | Gold clarification is defensible because context is absent. Reply safely avoids guessing but does not ask which programme and amount/count. Coarse disposition match only. |
| en-30 | en | List the confirmed jobs he will deliver in 2027, with employers and salaries. | unsupported | missing-limitation | Does not explain absence of confirmed 2027 jobs/employers/salaries; generic starters are safe but do not answer the evidence limitation. |
| ha-04 | ha | Mutane nawa ne aka ce sun samu aikin gwamnati a Borno? | answer | unanswered-answerable | Borno and the count question are explicit; reply supplies no 15-person reported placement figure. Generic guidance is not an answer to this evidence-supported question. |
| ha-29 | ha | Mata masu nakasar ji daga Kano nawa suka samu tallafin Maris? | unsupported | missing-limitation | Does not explain missing Kano/deafness subgroup evidence; generic starters are safe but do not address the request. |
| en-06 | en | Those 36,551 Beyond Disability jobs are already filled, right? | answer | unanswered-answerable | Does not correct filled-jobs premise to the 36,551-opportunity target. Generic guidance is not an answer to this evidence-supported question. |
| ha-21 | ha | Mutane nawa aka taimaka a shirin nan? | clarify | generic-clarification | Gold clarification is defensible because context is absent. Reply safely avoids guessing but does not ask which programme. Coarse disposition match only. |
| ha-17 | ha | Wane bayani ne game da taron para-volleyball a Lagos? | answer | unanswered-answerable | Does not identify the Lagos stakeholders meeting, representation or report context. Generic guidance is not an answer to this evidence-supported question. |
| en-15 | en | Who actually developed the disability-readiness toolkit he unveiled? | answer | unanswered-answerable | Does not name Deaf-in-Tech and DataLead Africa as toolkit developers. Generic guidance is not an answer to this evidence-supported question. |
| en-26 | en | How many took part in SMEDAN or NigWED? I only want one number. | clarify | targeted-clarification | Two named programmes and a demand for one number create real ambiguity. Reply explicitly asks which programme and avoids choosing or adding cohorts. |
| en-05 | en | Nigwed trainning, was it only 45 women? | answer | unanswered-answerable | Does not correct exact 45 to more than 45 NigWED trainees. Generic guidance is not an answer to this evidence-supported question. |
| en-28 | en | What was the average monthly income increase for NigWED graduates? | unsupported | correct-limitation | Explicitly says income changes are not established. This substantively handles the unsupported average income increase despite using a general causality template. |
| ha-10 | ha | Wane taimako ya yi wa mata masu nakasa? | answer | unanswered-answerable | Fails natural broad women question despite evidence for NigWED and March startup support. Generic guidance is not an answer to this evidence-supported question. |
| ha-22 | ha | A waccan shekarar fa? | clarify | generic-clarification | Gold clarification is defensible because context is absent. Reply safely avoids guessing but does not ask which year/topic. Coarse disposition match only. |
| ha-23 | ha | Nawa ne tallafin? | clarify | generic-clarification | Gold clarification is defensible because context is absent. Reply safely avoids guessing but does not ask which programme and amount/count. Coarse disposition match only. |
| en-21 | en | How many people did that programme support? | clarify | generic-clarification | Gold clarification is defensible because context is absent. Reply safely avoids guessing but does not ask which programme. Coarse disposition match only. |
| en-10 | en | Can you explain the support he has offered women living with disabilities? | answer | unanswered-answerable | Fails natural broad women question despite the two separate evidenced programmes/cohorts. Generic guidance is not an answer to this evidence-supported question. |
| ha-09 | ha | Game da Arewa maso Gabas, kusan mutane nawa aka sa a gaba don tallafin abinci? | answer | unanswered-answerable | Does not provide approximate 1,000 Northeast target or target qualification. Generic guidance is not an answer to this evidence-supported question. |
| ha-16 | ha | Shin Isa ne ya bayar da kayan taimako na ECOWAS ga NCPWD? | answer | unanswered-answerable | Does not distinguish ECOWAS donor, NCPWD recipient and Isa supportive speaker. Generic guidance is not an answer to this evidence-supported question. |
| en-19 | en | Do the House committee articles numbered 1243 and 1245 mean two visits? | answer | unanswered-answerable | Does not explain that 1243/1245 are duplicate coverage of one committee visit. Generic guidance is not an answer to this evidence-supported question. |
| ha-30 | ha | Da kashi nawa shirinsa ya rage talauci a Najeriya? | unsupported | correct-limitation | Both English and Hausa say causal impact is not established; substantively handles the unsupported national poverty-reduction percentage. |
| ha-18 | ha | Jigon mata da lafiya yana nufin duk rahotannin cikinsa na mata ne? | answer | unanswered-answerable | Does not explain that mixed topic 8 also includes veterans-support text. Generic guidance is not an answer to this evidence-supported question. |
| en-20 | en | If two organisations appear together in the network, does that prove a partnership? | answer | unanswered-answerable | Does not explain why co-occurrence is insufficient proof of partnership. Generic guidance is not an answer to this evidence-supported question. |
| ha-14 | ha | Me aka ruwaito ya yi wa makarantar makafi ta FCT tare da SMEDAN? | answer | unanswered-answerable | Does not describe FCT School of the Blind support with SMEDAN; named organisation alone is insufficient routing. Generic guidance is not an answer to this evidence-supported question. |
| en-17 | en | What areas of work do the reviewed categories cover? | answer | unanswered-answerable | Does not provide the eight reviewed categories or their scope. Generic guidance is not an answer to this evidence-supported question. |
| en-13 | en | How many PWDs did the Ramadan food report say received palliatives? | answer | unanswered-answerable | Does not state more than 500 Ramadan recipients and source attribution. Generic guidance is not an answer to this evidence-supported question. |
| en-16 | en | Is there a reviewed record connected to Lagos? | answer | unanswered-answerable | Does not retrieve the documented Lagos para-volleyball meeting. Generic guidance is not an answer to this evidence-supported question. |
| ha-06 | ha | An gama samar da ayyukan yi 36,551 na Beyond Disability kenan? | answer | unanswered-answerable | Does not correct the completed-jobs premise to a target. Generic guidance is not an answer to this evidence-supported question. |
| ha-26 | ha | Ina so a bani adadin SMEDAN ko na NigWED, guda daya kawai. | clarify | targeted-clarification | Two named programmes and a demand for one number create real ambiguity. Reply explicitly asks which programme and avoids choosing or adding cohorts. |
| ha-07 | ha | A Karu, mutane nawa suka karbi shinkafa da tallafin kudi a rahoton? | answer | wrong-refusal | Hausa asks how many people received rice and cash, not the monetary total. Refusal about money totals is true in isolation but addresses the wrong quantity; more than 500 people is supported. |
| ha-03 | ha | SMEDAN fa, participants nawa aka tallafa? | answer | unanswered-answerable | Does not answer the explicit SMEDAN participant question with five. Generic guidance is not an answer to this evidence-supported question. |
| ha-05 | ha | Matan NigWED guda 45 ne kacal aka horas? | answer | unanswered-answerable | Does not correct exact 45 to more than 45; asking a year cannot resolve the requested bound. Generic guidance is not an answer to this evidence-supported question. |
| ha-28 | ha | Nawa kudin shigar matan NigWED ya karu bayan horon? | unsupported | missing-limitation | Does not state that income changes are unmeasured; asks for an irrelevant report-year filter. |
| en-12 | en | About that Ayubson celebration in Abuja, what participation figure is sourced? | answer | unanswered-answerable | Does not supply the Ayubson report figure of more than 50 PWD participants. Generic guidance is not an answer to this evidence-supported question. |
| en-18 | en | How did you get the eight topics, and do they measure his impact? | answer | partial-answer | Correctly explains that reported claims do not establish causal impact. This answers part of the question and merits partial semantic credit, regardless of unsupported status. It omits TF-IDF/eight-topic NMF and selected-text scope, so is not a successful complete answer. Automated excessive-refusal label is too coarse. |
| ha-02 | ha | Rahotannin shekarar 2024 sun kunshi ayyuka nawa a jerin? | answer | unanswered-answerable | Question supplies 2024; reply requests a year instead of 10 canonical activities. Generic guidance is not an answer to this evidence-supported question. |
| en-24 | en | Which one was bigger? | clarify | generic-clarification | Gold clarification is defensible because context is absent. Reply safely avoids guessing but does not ask which programmes or metric to compare. Coarse disposition match only. |
| ha-15 | ha | Kyautar LEEX guda biyar ya samu ne a 2023? | answer | unanswered-answerable | Does not correct five awards to one recognition at the fifth edition. Generic guidance is not an answer to this evidence-supported question. |
| ha-08 | ha | Shirin Karu ya yi nufin tallafa wa gidaje nawa? | answer | unanswered-answerable | Does not give the at-least 500-household Karu target. Generic guidance is not an answer to this evidence-supported question. |
| en-09 | en | Was the Northeast expansion aiming for exactly a thousand recipients? | answer | unanswered-answerable | Does not correct exactly 1000 to approximately 1000 targeted beneficiaries. Generic guidance is not an answer to this evidence-supported question. |
| en-01 | en | How big is the reviewed activity list now? | answer | unanswered-answerable | Does not provide 33 reviewed activities; year filter is not needed. Generic guidance is not an answer to this evidence-supported question. |

## Reproduce and preserve the baseline

The selected fixture and results identify the exact input/code snapshot. Preserve the frozen baseline; after any parser changes, use a separately versioned evaluation and a fresh unseen sample. These questions are now exposed regression material. Do not repair these phrases and then present their new score as held-out accuracy.

```powershell
# Initial selection already frozen; --freeze refuses to overwrite it.
node scripts/evaluate-chatbot.mjs --output-dir output/chat-evaluation-rerun
# With the matching static build served by npm.cmd run preview:
node scripts/evaluate-chatbot-browser.mjs
node scripts/report-chatbot-evaluation.mjs
```

The main evaluator refuses an engine, bundle or candidate-pool mismatch and will not overwrite existing result files. Use a new directory under output/ for a repeat run. Timing and timestamps may differ; the baseline artifacts remain preserved. The report generator refuses a review attached to a different raw result hash.

- Engine SHA-256: `83cfe8ddba32bf33eff87e6dc88b125de84f958a3df0242feceefc4cc72c67fb`
- Bundle SHA-256: `166d42785cf3a12256c0207399d3d6cd5c4facaa0d7a75116a0feb181ea62db2`
- Candidate pool SHA-256: `5b80e6185b856213d4744f15df37cb0b1454ff18be42ac0aaafeff8093304259`
- Frozen 50 SHA-256: `56ab4fad2c5a7c3631c5d764a057bed6d906e9cbeb2c4f5fcbb204042a8f914b`
- Engine-results SHA-256: `37510cf75548dcead8c02a0746201d50a099d1390e2be4f32cc4962e7faaf809`

Next: improve language-independent intent/scope selection and evidence coverage while preserving deterministic execution and typed-claim checks; then validate on a new unseen, independently authored English/Hausa set. Current human Hausa, source-coverage and public-reveal gates remain open.
