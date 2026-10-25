import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";

const base = process.env.TEST_URL || "http://127.0.0.1:8767";
const bundle = JSON.parse(
  await readFile("content/dashboard/v1/bundle.json", "utf8"),
);
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH }
    : {}),
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1050 },
  reducedMotion: "reduce",
  acceptDownloads: true,
});
const page = await context.newPage();
const results = {
  date: new Date().toISOString(),
  base,
  checks: [],
  axe: [],
  errors: [],
  externalRequests: [],
  failedResponses: [],
};
page.on("pageerror", (error) => results.errors.push(error.message));
page.on("response", (response) => {
  if (response.status() >= 400)
    results.failedResponses.push({
      status: response.status(),
      url: response.url(),
    });
});
page.on("request", (request) => {
  if (new URL(request.url()).origin !== new URL(base).origin)
    results.externalRequests.push(request.url());
});
await mkdir("output/playwright", { recursive: true });
const lastAnswer = () => page.locator(".chat-answer").last();
async function ask(question) {
  const before = await page.locator(".chat-turn").count();
  await page.locator("#chat-question").fill(question);
  await page
    .getByRole("button", { name: /^(Send question|Aika tambaya)$/ })
    .click();
  await page.locator(".chat-turn").nth(before).waitFor();
}
async function audit(label) {
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  results.axe.push({
    label,
    violations: audit.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => n.target),
    })),
  });
}
async function languageGeometry() {
  const group = page.getByRole("group", {
    name: "Change language / Canja harshe",
    exact: true,
  });
  const english = group.getByRole("link", { name: "English", exact: true });
  const hausa = group.getByRole("link", { name: "Hausa", exact: true });
  const e = await english.boundingBox(),
    h = await hausa.boundingBox();
  assert.ok(
    e && h && e.y + e.height <= h.y && Math.abs(e.x - h.x) < 2,
    "English must be vertically above Hausa",
  );
  assert.equal(await group.locator('[aria-current="page"]').count(), 1);
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "page must not overflow horizontally",
  );
}
try {
  await page.goto(`${base}/chat/`);
  await page.getByRole("heading", { name: "Let’s look together." }).waitFor();
  await page.locator("#chat-question").fill("hydration check");
  await page.locator("#chat-question").fill("");
  await languageGeometry();
  await audit("English desktop empty conversation");
  await page.screenshot({
    path: "output/playwright/chat-desktop.png",
    fullPage: true,
  });
  results.checks.push(
    "English direct route, visible vertical language control, active state and empty conversation",
  );

  await page
    .getByRole("button", { name: "Send question", exact: true })
    .click();
  assert.equal(
    await page.locator("#chat-question").getAttribute("aria-invalid"),
    "true",
  );
  await ask("How many activities are documented?");
  assert.match(
    await lastAnswer().innerText(),
    /33 documented activity records/,
  );
  await page.locator("#chat-year").selectOption("2024");
  await ask("How many activities are documented?");
  const yearCount = bundle.activities.filter((a) =>
    a.report_date.startsWith("2024"),
  ).length;
  assert.match(
    await lastAnswer().innerText(),
    new RegExp(
      `${yearCount} documented activity records with report year 2024`,
    ),
  );
  await page.locator("#chat-year").selectOption("");
  results.checks.push(
    "Empty composer validation, bundle-derived inventory and active report-year filter",
  );

  await ask("what has he done for disabled women?");
  assert.equal(
    await lastAnswer()
      .getByRole("heading", {
        name: "Support for women with disabilities",
        exact: true,
      })
      .count(),
    1,
  );
  assert.equal(await lastAnswer().locator(".chat-result-items li").count(), 2);
  assert.match(await lastAnswer().innerText(), /more than 45 women/);
  assert.match(await lastAnswer().innerText(), /more than 20 women/);
  assert.match(await lastAnswer().innerText(), /overlap.*unknown/);
  assert.doesNotMatch(await lastAnswer().innerText(), /\b65\b/);
  await lastAnswer()
    .getByText("Supporting evidence", { exact: true })
    .first()
    .click();
  assert.match(
    await lastAnswer()
      .locator(".chat-result-items a")
      .first()
      .getAttribute("href"),
    /over-45-women-with-disabilities/,
  );
  await page.getByRole("link", { name: "Hausa", exact: true }).click();
  await page.waitForURL(`${base}/ha/chat/`);
  await lastAnswer()
    .getByRole("heading", { name: "Tallafi ga mata masu nakasa", exact: true })
    .waitFor();
  assert.match(await lastAnswer().innerText(), /fiye da 45/);
  assert.match(await lastAnswer().innerText(), /fiye da 20/);
  assert.match(
    await page.locator(".chat-question").last().innerText(),
    /what has he done for disabled women\?/,
  );
  await audit("Women-focused Hausa summary");
  await ask("Me ya yi wa mata masu nakasa?");
  assert.equal(await lastAnswer().locator(".chat-result-items li").count(), 2);
  await page.getByRole("link", { name: "English", exact: true }).click();
  await page.waitForURL(`${base}/chat/`);
  await lastAnswer()
    .getByRole("heading", {
      name: "Support for women with disabilities",
      exact: true,
    })
    .waitFor();
  results.checks.push(
    "Exact owner women-focused question and typed Hausa equivalent produce two separate sourced lower-bound claims; locale switch re-renders the summary without translating visitor text",
  );

  await ask("How many SMEDAN participants were supported?");
  assert.match(await lastAnswer().innerText(), /5 people reportedly supported/);
  await lastAnswer()
    .getByText("Sources and qualifications", { exact: true })
    .click();
  assert.ok(
    (
      await lastAnswer().getByRole("link").first().getAttribute("href")
    ).startsWith("https://"),
  );
  await lastAnswer()
    .getByRole("button", { name: /Show these records/ })
    .click();
  await page.locator("#chat-evidence").waitFor();
  assert.equal(
    await page
      .locator("#chat-evidence")
      .evaluate((e) => document.activeElement === e),
    true,
  );
  assert.match(
    await page.locator("#chat-evidence").innerText(),
    /SMEDAN|business/i,
  );
  const smedanQuestion = await page
    .locator(".chat-question")
    .last()
    .innerText();
  await page.locator("#chat-question").fill("My unfinished question");
  await page.locator("#chat-year").selectOption("2024");
  await page.getByRole("link", { name: "Hausa", exact: true }).focus();
  await page.keyboard.press("Enter");
  await page.waitForURL(`${base}/ha/chat/`);
  await page
    .getByRole("button", { name: "Aika tambaya", exact: true })
    .waitFor();
  assert.equal(
    await page.locator("#chat-question").inputValue(),
    "My unfinished question",
  );
  assert.equal(await page.locator("#chat-year").inputValue(), "2024");
  assert.equal(
    await page.locator(".chat-question").last().innerText(),
    smedanQuestion.replace("YOU", "KAI"),
  );
  assert.match(await lastAnswer().innerText(), /SMEDAN.*5/s);
  assert.equal(await page.locator("html").getAttribute("lang"), "ha");
  await page.locator("#chat-evidence").waitFor();
  await languageGeometry();
  await audit("Hausa conversation with selected evidence");
  results.checks.push(
    "Keyboard language switch preserves draft, raw question, programme, report-year filter and evidence selection; assistant re-renders in Hausa",
  );

  await page.goBack();
  await page.waitForURL(`${base}/chat/`);
  await page
    .getByRole("button", { name: "Send question", exact: true })
    .waitFor();
  assert.equal(
    await page.locator("#chat-question").inputValue(),
    "My unfinished question",
  );
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  await page.goForward();
  await page.waitForURL(`${base}/ha/chat/`);
  await page
    .getByRole("button", { name: "Aika tambaya", exact: true })
    .waitFor();
  assert.equal(await page.locator("html").getAttribute("lang"), "ha");
  await page.getByRole("link", { name: "English", exact: true }).click();
  await page.waitForURL(`${base}/chat/`);
  await page
    .getByRole("button", { name: "Send question", exact: true })
    .waitFor();
  await page.locator("#chat-year").selectOption("");
  await ask("And which year was that reported?");
  assert.match(await lastAnswer().innerText(), /canonical report year/);
  const downloadPromise = page.waitForEvent("download");
  await lastAnswer()
    .getByRole("button", { name: "Download calculation", exact: true })
    .click();
  const download = await downloadPromise;
  const receipt = JSON.parse(await readFile(await download.path(), "utf8"));
  assert.equal(receipt.datasetVersion, "v1");
  assert.match(receipt.bundleSha256, /^[a-f0-9]{64}$/);
  assert.ok(!JSON.stringify(receipt).includes("And which year"));
  results.checks.push(
    "Back/Forward locale synchronisation, contextual report-year follow-up and privacy-preserving receipt",
  );

  await ask("Were 36,551 jobs delivered?");
  assert.match(await lastAnswer().innerText(), /target/);
  assert.match(await lastAnswer().innerText(), /delivery.*not established/);
  await ask("How many unique people benefited overall?");
  assert.match(await lastAnswer().innerText(), /overlap/);
  await ask("How many SMEDAN activities?");
  assert.equal(
    await lastAnswer().evaluate((e) =>
      e.classList.contains("chat-answer-clarification"),
    ),
    true,
  );
  await ask("How many SMEDAN participants in Kano?");
  assert.ok(
    !/5 people reportedly supported/.test(await lastAnswer().innerText()),
  );
  await ask("How many activities reported in 1900?");
  assert.match(await lastAnswer().innerText(), /0 documented activity records/);
  assert.match(
    await lastAnswer().innerText(),
    /does not establish zero real-world activity/,
  );
  assert.equal(await page.locator("#chat-year").inputValue(), "1900");
  await ask("Show topics");
  assert.match(await lastAnswer().innerText(), /Clear the report-year filter/);
  await lastAnswer()
    .getByRole("button", { name: "Clear context and report year", exact: true })
    .click();
  assert.equal(await page.locator("#chat-year").inputValue(), "");
  assert.equal(await page.locator(".chat-turn").count(), 0);
  results.checks.push(
    "Targets, overlap refusal, wrong counting grain, unsupported geography and empty-year interpretation",
  );

  await page.getByRole("button", { name: /Start again/ }).click();
  assert.equal(await page.locator(".chat-turn").count(), 0);
  assert.equal(await page.locator("#chat-question").inputValue(), "");
  assert.equal(await page.locator("#chat-year").inputValue(), "");
  await ask("Show topics");
  assert.equal(
    await lastAnswer().locator(".chat-result-items li").count(),
    bundle.topics.length,
  );
  await ask("Explain the methodology");
  assert.match(await lastAnswer().innerText(), /NMF/);
  await ask("find: SMEDAN");
  assert.match(await lastAnswer().innerText(), /keyword lookup/);
  assert.ok((await lastAnswer().locator(".chat-result-items li").count()) > 0);
  for (let i = 0; i < 12; i++)
    await ask(
      i % 2 ? "Show categories" : "How many activities are documented?",
    );
  await page.locator("#chat-question").fill("Draft after a long conversation");
  await page.setViewportSize({ width: 390, height: 844 });
  await languageGeometry();
  await audit("English mobile long transcript");
  await page.screenshot({
    path: "output/playwright/chat-mobile-conversation.png",
    fullPage: true,
  });
  assert.ok(await page.locator("#chat-question").isVisible());
  results.checks.push(
    "Reset, eight frozen topics, method explanation, keyword evidence and usable long mobile transcript",
  );

  await page.goto(`${base}/ha/chat/`);
  await page
    .getByRole("button", { name: "Aika tambaya", exact: true })
    .waitFor();
  assert.equal(await page.locator(".chat-turn").count(), 0);
  await ask("Mutane nawa SMEDAN ta tallafa wa?");
  assert.match(await lastAnswer().innerText(), /5/);
  await languageGeometry();
  await audit("Hausa direct mobile route");
  await page.screenshot({
    path: "output/playwright/chat-mobile-hausa.png",
    fullPage: true,
  });
  await page.reload();
  await page
    .getByRole("button", { name: "Aika tambaya", exact: true })
    .waitFor();
  assert.equal(await page.locator("html").getAttribute("lang"), "ha");
  assert.equal(await page.locator(".chat-turn").count(), 0);
  await page.setViewportSize({ width: 320, height: 720 });
  await languageGeometry();
  await page.addStyleTag({ content: "html{font-size:200% !important}" });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "200% text must reflow",
  );
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  assert.equal(
    await page
      .getByRole("link", { name: "Hausa", exact: true })
      .getAttribute("aria-current"),
    "page",
  );
  results.checks.push(
    "Direct Hausa route and refresh stay Hausa; in-memory session clears; 320px/200% text reflow, reduced motion and forced-colour active-language marker",
  );

  assert.deepEqual(results.errors, []);
  assert.deepEqual(results.externalRequests, []);
  assert.deepEqual(results.failedResponses, []);
  assert.ok(
    results.axe.every((a) => a.violations.length === 0),
    JSON.stringify(results.axe),
  );
  console.log(JSON.stringify(results, null, 2));
} finally {
  await writeFile(
    "output/chat-browser-results.json",
    JSON.stringify(results, null, 2) + "\n",
  );
  await browser.close();
}
