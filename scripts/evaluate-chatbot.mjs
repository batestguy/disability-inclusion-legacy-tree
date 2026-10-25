import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { resolve, sep, join } from "node:path";
import { performance } from "node:perf_hooks";
import {
  answerQuestion,
  renderAnswer,
  validateAnswer,
} from "../apps/web/lib/chat-engine.mjs";

const paths = {
  candidates: "research/chat-evaluation-candidates.json",
  selected: "research/chat-evaluation-50.json",
  engine: "apps/web/lib/chat-engine.mjs",
  bundle: "content/dashboard/v1/bundle.json",
};
const sha = (data) => createHash("sha256").update(data).digest("hex");
const originalEngine = await readFile(paths.engine);
const rawBundle = await readFile(paths.bundle);
const bundle = JSON.parse(rawBundle);
const seed = 20261025;
const targets = { answer: 17, clarify: 5, unsupported: 3 };
let state = seed >>> 0;
function random() {
  state ^= state << 13;
  state ^= state >>> 17;
  state ^= state << 5;
  return (state >>> 0) / 4294967296;
}
function shuffled(values) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
let frozen;
if (process.argv.includes("--freeze")) {
  const candidatesRaw = await readFile(paths.candidates);
  const pool = JSON.parse(candidatesRaw);
  assert.equal(pool.candidates.length, 60);
  assert.equal(new Set(pool.candidates.map((c) => c.id)).size, 60);
  const chosen = [];
  for (const lang of ["en", "ha"]) {
    for (const [disposition, count] of Object.entries(targets)) {
      const rows = pool.candidates.filter(
        (c) => c.lang === lang && c.expected.disposition === disposition,
      );
      assert.equal(
        rows.length,
        { answer: 20, clarify: 6, unsupported: 4 }[disposition],
        `${lang}/${disposition} pool`,
      );
      chosen.push(...shuffled(rows).slice(0, count));
    }
  }
  frozen = {
    protocol: "docs/CHATBOT_EVALUATION_PROTOCOL.md",
    seed,
    method:
      "xorshift32/Fisher-Yates; 17 answerable, 5 clarification, 3 unsupported per language; shuffled without replacement",
    frozenAt: new Date().toISOString(),
    engineSha256: sha(originalEngine),
    bundleSha256: sha(rawBundle),
    candidateSha256: sha(candidatesRaw),
    questions: shuffled(chosen),
  };
  // Exclusive creation prevents accidentally replacing a baseline after exposure.
  await writeFile(paths.selected, JSON.stringify(frozen, null, 2) + "\n", {
    flag: "wx",
  });
  console.log(
    `Frozen ${frozen.questions.length} questions before engine execution. Run node scripts/evaluate-chatbot.mjs to evaluate.`,
  );
  process.exit(0);
}
frozen = JSON.parse(await readFile(paths.selected, "utf8"));
assert.equal(frozen.questions.length, 50);
assert.equal(
  frozen.engineSha256,
  sha(originalEngine),
  "Engine changed after baseline freeze; preserve baseline and create a separately versioned audit for fixes.",
);
assert.equal(
  frozen.bundleSha256,
  sha(rawBundle),
  "Dataset changed after freeze",
);
assert.equal(
  frozen.candidateSha256,
  sha(await readFile(paths.candidates)),
  "Candidate pool changed after freeze",
);
const outputArgument = process.argv.indexOf("--output-dir");
assert.ok(
  outputArgument === -1 || process.argv[outputArgument + 1],
  "Supply a new directory after --output-dir",
);
const outputDirectory = resolve(
  outputArgument === -1 ? "output" : process.argv[outputArgument + 1],
);
const outputRoot = resolve("output");
assert.ok(
  outputDirectory === outputRoot ||
    outputDirectory.startsWith(outputRoot + sep),
  "Audit outputs must remain under output/",
);
await mkdir(outputDirectory, { recursive: true });
for (const name of ["chat-evaluation-50.json", "chat-evaluation-50.csv"]) {
  let exists = false;
  try {
    await access(join(outputDirectory, name));
    exists = true;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  assert.equal(
    exists,
    false,
    "Preserve the baseline: use --output-dir output/new-audit-run for re-execution.",
  );
}

const sameSet = (a, b) =>
  JSON.stringify([...new Set(a)].sort()) ===
  JSON.stringify([...new Set(b)].sort());
const concepts = {
  "target-not-delivery": (a, r) =>
    /target/i.test(r.text + " " + r.detail) &&
    /not (?:established|documented)|delivery.*not|not.*deliver/i.test(
      r.text + " " + r.detail,
    ),
  "overlap-no-total": (a, r) =>
    /overlap/i.test(r.text + " " + r.detail) &&
    /unknown|unresolved|unavailable|cannot|not a total|kept separate/i.test(
      r.text + " " + r.detail,
    ),
  "reported-not-independent": (a, r) =>
    /not independent|not an independent|not.*independently|reports are not/i.test(
      r.text + " " + r.detail,
    ),
  "report-not-event": (a, r) =>
    /report|publication/i.test(r.text + " " + r.detail) &&
    /event/i.test(r.text + " " + r.detail),
  "text-not-impact": (a, r) =>
    /text|themes|patterns/i.test(r.text + " " + r.detail) &&
    /not impact|not.*impact|not.*truth/i.test(r.text + " " + r.detail),
  "cooccurrence-not-partnership": (a, r) =>
    /does not prove partnership|not proof of partnership|does not establish.*partnership/i.test(
      r.text + " " + r.detail,
    ),
};
function inspect(test, answer, english) {
  const expected = test.expected;
  const issues = [];
  const desiredStatus = {
    answer: "answered",
    clarify: "clarification",
    unsupported: "unsupported",
  }[expected.disposition];
  const correctiveLimitation =
    expected.disposition === "answer" &&
    expected.kind === "explanation" &&
    expected.requiredConcepts?.includes("overlap-no-total") &&
    answer.status === "unsupported" &&
    concepts["overlap-no-total"](answer, english);
  if (answer.status !== desiredStatus && !correctiveLimitation)
    issues.push(`disposition: expected ${desiredStatus}, got ${answer.status}`);
  if (answer.status === "answered") {
    if (!validateAnswer(bundle, answer))
      issues.push("engine's supplementary structural validation failed");
    if (expected.kind && answer.kind !== expected.kind)
      issues.push(`intent: expected ${expected.kind}, got ${answer.kind}`);
    for (const [field, value] of Object.entries(expected.plan || {})) {
      if (answer.plan?.[field] !== value)
        issues.push(
          `scope ${field}: expected ${JSON.stringify(value)}, got ${JSON.stringify(answer.plan?.[field])}`,
        );
    }
    for (const gold of expected.claims || []) {
      const claim = answer.claims.find((c) =>
        gold.observationId
          ? c.observationIds.includes(gold.observationId)
          : c.value === gold.value && c.unit === gold.unit,
      );
      if (!claim) {
        issues.push(
          `missing expected claim ${gold.observationId || `${gold.value} ${gold.unit}`}`,
        );
        continue;
      }
      for (const field of ["value", "bound", "unit", "stage"]) {
        if (Object.hasOwn(gold, field) && claim[field] !== gold[field])
          issues.push(
            `${field} mismatch for ${gold.observationId || gold.value}`,
          );
      }
      if (
        gold.populationContains &&
        !claim.population
          .toLowerCase()
          .includes(gold.populationContains.toLowerCase())
      )
        issues.push(`population mismatch: ${gold.populationContains}`);
    }
    if (
      expected.activityIds &&
      !sameSet(expected.activityIds, answer.activityIds)
    )
      issues.push("selected activities differ from gold");
    for (const id of expected.sourceIdsInclude || [])
      if (!answer.sourceIds.includes(id))
        issues.push(`missing expected evidence source ${id}`);
    for (const id of answer.sourceIds)
      if (!bundle.sources.some((s) => s.id === id))
        issues.push(`unresolvable asserted source ${id}`);
  }
  for (const concept of expected.requiredConcepts || []) {
    assert.ok(concepts[concept], `Unknown gold concept ${concept}`);
    if (!concepts[concept](answer, english))
      issues.push(`required meaning not recognised: ${concept}`);
  }
  let verdict = "correct-handling";
  if (issues.length) {
    if (answer.status === "answered")
      verdict = "incorrect-answer-or-interpretation";
    else if (
      expected.disposition === "answer" &&
      answer.status === "clarification"
    )
      verdict = "unnecessary-clarification";
    else if (
      expected.disposition === "answer" &&
      answer.status === "unsupported"
    )
      verdict = "excessive-refusal";
    else if (answer.status === "error") verdict = "execution-error";
    else verdict = "wrong-disposition-or-explanation";
  }
  return { verdict, issues };
}
const rows = [];
for (const question of frozen.questions) {
  const started = performance.now();
  const answer = answerQuestion(
    bundle,
    question.question,
    question.context || {},
  );
  const durationMs = performance.now() - started;
  const rendered = renderAnswer(answer, question.lang);
  const english = renderAnswer(answer, "en");
  rows.push({
    ...question,
    actual: answer,
    rendered,
    englishForSemanticReview: english,
    durationMs,
    ...inspect(question, answer, english),
  });
}
function aggregate(rows) {
  const correct = rows.filter((r) => r.verdict === "correct-handling");
  const answerable = rows.filter((r) => r.expected.disposition === "answer");
  const answered = rows.filter((r) => r.actual.status === "answered");
  const correctAnswers = correct.filter((r) => r.actual.status === "answered");
  const successfulAnswers = correct.filter(
    (r) => r.expected.disposition === "answer",
  );
  const unanswerable = rows.filter((r) => r.expected.disposition !== "answer");
  return {
    total: rows.length,
    correctHandling: correct.length,
    correctHandlingRate: correct.length / rows.length,
    answerable: answerable.length,
    successfulAnswers: successfulAnswers.length,
    substantiveCorrectiveLimitations: successfulAnswers.filter(
      (r) => r.actual.status !== "answered",
    ).length,
    answerableSuccessRate: successfulAnswers.length / answerable.length,
    genericClarifications: rows.filter(
      (r) =>
        r.actual.status === "clarification" && r.actual.reason === "question",
    ).length,
    answered: answered.length,
    correctnessAmongAnswered: answered.length
      ? correctAnswers.length / answered.length
      : null,
    incorrectAnswered: answered.filter((r) => r.verdict !== "correct-handling")
      .length,
    unnecessaryClarification: rows.filter(
      (r) => r.verdict === "unnecessary-clarification",
    ).length,
    excessiveRefusal: rows.filter((r) => r.verdict === "excessive-refusal")
      .length,
    unanswerable: unanswerable.length,
    correctUnanswerableHandling: unanswerable.filter(
      (r) => r.verdict === "correct-handling",
    ).length,
    outcomes: Object.fromEntries(
      [...new Set(rows.map((r) => r.verdict))].map((v) => [
        v,
        rows.filter((r) => r.verdict === v).length,
      ]),
    ),
  };
}
assert.equal(
  sha(await readFile(paths.engine)),
  frozen.engineSha256,
  "Engine changed during audit",
);
const result = {
  evaluatedAt: new Date().toISOString(),
  frozenAt: frozen.frozenAt,
  seed: frozen.seed,
  engineSha256: frozen.engineSha256,
  bundleSha256: frozen.bundleSha256,
  candidateSha256: frozen.candidateSha256,
  selectedSha256: sha(await readFile(paths.selected)),
  scoring:
    "Automated independent-gold checks; every reply requires the report's semantic review before final conclusions. No implementation tuning during baseline.",
  overall: aggregate(rows),
  byLanguage: {
    en: aggregate(rows.filter((r) => r.lang === "en")),
    ha: aggregate(rows.filter((r) => r.lang === "ha")),
  },
  latencyMs: {
    median: rows.map((r) => r.durationMs).sort((a, b) => a - b)[25],
    max: Math.max(...rows.map((r) => r.durationMs)),
  },
  rows,
};
await writeFile(
  join(outputDirectory, "chat-evaluation-50.json"),
  JSON.stringify(result, null, 2) + "\n",
  { flag: "wx" },
);
const csvCell = (value) =>
  '"' +
  String(value ?? "")
    .replace(/^[=+@-]/, "'$&")
    .replaceAll('"', '""') +
  '"';
const headers = [
  "id",
  "lang",
  "question",
  "expected",
  "actual",
  "verdict",
  "issues",
  "reply",
];
const csv =
  [
    headers,
    ...rows.map((r) => [
      r.id,
      r.lang,
      r.question,
      r.expected.disposition,
      r.actual.status,
      r.verdict,
      r.issues.join("; "),
      [
        r.rendered.text,
        ...r.rendered.items.map((i) => i.text),
        r.rendered.detail,
      ].join("\n"),
    ]),
  ]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n") + "\r\n";
await writeFile(
  join(outputDirectory, "chat-evaluation-50.csv"),
  "\ufeff" + csv,
  { flag: "wx" },
);
console.log(
  JSON.stringify(
    {
      overall: result.overall,
      byLanguage: result.byLanguage,
      engineSha256: result.engineSha256,
    },
    null,
    2,
  ),
);
