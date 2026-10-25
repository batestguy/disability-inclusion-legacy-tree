import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  answerQuestion,
  renderAnswer,
  validateAnswer,
  suggestedQuestions,
  createReceipt,
} from "../apps/web/lib/chat-engine.mjs";

const raw = readFileSync(
  new URL("../content/dashboard/v1/bundle.json", import.meta.url),
);
const bundle = JSON.parse(raw);
const manifest = JSON.parse(
  readFileSync(
    new URL("../content/dashboard/v1/manifest.json", import.meta.url),
  ),
);
const clone = (value) => JSON.parse(JSON.stringify(value));
const ask = (q, context) => answerQuestion(bundle, q, context);

test("natural women-focused questions produce equivalent sourced bilingual summaries", () => {
  const canonical = ask("what has he done for disabled women?");
  assert.equal(canonical.status, "answered");
  assert.equal(canonical.kind, "summary");
  assert.ok(
    canonical.claims.every((claim) =>
      claim.population.startsWith("Women with disabilities"),
    ),
  );
  for (const question of [
    "What has he done for women with disabilities?",
    "What did Abba Isa do for disabled women?",
    "How has he supported women with disabilities?",
    "Tell me about his work for disabled women",
    "Me ya yi wa mata masu nakasa?",
    "Me Abba Isa ya yi ga mata masu nakasa?",
    "Ta yaya ya tallafa wa mata masu nakasa?",
    "Wane tallafi ya bayar ga mata masu nakasa?",
  ]) {
    const answer = ask(question);
    assert.equal(answer.status, "answered", question);
    assert.deepEqual(answer.plan, canonical.plan, question);
    assert.deepEqual(answer.claims, canonical.claims, question);
    assert.deepEqual(answer.sourceIds, canonical.sourceIds, question);
    assert.equal(validateAnswer(bundle, answer), true);
  }
  assert.deepEqual(
    canonical.claims.map((c) => [c.value, c.bound, c.stage]),
    [
      [45, "greater-than", "reported-delivery"],
      [20, "greater-than", "reported-delivery"],
    ],
  );
  assert.deepEqual(
    new Set(canonical.sourceIds),
    new Set(["3531", "2279", "anniversary-2024"]),
  );
  for (const lang of ["en", "ha"]) {
    const rendered = renderAnswer(canonical, lang);
    assert.equal(rendered.items.length, 2);
    assert.match(rendered.items[0].text, /45/);
    assert.match(rendered.items[1].text, /20/);
    assert.doesNotMatch(
      rendered.text +
        rendered.detail +
        rendered.items.map((i) => i.text).join(" "),
      /\b65\b/,
    );
    assert.equal(rendered.draft, lang === "ha");
  }
  assert.match(renderAnswer(canonical).detail, /overlap.*unknown/);
  assert.match(
    renderAnswer(canonical).detail,
    /income or employment.*not established/,
  );
  const altered = clone(canonical);
  altered.claims[0].value = 65;
  assert.equal(validateAnswer(bundle, altered), false);
});

test("women summaries honour report-year context and never discard additional filters", () => {
  const question = "What has he done for disabled women?";
  const first = ask(question, { programme: "smedan" });
  assert.equal(first.kind, "summary");
  assert.equal(first.context.programme, undefined);
  const active = ask(question, { reportYear: 2024 });
  assert.equal(active.claims.length, 2);
  const empty = ask(question, { reportYear: 2025 });
  assert.equal(empty.reason, "no-matches");
  assert.deepEqual(empty.claims, []);
  assert.match(renderAnswer(empty).text, /does not establish/);
  const explicit = ask(
    "What has he done for disabled women reported in 2024?",
    { reportYear: 2025 },
  );
  assert.equal(explicit.claims.length, 2);
  const follow = ask("And in 2024?", empty.context);
  assert.equal(follow.kind, "summary");
  assert.equal(follow.claims.length, 2);
  const ambiguous = ask("And which year was that reported?", first.context);
  assert.equal(ambiguous.status, "clarification");
  assert.equal(ambiguous.choices.length, 2);
  for (const question of [
    "What has he done for disabled women in Kano?",
    "What has he done for disabled women under 18?",
    "What has he done for disabled women with visual impairments?",
    "What has he done for disabled women except training?",
    "What has he done for disabled women in 2023 and 2024?",
    "Me ya yi wa mata masu nakasa a Kano?",
    "And in 2024 in Kano?",
  ]) {
    const answer = ask(question, first.context);
    assert.notEqual(answer.status, "answered", question);
    assert.deepEqual(answer.claims, [], question);
  }
});

