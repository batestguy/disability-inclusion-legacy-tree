import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";

const base = process.env.TEST_URL || "http://127.0.0.1:8767";
const bundle = JSON.parse(await readFile("content/dashboard/v1/bundle.json", "utf8"));
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1050 } });
const page = await context.newPage();
const results = { completed: false, checks: [], axe: [], errors: [] };
page.on("pageerror", error => results.errors.push(error.message));
try {
  for (const path of ["/", "/explore/", "/chat/", "/about/", "/about/methodology/", "/achievements/inclusive-business-skills/"]) {
    await page.goto(base + path);
    await page.evaluate(() => document.fonts.ready);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), path + ": no horizontal overflow");
    const canvas = await page.evaluate(() => getComputedStyle(document.querySelector(".dashboard-shell") || document.body).backgroundColor);
    assert.equal(canvas, "rgb(255, 255, 255)", path + ": white canvas");
    assert.equal(await page.locator(".national-watermark").evaluate(el => getComputedStyle(el).display), "none");
    const selectedTab = page.locator(".dashboard-navigation a[aria-current=page]");
    if (await selectedTab.count()) assert.equal(await selectedTab.evaluate(el => getComputedStyle(el).color), "rgb(255, 255, 255)");
    const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    results.axe.push({ path, violations: audit.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })) });
    results.checks.push(path + ": consistent canvas and accessibility");
  }
  for (const code of ["en", "ha", "yo", "ig"]) {
    const prefix = code === "en" ? "" : "/" + code;
    await page.goto(base + prefix + "/about/");
    assert.equal(await page.locator(".creator-contact a").first().innerText(), "07061674831");
    assert.equal(await page.locator(".creator-contact a").first().getAttribute("href"), "tel:+2347061674831");
    assert.equal(await page.locator(".creator-contact a").last().getAttribute("href"), "mailto:jzbannister@atbu.edu.ng");
    await page.goto(base + prefix + "/about/methodology/");
    assert.equal(await page.locator(".methodology-records a:visible").count(), 4);
    assert.equal(await page.locator(".methodology-settings a").count(), 0);
    assert.equal(await page.locator(".methodology-settings").getAttribute("open"), null);
    await page.goto(base + prefix + "/explore/");
    assert.equal(await page.locator("#advocacy-title").evaluate(el => getComputedStyle(el).color), "rgb(11, 93, 59)");
    for (const mode of ["areas", "concepts"]) {
      await page.locator(`[data-cloud-mode="${mode}"]`).click();
      const denominator = mode === "concepts" ? bundle.model_documents.length : bundle.activities.length;
      for (const button of await page.locator(".concept-cloud button").all()) {
        const count = Number(await button.getAttribute("data-cloud-count"));
        const expected = (denominator ? count / denominator : 0).toFixed(2);
        assert.equal(await button.locator("sup").innerText(), "×" + expected);
        assert.match(await button.getAttribute("aria-label"), new RegExp(expected.replace(".", "\\.")));
        const sizes = await button.evaluate(el => [parseFloat(getComputedStyle(el).fontSize), parseFloat(getComputedStyle(el.querySelector("sup")).fontSize)]);
        assert.ok(sizes[1] < sizes[0] * .6, "frequency must remain smaller than its word");
      }
    }
    if (code === "en") await page.locator("#advocacy").screenshot({ path: "output/playwright/dashboard-relative-frequency.png" });
    results.checks.push(code + ": public contact, visible implementation links, both relative-frequency denominators");
  }
  await page.goto(base + "/");
  const bands = await page.locator(".solar-sun").evaluate(el => getComputedStyle(el, "::before").boxShadow);
  assert.equal((bands.match(/rgb\(0, 135, 81\)/g) || []).length, 2);
  assert.match(bands, /rgb\(255, 255, 255\)/);
  await page.screenshot({ path: "output/playwright/landing-nigerian-theme.png", fullPage: true });
  assert.deepEqual(results.errors, []);
  assert.ok(results.axe.every(a => a.violations.length === 0), JSON.stringify(results.axe));
  results.completed = true;
} finally {
  await writeFile("output/polish-browser-results.json", JSON.stringify(results, null, 2) + "\n");
  await browser.close();
}
console.log(JSON.stringify(results));
