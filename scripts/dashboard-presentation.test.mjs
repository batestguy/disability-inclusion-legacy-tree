import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { buildDashboardPresentation } from "../apps/web/lib/dashboard-presentation.mjs";
const root = new URL("../", import.meta.url);
const bundleBytes = readFileSync(new URL("content/dashboard/v1/bundle.json", root));
const bundle = JSON.parse(bundleBytes);
const supplement = JSON.parse(readFileSync(new URL("content/dashboard/presentation.json", root), "utf8"));
const clone = () => structuredClone(bundle);

test("frozen evidence stays byte-identical and every original observation retains its dimensions", () => {
  assert.equal(createHash("sha256").update(bundleBytes).digest("hex"), "166d42785cf3a12256c0207399d3d6cd5c4facaa0d7a75116a0feb181ea62db2");
  const before = JSON.stringify(bundle), result = buildDashboardPresentation(bundle);
  assert.equal(JSON.stringify(bundle), before);
  assert.equal(result.figures.length, 13);
  assert.equal(result.figures.filter((f) => f.kind === "observation").length, 11);
  for (const o of bundle.observations) {
    const f = result.figures.find((f) => f.id === o.id);
    for (const field of ["value", "bound", "unit", "stage", "population"]) assert.equal(f[field], o[field]);
    assert.equal(f.activityId, o.activity_id);
    assert.deepEqual(f.limitations, o.limitations);
    assert.ok(f.sourceIds.every((id) => bundle.sources.some((s) => s.id === id)));
    assert.ok(f.groupIds.includes("all"));
  }
  result.figures[0].limitations.push("caller mutation");
  result.groups[0].activityIds.pop();
  assert.equal(buildDashboardPresentation(bundle).groups[0].activityIds.length, 33);
  assert.equal(JSON.stringify(bundle), before);
});

test("groups preserve catalogue unions, overlap, targets and the full All inventory", () => {
  const result = buildDashboardPresentation(bundle);
  const group = (id) => result.groups.find((g) => g.id === id);
  assert.equal(group("all").activityIds.length, 33);
  assert.equal(new Set(group("all").activityIds).size, 33);
  for (const [id, categories] of [["health-welfare", ["healthcare-welfare"]], ["training-education", ["education-training"]], ["accessibility", ["policy-accessibility", "digital-assistive-technology"]]]) {
    assert.deepEqual(group(id).activityIds, bundle.activities.filter((a) => a.categories.some((c) => categories.includes(c))).map((a) => a.id));
  }
  const nigwed = result.figures.find((f) => f.activityId === "nigwed-skills-2024");
  assert.ok(["all", "health-welfare", "training-education", "enterprise-support"].every((id) => nigwed.groupIds.includes(id)));
  const welfare = result.figures.filter((f) => f.groupIds.includes("health-welfare"));
  assert.equal(welfare.filter((f) => f.stage === "target").length, 2);
  assert.ok(welfare.some((f) => f.value === 500 && f.unit === "households" && f.bound === "at-least"));
  assert.ok(welfare.some((f) => f.value === 1000 && f.bound === "approximate"));
  assert.equal(result.figures.filter((f) => f.activityId === "inclusive-business-skills").length, 1);
});

test("enterprise support selects evidenced enterprise initiatives without relabelling every livelihood", () => {
  const result = buildDashboardPresentation(bundle);
  const enterprise = result.groups.find((g) => g.id === "enterprise-support");
  assert.deepEqual([...enterprise.activityIds].sort(), ["inclusive-business-skills", "nigwed-skills-2024", "fha-stalls-2025", "startup-support-march-2024"].sort());
  for (const id of ["borno-employment-2024", "beyond-disability-coordination-2024", "digital-employment-roundtable-2025", "disability-readiness-toolkit-2025", "adapted-vehicle-presentation-2026", "veterans-mou-2024"]) {
    assert.equal(enterprise.activityIds.includes(id), false);
    assert.ok(bundle.activities.find((a) => a.id === id).categories.includes("livelihoods"));
    assert.ok(result.groups.find((g) => g.id === "all").activityIds.includes(id));
  }
  const smedan = result.figures.find((f) => f.activityId === "inclusive-business-skills");
  assert.ok(smedan.groupIds.includes("training-education") && smedan.groupIds.includes("enterprise-support"));
  const nigwed = result.figures.find((f) => f.activityId === "nigwed-skills-2024");
  assert.ok(["training-education", "health-welfare", "enterprise-support"].every((id) => nigwed.groupIds.includes(id)));
  assert.equal(result.figures.filter((f) => f.groupIds.includes("enterprise-support")).length, 4);
});

