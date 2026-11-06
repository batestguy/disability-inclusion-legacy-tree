import { readFile, mkdir, writeFile } from "node:fs/promises";
import ts from "typescript";
import { translate } from "../apps/web/lib/locales.mjs";
import { getFlowNode } from "../apps/web/lib/guided-flow.mjs";
import { getConciseAnswer } from "../apps/web/lib/guided-presentation.mjs";
import { buildDashboardPresentation } from "../apps/web/lib/dashboard-presentation.mjs";

const texts = new Set();
function collect(value) {
  if (!value || typeof value !== "object" || value.originalLanguage) return;
  if (typeof value.en === "string" && typeof value.ha === "string" && value.en !== value.ha) texts.add(value.en);
  for (const child of Object.values(value)) collect(child);
}
for (const name of ["content/dashboard/v1/bundle.json", "content/records.json", "content/dashboard-speaking-photo.json", "content/dashboard-portrait.json"]) {
  try { collect(JSON.parse(await readFile(name, "utf8"))); } catch (error) { if (error.code !== "ENOENT") throw error; }
}
const bundle = JSON.parse(await readFile("content/dashboard/v1/bundle.json", "utf8"));
const portrait = JSON.parse(await readFile("content/dashboard-portrait.json", "utf8"));
texts.add(portrait.quote_excerpt);
// Exercise the interpolation boundaries used by filtered and empty states.
for (const count of [0, 1, bundle.activities.length]) {
  for (const text of [
    `Appears in ${count} of ${bundle.model_documents.length} reports`,
    `Covers ${count} recorded activities`,
    `${count} of ${bundle.model_documents.length} selected reports`,
    `${count} classified activity records`,
    `${count} sourced figures shown`,
    `View all ${count} activities`,
    `Browse activities (${count})`,
  ]) texts.add(text);
}
collect(buildDashboardPresentation(bundle));
const visited = new Set();
const queue = ["start"];
while (queue.length) {
  const id = queue.pop();
  if (visited.has(id)) continue;
  visited.add(id);
  const node = getFlowNode(bundle, id);
  collect(node); collect(getConciseAnswer(node));
  node.options.forEach(option => queue.push(option.target));
}
const active = ["AboutWorkspace", "AboutBiography", "DashboardAdvocacy", "DashboardEvidence", "DashboardHighlights", "DashboardNetwork", "MobileNetworkFlow", "DashboardWorkspace", "GuidedWorkspace", "HomeWorkspace", "LandingEffects", "SolarSystem", "OpeningPortrait", "Permanent", "Preferences", "Record", "WorkspaceFooter", "WorkspaceHeader"];
for (const [dir, names] of [["apps/web/components", active.map(name => name + ".tsx")], ["apps/web/lib", ["methodology.ts"]]]) {
  for (const name of names) {
    const source = ts.createSourceFile(name, await readFile(`${dir}/${name}`, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node) {
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
        const index = ["say", "bi"].includes(node.expression.text) ? 0 : ["t", "translate", "local"].includes(node.expression.text) ? 1 : -1;
        const argument = node.arguments[index];
        if (argument && (ts.isStringLiteral(argument) || ts.isNoSubstitutionTemplateLiteral(argument))) texts.add(argument.text);
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
}
const properNames = new Set(["Mohammed Abba Isa"]);
function checkLocalized(value) {
  if (!value || typeof value !== "object") return 0;
  if (typeof value.en === "string") {
    for (const code of ["en", "ha", "yo", "ig"]) {
      if (typeof value[code] !== "string" || !value[code].trim()) throw new Error(`Direct translation missing: ${code}`);
    }
    return 1;
  }
  return Object.values(value).reduce((count, child) => count + checkLocalized(child), 0);
}
const biographyTexts = checkLocalized(JSON.parse(await readFile("content/about.json", "utf8")));
const interactionTexts = checkLocalized(JSON.parse(await readFile("content/interaction-copy.json", "utf8")));
const methodologyTexts = checkLocalized(JSON.parse(await readFile("content/methodology-summary.json", "utf8")));
const workflowTexts = checkLocalized(JSON.parse(await readFile("content/methodology-workflow.json", "utf8")));
const landingTexts = checkLocalized(JSON.parse(await readFile("content/landing-interactions.json", "utf8")));
const missing = Object.fromEntries(["yo", "ig"].map(lang => [lang, [...texts].filter(text => !properNames.has(text) && /[A-Za-z]/.test(text) && translate(lang, text) === text).sort()]));
await mkdir("output", { recursive: true });
await writeFile("output/locale-coverage.json", JSON.stringify({ auditedTexts: texts.size, biographyTexts, interactionTexts, methodologyTexts, workflowTexts, landingTexts, guidedNodes: visited.size, missing }, null, 2));
console.log(JSON.stringify({ auditedTexts: texts.size, biographyTexts, interactionTexts, methodologyTexts, workflowTexts, landingTexts, guidedNodes: visited.size, missing: Object.fromEntries(Object.entries(missing).map(([lang, values]) => [lang, values.length])) }));
if (process.argv.includes("--check") && Object.values(missing).some(values => values.length)) process.exitCode = 1;
