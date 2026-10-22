import { chromium } from "@playwright/test";
import lighthouse from "lighthouse";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH,
  args: ["--remote-debugging-port=8766"],
});
try {
  const response = await fetch("http://127.0.0.1:8766/json/version");
  console.log("Chrome debugger:", response.status);
  for (const [name, extra] of [
    ["mobile", {}],
    [
      "3g",
      {
        throttling: {
          rttMs: 300,
          throughputKbps: 700,
          cpuSlowdownMultiplier: 4,
          requestLatencyMs: 300,
          downloadThroughputKbps: 700,
          uploadThroughputKbps: 300,
        },
      },
    ],
  ]) {
    const result = await lighthouse(
      process.env.TEST_URL || "http://127.0.0.1:8767",
      {
        port: 8766,
        output: "json",
        onlyCategories: ["performance", "accessibility"],
        logLevel: "error",
        ...extra,
      },
    );
    await writeFile(`output/lighthouse-${name}.json`, result.report);
    console.log(
      name,
      JSON.stringify({
        performance: result.lhr.categories.performance.score,
        accessibility: result.lhr.categories.accessibility.score,
        lcp: result.lhr.audits["largest-contentful-paint"].numericValue,
        settings: result.lhr.configSettings,
      }),
    );
  }
} finally {
  await browser.close();
}