test("women summaries require source-specific population and outcome evidence", () => {
  for (const mutate of [
    (o) => {
      o.evidence = o.evidence.filter((e) => e.source_id !== "2279");
    },
    (o) => {
      o.evidence.find((e) => e.source_id === "2279").population =
        "Mixed cohort";
    },
    (o) => {
      o.evidence.find((e) => e.source_id === "2279").stage = "target";
    },
    (o) => {
      o.bound = "exact";
    },
    (o) => {
      o.value = 65;
    },
  ]) {
    const changed = clone(bundle);
    mutate(
      changed.observations.find(
        (o) => o.activity_id === "startup-support-march-2024",
      ),
    );
    const answer = answerQuestion(
      changed,
      "What has he done for disabled women?",
    );
    assert.equal(answer.status, "error");
    assert.deepEqual(answer.claims, []);
  }
});

test("fixture identity matches the independently committed manifest; no runtime attestation is claimed", () => {
  assert.equal(
    createHash("sha256").update(raw).digest("hex"),
    manifest.bundle_sha256,
  );
  assert.equal(bundle.activities.length, 33);
  assert.equal(bundle.observations.length, 11);
  assert.equal(bundle.status, "reviewed-subset-preview-not-public-approved");
});

test("English/Hausa semantic pairs select equivalent complete plans, claims and evidence", () => {
  const pairs = [
    ["How many activities are documented?", "Ayyuka nawa aka rubuta?"],
    ["Show activities reported in 2024", "Nuna ayyuka a shekarar rahoto 2024"],
    [
      "How many SMEDAN participants were supported?",
      "Mutane nawa SMEDAN ta tallafa wa?",
    ],
    [
      "How many women received NIGWED training?",
      "Mata nawa suka samu horon NIGWED?",
    ],
    ["How many startup recipients?", "Mutane nawa suka samu tallafin startup?"],
    ["How many Borno placements?", "Mutane nawa suka samu aikin yi a Borno?"],
    ["Were 36,551 jobs delivered?", "An samar da ayyukan yi 36,551?"],
    [
      "How many unique people benefited overall?",
      "Mutane daban daban nawa suka amfana gaba daya?",
    ],
    ["find: SMEDAN", "nemo: SMEDAN"],
    ["Show categories", "Nuna rukunai"],
  ];
  for (const [en, ha] of pairs) {
    const a = ask(en);
    const b = ask(ha);
    assert.equal(a.status, b.status, `${en} / ${ha}`);
    assert.notEqual(a.status, "clarification", ha);
    assert.deepEqual(a.plan, b.plan, ha);
    assert.deepEqual(a.claims, b.claims, ha);
    assert.deepEqual(a.sourceIds, b.sourceIds, ha);
    if (a.status === "answered")
      assert.equal(validateAnswer(bundle, a), true, en);
  }
});

