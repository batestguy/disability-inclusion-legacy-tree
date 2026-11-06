import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.TEST_URL || "http://127.0.0.1:8767";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1366, height: 1000 }, hasTouch: true });
const page = await context.newPage();
const result = { date: new Date().toISOString(), completed: false, desktopStates: 0, mobileStates: 0, axe: [], errors: [] };
page.on("pageerror", error => result.errors.push(error.message));
await mkdir("output/playwright", { recursive: true });
async function audit(label) {
  const check = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  result.axe.push({ label, violations: check.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })) });
}
async function languageButtons() {
  await page.evaluate(() => document.fonts.ready);
  const buttons = await page.locator(".dashboard-header .language-options a").evaluateAll(links => links.map(a => {
    const b = a.getBoundingClientRect(), s = getComputedStyle(a);
    return { text: a.textContent.replace("✓", "").trim(), x: b.x, y: b.y, width: b.width, height: b.height,
      inside: b.left >= 0 && b.right <= innerWidth && b.top >= 0 && b.bottom <= innerHeight,
      hit: document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2)?.closest("a") === a,
      color: s.color, background: s.backgroundColor };
  }));
  assert.deepEqual(buttons.map(b => b.text), ["English", "Hausa", "Yorùbá", "Igbo"]);
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    assert.ok(button.inside && button.hit && button.height >= 44, JSON.stringify(button));
    assert.equal(button.color, "rgb(255, 255, 255)");
    assert.notEqual(button.background, "rgba(0, 0, 0, 0)");
    if (i) assert.ok(button.y >= buttons[i - 1].y + buttons[i - 1].height, "languages stay vertically stacked");
  }
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
}
try {
  for (const width of [768, 1024, 1280, 1366, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ["/", "/explore/", "/chat/"]) {
      await page.goto(base + path);
      await languageButtons();
      await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
      await languageButtons();
      result.desktopStates++;
    }
  }
  await page.setViewportSize({ width: 1366, height: 1000 });
  await page.goto(base + "/explore/?section=collaborations&initiative=toolkit-developers");
  await page.getByRole("link", { name: "Hausa", exact: true }).click();
  await page.waitForURL(url => url.pathname === "/ha/explore/");
  assert.equal(new URL(page.url()).searchParams.get("initiative"), "toolkit-developers");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await languageButtons();
  await audit("desktop language buttons and graph");
  await page.screenshot({ path: "output/playwright/dashboard-final-desktop-language.png" });

  for (const code of ["en", "ha", "yo", "ig"]) for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(base + (code === "en" ? "" : "/" + code) + "/explore/?section=collaborations");
    await page.evaluate(() => document.fonts.ready);
    const viewport = page.locator(".network-map-viewport");
    await viewport.waitFor({ state: "visible" });
    assert.ok(await page.locator(".network-map").isVisible());
    assert.ok(await page.locator(".network-view-controls button").evaluateAll(buttons => buttons.every(b => b.getBoundingClientRect().width >= 76)), "view buttons must keep their words readable");
    assert.ok(!(await page.locator(".network-list").isVisible()));
    await viewport.focus();
    const arrows = await page.locator(".pathway-edge").evaluateAll(paths => paths.map(path => {
      const marker = path.getAttribute("marker-end");
      return { marker, resolved: marker && !!document.getElementById(marker.slice(5, -1)), computed: getComputedStyle(path).markerEnd };
    }));
    assert.ok(arrows.length > 10 && arrows.every(a => a.resolved && a.computed !== "none"), "all graph edges need working arrowheads");
    assert.ok(await viewport.evaluate(el => el.scrollWidth > el.clientWidth), "phone graph must scroll horizontally");
    await page.keyboard.press("ArrowRight");
    await page.waitForFunction(() => document.querySelector(".network-map-viewport").scrollLeft > 0);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "graph scrolling must stay inside its panel");
    await page.locator(".pathway-person").first().tap();
    assert.ok(await page.locator(".network-actor-selection").isVisible());
    assert.ok(await page.locator(".pathway-edge[data-actor-edge].is-active").count() > 0);
    const initiative = page.locator("[data-network-map-initiative]:not(.is-dimmed)").first();
    const id = await initiative.getAttribute("data-network-map-initiative");
    await initiative.tap();
    assert.equal(await page.locator("[data-selected-initiative]").getAttribute("data-selected-initiative"), id);
    await page.locator(".network-view-controls button").nth(1).click();
    assert.ok(await page.locator(".network-list").isVisible());
    assert.ok(!(await viewport.isVisible()));
    await page.locator(".network-view-controls button").first().click();
    await viewport.focus();
    assert.ok(await viewport.isVisible());
    await audit(`${code}: ${width}px horizontal network and arrows`);
    await viewport.focus();
    if (width === 390) await page.screenshot({ path: `output/playwright/dashboard-final-network-${code}-phone.png` });
    result.mobileStates++;
  }
  assert.deepEqual(result.errors, []);
  assert.ok(result.axe.every(a => !a.violations.length), JSON.stringify(result.axe));
  result.completed = true;
} finally {
  await writeFile("output/final-fix-browser-results.json", JSON.stringify(result, null, 2) + "\n");
  await browser.close();
}
console.log(JSON.stringify(result));
