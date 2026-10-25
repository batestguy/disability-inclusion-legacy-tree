import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const raw = await readFile("output/chat-evaluation-50.json");
const result = JSON.parse(raw);
const review = JSON.parse(
  await readFile("research/chat-evaluation-review.json", "utf8"),
);
const browser = JSON.parse(
  await readFile("output/chat-evaluation-50-browser.json", "utf8"),
);
assert.equal(
  createHash("sha256").update(raw).digest("hex"),
  review.protocol.baselineSha256,
  "Review must refer to this exact baseline",
);
assert.equal(result.engineSha256, browser.engineSha256);
assert.equal(review.rows.length, 50);
assert.equal(browser.rows.length, 50);
assert.ok(browser.rows.every((r) => r.statusMatches && r.textMatches));
const adjudications = new Map(review.rows.map((r) => [r.id, r]));
const browserRows = new Map(browser.rows.map((r) => [r.id, r]));
assert.ok(
  result.rows.every((r) => adjudications.has(r.id) && browserRows.has(r.id)),
);
const useful = new Set([
  "correct-limitation",
  "targeted-clarification",
  "correct-answer",
]);
assert.equal(
  review.rows.filter((r) => useful.has(r.semanticVerdict)).length,
  review.summary.fullyUsefulHandling,
);
const cell = (s) =>
  String(s ?? "")
    .replaceAll("|", "\\|")
    .replaceAll("\n", " ");