test("single measurements preserve bound, population, stage and office attribution", () => {
  for (const [question, value, bound, stage] of [
    ["SMEDAN", 5, "exact", "reported-delivery"],
    ["NIGWED", 45, "greater-than", "reported-delivery"],
    ["startup", 20, "greater-than", "reported-delivery"],
    ["Borno", 15, "exact", "reported-delivery"],
    ["Beyond Disability", 36551, "exact", "target"],
  ]) {
    const a = ask(question);
    const c = a.claims[0];
    assert.equal(a.status, "answered", question);
    assert.equal(c.value, value);
    assert.equal(c.bound, bound);
    assert.equal(c.stage, stage);
    assert.ok(c.population);
    assert.ok(c.attribution);
    assert.equal(c.dateBasis, "reportDate");
    assert.ok(c.reportDate);
    assert.ok(c.evidenceDateBasis);
    assert.ok(c.limitations.length);
    assert.ok(c.sourceIds.length);
    assert.ok(c.activityIds.length);
    assert.ok(c.observationIds.length);
    assert.equal(validateAnswer(bundle, a), true);
  }
  assert.match(renderAnswer(ask("NIGWED")).text, /more than 45/);
  assert.match(
    renderAnswer(ask("Were 36,551 jobs delivered?")).text,
    /target.*delivery.*not established/,
  );
  assert.match(renderAnswer(ask("SMEDAN")).detail, /one cohort/);
});

test("count and list use distinct activities and canonical report dates, including honest empty results", () => {
  for (const year of [2023, 2024, 2025, 2026, 2020]) {
    const expected = bundle.activities.filter((a) =>
      a.report_date.startsWith(String(year)),
    );
    const count = ask(`How many activities were reported in ${year}?`);
    const list = ask(`List documented activities from ${year}`);
    assert.equal(count.status, "answered");
    assert.equal(list.status, "answered");
    assert.equal(count.claims[0].value, expected.length);
    assert.equal(list.items.length, expected.length);
    assert.deepEqual(
      count.activityIds,
      expected.map((a) => a.id),
    );
    assert.equal(new Set(count.activityIds).size, count.activityIds.length);
    if (!expected.length)
      assert.match(renderAnswer(count).detail, /does not establish zero/);
  }
  assert.equal(ask("How many activities?").claims[0].value, 33);
});

test("explicit report-year UI context persists and explicit years override it", () => {
  const context = { reportYear: 2025 };
  assert.equal(ask("How many activities?", context).plan.reportYear, 2025);
  assert.equal(
    ask("How many activities in 2024?", context).plan.reportYear,
    2024,
  );
  assert.equal(ask("SMEDAN", context).reason, "year-mismatch");
  assert.equal(ask("Show categories", context).reason, "year-global");
  assert.equal(ask("Explain methodology", context).reason, "year-global");
  assert.equal(ask("find: SMEDAN", context).plan.reportYear, 2025);
});

test("programme/year followups retain supported context and unrelated questions do not inherit a programme", () => {
  const initial = ask("How many SMEDAN participants were supported?");
  const en = ask("And which year was that reported?", initial.context);
  const ha = ask(
    "Kuma wace shekara aka bayar da wannan rahoto?",
    initial.context,
  );
  assert.equal(en.kind, "report-year");
  assert.equal(en.claims[0].value, 2024);
  assert.deepEqual(en.plan, ha.plan);
  assert.deepEqual(en.claims, ha.claims);
  assert.equal(ask("And in 2025?", initial.context).reason, "year-mismatch");
  assert.equal(ask("How many activities?", initial.context).kind, "count");
  const list = ask("Show activities in 2023");
  assert.equal(ask("What about 2024?", list.context).plan.reportYear, 2024);
  assert.deepEqual(ask("Start again", initial.context).context, {});
  assert.equal(
    ask("And which year was that reported?").status,
    "clarification",
  );
});

test("paraphrases, code switching, casing and explicit aliases have deterministic support", () => {
  const groups = [
    [
      "How many SMEDAN participants?",
      "Mutane nawa smedan ta tallafa wa?",
      "SMEDAN",
    ],
    [
      "How many NIGWED women were trained?",
      "Mata nawa suka samu horon nig wed?",
      "NIGWED",
    ],
    [
      "How many startup recipients?",
      "How many start-up recipients?",
      "Mutane nawa suka samu tallafin startup?",
    ],
    [
      "Were 36,551 jobs delivered?",
      "Were 36 551 jobs delivered?",
      "What is the Beyond Disability target?",
    ],
  ];
  for (const questions of groups) {
    const expected = ask(questions[0]);
    for (const question of questions) {
      const answer = ask(question);
      assert.equal(answer.status, "answered", question);
      assert.deepEqual(answer.plan, expected.plan, question);
      assert.deepEqual(answer.claims, expected.claims, question);
    }
  }
});

