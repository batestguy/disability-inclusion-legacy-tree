import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildDashboardView, normalizeDashboardFilters, exportActivitiesCsv, exportObservationsCsv } from "../apps/web/lib/dashboard-data.mjs";
const bundle = JSON.parse(readFileSync(new URL("../content/dashboard/v1/bundle.json", import.meta.url)));
const view = (filters, b = bundle) => buildDashboardView(b, filters);
const clone = () => structuredClone(bundle);

test("baseline distinguishes activity, typed measure, citation catalogue and canonical text grains", () => {
  const v = view();
  assert.deepEqual(v.inventory, { activities: 33, reportedFigures: 8, targets: 3, citations: 36 });
  assert.equal(v.observations.length, 11);
  assert.equal(bundle.sources.length, 37);
  // State House appointment citation is catalogued but never attached to an activity.
  assert.deepEqual(bundle.sources.filter((s) => !v.sourceIds.includes(s.id)).map((s) => s.id), ["appointment"]);
  assert.equal(v.modelDocumentCount, 30);
  assert.equal(v.modelledDocumentCount, 30);
  assert.deepEqual(v.canonicalReportYears, [{ year: "2023", count: 10 }, { year: "2024", count: 7 }, { year: "2025", count: 10 }, { year: "2026", count: 3 }]);
  assert.equal(v.relationships.length, 9);
  assert.equal(v.entities.length, 46);
  assert.equal(v.coOccurrences.length, 257);
  assert.equal(v.entities.reduce((n, e) => n + e.mentions, 0), 149);
  assert.deepEqual(v.activities.map((a) => a.report_date), v.activities.map((a) => a.report_date).sort().reverse());
  assert.ok(v.activities.every((a) => bundle.activities.includes(a)));
  assert.ok(v.observations.every((o) => bundle.observations.includes(o)));
});

test("filters AND activity report year, multilabel category and activity identity", () => {
  const v = view({ year: "2024" });
  assert.equal(v.activities.length, 10);
  assert.equal(v.modelDocumentCount, 7);
  assert.equal(v.timeline.find((t) => t.year === "2024").count, 10);
  const a = bundle.activities.find((a) => a.categories.length > 1 && a.report_date.startsWith("2024"));
  for (const category of a.categories) {
    assert.deepEqual(view({ year: "2024", category, activity: a.id }).activities.map((a) => a.id), [a.id]);
  }
  assert.equal(view({ year: "2023", activity: a.id }).activities.length, 0);
  const incompatible = bundle.categories.find((c) => !a.categories.includes(c.id));
  assert.equal(view({ category: incompatible.id, activity: a.id }).activities.length, 0);
  assert.ok(view().categories.reduce((n, c) => n + c.count, 0) > 33);
});

test("follow-up citations survive activity-year selection but model texts still obey publication year", () => {
  // Current follow-ups stay in the same publication year; vary a copy to guard future updates.
  const b = clone();
  const a = b.activities.find((a) => a.id === "inclusive-business-skills");
  const d = b.model_documents.find((d) => a.source_ids.includes(d.source_id));
  assert.ok(d);
  d.publication_date = "2025-01-02";
  b.sources.find((s) => s.id === d.source_id).date = d.publication_date;
  const v = view({ activity: a.id, year: a.report_date.slice(0, 4) }, b);
  assert.deepEqual(v.sourceIds, a.source_ids);
  const later = v.sources.filter((s) => !s.date.startsWith(v.filters.year));
  assert.ok(later.length > 0);
  assert.equal(v.canonicalReportYears.filter((y) => y.year !== v.filters.year).reduce((n, y) => n + y.count, 0), 0);
});

test("qualitative records and empty matches have missing observations, never invented zero outcomes", () => {
  const qualitative = bundle.activities.find((a) => !a.observation_ids.length);
  const v = view({ activity: qualitative.id });
  assert.equal(v.activities.length, 1);
  assert.deepEqual(v.observations, []);
  const empty = view({ activity: "karu-food-cash-2024", year: "2023" });
  assert.deepEqual(empty.observations, []);
  assert.equal(empty.modelDocumentCount, 0);
  assert.ok(empty.topics.every((t) => t.meanShare === null));
  assert.deepEqual(empty.relationships, []);
  assert.deepEqual(empty.coOccurrences, []);
  assert.deepEqual(empty.entities, []);
  assert.equal(exportObservationsCsv(empty).split("\r\n").length, 2);
});

test("Karu measures retain distinct bounds, units, populations and stages", () => {
  const v = view({ activity: "karu-food-cash-2024" });
  assert.deepEqual(v.observations.map((o) => [o.value, o.bound, o.unit, o.stage]), [[500, "greater-than", "people", "reported-delivery"], [500, "at-least", "households", "target"]]);
  assert.notEqual(v.observations[0].population, v.observations[1].population);
  assert.equal(v.inventory.reportedFigures, 1);
  assert.equal(v.inventory.targets, 1);
  assert.ok(!("beneficiaries" in v.inventory));
});

test("invalid filters normalize safely without resetting valid but incompatible AND constraints", () => {
  assert.deepEqual(normalizeDashboardFilters(bundle, null), { year: "all", category: "all", activity: "all" });
  assert.deepEqual(normalizeDashboardFilters(bundle, { year: "2099", category: "__proto__", activity: [] }), { year: "all", category: "all", activity: "all" });
  assert.deepEqual(view({ year: "2023", activity: "karu-food-cash-2024" }).filters, { year: "2023", category: "all", activity: "karu-food-cash-2024" });
});

