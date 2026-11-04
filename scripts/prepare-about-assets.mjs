import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import sharp from "sharp";

const creatorFile = process.argv[2];
if (!creatorFile) throw new Error("Usage: node scripts/prepare-about-assets.mjs <original creator photograph>");
const directory = "apps/web/public/branding/about";
await mkdir(directory, { recursive: true });
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
const definitions = {
  subjectPortrait: {
    file: "mohammed-abba-isa-portrait.webp", width: 505,
    sourcePage: "https://ossaposneo.org/ssap-hon-abba-isa-commends-dg-smedan-for-implementing-5-pwd-inclusion-in-empowerment-program/",
    sourceAsset: "https://ossaposneo.org/wp-content/uploads/2024/01/IMG-20240124-WA0021-505x800.jpg",
    context: "Portrait published with the office's SMEDAN report, not a photograph of training delivery.",
  },
  ceremony: {
    file: "fha-stall-allotment.webp", width: 1100,
    sourcePage: "https://ossaposneo.org/ssap-abba-isa-tasks-mdas-on-inclusive-policy-as-fha-mortgage-bank-allots-stalls-to-three-pwds/",
    sourceAsset: "https://ossaposneo.org/wp-content/uploads/2025/05/SSAP-Abba-Isa-Tasks-MDAs-on-Inclusive-Policy-as-FHA-Mortgage-Bank-Allots-Stalls-to-Three-PWDs.jpeg",
    context: "FHA Mortgage Bank stall-allotment ceremony; the office report was published 16 May 2025. The bank delivered the allotment documents.",
  },
  creator: {
    file: "jerry-zachary-bannister.webp", width: 800,
    sourcePage: "https://github.com/batestguy",
    sourceAsset: "Owner-supplied original: Photo 2 - full length in wheelchair, purple outfit.png",
    context: "Owner supplied the full-length original and requested its use in his creator biography. GitHub displays a cropped version of this photograph.",
  },
};
let manifest;
try { manifest = JSON.parse(await readFile("content/about-assets.json", "utf8")); }
catch (error) { if (error.code !== "ENOENT") throw error; manifest = { publicApproved: false, assets: {} }; }
manifest.checked = new Date().toISOString().slice(0, 10);
for (const [id, definition] of Object.entries(definitions)) {
  let original;
  if (id === "creator") original = await readFile(resolve(creatorFile));
  else {
    const response = await fetch(definition.sourceAsset);
    if (!response.ok) throw new Error(`${id}: source returned ${response.status}`);
    original = Buffer.from(await response.arrayBuffer());
  }
  const originalMetadata = await sharp(original).metadata();
  const result = await sharp(original).rotate().resize({ width: definition.width, withoutEnlargement: true }).webp({ quality: 90 }).toBuffer({ resolveWithObject: true });
  await writeFile(`${directory}/${definition.file}`, result.data);
  manifest.assets[id] = {
    localPath: `/branding/about/${definition.file}`, sourcePage: definition.sourcePage,
    sourceAsset: definition.sourceAsset, context: definition.context,
    originalSha256: sha256(original), originalWidth: originalMetadata.width, originalHeight: originalMetadata.height,
    sha256: sha256(result.data), width: result.info.width, height: result.info.height, bytes: result.data.length,
    modifications: "Proportional resizing and WebP encoding only; complete frame retained, no generated content, background alteration or facial retouching.",
    reusePermission: id === "creator" ? "Owner supplied this image and requested its inclusion; no broader photographer licence is asserted." : "Rights-holder licence/public-reuse permission remains unverified; owner-requested local prototype use only.",
    publicApproved: false,
  };
}
await writeFile("content/about-assets.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(JSON.stringify(Object.fromEntries(Object.entries(manifest.assets).map(([id, asset]) => [id, { width: asset.width, height: asset.height, bytes: asset.bytes }]))));
