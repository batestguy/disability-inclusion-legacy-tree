import { existsSync, readFileSync } from "node:fs";
const required = [
  "HonAbbas.txt",
  "package-lock.json",
  "content/records.json",
  "apps/web/app/page.tsx",
  "studio/sanity.config.ts",
];
for (const f of required) {
  if (!existsSync(f)) throw new Error(`Missing ${f}`);
}
const d = JSON.parse(readFileSync("content/records.json", "utf8"));
console.log(
  `Preflight OK: ${d.achievements.length} records, ${d.sources.length} sources. Local preview content. Public reveal gates pending.`,
);
