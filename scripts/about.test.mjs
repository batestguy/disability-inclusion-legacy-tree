import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const copy = JSON.parse(await readFile("content/about.json", "utf8"));
const assets = JSON.parse(await readFile("content/about-assets.json", "utf8"));
const interaction = JSON.parse(await readFile("content/interaction-copy.json", "utf8"));
const methodology = JSON.parse(await readFile("content/methodology-summary.json", "utf8"));
const workflow = JSON.parse(await readFile("content/methodology-workflow.json", "utf8"));

test("biographies, interaction copy and image descriptions have four draft locales with unchanged dates/numbers", () => {
  const fields = [copy.homeIntro, ...copy.subjectParagraphs, ...copy.subjectSections.flatMap(section => [section.title, section.text]), ...Object.values(copy.documentaryPhotos).flatMap(photo => [photo.alt, photo.caption]), ...copy.creatorParagraphs, copy.subjectPortraitAlt, copy.subjectPortraitCaption, copy.ceremonyAlt, copy.ceremonyCaption, copy.creatorPortraitAlt, copy.creatorPortraitCaption, interaction.welcome, ...Object.values(interaction.tools).flatMap(tool => [tool.format, tool.invitation]), ...methodology.flatMap(step => [step.title, step.text]), workflow.title, ...workflow.paragraphs];
  const numbers = text => text.match(/\d+/g) ?? [];
  for (const field of fields) for (const lang of ["en", "ha", "yo", "ig"]) {
    assert.ok(field[lang]?.trim());
    assert.deepEqual(numbers(field[lang]), numbers(field.en), `${lang}: dates/numbers changed`);
  }
});

test("biography photographs match provenance and retain their original full-frame proportions", async () => {
  assert.equal(assets.publicApproved, false);
  for (const asset of Object.values(assets.assets)) {
    assert.equal(asset.publicApproved, false);
    const bytes = await readFile("apps/web/public" + asset.localPath);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256);
    assert.equal(bytes.length, asset.bytes);
    assert.ok(Math.abs(asset.height - asset.width * asset.originalHeight / asset.originalWidth) <= 1, "a full-length image was cropped or distorted");
    assert.ok(asset.sourcePage.startsWith("https://"));
    assert.ok(asset.reusePermission);
  }
});
