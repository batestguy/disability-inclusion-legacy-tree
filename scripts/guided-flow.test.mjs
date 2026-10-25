import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getFlowNode } from "../apps/web/lib/guided-flow.mjs";

const bundle = JSON.parse(readFileSync(new URL("../content/dashboard/v1/bundle.json", import.meta.url)));
const node = (id) => getFlowNode(bundle, id);
const clone = () => structuredClone(bundle);

test("the complete reachable graph resolves, is bilingual, and has no dead ends", () => {
  const visited = new Map();
  const visit = (id) => {
    if (visited.has(id)) return;
    const n = node(id);
    visited.set(id, n);
    assert.equal(n.haReviewed, false);
    for (const text of [n.title, n.question, ...n.paragraphs, ...n.items.flatMap((i) => [i.label, ...(i.meta ? [i.meta] : [])]), ...n.options.flatMap((o) => [o.label, ...(o.description ? [o.description] : [])])]) {
      assert.ok(text.en && text.ha, `${id}: missing bilingual text`);
    }
    for (const sourceId of [...n.sourceIds, ...n.claims.flatMap((c) => c.sourceIds), ...(n.evidence ?? []).map((e) => e.sourceId)]) assert.ok(bundle.sources.some((s) => s.id === sourceId), `${id}: ${sourceId}`);
    assert.ok(n.options.length);
    for (const option of n.options) {
      if (option.target === "start") { assert.equal(n.terminal, true); continue; }
      visit(option.target);
    }
    if (n.terminal) assert.equal(n.options.at(-1).target, "start");
    assert.equal(new Set(n.options.map((o) => o.id)).size, n.options.length);
  };
  visit("start");
  for (const a of bundle.activities) {
    assert.ok(visited.has(`activity:${a.id}`));
    assert.ok(visited.has(`evidence:${a.id}`));
    assert.deepEqual(node(`activity:${a.id}`).record.limitations, a.limitations);
  }
  for (const o of bundle.observations) assert.ok(visited.has(`measure:${o.id}`));
  const leadsToTerminal = (id, seen = new Set()) => {
    if (visited.get(id).terminal) return true;
    if (seen.has(id)) return false;
    const nextSeen = new Set([...seen, id]);
    return visited.get(id).options.some((o) => o.target !== "start" && leadsToTerminal(o.target, nextSeen));
  };
  for (const id of visited.keys()) assert.ok(leadsToTerminal(id), `${id}: no terminal path`);
  assert.equal(visited.size, 162);
});

test("all eleven figures preserve dimensions, bounds, stages and exact evidence references", () => {
  assert.equal(bundle.observations.length, 11);
  for (const o of bundle.observations) {
    const n = node(`measure:${o.id}`);
    const c = n.claims[0];
    for (const key of ["value", "bound", "unit", "population", "stage"]) assert.deepEqual(c[key], o[key]);
    assert.equal(c.reportDate, o.report_date);
    assert.equal(c.evidenceDateBasis, o.date_basis);
    assert.equal(c.attribution, o.isa_role);
    assert.deepEqual(c.limitations, o.limitations);
    assert.deepEqual(c.partners, o.partners);
    assert.deepEqual(c.geography, o.geography);
    assert.deepEqual(c.observationIds, [o.id]);
    for (const e of n.evidence) assert.ok(o.evidence.some((original) => original.text === e.text && (original.source_ids ?? [original.source_id]).includes(e.sourceId)));
    assert.ok(c.sourceIds.length);
  }
  const karu = node("activity:karu-food-cash-2024");
  const karuClaims = karu.options.filter((o) => o.target.startsWith("measure:")).map((o) => node(o.target).claims[0]);
  assert.deepEqual(karuClaims.map((c) => [c.value, c.bound, c.unit, c.stage]), [[500, "greater-than", "people", "reported-delivery"], [500, "at-least", "households", "target"]]);
  assert.equal(node("measure:posts-2790-s9-observation-1").claims[0].bound, "approximate");
  assert.equal(node("measure:beyond-disability-coordination-2024:projected-opportunities").claims[0].stage, "target");
});