test("topic means use selected saved weights including topic zeros but exclude whole zero vectors", () => {
  const v = view({ year: "2024" });
  const docs = bundle.model_documents.filter((d) => d.publication_date.startsWith("2024"));
  for (const [i, t] of v.topics.entries()) {
    assert.equal(t.modelledDocumentCount, docs.length);
    assert.equal(t.meanShare, docs.reduce((n, d) => n + d.topic_shares[i], 0) / docs.length);
    assert.ok(t.representativeSourceIds.every((id) => docs.some((d) => d.source_id === id)));
  }
  const b = clone();
  b.model_documents[0].topic_shares.fill(0);
  const z = view({}, b);
  assert.equal(z.modelDocumentCount, 30);
  assert.equal(z.modelledDocumentCount, 29);
  for (const [i, t] of z.topics.entries()) assert.equal(t.meanShare, b.model_documents.slice(1).reduce((n, d) => n + d.topic_shares[i], 0) / 29);
});

test("source aliases collapse to one document and network supports count selected documents", () => {
  const b = clone();
  const a = b.activities.find((a) => a.source_ids.includes("1243"));
  const alias = b.sources.find((s) => s.id === "1245");
  assert.ok(alias);
  a.source_ids = ["1245"];
  const v = view({ activity: a.id }, b);
  assert.equal(v.modelDocumentCount, 1);
  assert.ok(v.topics.some((t) => t.meanShare > 0));
  const selected = view({ activity: "karu-food-cash-2024" });
  for (const edge of selected.coOccurrences) {
    assert.deepEqual(edge.source_ids, ["2790"]);
    assert.equal(edge.supporting_unique_documents, 1);
    assert.equal(edge.is_partnership, false);
  }
  const all = view();
  assert.ok(all.coOccurrences.some((edge) => edge.supporting_unique_documents > 1));
  assert.ok(selected.coOccurrences.length < all.coOccurrences.length);
});

// Small RFC4180 reader so quoted commas, quotes and newlines are verified as cells.
function readCsv(text) {
  const rows = []; let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') { if (quoted && text[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted; }
    else if (c === "," && !quoted) { row.push(cell); cell = ""; }
    else if (c === "\r" && text[i + 1] === "\n" && !quoted) { row.push(cell); rows.push(row); row = []; cell = ""; i++; }
    else cell += c;
  }
  return rows;
}

test("CSV exports exactly selected records and source URLs with correct dimensions and safe text cells", () => {
  const v = view({ activity: "karu-food-cash-2024" });
  const [headers, ...rows] = readCsv(exportObservationsCsv(v));
  assert.equal(rows.length, 2);
  const records = rows.map((row) => Object.fromEntries(headers.map((h, i) => [h, row[i]])));
  for (const [i, r] of records.entries()) {
    const o = v.observations[i];
    assert.equal(r.observation_id, o.id);
    assert.equal(r.value, String(o.value));
    assert.equal(r.bound, o.bound); assert.equal(r.unit, o.unit); assert.equal(r.stage, o.stage);
    assert.equal(r.date_basis, o.date_basis);
    assert.ok(r.source_urls.includes(v.sources[0].url));
  }
  const activityRows = readCsv(exportActivitiesCsv(v));
  assert.equal(activityRows.length, 2);
  const typed = JSON.parse(activityRows[1][activityRows[0].indexOf("typed_observations_json")]);
  assert.deepEqual(typed.map((o) => [o.bound, o.unit, o.stage]), [["greater-than", "people", "reported-delivery"], ["at-least", "households", "target"]]);
  const b = clone();
  b.activities[0].title.en = ' =HYPERLINK("bad"),\r\nunsafe';
  b.activities[0].isa_role = "\t@unsafe";
  const safe = view({ activity: b.activities[0].id }, b);
  const [h, r] = readCsv(exportActivitiesCsv(safe));
  assert.equal(r[h.indexOf("title_en")], `'${b.activities[0].title.en}`);
  assert.equal(r[h.indexOf("isa_role")], `'${b.activities[0].isa_role}`);
  assert.match(exportObservationsCsv(v), /,500,/);
});

test("broken references fail closed and selections do not mutate the frozen bundle", () => {
  const before = JSON.stringify(bundle);
  view({ year: "2024", category: "livelihoods" });
  assert.equal(JSON.stringify(bundle), before);
  for (const mutate of [
    (b) => { b.activities[0].source_ids.push("missing"); },
    (b) => { b.observations[0].activity_id = "missing"; },
    (b) => { b.activities[0].observation_ids.push("missing"); },
    (b) => { b.observations[0].bound = "at-most"; },
    (b) => { b.model_documents[0].topic_shares[0] = NaN; },
    (b) => { b.partnerships[0].evidence.source_id = "missing"; },
    (b) => { b.co_occurrences[0].entity_ids.push("missing"); },
    (b) => { b.sources[0].url = "javascript:bad"; },
  ]) { const b = clone(); mutate(b); assert.throws(() => view({}, b), TypeError); }
});