const counts = review.summary;
const lines = [
  "# Fifty-question chatbot accuracy audit",
  "",
  `25 October 2026. Frozen seed ${result.seed}; current reviewed-subset v1 chatbot.`,
  "",
  "**The chatbot is not ready for general conversational use.** It did not completely answer any of the 34 questions whose answers were available in the reviewed evidence. Five of 50 responses provided fully useful handling; these were two targeted clarifications and three appropriate limitations. One additional reply was partially useful. The implementation was not changed during this baseline audit.",
  "",
  "| Measure | English | Hausa | Total |",
  "| --- | ---: | ---: | ---: |",
  "| Questions | 25 | 25 | 50 |",
  "| Fully answered answerable questions | 0/17 | 0/17 | 0/34 |",
  "| Fully useful handling, including targeted clarification/limitations | 3/25 (12%) | 2/25 (8%) | 5/50 (10%) |",
  "| Partially answered | 1 | 0 | 1 |",
  "| Coarse answer/clarify/refuse action matches | 7/25 | 6/25 | 13/50 (26%) |",
  "| Wrong answer/interpretation | 1 | 0 | 1 |",
  "",
  "The 26% action-match figure is not a claim of factual accuracy: eight matches were generic clarification messages that did not identify the missing information. Among all ten ambiguous questions, two received targeted clarification. Among six unsupported requests, three received relevant substantive limitations and three received fallback guidance. The engine asserted a substantive answer once; that answer addressed the wrong quantity. No invented source value was observed in this sample, but near-total abstention cannot establish numerical reliability.",
  "",
  "## What failed",
  "",
  "| Example | Expected | Actual |",
  "| --- | --- | --- |",
  "| And the year of that report? (SMEDAN context) | Canonical report year 2024 | Five people reportedly supported: a true number for the wrong question |",
  "| How many records have a 2025 report date? | Eleven canonical activity records | Asks for a report-year filter even though the year is supplied |",
  "| Can you explain the support he has offered women living with disabilities? | Separate sourced >45 training and >20 startup-support cohorts | Generic fallback despite the newly added women-summary feature |",
  "| Wane taimako ya yi wa mata masu nakasa? | Equivalent women-focused summary | Generic fallback |",
  "| How many PWD beneficiaries received the FHA stall-allotment documents? | Three, with bank/office attribution and outcome limits | Generic fallback |",
  "| How did you get the eight topics, and do they measure his impact? | Explain English TF-IDF/NMF and descriptive limits | Correct partial warning about causal impact, but no topic-method explanation |",
  "",
  "The main problem is question understanding and coverage. The [programme catalogue](../apps/web/lib/chat-engine.mjs) exposes only a subset of observations; strict vocabulary checks reject ordinary paraphrases and typos; follow-up patterns miss common year questions; and keyword refusals can override otherwise answerable methodological or recipient-count questions. Natural institution, place, theme and source questions also fall outside the literal query forms. This needs a broader plan-selection design and evidence-driven answer coverage, rather than claiming that correct arithmetic makes the chat accurate.",
  "",
  "## Method and limits",
  "",
  "An independent author used the bundle and requirements, without inspecting the parser or its tests, to create 60 candidates. A seeded stratified draw selected 25 per language: 17 answerable, five ambiguous and three unsupported. This is random sampling from a purpose-built candidate pool, not random sampling of real visitors. The sample contains natural paraphrases and evidence-backed questions beyond the parser's advertised forms; it contains no canonical exact-question positive control. Existing developer fixtures still pass, but measure a narrower scope. The sample does not include every candidate category, including the private-contact requests excluded by the seeded draw.",
  "",
  "Gold expectations and selection were frozen before execution. The unchanged response engine was scored against expected meaning, facts, units, bounds, stages, population, year and evidence. An independent-of-implementation semantic review inspected all 50 outputs and found no complete correct answer hidden by internal status/kind labels. The reviewer was also the independent gold author, not a second gold author. One gold question uses 'records' to mean activity records under the declared audit grain; even if treated as ambiguous instead, it would not change the conclusion. Relevant partial content was retained as partial credit, not upgraded to a full answer.",
  "",
  "All 50 were then asked through the production-static browser interface, with programme context set where needed. Every rendered main reply and status matched the engine baseline; there were no page errors or HTTP failures. Thus the observed failures are user-visible response behaviour. Latency measurements in the raw engine file cover local execution only, not browser/network or end-to-end performance.",
  "",
  "Hausa questions and templates remain drafts; this is not fluent-human language validation. The evidence bundle is source-context reviewed, not independent proof of reported delivery. No population accuracy estimate, confidence interval, general safety certification or public-reveal approval follows from these 50 questions. Provisional audit targets (zero wrong answers, 80% answerable success per language, 90% handling overall) were not met. No parser patch, deployment or dependency was introduced during evaluation.",
  "",
  "## All 50 questions and adjudications",
  "",
  "Full replies, gold facts, structured results and rendered languages are available in the [raw JSON](../output/chat-evaluation-50.json). The [reviewed CSV](../output/chat-evaluation-50-reviewed.csv) includes every reply and semantic verdict; the [review artifact](../research/chat-evaluation-review.json) records row-level reasoning. The browser [evidence](../output/chat-evaluation-50-browser.json) confirms all 50 observed replies.",
  "",
  "| ID | Language | Question | Gold action | Semantic result | Review note |",
  "| --- | --- | --- | --- | --- | --- |",
  ...result.rows.map((r) => {
    const a = adjudications.get(r.id);
    return `| ${cell(r.id)} | ${r.lang} | ${cell(r.question)} | ${r.expected.disposition} | ${cell(a.semanticVerdict)} | ${cell(a.note)} |`;
  }),
  "",
  "## Reproduce and preserve the baseline",
  "",
  "The selected fixture and results identify the exact input/code snapshot. Preserve the frozen baseline; after any parser changes, use a separately versioned evaluation and a fresh unseen sample. These questions are now exposed regression material. Do not repair these phrases and then present their new score as held-out accuracy.",
  "",
  "```powershell",
  "# Initial selection already frozen; --freeze refuses to overwrite it.",
  "node scripts/evaluate-chatbot.mjs --output-dir output/chat-evaluation-rerun",
  "# With the matching static build served by npm.cmd run preview:",
  "node scripts/evaluate-chatbot-browser.mjs",
  "node scripts/report-chatbot-evaluation.mjs",
  "```",
  "",
  "The main evaluator refuses an engine, bundle or candidate-pool mismatch and will not overwrite existing result files. Use a new directory under output/ for a repeat run. Timing and timestamps may differ; the baseline artifacts remain preserved. The report generator refuses a review attached to a different raw result hash.",
  "",
  `- Engine SHA-256: \`${result.engineSha256}\``,
  `- Bundle SHA-256: \`${result.bundleSha256}\``,
  `- Candidate pool SHA-256: \`${result.candidateSha256}\``,
  `- Frozen 50 SHA-256: \`${result.selectedSha256}\``,
  `- Engine-results SHA-256: \`${review.protocol.baselineSha256}\``,
  "",
  "Next: improve language-independent intent/scope selection and evidence coverage while preserving deterministic execution and typed-claim checks; then validate on a new unseen, independently authored English/Hausa set. Current human Hausa, source-coverage and public-reveal gates remain open.",
];
await writeFile("docs/CHATBOT_ACCURACY_AUDIT.md", lines.join("\n") + "\n");
const csvCell = (value) =>
  '"' +
  String(value ?? "")
    .replace(/^[=+@-]/, "'$&")
    .replaceAll('"', '""') +
  '"';
const header = [
  "id",
  "language",
  "question",
  "expected_action",
  "gold_answer",
  "actual_status",
  "semantic_verdict",
  "targeted_response",
  "review_note",
  "actual_reply",
];
const rows = result.rows.map((r) => {
  const a = adjudications.get(r.id);
  return [
    r.id,
    r.lang,
    r.question,
    r.expected.disposition,
    r.expected.note,
    r.actual.status,
    a.semanticVerdict,
    a.targetedResponse,
    a.note,
    [
      r.rendered.text,
      ...r.rendered.items.map((i) => i.text),
      r.rendered.detail,
    ].join("\n"),
  ];
});
await writeFile(
  "output/chat-evaluation-50-reviewed.csv",
  "\ufeff" +
    [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n") +
    "\r\n",
);
console.log(
  JSON.stringify({
    reviewed: counts.reviewed,
    fullyUseful: counts.fullyUsefulHandling,
    fullySuccessfulAnswerables: counts.fullySuccessfulAnswerables,
    report: "docs/CHATBOT_ACCURACY_AUDIT.md",
  }),
);