test("figure follow-ups retain their activity and compare only separate same-record measures", () => {
  for (const observation of bundle.observations) {
    const n = node(`measure:${observation.id}`);
    assert.ok(n.options.some((o) => o.target === `activity:${observation.activity_id}`));
    assert.ok(n.options.some((o) => o.target === `evidence:${observation.activity_id}`));
    const siblings = bundle.observations.filter((o) => o.activity_id === observation.activity_id && o.id !== observation.id);
    assert.deepEqual(n.options.filter((o) => o.target.startsWith("measure:")).map((o) => o.target), siblings.map((o) => `measure:${o.id}`));
    assert.ok(node(`evidence:${observation.activity_id}`).options.some((o) => o.target === n.id));
  }
  const karuDelivery = node("activity:karu-food-cash-2024").options
    .filter((o) => o.target.startsWith("measure:")).map((o) => node(o.target));
  for (const measure of karuDelivery) {
    const comparison = measure.options.find((o) => o.target.startsWith("measure:"));
    assert.match(comparison.description.en, /separate measure/);
    assert.notEqual(node(comparison.target).claims[0].stage, measure.claims[0].stage);
    assert.notEqual(node(comparison.target).claims[0].unit, measure.claims[0].unit);
  }
});

test("theme, name and relationship follow-ups are bounded and justified only by cited reports", () => {
  const ids = [
    ...bundle.topics.map((t) => `topic:${t.id}`),
    ...bundle.entities.map((e) => `entity:${e.id}`),
    ...bundle.partnerships.map((p) => `relationship:${p.id}`),
  ];
  for (const id of ids) {
    const n = node(id);
    const related = n.options.filter((o) => o.target.startsWith("activity:"));
    const expected = bundle.activities.filter((a) => a.source_ids.some((source) => n.sourceIds.includes(source))).slice(0, 3);
    assert.deepEqual(related.map((o) => o.target), expected.map((a) => `activity:${a.id}`), id);
    assert.ok(related.length <= 3, id);
    for (const option of related) {
      assert.match(option.description.en, /shared reporting does not establish a partnership/);
      assert.ok(node(option.target).sourceIds.some((source) => n.sourceIds.includes(source)), id);
    }
  }
});

test("every activity answers with a substantive bilingual summary and readable stage", () => {
  for (const a of bundle.activities) {
    const n = node(`activity:${a.id}`);
    assert.ok(n.paragraphs[0].en.length > 80, a.id);
    assert.ok(n.paragraphs[0].ha.length > 80, a.id);
    if (a.stage.includes("-")) assert.ok(!n.paragraphs[1].en.includes(a.stage), a.id);
    assert.deepEqual(n.record.role, a.isa_role);
    assert.equal(n.record.stage, a.stage);
  }
  const text = (id) => node(`activity:${id}`).paragraphs[0];
  assert.match(text("disability-readiness-toolkit-2025").en, /Deaf-in-Tech and DataLead Africa produced it/);
  assert.match(text("disability-readiness-toolkit-2025").ha, /Deaf-in-Tech da DataLead Africa ne suka samar/);
  assert.match(text("disability-readiness-toolkit-2025").en, /Lanre Oloyede/);
  const donor = node("activity:assistive-technology-partnership");
  assert.match(donor.paragraphs[0].en, /ECOWAS assistive devices to the National Commission/);
  assert.match(donor.record.role, /ECOWAS donated.*NCPWD received/);
  assert.match(donor.paragraphs[0].ha, /kayan taimako na ECOWAS ga Hukumar/);
  assert.match(text("school-blind-support-2025").en, /with SMEDAN/);
  assert.match(text("school-blind-support-2025").ha, /tare da SMEDAN/);
  assert.match(text("school-blind-support-2025").en, /needs raised, not devices.*delivered/);
  assert.match(text("school-blind-support-2025").ha, /ba kayan da aka tabbatar an bayar ba/);
  assert.match(text("leex-inspirational-award-2023").en, /first announced.*later reported/);
  assert.match(text("rehabilitation-centres-plan-2025").en, /planning, not centres opened/);
});

