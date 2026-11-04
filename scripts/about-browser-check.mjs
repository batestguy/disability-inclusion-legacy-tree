import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { languages, translate, localeHome } from "../apps/web/lib/locales.mjs";
import { buildDashboardPresentation } from "../apps/web/lib/dashboard-presentation.mjs";

const copy = JSON.parse(await readFile("content/about.json", "utf8"));
const interaction = JSON.parse(await readFile("content/interaction-copy.json", "utf8"));
const assets = JSON.parse(await readFile("content/about-assets.json", "utf8"));
const workflow = JSON.parse(await readFile("content/methodology-workflow.json", "utf8"));
const bundle = JSON.parse(await readFile("content/dashboard/v1/bundle.json", "utf8"));
const data = buildDashboardPresentation(bundle);
const area = data.groups.find(group => group.id !== "all").id;
const term = data.concepts[0].id;
const query = `?area=${area}&term=${term}`;
const flow = "#flow=" + encodeURIComponent("start|women");
const base = process.env.TEST_URL || "http://127.0.0.1:8767";
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
const context = await browser.newContext({ viewport: { width: 1440, height: 1050 }, reducedMotion: "reduce" });
const page = await context.newPage();
const results = { date: new Date().toISOString(), completed: false, checks: [], axe: [], errors: [], failedResponses: [], externalRequests: [] };
page.on("pageerror", error => results.errors.push(error.message));
page.on("response", response => { if (response.status() >= 400) results.failedResponses.push(response.url()); });
page.on("request", request => { if (new URL(request.url()).origin !== new URL(base).origin) results.externalRequests.push(request.url()); });
await mkdir("output/playwright", { recursive: true });

async function loaded(code) {
  await page.locator(`html[lang="${code}"]`).waitFor({ state: "attached" });
  await page.evaluate(() => document.fonts.ready);
}
async function geometry() {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "horizontal overflow");
  for (const id of Object.keys(assets.assets)) {
    const image = page.locator(`[data-biography-photo="${id}"] img`);
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(image => image.decode());
    const box = await image.boundingBox();
    const asset = assets.assets[id];
    assert.ok(box && Math.abs(box.height - box.width * asset.height / asset.width) < 2, `${id}: frame cropped/distorted`);
    assert.equal(new URL(await image.getAttribute("src"), base).pathname, asset.localPath);
  }
  const subject = await page.locator(".biography-subject").boundingBox();
  const creator = await page.locator(".biography-creator").boundingBox();
  assert.ok(subject.y + subject.height <= creator.y, "creator must follow his biography");
  assert.ok(subject.height > creator.height * 1.5, "Isa's story must visibly lead the About page");
  assert.equal(await page.locator(".biography-subject [data-biography-photo]").count(), 4);
  const subjectImage = await page.locator('[data-biography-photo="subjectPortrait"] img').boundingBox();
  const creatorImage = await page.locator('[data-biography-photo="creator"] img').boundingBox();
  assert.ok(subjectImage.width > creatorImage.width, "creator photograph must remain a smaller supporting credit");
  await page.evaluate(() => window.scrollTo(0, 0));
}
async function audit(label) {
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  results.axe.push({ label, violations: result.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })) });
  assert.equal(result.violations.length, 0, `${label}: accessibility violations`);
}
function state() {
  const url = new URL(page.url());
  assert.equal(url.searchParams.get("area"), area);
  assert.equal(url.searchParams.get("term"), term);
  assert.equal(decodeURIComponent(url.hash), "#flow=start|women");
}

