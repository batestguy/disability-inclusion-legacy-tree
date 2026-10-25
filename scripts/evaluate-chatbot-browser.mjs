import { chromium } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

const baseline = JSON.parse(
  await readFile("output/chat-evaluation-50.json", "utf8"),
);
assert.equal(
  createHash("sha256")
    .update(await readFile("apps/web/lib/chat-engine.mjs"))
    .digest("hex"),
  baseline.engineSha256,
);
const base = process.env.TEST_URL || "http://127.0.0.1:8767";
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH }
    : {}),
});
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  reducedMotion: "reduce",
});
const evidence = {
  date: new Date().toISOString(),
  base,
  engineSha256: baseline.engineSha256,
  rows: [],
  pageErrors: [],
  failedResponses: [],
};
page.on("pageerror", (error) => evidence.pageErrors.push(error.message));
page.on("response", (response) => {
  if (response.status() >= 400)
    evidence.failedResponses.push({
      status: response.status(),
      url: response.url(),
    });
});
const normalise = (text) => text.replace(/\s+/g, " ").trim();
async function ask(question) {
  const before = await page.locator(".chat-turn").count();
  await page.locator("#chat-question").fill(question);
  await page
    .getByRole("button", { name: /^(Send question|Aika tambaya)$/ })
    .click();
  await page.locator(".chat-turn").nth(before).waitFor();
}
try {
  for (const row of baseline.rows) {
    const url = `${base}${row.lang === "ha" ? "/ha/chat/" : "/chat/"}`;
    if (page.url() !== url) await page.goto(url);
    await page
      .getByRole("button", { name: /^(Start again|Fara sabo)/ })
      .click();
    if (row.context?.programme)
      await ask(
        {
          smedan: "SMEDAN",
          nigwed: "NIGWED",
          borno: "Borno",
          startup: "startup",
          beyond: "Beyond Disability",
        }[row.context.programme],
      );
    if (row.context?.reportYear)
      await page
        .locator("#chat-year")
        .selectOption(String(row.context.reportYear));
    await ask(row.question);
    const answer = page.locator(".chat-answer").last();
    const actualText = await answer.locator(":scope > p").first().innerText();
    const statusMatches = await answer.evaluate(
      (element, status) => element.classList.contains(`chat-answer-${status}`),
      row.actual.status,
    );
    const textMatches = normalise(actualText) === normalise(row.rendered.text);
    evidence.rows.push({
      id: row.id,
      lang: row.lang,
      question: row.question,
      expectedEngineStatus: row.actual.status,
      statusMatches,
      textMatches,
      browserReply: actualText,
    });
    assert.ok(
      statusMatches && textMatches,
      `Browser differs from baseline for ${row.id}`,
    );
  }
  assert.equal(evidence.rows.length, 50);
  assert.deepEqual(evidence.pageErrors, []);
  assert.deepEqual(evidence.failedResponses, []);
  console.log(
    JSON.stringify({
      questions: evidence.rows.length,
      matches: evidence.rows.filter((r) => r.textMatches && r.statusMatches)
        .length,
      pageErrors: evidence.pageErrors.length,
      failedResponses: evidence.failedResponses.length,
    }),
  );
} finally {
  await writeFile(
    "output/chat-evaluation-50-browser.json",
    JSON.stringify(evidence, null, 2) + "\n",
  );
  await browser.close();
}
