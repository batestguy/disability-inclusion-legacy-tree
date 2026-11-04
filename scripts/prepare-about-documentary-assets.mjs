import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";

// Add documentary photographs without regenerating the owner's supplied image.
const manifestPath = "content/about-assets.json";
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
const directory = "apps/web/public/branding/about";
await mkdir(directory, { recursive: true });
await mkdir("output/about-originals", { recursive: true });
const definitions = {
  speaking: {
    file: "isa-nigwed-speaking.webp", width: 576,
    sourcePage: "https://ossaposneo.org/ssap-abba-isa-empowers-over-45-women-with-disabilities-flags-off-training-free-distribution-of-re-usable-sanitary-pads/",
    sourceAsset: "https://ossaposneo.org/wp-content/uploads/2024/07/IMG-20240719-WA0049-576x1024-1.jpg",
    localOriginal: "output/speaking-photo/IMG-20240719-WA0049-576x1024-1.jpg",
    context: "Isa speaking into a microphone at the NigWED event in Karon-majigi, Abuja; office report published 19 July 2024. Full source frame, including wheelchair and event banner, retained.",
  },
  education: {
    file: "isa-inclusive-education.webp", width: 960,
    sourcePage: "https://ossaposneo.org/ssap-abba-isa-presents-position-paper-on-bill-to-establish-federal-colleges-of-education-special-dukku-gombe-state-at-public-hearing/",
    sourceAsset: "https://ossaposneo.org/wp-content/uploads/2024/07/IMG-20240719-WA0009-2-1024x754-1.jpg",
    localOriginal: "output/about-originals/education.jpg",
    context: "Photograph embedded in the office's 19 July 2024 report about Isa presenting a position paper at the Dukku special-education college public hearing. Visually shows Isa greeting another attendee; the caption identifies the source publication, without asserting an independently verified photographed event/date. Original DIRECTOR MBB watermark retained. TheCable separately reported the hearing on 20 July 2024.",
  },
};
for (const [id, definition] of Object.entries(definitions)) {
  let original;
  if (definition.localOriginal) {
    try { original = await readFile(definition.localOriginal); } catch (error) { if (error.code !== "ENOENT") throw error; }
  }
  if (!original) {
    const response = await fetch(definition.sourceAsset, { signal: AbortSignal.timeout(45000) });
    if (!response.ok) throw new Error(`${id}: source returned ${response.status}`);
    original = Buffer.from(await response.arrayBuffer());
  }
  const metadata = await sharp(original).metadata();
  const result = await sharp(original).rotate().resize({ width: definition.width, withoutEnlargement: true }).webp({ quality: 88 }).toBuffer({ resolveWithObject: true });
  await writeFile(`output/about-originals/${id}.jpg`, original);
  await writeFile(`${directory}/${definition.file}`, result.data);
  manifest.assets[id] = {
    localPath: `/branding/about/${definition.file}`, sourcePage: definition.sourcePage,
    sourceAsset: definition.sourceAsset, context: definition.context,
    originalSha256: sha256(original), originalWidth: metadata.width, originalHeight: metadata.height,
    sha256: sha256(result.data), width: result.info.width, height: result.info.height, bytes: result.data.length,
    modifications: "Proportional resizing and WebP encoding only; complete frame retained, no generated content, background alteration or facial retouching.",
    reusePermission: "Rights-holder licence/public-reuse permission remains unverified; owner-requested local prototype use only.",
    publicApproved: false,
  };
}
manifest.checked = new Date().toISOString().slice(0, 10);
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log("Prepared two full-frame documentary photographs; existing assets and permissions preserved.");