try {
  for (const { code } of languages) {
    await page.setViewportSize({ width: 1440, height: 1050 });
    await page.goto(`${base}${localeHome(code)}${query}&view=home${flow}`);
    await loaded(code);
    assert.equal(await page.locator(".home-biography-intro p").innerText(), copy.homeIntro[code]);
    for (const [id, tool] of Object.entries(interaction.tools)) {
      assert.equal(await page.locator(`.bubble-${id} .bubble-format`).innerText(), tool.format[code]);
      assert.ok((await page.locator(`.bubble-${id} .bubble-invitation`).innerText()).startsWith(tool.invitation[code]));
    }
    await page.waitForFunction(area => document.querySelector(".home-biography-intro a")?.getAttribute("href")?.includes(`area=${area}`), area);
    await page.locator(".home-biography-intro a").focus(); await page.keyboard.press("Enter");
    await page.waitForURL(url => url.pathname === localeHome(code) + "about/");
    await loaded(code); state();
    assert.equal(await page.locator("h1").innerText(), translate(code, "About Mohammed Abba Isa", "Game da Mohammed Abba Isa"));
    assert.equal(await page.locator(".biography-prose p").count(), copy.subjectParagraphs.length + copy.subjectSections.length + copy.creatorParagraphs.length);
    assert.equal(await page.locator(".biography-creator .biography-prose p").first().innerText(), copy.creatorParagraphs[0][code]);
    assert.equal(await page.locator(".biography-creator .biography-prose p").nth(1).innerText(), copy.creatorParagraphs[1][code]);
    assert.equal(await page.locator(".biography-creator .biography-prose p").last().innerText(), copy.creatorParagraphs.at(-1)[code]);
    for (const link of await page.locator(".biography-creator a").all()) assert.equal(await link.getAttribute("href"), "https://github.com/batestguy", "creator profile must not link individual projects");
    assert.equal(await page.locator(".biography-subject .biography-prose p").last().innerText(), copy.subjectSections.at(-1).text[code]);
    assert.equal(await page.locator(".creator-work-link").getAttribute("href"), "https://github.com/batestguy");
    assert.equal(await page.getByText("A record you can question", { exact: true }).count(), 0);
    assert.equal(await page.locator(".biography-sources a").count(), 4);
    await geometry(); await audit(`${code}: About desktop`);
    await page.screenshot({ path: `output/playwright/about-${code}-desktop.png`, fullPage: true });
    const next = code === "ig" ? "en" : languages[languages.findIndex(lang => lang.code === code) + 1].code;
    await page.locator(`.language-choice a[hreflang="${next}"]`).click();
    await loaded(next); state();
    await page.locator(`.language-choice a[hreflang="${code}"]`).click();
    await loaded(code); state();
    await page.reload(); await loaded(code); state();
    await page.locator(".about-method-link").click();
    await page.waitForURL(url => url.pathname === localeHome(code) + "about/methodology/");
    state(); assert.equal(await page.locator(".methodology-steps > li").count(), 7);
    assert.equal(await page.locator("#workflow-title").innerText(), workflow.title[code]);
    assert.equal(await page.locator(".methodology-workflow p").last().innerText(), workflow.paragraphs.at(-1)[code]);
    await audit(`${code}: Methodology and agent workflow`);
    await page.screenshot({ path: `output/playwright/methodology-${code}-desktop.png`, fullPage: true });
    await page.goto(`${base}${localeHome(code)}explore/`);
    await loaded(code);
    for (const section of ["overview", "advocacy", "collaborations"]) assert.equal(await page.locator(`#${section} .section-format`).innerText(), interaction.tools[section].format[code]);
    await page.goto(`${base}${localeHome(code)}chat/`);
    await loaded(code);
    assert.equal(await page.locator(".guided-frame-header div > span").innerText(), interaction.tools.chat.format[code]);
    assert.equal(await page.locator("#guided-question").innerText(), interaction.welcome[code]);
    await page.locator('.guided-options button[data-target="programmes"]').click();
    await page.locator('#guided-answer[data-node="programmes"]').waitFor();
    assert.notEqual(await page.locator("#guided-question").innerText(), interaction.welcome[code]);
    results.checks.push(`${code}: Home introduction/subtitles, keyboard biography link, sourced biographies and new photos, locale/reload/Methodology state, repeated chapter/chat descriptions`);

    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(`${base}${localeHome(code)}about/`);
    await loaded(code); await geometry(); await audit(`${code}: About 320px`);
    await page.screenshot({ path: `output/playwright/about-${code}-phone.png`, fullPage: true });
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    await geometry();
    await page.evaluate(() => { document.documentElement.style.fontSize = ""; });
  }
  await page.route("**/branding/about/*", route => route.abort());
  await page.goto(base + "/about/");
  for (const figure of await page.locator("[data-biography-photo]").all()) await figure.scrollIntoViewIfNeeded();
  await page.waitForFunction(count => document.querySelectorAll(".biography-photo-fallback").length === count, Object.keys(assets.assets).length);
  assert.equal(await page.locator(".biography-photo figcaption a").count(), Object.keys(assets.assets).length);
  assert.equal(await page.locator(".creator-work-link").count(), 1);
  await audit("About photo fallback");
  await page.unroute("**/branding/about/*");
  results.checks.push("All four About pages fit 320px/enlarged text, keep full photo frames, and failed images retain alternative names, captions and source/profile links");
  assert.deepEqual(results.errors, []);
  assert.deepEqual(results.failedResponses, []);
  assert.deepEqual(results.externalRequests, []);
  results.completed = true;
} finally {
  await writeFile("output/about-browser-results.json", JSON.stringify(results, null, 2));
  await browser.close();
}
console.log(JSON.stringify({ completed: results.completed, checks: results.checks.length, axeStates: results.axe.length }));
