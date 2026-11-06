import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";

const browser = await chromium.launch({ headless: true });
const results = [];
try {
  await Promise.all([1440, 1366, 1280, 1024, 900, 768, 600, 501, 390, 320].map(async width => {
    const page = await browser.newPage({ viewport: { width, height: 1050 } });
    await page.goto(process.env.TEST_URL || "http://127.0.0.1:8767");
    await page.waitForFunction(() => document.fonts.status === "loaded");
    await page.waitForFunction(() => document.querySelector(".solar-system").dataset.layoutReady === "true");
    await page.waitForFunction(() => document.querySelector(".solar-system").dataset.mode === "orbit");
    const compact = await page.locator(".solar-system").getAttribute("data-compact-orbit") === "true";
    assert.equal(await page.locator(".solar-word-streams").evaluate(el => getComputedStyle(el).display), "block");
    const wordStart = await page.locator(".falling-concept").first().evaluate(el => getComputedStyle(el).transform);
    let minimumGap = Infinity;
    const started = Date.now();
    let samples = 0;
    do {
      const geometry = await page.evaluate(() => {
        const sun = document.querySelector(".solar-sun img").getBoundingClientRect();
        const lanes = [...document.querySelectorAll(".solar-word-lane")].map(el => el.getBoundingClientRect());
        const planets = [...document.querySelectorAll(".bubble-surface")].map(el => {
          const box = el.getBoundingClientRect();
          const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
          const laneGap = Math.min(...lanes.map(lane => Math.hypot(Math.max(lane.left - cx, 0, cx - lane.right), Math.max(lane.top - cy, 0, cy - lane.bottom)) - Math.max(box.width, box.height) / 2));
          return { label: el.innerText, laneGap, gap: Math.hypot(box.x + box.width / 2 - sun.x - sun.width / 2, box.y + box.height / 2 - sun.y - sun.height / 2) - (sun.width + Math.max(box.width, box.height)) / 2 };
        });
        return { planets, circular: Math.abs(sun.width - sun.height) < 1 && getComputedStyle(document.querySelector(".solar-sun img")).borderRadius === "50%", paused: document.querySelector(".solar-system").dataset.orbitPaused };
      });
      assert.ok(geometry.circular, `${width}px: circular portrait`);
      assert.equal(geometry.paused, "false");
      for (const planet of geometry.planets) {
        minimumGap = Math.min(minimumGap, planet.gap, planet.laneGap);
        assert.ok(planet.laneGap >= 12, `${width}px: ${planet.label} must clear falling-word lanes by 12px (actual ${planet.laneGap})`);
        assert.ok(planet.gap > 0, `${width}px: ${planet.label} overlaps portrait by ${-planet.gap}px`);
      }
      samples++;
      await page.waitForTimeout(500);
    } while (Date.now() - started < 44000);
    assert.notEqual(await page.locator(".falling-concept").first().evaluate(el => getComputedStyle(el).transform), wordStart, `${width}px: concept words must actually fall`);
    await page.screenshot({ path: `output/playwright/solar-clearance-${width}.png`, fullPage: true });
    results.push({ width, mode: "orbit", compact, samples, minimumGap: Math.round(minimumGap * 10) / 10 });
    await page.close();
  }));
  await writeFile("output/solar-orbit-browser-results.json", JSON.stringify({ completed: true, results }, null, 2) + "\n");
  console.log(JSON.stringify(results));
} finally {
  await browser.close();
}