test("supplemental milestones retain represented roles and exclude unaccepted beneficiary claims", () => {
  const result = buildDashboardPresentation(bundle), milestones = result.figures.filter((f) => f.kind === "milestone");
  assert.deepEqual(milestones.map((f) => [f.value, f.unit, f.stage]), [[1, "vehicle", "reported-milestone"], [1, "toolkit", "reported-milestone"]]);
  const toolkit = milestones.find((f) => f.unit === "toolkit");
  assert.match(toolkit.role, /represented.*Lanre Oloyede/);
  assert.match(toolkit.role, /Developers: Deaf-in-Tech and DataLead Africa/);
  assert.ok(toolkit.limitations.some((s) => s.includes("not authorship")));
  assert.equal(result.haReviewed, false);
  assert.equal(result.publicApproved, false);
  assert.equal(result.figures.some((f) => f.value === 1200), false);
});

test("collaborations are evidenced actor–initiative memberships with distinct person roles", () => {
  const result = buildDashboardPresentation(bundle);
  assert.equal(result.collaborations.length, 9);
  assert.equal(result.collaborations.filter((c) => c.kind === "stated-cooperation").length, 2);
  assert.equal(result.collaborations.filter((c) => c.kind === "signed-mou-reported").length, 1);
  for (const c of result.collaborations) {
    const original = bundle.partnerships.find((p) => p.id === c.id);
    assert.deepEqual(c.participants.map((p) => p.id), original.entity_ids);
    assert.ok(c.participants.every((p) => p.role.en && p.role.ha));
    assert.ok(c.limitations.length && c.excerpt && c.sourceId);
  }
  const toolkit = result.collaborations.find((c) => c.id === "toolkit-developers");
  assert.deepEqual(toolkit.participants.map((p) => p.id), ["datalead", "deaf-in-tech"]);
  const health = result.collaborations.find((c) => c.id === "health-ministry-intention");
  assert.equal(health.participants.find((p) => p.id === "ali-pate").kind, "person");
  const withoutCooccurrences = clone(); withoutCooccurrences.co_occurrences = [];
  assert.deepEqual(buildDashboardPresentation(withoutCooccurrences).collaborations, result.collaborations);
  assert.equal("edges" in result, false);
});

test("concept frequencies count canonical report matches, with excerpts and explicit denominator", () => {
  const result = buildDashboardPresentation(bundle);
  assert.equal(result.conceptReportCount, 30);
  assert.equal(result.concepts.length, 7);
  for (const c of result.concepts) {
    assert.equal(c.count, new Set(c.sourceIds).size);
    assert.equal(c.count, c.excerpts.length);
    assert.ok(c.excerpts.every((e) => e.text.toLowerCase().includes(c.phrase)));
    assert.ok(c.sourceIds.every((id) => bundle.model_documents.some((d) => d.source_id === id)));
  }
  assert.equal(result.concepts.find((c) => c.id === "disability-inclusion").count, 13);
  assert.equal(result.concepts.find((c) => c.id === "reasonable-accommodations").count, 1);
  assert.equal(supplement.conceptExtraction.reports.length, 30);
});

test("invalid IDs, duplicate aliases and mismatched actor membership fail closed", () => {
  for (const mutate of [
    (b) => { b.observations[0].activity_id = "unknown"; },
    (b) => { b.observations[0].observation_id_aliases = [b.observations[1].id]; },
    (b) => { b.partnerships[0].entity_ids = ["mohammed-abba-isa"]; },
    (b) => { b.partnerships[0].entity_ids.push(b.partnerships[0].entity_ids[0]); },
    (b) => { b.partnerships[0].evidence.source_id = "1307"; },
    (b) => { b.activities = b.activities.filter((a) => a.id !== "borno-employment-2024"); },
  ]) {
    const bad = clone(); mutate(bad); assert.throws(() => buildDashboardPresentation(bad), TypeError);
  }
});

test("committed phrase extraction reproduces from the ignored archive", { skip: !existsSync(new URL("output/office-evidence/articles.json", root)) }, () => {
  const child = spawnSync(process.execPath, ["scripts/extract-dashboard-concepts.mjs", "--check"], { cwd: root, encoding: "utf8" });
  assert.equal(child.status, 0, child.stderr || child.stdout);
});