test("count/list year followups accept only a bare report year and never discard another filter", () => {
  for (const initial of [
    "How many activities in 2023?",
    "Show activities reported in 2023",
  ]) {
    const context = ask(initial).context;
    for (const question of [
      "What about 2024?",
      "And in 2024?",
      "2024",
      "Kuma a 2024?",
      "Kuma a shekarar rahoto 2024?",
    ]) {
      const a = ask(question, context);
      assert.equal(a.status, "answered", `${initial} -> ${question}`);
      assert.equal(a.kind, context.intent);
      assert.equal(a.plan.reportYear, 2024);
      assert.equal(a.claims[0].value, 10);
    }
    for (const question of [
      "What about 2024 in Kano?",
      "And in 2024 for women?",
      "And 2024 sources?",
      "What about 2024 training?",
      "Kuma a 2024 a Kano?",
      "Kuma a 2024 ga mata?",
      "Kuma a 2024 horo?",
      "What about 2024 placements?",
      "How about 2024 organisations?",
      "And 2024 households?",
      "And 2024 target?",
    ]) {
      const a = ask(question, context);
      assert.equal(a.status, "clarification", `${initial} -> ${question}`);
      assert.equal(a.plan, null);
      assert.deepEqual(a.claims, []);
      assert.deepEqual(a.context, context);
    }
  }
});

test("programme-specific training, employment, assets and demographics cannot reuse a broader cohort count", () => {
  const rejected = [
    ["How many startup recipients were trained?", "stage"],
    ["How many Borno recipients received kits?", "stage"],
    ["How many NIGWED recipients received kits?", "stage"],
    ["How many startup recipients received equipment?", "stage"],
    ["How many NIGWED placements?", "stage"],
    ["How many startup placements?", "stage"],
    ["Mutane nawa suka samu horon startup?", "stage"],
    ["Mutane nawa Borno suka samu kayayyaki?", "stage"],
    ["Mutane nawa NIGWED suka samu kayayyaki?", "stage"],
    ["Mutane nawa startup suka samu aikin yi?", "stage"],
    ["How many startup women?", "population"],
    ["Mata nawa suka samu tallafin startup?", "population"],
  ];
  for (const [question, reason] of rejected) {
    const a = ask(question);
    assert.equal(a.status, "unsupported", question);
    assert.equal(a.reason, reason, question);
    assert.equal(a.plan, null);
    assert.deepEqual(a.claims, []);
    assert.ok(renderAnswer(a, "en").text);
    assert.ok(renderAnswer(a, "ha").text);
  }
  for (const question of [
    "How many SMEDAN participants were trained?",
    "How many SMEDAN participants received kits?",
    "How many women received NIGWED training?",
    "How many startup recipients?",
    "How many Borno placements?",
  ]) {
    assert.equal(ask(question).status, "answered", question);
  }
  // The same outcome restrictions also apply when the programme is inherited.
  for (const [initial, followup] of [
    ["startup", "And how many recipients were trained?"],
    ["Borno", "And how many recipients received kits?"],
    ["NIGWED", "And how many placements?"],
  ]) {
    assert.equal(
      ask(followup, ask(initial).context).status,
      "unsupported",
      `${initial} -> ${followup}`,
    );
  }
});

test("ambiguous programme, temporal and exclusion prompts clarify without executing claims", () => {
  for (const question of [
    "How many SMEDAN and NIGWED participants?",
    "How many activities in 2023 or 2024?",
    "How many activities reported last year?",
    "How many activities this year?",
    "How many activities except meetings?",
    "How many people were not supported by SMEDAN?",
    "SMEDAN ba ta tallafa wa mutane nawa?",
    "How many training participants?",
  ]) {
    const a = ask(question);
    assert.equal(a.status, "clarification", question);
    assert.equal(a.plan, null);
    assert.equal(a.claims.length, 0);
    assert.ok(a.choices.length);
  }
});

