/** Rebuild small phrase frequencies from the selected canonical archive reports.
 * node scripts/extract-dashboard-concepts.mjs [--check]
 * Raw office archive stays ignored. This writes only the supplemental concept data.
 */
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
const root = new URL("../", import.meta.url);
const read = async (path) => JSON.parse(await readFile(new URL(path, root), "utf8"));
const b = await read("content/dashboard/v1/bundle.json");
const data = await read("content/dashboard/presentation.json");
const articles = await read(process.env.DASHBOARD_ARTICLES_PATH ? new URL(`file:///${process.env.DASHBOARD_ARTICLES_PATH.replaceAll("\\", "/")}`).href : "output/office-evidence/articles.json");
const articlesById = new Map(articles.map((a) => [String(a.source_id), a]));
const normalize = (s) => s.toLowerCase().replaceAll("’", "'").replace(/\s+/g, " ");
const docs = [...b.model_documents].sort((a, c) => a.source_id.localeCompare(c.source_id)).map((d) => {
  const article = articlesById.get(String(d.archive_source_id));
  if (!article?.text || !b.sources.some((s) => s.id === d.source_id)) throw new Error(`Missing canonical report ${d.source_id}`);
  return { sourceId: d.source_id, text: article.text, archiveSourceId: d.archive_source_id, textSha256: createHash("sha256").update(article.text).digest("hex") };
});
// A phrase must have word boundaries; count a canonical report once regardless
// of repeated mentions or archive aliases. Excerpts retain original wording.
const concepts = data.conceptDefinitions.map((definition) => {
  const regex = new RegExp(`\\b${definition.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  const excerpts = docs.flatMap((d) => {
    const text = d.text.replace(/\s+/g, " ");
    const match = regex.exec(normalize(text));
    if (!match) return [];
    const start = Math.max(0, text.lastIndexOf(" ", Math.max(0, match.index - 35)) + 1);
    const endSpace = text.indexOf(" ", match.index + definition.phrase.length + 55);
    return [{ sourceId: d.sourceId, text: text.slice(start, endSpace < 0 ? text.length : endSpace) }];
  });
  return { ...definition, count: excerpts.length, sourceIds: excerpts.map((e) => e.sourceId), excerpts };
});
const result = { ...data, conceptExtraction: { method: "case-insensitive whole phrase; whitespace collapsed; one match per selected canonical report; archive aliases deduplicated", reportCount: docs.length, reports: docs.map(({ text, ...meta }) => meta) }, concepts };
const serialized = JSON.stringify(result, null, 2) + "\n";
const destination = new URL("content/dashboard/presentation.json", root);
if (process.argv.includes("--check")) {
  if (serialized !== await readFile(destination, "utf8")) throw new Error("Concept extraction differs: rerun node scripts/extract-dashboard-concepts.mjs and review source matches");
  console.log(`Concept extraction matches: ${docs.length} canonical reports, ${concepts.length} phrases.`);
} else {
  await writeFile(destination, serialized);
  console.log(`Wrote ${fileURLToPath(destination)} (${docs.length} canonical reports).`);
}
