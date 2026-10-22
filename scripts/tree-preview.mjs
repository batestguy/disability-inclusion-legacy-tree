import { chromium } from "@playwright/test";
const b = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH,
});
const p = await b.newPage({
  viewport: { width: 1440, height: 1100 },
  reducedMotion: "reduce",
});
await p.goto("http://127.0.0.1:8767");
await p.locator("#explore").scrollIntoViewIfNeeded();
await p
  .locator(".tree-stage")
  .screenshot({ path: "output/playwright/tree-revision-desktop.png" });
await p.getByRole("button", { name: /01 Policy Advocacy/ }).click();
await p
  .locator(".tree-stage")
  .screenshot({ path: "output/playwright/tree-revision-expanded.png" });
await p.setViewportSize({ width: 390, height: 844 });
await p.goto("http://127.0.0.1:8767");
await p.screenshot({ path: "output/playwright/tree-revision-mobile-top.png" });
await p.getByRole("button", { name: /01 Policy Advocacy/ }).click();
await p
  .locator(".tree-stage")
  .screenshot({ path: "output/playwright/tree-revision-mobile.png" });
await b.close();
