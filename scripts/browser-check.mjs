import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const base = process.env.TEST_URL || "http://127.0.0.1:8767";
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH }
    : {}),
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const results = {
  date: new Date().toISOString(),
  base,
  checks: [],
  axe: [],
  errors: [],
};
page.on("pageerror", (e) => results.errors.push(e.message));
await mkdir("output/playwright", { recursive: true });
async function axe(label) {
  // Audit off-screen content too; content-visibility only optimises painting.
  const fullLayout = await page.addStyleTag({
    content: ".archive,.roots,.about{content-visibility:visible!important}",
  });
  const r = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  await fullLayout.evaluate((el) => el.remove());
  results.axe.push({
    label,
    violations: r.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => n.target),
    })),
  });
}
try {
  await page.goto(base);
  await page.getByRole("button", { name: /Reading preferences/ }).waitFor();
  const flag = page.locator(".national-watermark");
  assert.equal(await flag.getAttribute("aria-hidden"), "true");
  const flagGeometry = () =>
    flag.evaluate((el) => {
      const r = el.getBoundingClientRect(),
        s = getComputedStyle(el);
      return {
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
        viewportWidth: document.documentElement.clientWidth,
        viewportHeight: innerHeight,
        position: s.position,
        pointerEvents: s.pointerEvents,
      };
    });
  let f = await flagGeometry();
  assert.equal(f.position, "fixed");
  assert.equal(f.pointerEvents, "none");
  assert.equal(f.width, f.viewportWidth);
  assert.equal(f.height, f.viewportHeight);
  await page.evaluate(() => window.scrollTo(0, 700));
  f = await flagGeometry();
  assert.equal(f.y, 0);
  await page.evaluate(() => window.scrollTo(0, 0));
  const credit = page.locator(".tree-credit");
  await credit.getByRole("link", { name: "Adamu ab", exact: true }).waitFor();
  assert.equal(
    await credit
      .getByRole("link", { name: "CC BY-SA 4.0", exact: true })
      .getAttribute("href"),
    "https://creativecommons.org/licenses/by-sa/4.0/",
  );
  assert.equal(
    await credit
      .getByRole("link", { name: "Booboo tree.jpg", exact: true })
      .getAttribute("href"),
    "https://commons.wikimedia.org/wiki/File:Booboo_tree.jpg",
  );
  assert.equal(
    (await page.request.get(base + "/tree-art-license.txt")).status(),
    200,
  );
  assert.equal(
    (await page.request.get(base + "/tree-yobe-mobile.webp")).status(),
    200,
  );
  results.checks.push(
    "flag covers full viewport while scrolling and regional artwork has public source, licence and download",
  );
  await axe("English desktop");
  await page.screenshot({
    path: "output/playwright/desktop.png",
    fullPage: true,
  });
  assert.equal(await page.locator(".leaf").count(), 5);
  results.checks.push("five sourced stories");
  await page.getByRole("button", { name: /01 Policy Advocacy/ }).click();
  assert.equal(await page.locator(".leaf").count(), 2);
  results.checks.push("branch selection");
  await axe("expanded story branches");
  assert.equal(
    await page.locator("#twigs-policy .twig-story:visible").count(),
    2,
  );
  const policyButton = page.getByRole("button", { name: /01 Policy Advocacy/ });
  assert.equal(await policyButton.getAttribute("aria-expanded"), "true");
  const twig = page.locator("#twigs-policy .twig-story").first();
  await twig.click();
  await page.getByRole("dialog").waitFor();
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page.waitForFunction(() =>
    document.activeElement?.classList.contains("twig-story"),
  );
  assert.equal(
    await twig.evaluate((el) => el === document.activeElement),
    true,
  );
  assert.equal(await policyButton.getAttribute("aria-expanded"), "true");
  await policyButton.click();
  assert.equal(await page.locator("#twigs-policy").isVisible(), false);
  results.checks.push(
    "branches expand into connected stories, retain state and restore focus",
  );
  const languages = page.getByRole("group", {
    name: "Change language / Canja harshe",
  });
  await languages.getByRole("link", { name: /English/ }).waitFor();
  await languages.getByRole("link", { name: "Hausa", exact: true }).waitFor();
  assert.equal(
    await languages
      .getByRole("link", { name: /English/ })
      .getAttribute("aria-current"),
    "page",
  );
  assert.ok(
    await page
      .locator(".stump-portrait")
      .evaluate((el) => el.getBoundingClientRect().width >= 225),
  );
  results.checks.push(
    "clearly labelled language choices and enlarged portrait stump",
  );
  await page.locator(".limb-hit-policy").scrollIntoViewIfNeeded();
  const barkPoint = await page.locator(".limb-hit-policy").evaluate((el) => {
    const p = el
      .getPointAtLength(el.getTotalLength() * 0.5)
      .matrixTransform(el.getScreenCTM());
    return { x: p.x, y: p.y };
  });
  await page.mouse.click(barkPoint.x, barkPoint.y);
  assert.equal(await policyButton.getAttribute("aria-expanded"), "true");
  await policyButton.click();
  results.checks.push(
    "clicking the actual illustrated limb opens its story branches",
  );
  await policyButton.focus();
  await page.keyboard.press("Space");
  assert.equal(await policyButton.getAttribute("aria-expanded"), "true");
  await page.keyboard.press("Tab");
  assert.equal(
    await twig.evaluate((el) => el === document.activeElement),
    true,
  );
  await policyButton.focus();
  await page.keyboard.press("Space");
  results.checks.push("keyboard branch expansion and story focus order");

  await page.getByRole("button", { name: /Show all stories/ }).click();
  await page.getByRole("searchbox").fill("zzzznonexistent");
  assert.equal(await page.locator(".leaf").count(), 0);
  await page.getByText("No leaves on this path yet.").waitFor();
  results.checks.push("empty search");
  await page.getByRole("searchbox").fill("");
  await page.locator(".filters select").nth(1).selectOption("2026");
  assert.equal(await page.locator(".leaf").count(), 1);
  await page.locator(".filters select").nth(1).selectOption("all");
  results.checks.push("year filter");
  const trigger = page.locator(".leaf").first();
  await trigger.click();
  await page.getByRole("dialog").waitFor();
  assert.match(page.url(), /#leaf=inclusive-business-skills/);
  await axe("detail panel");
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  assert.equal(
    await trigger.evaluate((el) => el === document.activeElement),
    true,
  );
  results.checks.push("Escape and focus restoration");
  await trigger.click();
  await page.goBack();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  results.checks.push("browser Back closes detail");
  await trigger.click();
  await page.getByRole("link", { name: /Permanent record/ }).click();
  assert.match(page.url(), /achievements\/inclusive-business-skills/);
  await page.getByRole("heading", { name: "Cite this record" }).waitFor();
  await axe("permanent record");
  await page.getByRole("link", { name: "Hausa", exact: true }).click();
  assert.match(page.url(), /ha\/achievements\/inclusive-business-skills/);
  await page.getByText("Fassarar Hausa na jiran bitar mutum.").waitFor();
  results.checks.push("permanent bilingual link preserves record");
  await page.goto(base + "/ha/#leaf=inclusive-business-skills");
  await page.getByRole("dialog").waitFor();
  await axe("Hausa direct detail");
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "English", exact: false })
    .click();
  await page.getByRole("dialog").waitFor();
  assert.match(page.url(), /\/#leaf=inclusive-business-skills/);
  results.checks.push("panel language switch retains selected story");
  await page.keyboard.press("Escape");
  await page.goto(base);
  await page.getByRole("button", { name: /Reading preferences/ }).click();
  await page.getByLabel("High contrast", { exact: true }).check();
  await page.locator(".preferences select").selectOption("150");
  await page.getByLabel("Reduce motion", { exact: true }).check();
  await page.getByLabel("Simple reading font", { exact: true }).check();
  await page.getByLabel("Underline links", { exact: true }).check();
  await page.getByRole("button", { name: "Close", exact: false }).click();
  await page.reload();
  await page.waitForFunction(() =>
    document.documentElement.classList.contains("high-contrast"),
  );
  assert.equal(
    await page.evaluate(() => document.documentElement.style.fontSize),
    "150%",
  );
  results.checks.push("all preferences persist after reload");
  assert.equal(await flag.isVisible(), false);
  results.checks.push("flag watermark is hidden in high contrast mode");
  await axe("high contrast large text");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: /01 Policy Advocacy/ }).click();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await axe("mobile expanded branches at 150 percent text");
  await page.getByRole("button", { name: /01 Policy Advocacy/ }).click();
  results.checks.push("mobile large text no horizontal overflow");
  await page.getByRole("button", { name: /Reading preferences/ }).click();
  await page.getByRole("button", { name: "Reset preferences" }).click();
  await page.getByRole("button", { name: "Close", exact: false }).click();
  await page.screenshot({
    path: "output/playwright/mobile.png",
    fullPage: true,
  });
  f = await flagGeometry();
  assert.equal(f.width, 390);
  assert.equal(f.height, 844);
  await axe("mobile default");
  await page.locator(".leaf").first().click();
  await page.getByRole("dialog").waitFor();
  await page.screenshot({ path: "output/playwright/mobile-panel.png" });
  await page.keyboard.press("Tab");
  assert.ok(
    await page
      .getByRole("dialog")
      .evaluate((el) => el.contains(document.activeElement)),
  );
  results.checks.push("mobile panel focus contained");
  await axe("mobile panel");
  await page.goto(base);
  await page.evaluate(() => localStorage.clear());
  await page.setViewportSize({ width: 320, height: 900 });
  await page.reload();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  results.checks.push("320px reflow");
  const blocked = await browser.newContext();
  await blocked.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Unavailable");
      },
    });
  });
  const p = await blocked.newPage();
  await p.goto(base);
  await p.getByRole("button", { name: /Reading preferences/ }).click();
  await p.getByLabel("High contrast", { exact: true }).check();
  await p.waitForFunction(() =>
    document.documentElement.classList.contains("high-contrast"),
  );
  results.checks.push("unavailable localStorage handled");
  await blocked.close();
  assert.equal(results.errors.length, 0);
  assert.equal(
    results.axe.flatMap((x) => x.violations).length,
    0,
    "axe violations",
  );
} finally {
  await writeFile(
    "output/browser-results.json",
    JSON.stringify(results, null, 2),
  );
  await browser.close();
}
console.log(JSON.stringify(results, null, 2));
