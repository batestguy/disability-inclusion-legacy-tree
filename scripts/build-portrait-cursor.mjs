import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";

const provenance = JSON.parse(await readFile("content/portrait-cursor.json", "utf8"));
const sourcePath = process.argv[2] || provenance.local_source;
const original = await readFile(sourcePath);
const sha256 = (buffer) => createHash("sha256").update(buffer).digest("hex");
if (sha256(original) !== provenance.source_sha256) throw new Error("The input is not the recorded portrait. Check its source and provenance before using a different photo.");
const source = await sharp(original).metadata();
if (source.width !== provenance.source_dimensions[0] || source.height !== provenance.source_dimensions[1]) throw new Error("Portrait dimensions do not match the recorded source.");

await mkdir("output/portrait-cursor", { recursive: true });
// A native arrow icon embeds an unchanged photographic crop; no generated likeness.
const arrowTemplate = await readFile("content/portrait-cursor-arrow.svg", "utf8");
const faceCrop = await sharp(original).extract(provenance.crop).png().toBuffer();
const sourcePixels = await sharp(original).ensureAlpha().raw().toBuffer();
const cropPixels = await sharp(faceCrop).ensureAlpha().raw().toBuffer();
const { left, top, width, height } = provenance.crop;
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) for (let channel = 0; channel < 4; channel++) {
  if (cropPixels[(y * width + x) * 4 + channel] !== sourcePixels[((top + y) * source.width + left + x) * 4 + channel]) throw new Error("Portrait crop changed an original source pixel.");
}
const arrow = arrowTemplate.replace("{{PORTRAIT_DATA_URL}}", `data:image/png;base64,${faceCrop.toString("base64")}`);
const cursor = await sharp(Buffer.from(arrow)).png().toBuffer();
await writeFile("output/portrait-cursor/arrow-preview.png", await sharp(Buffer.from(arrow), { density: 576 }).png().toBuffer());
await mkdir("apps/web/public/branding", { recursive: true });
await writeFile("apps/web/public/branding/abba-isa-cursor.png", cursor);
const decoded = await sharp(cursor).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let transparent = 0;
let opaque = 0;
for (let index = 3; index < decoded.data.length; index += 4) {
  if (decoded.data[index] === 0) transparent++;
  if (decoded.data[index] === 255) opaque++;
}
if (!transparent || !opaque) throw new Error("Cursor must contain both transparent background and visible photograph pixels.");
console.log(JSON.stringify({ sourceSha256: sha256(original), arrowSha256: sha256(Buffer.from(arrowTemplate)), cursorSha256: sha256(cursor), width: decoded.info.width, height: decoded.info.height, hotspot: [4, 3], bytes: cursor.length, transparentPixels: transparent, opaquePixels: opaque, preservedCropPixels: width * height }, null, 2));
