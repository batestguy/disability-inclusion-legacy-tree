import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";

const browser = await chromium.launch({ headless: true });
const results = [];
try {
  await Promise.all([1440, 1024, 768, 600, 501, 390, 320].map(async width => {
    const page = await browser.newPage({ viewport: { width, height: 1050 } });
    await page.goto(process.env.TEST_URL || "http://127.0.0.1:8767");
    await page.waitForFunction(() => document.fonts.status === "loaded");
    if (width === 320) {
      await page.waitForFunction(() => document.querySelector(".solar-system").dataset.mode === "static");
      results.push({ width, mode: "static", reason: "Keep portrait and all four controls clear on narrow screens" });
      await page.close();
      return;
    }
    await page.waitForFunction(() => document.querySelector(".solar-system").dataset.mode === "orbit");
    let minimumGap = Infinity;
    const started = Date.now();
    let samples = 0;
    do {
      const geometry = await page.evaluate(() => {
        const sun = document.querySelector(".solar-sun img").getBoundingClientRect();
        const planets = [...document.querySelectorAll(".bubble-surface")].map(el => {
          const box = el.getBoundingClientRect();
          return { label: el.innerText, gap: Math.hypot(box.x + box.width / 2 - sun.x - sun.width / 2, box.y + box.height / 2 - sun.y - sun.height / 2) - (sun.width + Math.max(box.width, box.height)) / 2 };
        });
        return { planets, circular: Math.abs(sun.width - sun.height) < 1 && getComputedStyle(document.querySelector(".solar-sun img")).borderRadius === "50%", paused: document.querySelector(".solar-system").dataset.orbitPaused };
      });
      assert.ok(geometry.circular, `${width}px: circular portrait`);
      assert.equal(geometry.paused, "false");
      for (const planet of geometry.planets) {
        minimumGap = Math.min(minimumGap, planet.gap);
        assert.ok(planet.gap > 0, `${width}px: ${planet.label} overlaps portrait by ${-planet.gap}px`);
      }
      samples++;
      await page.waitForTimeout(500);
    } while (Date.now() - started < 44000);
    await page.screenshot({ path: `output/playwright/solar-clearance-${width}.png`, fullPage: true });
    results.push({ width, mode: "orbit", samples, minimumGap: Math.round(minimumGap * 10) / 10 });
    await page.close();
  }));
  await writeFile("output/solar-orbit-browser-results.json", JSON.stringify({ completed: true, results }, null, 2) + "\n");
  console.log(JSON.stringify(results));
} finally {
  await browser.close();
}
