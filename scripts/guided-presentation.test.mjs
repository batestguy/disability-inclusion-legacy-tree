import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getFlowNode } from "../apps/web/lib/guided-flow.mjs";
import { getConciseAnswer, getSourceEvidence, paginate, splitText } from "../apps/web/lib/guided-presentation.mjs";

const bundle = JSON.parse(readFileSync(new URL("../content/dashboard/v1/bundle.json", import.meta.url)));
const node = (id) => getFlowNode(bundle, id);

test("women summary sources resolve stored cohort evidence with its exact role and qualifications", () => {
  const women = node("women");
  assert.equal(women.evidence, undefined);
  const evidence = getSourceEvidence(bundle, women, "3531");
  const original = bundle.observations.find((o) => o.id === "nigwed-skills-2024:trainees").evidence.find((e) => e.source_id === "3531");
  assert.ok(evidence.some((e) => e.text === original.text && e.role === original.isa_role && e.limitations === original.limitations));
  assert.ok(evidence.every((e) => e.sourceId === "3531"));
  assert.deepEqual(getSourceEvidence(bundle, women, "not-a-selected-source"), []);
});

test("direct source evidence retains priority and returned evidence cannot mutate the frozen record", () => {
  const measure = node("measure:nigwed-skills-2024:trainees");
  const original = measure.evidence.filter((e) => e.sourceId === "3531");
  const evidence = getSourceEvidence(bundle, measure, "3531");
  assert.deepEqual(evidence, original);
  evidence[0].text = "changed";
  assert.deepEqual(measure.evidence.filter((e) => e.sourceId === "3531"), original);
  assert.deepEqual(getSourceEvidence(bundle, { ...measure, sourceIds: ["no-stored-extract"], evidence: [] }, "no-stored-extract"), []);
});

test("all 162 reachable nodes have a valid bilingual concise reading surface", () => {
  const visited = new Set();
  const visit = (id) => {
    if (visited.has(id)) return;
    visited.add(id);
    const n = node(id);
    const before = structuredClone(n);
    const answer = getConciseAnswer(n);
    for (const text of [answer.title, ...answer.paragraphs, ...answer.items.flatMap((i) => [i.label, ...(i.meta ? [i.meta] : [])])]) {
      assert.ok(text.en && text.ha, id);
    }
    assert.deepEqual(n, before);
    for (const option of n.options) visit(option.target);
  };
  visit("start");
  assert.equal(visited.size, 162);
  assert.deepEqual(getConciseAnswer(node("start")), { title: node("start").question, paragraphs: [], items: [] });
  for (const id of ["programmes", "timeline", "themes", "categories", "entities"]) {
    assert.deepEqual(getConciseAnswer(node(id)).paragraphs, []);
  }
});

test("women retain two separate bounded cohorts without inventing a combined total", () => {
  const n = node("women");
  const answer = getConciseAnswer(n);
  assert.equal(answer.items.length, 2);
  assert.deepEqual(answer.items.map(({ id, meta }) => ({ id, meta })), n.items.map(({ id, meta }) => ({ id, meta })));
  assert.deepEqual(answer.items.map((i) => i.label), [{ en: "NigWED", ha: "NigWED" }, { en: "Startup support", ha: "Tallafin fara sana’a" }]);
  assert.match(answer.items[0].meta.en, /More than 45/);
  assert.match(answer.items[1].meta.en, /More than 20/);
  assert.match(answer.paragraphs[0].en, /Do not add.*income and employment outcomes are unmeasured/);
  assert.ok(!JSON.stringify(answer).includes("65"));
});

test("figures keep every bound, stage and unit label with the activity-specific qualifier", () => {
  for (const observation of bundle.observations) {
    const n = node(`measure:${observation.id}`);
    const answer = getConciseAnswer(n);
    assert.deepEqual(answer.paragraphs[0], n.paragraphs[0]);
    assert.equal(answer.paragraphs.length, 2);
    assert.ok(!answer.paragraphs[1].en.includes("require the source details"), observation.id);
    assert.deepEqual(n.claims[0].population, observation.population);
  }
  assert.match(getConciseAnswer(node("measure:beyond-disability-coordination-2024:projected-opportunities")).paragraphs[1].en, /not delivered jobs/);
  assert.match(getConciseAnswer(node("measure:borno-employment-2024:placements")).paragraphs[1].en, /not jobs created by Isa alone/);
});

test("activity summaries and original relationship attribution and limitations survive", () => {
  for (const a of bundle.activities) assert.deepEqual(getConciseAnswer(node(`activity:${a.id}`)).paragraphs, node(`activity:${a.id}`).paragraphs.slice(0, 1));
  for (const a of bundle.activities) assert.deepEqual(getConciseAnswer(node(`evidence:${a.id}`)).paragraphs, []);
  for (const p of bundle.partnerships) {
    const answer = getConciseAnswer(node(`relationship:${p.id}`));
    assert.equal(answer.items[0].label.en, p.evidence.text);
    assert.equal(answer.items[1].label.en, p.limitations);
    assert.ok(answer.items.every((i) => i.originalLanguage === "en"));
  }
  assert.match(getConciseAnswer(node(`topic:${bundle.topics[0].id}`)).paragraphs[0].en, /not proof of delivery, impact/);
  assert.match(getConciseAnswer(node("connections")).paragraphs[0].en, /does not establish a partnership/);
  assert.equal(getConciseAnswer(node("scope")).paragraphs.length, 1);
});

test("three-item pagination visits every item once and clamps invalid page positions", () => {
  for (const length of [0, 1, 2, 3, 4, 11, 33, 46]) {
    const items = Array.from({ length }, (_, id) => id);
    const result = paginate(items, 0);
    const collected = Array.from({ length: result.pageCount }, (_, page) => paginate(items, page).items).flat();
    assert.deepEqual(collected, items);
    assert.equal(paginate(items, -3).page, 0);
    assert.equal(paginate(items, 1000).page, result.pageCount - 1);
    assert.equal(paginate(items, NaN).page, 0);
    assert.ok(result.items.length <= 3);
  }
  assert.throws(() => paginate([], 0, 0), TypeError);
});

test("text segmentation roundtrips exact source text, whitespace and long words", () => {
  const texts = ["", "  leading\ntrailing  ", "a".repeat(401), "Ƙarin bayanai\r\n\t  da hujja. ", ...bundle.activities.flatMap((a) => a.evidence.map((e) => e.text))];
  for (const text of texts) {
    for (const max of [1, 17, 400]) {
      const segments = splitText(text, max);
      assert.equal(segments.join(""), text);
      for (const segment of segments) assert.ok(segment.length <= max || /^\S+$|^\s+$/u.test(segment));
    }
  }
  assert.throws(() => splitText("text", 0), TypeError);
});
