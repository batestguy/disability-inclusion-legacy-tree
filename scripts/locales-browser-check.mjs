import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { languages, translate } from "../apps/web/lib/locales.mjs";
import { getFlowNode } from "../apps/web/lib/guided-flow.mjs";
import { buildDashboardPresentation } from "../apps/web/lib/dashboard-presentation.mjs";

const base = process.env.TEST_URL || "http://127.0.0.1:8767";
const bundle = JSON.parse(await readFile("content/dashboard/v1/bundle.json", "utf8"));
const presentation = buildDashboardPresentation(bundle);
const area = presentation.groups.find(group => group.id !== "all").id;
const term = presentation.concepts[0].id;
const query = `?area=${area}&term=${term}`;
const flow = "#flow=" + encodeURIComponent("start|women");
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
async function layout(code, label, audit = true) {
  await loaded(code);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label}: horizontal overflow`);
  const crowded = await page.locator(".bubble-surface").evaluateAll(surfaces => surfaces.filter(surface => {
    const frame = surface.getBoundingClientRect();
    return Array.from(surface.children).some(child => {
      const rect = child.getBoundingClientRect();
      return rect.left < frame.left - 1 || rect.right > frame.right + 1 || rect.top < frame.top - 1 || rect.bottom > frame.bottom + 1;
    });
  }).map(surface => surface.textContent));
  assert.deepEqual(crowded, [], `${label}: bubble content exceeds its frame`);
  const group = page.getByRole("group", { name: "Change language / Canja harshe / Yí èdè padà / Gbanwee asụsụ", exact: true });
  assert.equal(await group.count(), 1);
  const links = group.locator("a");
  assert.equal(await links.count(), 4);
  let previous;
  for (const { code: target, label } of languages) {
    const link = group.locator(`a[hreflang="${target}"]`);
    assert.equal((await link.innerText()).replace("✓", "").trim(), label);
    const box = await link.boundingBox();
    assert.ok(box && box.height >= 40 && box.width >= 44, `small language hit area: ${target}`);
    if (previous) assert.ok(previous.y + previous.height <= box.y + 1 && Math.abs(previous.x - box.x) < 2, "language links must remain vertically stacked");
    previous = box;
  }
  assert.equal(await group.locator('a[aria-current="page"]').getAttribute("hreflang"), code);
  const navigation = await page.locator(".dashboard-navigation").boundingBox();
  for (const part of [group.locator(".language-prompt"), group.locator(".language-options")]) {
    const box = await part.boundingBox();
    assert.ok(navigation && box && (navigation.x + navigation.width <= box.x + 1 || box.x + box.width <= navigation.x + 1 || navigation.y + navigation.height <= box.y + 1 || box.y + box.height <= navigation.y + 1), `${label}: navigation overlaps language controls`);
  }
  assert.doesNotMatch(await page.locator("body").innerText(), /review pending|pending review|awaiting.{0,30}review/i);
  assert.equal(await page.locator(".dashboard-header .translation-draft").count(), 0);
  if (code !== "en") assert.equal(await page.locator('[data-translation-status="draft"]').count(), 1);
  if (audit) {
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    results.axe.push({ label, violations: axe.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })) });
    assert.equal(axe.violations.length, 0, `${label}: accessibility violations`);
  }
}

try {
  for (const code of ["yo", "ig"]) {
    await page.setViewportSize({ width: 1440, height: 1050 });
    await page.goto(`${base}/${code}/`);
    await layout(code, `${code}: home desktop`);
    assert.equal(await page.locator("h1").innerText(), translate(code, "Advancing Disability Inclusion"));
    assert.notEqual(await page.locator(".bubble-chat strong").innerText(), "Interact with me");
    await page.locator(".quote-original summary").click();
    assert.ok((await page.locator('.quote-original p[lang="en"]').innerText()).length > 30);
    await page.locator(".bubble-overview").focus(); await page.keyboard.press("Enter");
    await page.waitForURL(url => url.pathname === `/${code}/explore/` && url.searchParams.get("section") === "overview");
    await layout(code, `${code}: explore desktop`);
    await page.locator(`button[data-area="${area}"]`).click();
    assert.equal(new URL(page.url()).searchParams.get("area"), area);
    await page.goto(`${base}/${code}/chat/${query}${flow}`);
    await page.locator('#guided-answer[data-node="women"]').waitFor();
    await layout(code, `${code}: guided answer desktop`);
    assert.equal(await page.locator("#guided-question").innerText(), getFlowNode(bundle, "women").title[code]);
    assert.notEqual(await page.locator(".guided-summary").innerText(), "");
    assert.equal(await page.locator(".guided-options button").count(), 2);
    await page.reload();
    await page.locator('#guided-answer[data-node="women"]').waitFor();
    // Every shared language link retains the chosen record context and valid path.
    for (const target of ["en", "ha", "yo", "ig", code]) {
      await page.locator(`.language-choice a[hreflang="${target}"]`).click();
      await loaded(target);
      assert.equal(new URL(page.url()).searchParams.get("area"), area);
      assert.equal(new URL(page.url()).searchParams.get("term"), term);
      assert.equal(decodeURIComponent(new URL(page.url()).hash), "#flow=start|women");
      await page.locator('#guided-answer[data-node="women"]').waitFor();
    }
    await page.getByRole("button", { name: translate(code, "View sources"), exact: true }).click();
    await page.locator(".guided-options button[data-source]").first().click();
    await page.locator('#guided-answer[data-view="source"]').waitFor();
    assert.ok((await page.locator('.guided-detail [lang="en"]').first().innerText()).length > 20);
    await page.locator('.dashboard-navigation a').filter({ hasText: translate(code, "About") }).click();
    await page.waitForURL(url => url.pathname === `/${code}/about/`);
    await page.locator(".about-method-link").click();
    await page.waitForURL(url => url.pathname === `/${code}/about/methodology/`);
    await layout(code, `${code}: methodology desktop`);
    assert.equal(await page.locator(".methodology-steps > li").count(), 7);
    assert.notEqual(await page.locator(".methodology-steps p").first().innerText(), "");
    assert.equal(new URL(page.url()).searchParams.get("area"), area);
    assert.equal(decodeURIComponent(new URL(page.url()).hash), "#flow=start|women");
    results.checks.push(`${code}: home, keyboard Explore, chosen area, guided women/cohorts, reload, all language switches, exact English source and Methodology context`);

    await page.setViewportSize({ width: 320, height: 900 });
    for (const route of ["", "explore/", "chat/", "about/methodology/"]) {
      await page.goto(`${base}/${code}/${route}`);
      await layout(code, `${code}: ${route || "home"} 320px`);
      await page.screenshot({ path: `output/playwright/locales-${code}-${route.split("/")[0] || "home"}-phone.png`, fullPage: true });
    }
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    await layout(code, `${code}: methodology enlarged text`, false);
    await page.evaluate(() => { document.documentElement.style.fontSize = ""; });
    const slug = JSON.parse(await readFile("content/records.json", "utf8")).achievements[0].slug;
    await page.goto(`${base}/${code}/achievements/${slug}/`);
    await loaded(code);
    assert.equal(await page.locator('[data-translation-status="draft"]').count(), 1);
    assert.ok((await page.locator(".record-content h2").innerText()).length > 5);
    results.checks.push(`${code}: 320px Home/Explore/Chat/Methodology, enlarged reading text and permanent record`);
  }
  assert.deepEqual(results.errors, []);
  assert.deepEqual(results.failedResponses, []);
  assert.deepEqual(results.externalRequests, []);
  results.completed = true;
} finally {
  await writeFile("output/locales-browser-results.json", JSON.stringify(results, null, 2));
  await browser.close();
}
console.log(JSON.stringify({ completed: results.completed, checks: results.checks.length, axeStates: results.axe.length }));