test("wrong unit, stage, population, geography and unsupported counting grains never answer a matching number", () => {
  for (const question of [
    "How many SMEDAN activities?",
    "How many SMEDAN sources?",
    "How many SMEDAN organisations?",
    "How many SMEDAN participants in Kano?",
    "How many SMEDAN women?",
    "How many Borno women?",
    "How many Borno children?",
    "How many NIGWED men?",
    "How many NIGWED pads?",
    "How many SMEDAN kits?",
    "How many SMEDAN households?",
    "How many jobs did NIGWED create?",
    "How many Borno trainees?",
    "What is the startup target?",
    "What percentage of Beyond Disability jobs were delivered?",
    "How many Beyond Disability people were supported?",
    "How many activities in Borno?",
    "How many activities about health?",
    "How many NIGWED farmers?",
  ]) {
    const a = ask(question);
    assert.notEqual(a.status, "answered", question);
    assert.equal(a.claims.length, 0, question);
  }
});

test("unsupported totals, money, causal claims and event dates have explicit outcomes in both languages", () => {
  for (const [question, reason] of [
    ["How many unique people benefited overall?", "unique-people"],
    ["Jimillar mutane nawa?", "unique-people"],
    ["How much money was spent?", "money"],
    ["Kudi nawa aka kashe?", "money"],
    ["What impact did SMEDAN cause?", "causality"],
    ["Shin ya rage talauci?", "causality"],
    ["What was the event date for SMEDAN?", "event-date"],
    ["Shekarar da aka gudanar da SMEDAN?", "event-date"],
  ]) {
    const a = ask(question);
    assert.equal(a.status, "unsupported", question);
    assert.equal(a.reason, reason);
    assert.ok(renderAnswer(a, "en").text);
    assert.ok(renderAnswer(a, "ha").text);
    assert.equal(a.claims.length, 0);
  }
});