test("women-focused cohorts stay separate with source-context populations and no invented total", () => {
  const n = node("women");
  assert.deepEqual(n.claims.map((c) => c.value), [45, 20]);
  assert.ok(n.claims.every((c) => c.bound === "greater-than" && /women with disabilities/i.test(c.population)));
  assert.deepEqual(n.claims.map((c) => c.sourceIds), [["3531"], ["2279"]]);
  assert.ok(!JSON.stringify(n).includes("65"));
  assert.match(n.paragraphs[0].en, /Do not add/);
  assert.match(n.paragraphs[0].en, /Income and employment outcomes are unmeasured/);
});

test("publication-year denominators use canonical documents, separately from activity counts", () => {
  for (const [year, count] of [[2023, 10], [2024, 7], [2025, 10], [2026, 3]]) {
    const n = node(`year:${year}`);
    assert.equal(n.claims[0].value, count);
    assert.equal(n.claims[0].reportYear, year);
    assert.equal(n.claims[1].value, bundle.activities.filter((a) => a.report_date.startsWith(String(year))).length);
    assert.match(n.paragraphs[0].en, /Publication year is not an event date/);
  }
});

test("topics, manual categories and dictionary co-occurrences remain distinct from relationship evidence", () => {
  assert.equal(node("categories").options.length, 8);
  assert.equal(node("themes").options.filter((o) => o.target.startsWith("topic:")).length, 8);
  assert.equal(node("entities").options.length, 46);
  assert.match(node("connections").paragraphs[1].en, /257 article co-occurrence edges/);
  assert.equal(node("relationships").options.length, 9);
  assert.deepEqual(Object.fromEntries(["reported-programme-collaboration", "stated-cooperation", "signed-mou-reported"].map((kind) => [kind, bundle.partnerships.filter((p) => p.kind === kind).length])), { "reported-programme-collaboration": 6, "stated-cooperation": 2, "signed-mou-reported": 1 });
  for (const p of bundle.partnerships) {
    const n = node(`relationship:${p.id}`);
    assert.equal(n.evidence[0].text, p.evidence.text);
    assert.equal(n.evidence[0].limitations, p.limitations);
    assert.equal(n.evidence[0].sourceId, p.evidence.source_id);
  }
  assert.match(node("relationship:toolkit-developers").evidence[0].limitations, /not Isa/);
  assert.match(node("relationship:ncpwd-intention").paragraphs[0].en, /intention/);
});

test("unknown nodes and malformed bundles fail closed; returned nodes cannot mutate the bundle", () => {
  for (const id of ["missing", "__proto__", "activity:missing", "year:2027", null]) assert.throws(() => node(id), RangeError);
  for (const mutate of [
    (b) => { b.activities = []; },
    (b) => { b.observations[0].bound = "at-most"; },
    (b) => { b.observations[0].value = NaN; },
    (b) => { b.activities[0].source_ids = ["missing"]; },
    (b) => { b.sources[0].url = "javascript:alert(1)"; },
    (b) => { b.partnerships[0].evidence.source_id = "missing"; },
    (b) => { b.model_documents.push(b.model_documents[0]); },
    (b) => { b.categories[0].label.ha = ""; },
  ]) {
    const b = clone(); mutate(b); assert.throws(() => getFlowNode(b), TypeError);
  }
  assert.throws(() => getFlowNode(null), TypeError);
  const n = node("activity:nigwed-skills-2024");
  n.record.limitations.push("mutation"); n.title.en = "mutation";
  assert.notEqual(node(n.id).title.en, "mutation");
  assert.ok(!node(n.id).record.limitations.includes("mutation"));
});
