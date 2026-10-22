import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const data = JSON.parse(
  readFileSync(new URL("../content/records.json", import.meta.url), "utf8"),
);
test("every bilingual record has traceable evidence, role, status and a unique permanent slug", () => {
  const seen = new Set();
  for (const a of data.achievements) {
    assert.match(a.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(!seen.has(a.slug));
    seen.add(a.slug);
    assert.match(a.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(
      ["policy", "economic", "digital", "assistive"].includes(a.branch),
    );
    assert.ok(
      ["advocacy", "reported", "announced", "completed", "measured"].includes(
        a.status,
      ),
    );
    for (const f of ["title", "description", "role", "evidenceLimits"])
      for (const l of ["en", "ha"]) assert.ok(a[f][l]?.length > 8);
    assert.ok(a.sources.length);
    for (const id of a.sources)
      assert.ok(data.sources.some((s) => s.id === id));
  }
});
test("sources use external HTTPS and the roots have supporting sources", () => {
  for (const s of data.sources) {
    assert.equal(new URL(s.url).protocol, "https:");
    assert.ok(s.publisher);
    assert.ok(["official", "office", "independent"].includes(s.type));
  }
  for (const m of data.timeline)
    for (const id of m.sources)
      assert.ok(data.sources.some((s) => s.id === id));
});
test("preview does not claim portrait rights or Hausa approval", () => {
  assert.equal(data.settings.revealReady, false);
  assert.equal(data.settings.haReviewed, false);
  assert.equal(data.settings.portrait, null);
  assert.ok(data.achievements.every((a) => !a.haReviewed));
});

const { transpileModule, ModuleKind } = await import("typescript");
const { parse, evaluate } = await import("groq-js");
const source = readFileSync(
  new URL("../apps/web/lib/content.ts", import.meta.url),
  "utf8",
);
const moduleText = transpileModule(
  source.replace(
    /import seed from .*?;/,
    `const seed=${JSON.stringify(data)};`,
  ),
  { compilerOptions: { module: ModuleKind.ESNext, target: 99 } },
).outputText;
const { validateContent } = await import(
  "data:text/javascript;base64," + Buffer.from(moduleText).toString("base64")
);
test("release gate refuses unreviewed Hausa, unlicensed portrait and missing corrections", () => {
  const original = process.env.RELEASE_MODE;
  try {
    process.env.RELEASE_MODE = "public";
    assert.throws(() => validateContent(data), /Public reveal blocked/);
    const d = structuredClone(data);
    d.settings.haReviewed = true;
    d.achievements.forEach((a) => (a.haReviewed = true));
    d.timeline.forEach((m) => (m.haReviewed = true));
    d.settings.correctionEmail = "corrections@example.org";
    d.settings.portrait = {
      rightsStatus: "permission",
      permission: "Written permission held by owner",
      credit: "Photographer",
      alt: { en: "Portrait", ha: "Hoto" },
      url: "https://cdn.sanity.io/portrait.webp",
    };
    assert.doesNotThrow(() => validateContent(d));
    d.timeline[0].haReviewed = false;
    assert.throws(() => validateContent(d), /Public reveal blocked/);
  } finally {
    if (original === undefined) delete process.env.RELEASE_MODE;
    else process.env.RELEASE_MODE = original;
  }
});
test("Sanity query maps schemas and excludes draft or unreviewed evidence and editorial notes", async () => {
  const q = source.match(/const query\s*=\s*`([\s\S]*?)`;/)[1];
  const dataset = [
    ...data.sources.map((s) => ({
      ...s,
      _id: s.id,
      _type: "source",
      reviewed: true,
      notes: "EDITORIAL_ONLY",
    })),
    ...data.achievements.map((a) => ({
      ...a,
      _id: a.slug,
      _type: "achievement",
      slug: { current: a.slug },
      sources: a.sources.map((id) => ({ _type: "reference", _ref: id })),
    })),
    ...data.timeline.map((m, i) => ({
      _id: "timeline-" + i,
      _type: "timelineEvent",
      reviewed: true,
      haReviewed: false,
      date: m.date,
      label: m.title,
      detail: m.description,
      sources: m.sources.map((id) => ({ _ref: id })),
      sortOrder: i,
    })),
    {
      _id: "siteSettings",
      _type: "siteSettings",
      reviewed: true,
      ...data.settings,
    },
    {
      _id: "drafts.private",
      _type: "achievement",
      reviewed: true,
      title: { en: "SHOULD_NOT_APPEAR" },
    },
  ];
  const output = await (await evaluate(parse(q), { dataset })).get();
  assert.equal(output.achievements.length, 5);
  assert.equal(output.timeline[0].title.en, data.timeline[0].title.en);
  assert.deepEqual(
    output.achievements[0].sources,
    data.achievements[0].sources,
  );
  assert.ok(!JSON.stringify(output).includes("EDITORIAL_ONLY"));
  dataset.find((d) => d._id === "smedan").reviewed = false;
  const without = await (await evaluate(parse(q), { dataset })).get();
  assert.ok(!without.sources.some((s) => s.id === "smedan"));
  assert.throws(
    () => validateContent(without),
    /Invalid achievement|Missing source/,
  );
});