test("explicit keyword/source lookup wins over named programme and retains resolvable evidence", () => {
  for (const q of [
    "find: SMEDAN",
    "nemo: SMEDAN",
    "source: 3531",
    "find: Abuja",
  ]) {
    const a = ask(q);
    assert.equal(a.kind, "lookup", q);
    assert.equal(a.status, "answered");
    assert.ok(a.items.length);
    assert.ok(a.sourceIds.length);
    assert.equal(validateAnswer(bundle, a), true);
    assert.ok(a.sources.every((s) => /^https:\/\//.test(s.url)));
  }
  const noMatch = ask("find: nonexistentphrase");
  assert.equal(noMatch.reason, "no-matches");
  assert.equal(noMatch.items.length, 0);
  assert.match(renderAnswer(noMatch).text, /not evidence/);
});

test("catalogues and method explanations do not turn text themes or co-occurrence into impact claims", () => {
  for (const q of [
    "Show categories",
    "Show topics",
    "Show organisations",
    "Show places",
    "Show connections",
  ]) {
    const a = ask(q);
    assert.equal(a.status, "answered", q);
    assert.equal(a.kind, "catalogue");
    assert.equal(a.claims.length, 0);
    assert.ok(a.items.length);
    assert.equal(validateAnswer(bundle, a), true);
  }
  const connections = ask("Show connections");
  assert.ok(
    connections.items.every(
      (item) =>
        item.label.en.includes(" / ") &&
        item.sourceIds.length &&
        item.reportDate &&
        item.evidence,
    ),
  );
  assert.match(renderAnswer(connections).detail, /intentions/);
  assert.match(
    renderAnswer(ask("Explain the methodology")).text,
    /not impact or truth/,
  );
  assert.match(
    renderAnswer(ask("What does co-occurrence mean?")).text,
    /does not prove partnership/,
  );
  assert.match(
    renderAnswer(ask("Explain the scope")).text,
    /not.*representative|neither.*representative/,
  );
});

test("complete candidate validation rejects altered values and dimensions against unchanged evidence", () => {
  const original = ask("NIGWED");
  for (const [key, value] of Object.entries({
    value: 46,
    bound: "exact",
    unit: "households",
    population: "All Nigerians",
    stage: "target",
    dateBasis: "eventDate",
    attribution: "Independently audited",
    reportDate: "2023-01-01",
    sourceIds: ["smedan"],
  })) {
    const changed = clone(original);
    changed.claims[0][key] = value;
    assert.equal(validateAnswer(bundle, changed), false, key);
  }
  for (const mutate of [
    (a) => {
      a.activityIds = ["inclusive-business-skills"];
    },
    (a) => {
      a.sources[0].url = "https://example.com";
    },
    (a) => {
      a.plan.extra = "ignored filter";
    },
    (a) => {
      a.plan.reportYear = 2025;
    },
    (a) => {
      a.snapshot.version = "v2";
    },
  ]) {
    const changed = clone(original);
    mutate(changed);
    assert.equal(validateAnswer(bundle, changed), false);
  }
});

test("incompatible bundle and broken selected evidence fail closed", () => {
  for (const invalid of [
    null,
    {},
    { ...bundle, schema_version: 2 },
    { ...bundle, status: "public-approved" },
    { ...bundle, activities: [null] },
  ]) {
    assert.equal(
      answerQuestion(invalid, "How many activities?").status,
      "error",
    );
  }
  for (const mutate of [
    (b) => {
      b.observations.find((o) =>
        o.id.startsWith("inclusive-business-skills"),
      ).unit = "households";
    },
    (b) => {
      b.observations.find((o) =>
        o.id.startsWith("inclusive-business-skills"),
      ).stage = "target";
    },
    (b) => {
      b.observations.find((o) =>
        o.id.startsWith("inclusive-business-skills"),
      ).evidence = [];
    },
    (b) => {
      b.observations.find((o) =>
        o.id.startsWith("inclusive-business-skills"),
      ).evidence[0].source_ids = ["missing"];
    },
    (b) => {
      b.activities.find(
        (a) => a.id === "inclusive-business-skills",
      ).observation_ids = [];
    },
  ]) {
    const changed = clone(bundle);
    mutate(changed);
    assert.equal(answerQuestion(changed, "SMEDAN").status, "error");
  }
});

test("receipts carry snapshot and selection while omitting raw questions and literal keywords", () => {
  const a = ask("How many SMEDAN participants?");
  const receipt = createReceipt(a, manifest);
  assert.equal(receipt.bundleSha256, manifest.bundle_sha256);
  assert.equal(receipt.datasetDate, bundle.dataset_date);
  assert.equal(receipt.manifestVersionMatches, true);
  assert.deepEqual(receipt.claims, a.claims);
  assert.doesNotMatch(JSON.stringify(receipt), /How many SMEDAN participants/);
  assert.equal(
    createReceipt(a, { dataset_version: "v2" }).manifestVersionMatches,
    false,
  );
  const keyword = "sensitivevisitorphrase";
  const lookupReceipt = createReceipt(ask(`find: ${keyword}`), manifest);
  assert.doesNotMatch(JSON.stringify(lookupReceipt), new RegExp(keyword));
  assert.equal(lookupReceipt.plan.term, "[omitted]");
});

test("localized renderings preserve structured values and mark Hausa as draft without translating source titles", () => {
  for (const { question } of suggestedQuestions()) {
    const a = ask(question);
    const before = clone(a);
    for (const lang of ["en", "ha"]) {
      const rendered = renderAnswer(a, lang);
      assert.ok(rendered.text);
      assert.ok(rendered.detail);
      assert.equal(rendered.draft, lang === "ha");
      assert.equal(rendered.text.includes("NaN"), false);
    }
    assert.deepEqual(a, before);
  }
  const list = renderAnswer(ask("Show activities reported in 2024"), "ha");
  assert.ok(list.items.some((i) => i.untranslated));
  assert.match(list.detail, /daftari/);
  assert.equal(ask(" ".repeat(5)).status, "clarification");
  assert.equal(ask("x".repeat(1201)).status, "clarification");
});
