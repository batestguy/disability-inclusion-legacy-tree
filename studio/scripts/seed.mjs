import { readFileSync } from "node:fs";

// Emits public seed content only; no credentials or API calls. Redirect stdout to NDJSON.
const seed = JSON.parse(
  readFileSync(
    new URL("../../content/records.json", import.meta.url),
    "utf8",
  ).replace(/^\uFEFF/, ""),
);
const sourceId = (id) => `source.${id}`;
const references = (ids) =>
  ids.map((id, index) => {
    if (!seed.sources.some((source) => source.id === id))
      throw new Error(`Unknown source reference: ${id}`);
    return { _key: `source-${index}`, _type: "reference", _ref: sourceId(id) };
  });
const documents = [
  ...seed.sources.map(({ id, ...source }) => ({
    ...source,
    _id: sourceId(id),
    _type: "source",
    reviewed: false,
  })),
  ...seed.achievements.map(({ slug, sources, ...achievement }) => ({
    ...achievement,
    _id: `achievement.${slug}`,
    _type: "achievement",
    slug: { _type: "slug", current: slug },
    sources: references(sources),
    reviewed: false,
    haReviewed: false,
  })),
  ...seed.timeline.map(({ date, title, description, sources }, index) => ({
    _id: `timeline.${String(index + 1).padStart(2, "0")}`,
    _type: "timelineEvent",
    date,
    label: title,
    detail: description,
    sortOrder: index,
    sources: references(sources),
    reviewed: false,
    haReviewed: false,
  })),
  {
    _id: "siteSettings",
    _type: "siteSettings",
    title: "Legacy archive",
    ...(seed.settings.creator?.name ? { creator: seed.settings.creator } : {}),
    ...(seed.settings.correctionEmail
      ? { correctionEmail: seed.settings.correctionEmail }
      : {}),
    reviewed: false,
    haReviewed: false,
  },
];
const ids = new Set();
for (const document of documents) {
  if (!/^[a-zA-Z0-9_.-]+$/.test(document._id) || ids.has(document._id)) {
    throw new Error(`Invalid or duplicate document ID: ${document._id}`);
  }
  ids.add(document._id);
}
process.stdout.write(
  `${documents.map((document) => JSON.stringify(document)).join("\n")}\n`,
);
