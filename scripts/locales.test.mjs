import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { languages, localeHome, translate, localizeData } from "../apps/web/lib/locales.mjs";
import { getFlowNode } from "../apps/web/lib/guided-flow.mjs";
import { getConciseAnswer, getSourceEvidence } from "../apps/web/lib/guided-presentation.mjs";
import { buildDashboardPresentation } from "../apps/web/lib/dashboard-presentation.mjs";

const bundle = JSON.parse(await readFile(new URL("../content/dashboard/v1/bundle.json", import.meta.url), "utf8"));

test("four locales preserve the established English/Hausa order and use distinct paths", () => {
  assert.deepEqual(languages.map(l => l.code), ["en", "ha", "yo", "ig"]);
  assert.deepEqual(languages.map(l => localeHome(l.code)), ["/", "/ha/", "/yo/", "/ig/"]);
  for (const code of ["yo", "ig"]) {
    assert.notEqual(translate(code, "Home", "Gida"), "Home");
    assert.notEqual(translate(code, "Home", "Gida"), "Gida");
  }
});

test("draft translation entries retain all numerical tokens in order", async () => {
  const numbers = text => text.match(/\d+(?:[.,]\d+)*/g) ?? [];
  for (const code of ["yo", "ig"]) {
    const dictionary = JSON.parse(await readFile(new URL(`../content/locales/${code}.json`, import.meta.url), "utf8"));
    for (const [original, translated] of Object.entries(dictionary)) {
      assert.deepEqual(numbers(translated), numbers(original), `${code}: changed numerical tokens in ${original}`);
    }
  }
});

test("localization does not mutate original evidence, quantities, identity or approval gates", () => {
  const original = structuredClone(bundle);
  const localized = localizeData(bundle);
  assert.deepEqual(bundle, original);
  assert.deepEqual(localized.observations, bundle.observations);
  assert.deepEqual(localized.sources, bundle.sources);
  assert.equal(localized.dataset_version, bundle.dataset_version);
  assert.equal(localized.categories[0].label.en, bundle.categories[0].label.en);
  assert.equal(localized.categories[0].label.ha, bundle.categories[0].label.ha);
  for (const language of ["yo", "ig"]) assert.ok(localized.categories[0].label[language]);
  const view = buildDashboardPresentation(bundle);
  assert.equal(view.haReviewed, false);
  assert.equal(view.publicApproved, false);
});

test("all reachable guided screens have four-language display fields and unchanged source excerpts", () => {
  const visited = new Set();
  const pending = ["start"];
  while (pending.length) {
    const id = pending.pop();
    if (visited.has(id)) continue;
    visited.add(id);
    const node = getFlowNode(bundle, id);
    const answer = getConciseAnswer(node);
    for (const text of [node.title, node.question, ...node.paragraphs, ...node.options.map(o => o.label), answer.title, ...answer.paragraphs]) {
      for (const { code } of languages) assert.equal(typeof text[code], "string", `${id}: missing ${code}`);
    }
    for (const option of node.options) pending.push(option.target);
    assert.equal(node.haReviewed, false);
    for (const source of node.sourceIds) {
      assert.deepEqual(getSourceEvidence(localizeData(bundle), node, source), getSourceEvidence(bundle, node, source));
    }
  }
  assert.ok(visited.size > 100, "check complete guided graph, including evidence and entity routes");
});
