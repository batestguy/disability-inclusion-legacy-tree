import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { buildDashboardPresentation } from "../apps/web/lib/dashboard-presentation.mjs";

const base = process.env.TEST_URL || "http://127.0.0.1:8767";
const bundle = JSON.parse(await readFile("content/dashboard/v1/bundle.json", "utf8"));
const data = buildDashboardPresentation(bundle);
const baseline = JSON.parse(await readFile("scripts/fixtures/mobile-network-desktop-baseline.json", "utf8"));
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, hasTouch: true, reducedMotion: "reduce" });
const page = await context.newPage();
const result = { completed: false, desktopLayoutPreserved: false, mobileStates: [], axe: [], errors: [] };
page.on("pageerror", error => result.errors.push(error.message));
const expectedLinks = data.collaborations.flatMap(c => c.participants.filter(p => p.id !== "mohammed-abba-isa").map(p => ({ from: `actor:${p.id}`, to: `initiative:${c.activityId}`, kind: c.kind })));
async function audit(label) {
  const report = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  result.axe.push({ label, violations: report.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })) });
}
async function drawing(count) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(count => document.querySelectorAll(".mobile-flow-edge").length === count, count);
  await page.waitForTimeout(100);
  return page.locator(".mobile-network-flow").evaluate(root => {
    const bounds = root.getBoundingClientRect();
    const boxes = [...root.querySelectorAll("[data-mobile-node],.mobile-flow-stage-title")].map(el => {
      const b = el.getBoundingClientRect();
      return { key: el.dataset.mobileNode || "heading", left: b.left - bounds.left, right: b.right - bounds.left, top: b.top - bounds.top, bottom: b.bottom - bounds.top };
    });
    const errors = [];
    const distance = (p, b) => Math.hypot(Math.max(b.left - p.x, 0, p.x - b.right), Math.max(b.top - p.y, 0, p.y - b.bottom));
    const links = [...root.querySelectorAll(".mobile-flow-edge")].map(path => {
      const from = path.dataset.mobileFrom, to = path.dataset.mobileTo;
      const a = boxes.find(b => b.key === from), b = boxes.find(b => b.key === to);
      const length = path.getTotalLength();
      if (!a || !b || Math.abs(distance(path.getPointAtLength(0), a) - 1) > .1 || Math.abs(distance(path.getPointAtLength(length), b) - 1) > .1) errors.push(`${from}->${to}: endpoints do not attach to card edges`);
      for (let step = 0; step <= length; step += 3) {
        const point = path.getPointAtLength(step);
        if (boxes.some(box => point.x > box.left + .5 && point.x < box.right - .5 && point.y > box.top + .5 && point.y < box.bottom - .5)) {
          errors.push(`${from}->${to}: route crosses a card or heading`); break;
        }
      }
      
      const marker = path.getAttribute("marker-end");
      if (!marker || !document.getElementById(marker.slice(5, -1))) errors.push(`${from}->${to}: missing arrowhead`);
      return { from, to, kind: path.dataset.mobileKind };
    });
    return { errors, links, boxes, overflow: document.documentElement.scrollWidth > innerWidth, clipped: [...root.querySelectorAll("button")].filter(b => b.scrollWidth > b.clientWidth + 1 || b.scrollHeight > b.clientHeight + 1).map(b => b.textContent) };
  });
}
try {
  await page.goto(base + "/explore/?section=collaborations");
  await page.evaluate(() => document.fonts.ready);
  const desktop = await page.locator(".pathway-map").evaluate(el => ({ height: el.getBoundingClientRect().height, width: el.getBoundingClientRect().width, paths: [...el.querySelectorAll(".pathway-edge")].map(e => e.getAttribute("d")), nodes: [...el.querySelectorAll(".pathway-person,.pathway-initiative")].map(e => ({ text: e.textContent, x: e.offsetLeft, y: e.offsetTop, w: e.offsetWidth, h: e.offsetHeight })) }));
  assert.deepEqual({...desktop, nodes: desktop.nodes.map(({h,...node}) => node)}, {...baseline, nodes: baseline.nodes.map(({h,...node}) => node)}, "desktop layout and connections stay unchanged");
  const compact = await page.locator(".pathway-person").first().evaluate(el => ({font: parseFloat(getComputedStyle(el).fontSize), icon: el.querySelector(".collage-avatar").getBoundingClientRect().width}));
  assert.equal(compact.font, 13); assert.ok(compact.icon <= 56);
  assert.ok(!(await page.locator(".mobile-network-flow").isVisible()));
  result.desktopLayoutPreserved = true;
  await page.setViewportSize({ width: 834, height: 1000 });
  assert.ok(await page.locator(".network-map-viewport").isVisible());
  assert.ok(!(await page.locator(".mobile-network-flow").isVisible()));

  for (const code of ["en", "ha", "yo", "ig"]) for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(base + (code === "en" ? "" : "/" + code) + "/explore/?section=collaborations");
    await page.locator(".mobile-network-flow").waitFor({ state: "visible" });
    assert.ok(!(await page.locator(".network-map-viewport").isVisible()));
    const portrait = await page.locator(".mobile-flow-subject .collage-avatar").boundingBox();
    assert.equal(portrait.width, 96);
    assert.equal(portrait.height, 96);
    assert.ok(await page.locator(".mobile-flow-partner .collage-avatar").evaluateAll(images => images.every(image => image.getBoundingClientRect().width <= 56)));
    const chooser = await drawing(0);
    assert.deepEqual(chooser.errors, []);
    assert.equal(await page.locator(".mobile-flow-tile").count(), 0);
    assert.equal(chooser.overflow, false);
    await page.locator(".mobile-flow-partner").first().tap();
    const id = await page.locator(".mobile-flow-partner[aria-pressed=true]").getAttribute("data-mobile-actor");
    const links = expectedLinks.filter(e => e.from === `actor:${id}`);
    const geometry = await drawing(links.length + 1);
    assert.deepEqual(geometry.errors, []);
    assert.deepEqual(geometry.clipped, []);
    assert.equal(geometry.overflow, false);
    assert.equal(await page.locator(".mobile-flow-partner").count(), 1);
    assert.deepEqual(geometry.links.filter(e => e.from.startsWith("actor:")), links);
    const tile = page.locator(".mobile-flow-tile:not(.is-dimmed)").first();
    const activity = await tile.getAttribute("data-mobile-initiative");
    await tile.tap();
    assert.equal(await page.locator("[data-selected-activity]").getAttribute("data-selected-activity"), activity);
    await page.locator(".network-view-controls button").nth(1).click();
    assert.ok(await page.locator(".network-list").isVisible());
    assert.ok(!(await page.locator(".mobile-network-flow").isVisible()));
    await page.locator(".network-view-controls button").first().click();
    await drawing(links.length + 1);
    await audit(`${code}: ${width}px mobile flow`);
    await page.locator(".mobile-flow-subject").scrollIntoViewIfNeeded();
    if (width === 390) await page.screenshot({ path: `output/playwright/dashboard-mobile-flow-${code}.png` });
    assert.equal(new URL(page.url()).searchParams.get("actor"), id);
    await page.locator(".mobile-flow-change").click();
    await drawing(0);
    await page.locator(".mobile-flow-all").click();
    const full = await drawing(new Set(expectedLinks.map(e => e.from)).size + expectedLinks.length + 1);
    assert.deepEqual(full.errors, []);
    assert.deepEqual(full.links.filter(e => e.from.startsWith("actor:")), expectedLinks);
    await page.locator(".mobile-flow-all").click();
    await drawing(0);
    await page.locator(".mobile-flow-partner").first().tap();
    result.mobileStates.push(`${code}:${width}`);
  }
  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  const large = await drawing((await page.locator(".mobile-flow-tile").count()) + 1);
  assert.deepEqual(large.errors, []);
  assert.equal(large.overflow, false);
  await audit("320px enlarged text flow");
  assert.deepEqual(result.errors, []);
  assert.ok(result.axe.every(a => !a.violations.length), JSON.stringify(result.axe));
  result.completed = true;
} finally {
  await writeFile("output/mobile-network-draft-results.json", JSON.stringify(result, null, 2) + "\n");
  await browser.close();
}
console.log(JSON.stringify(result));
