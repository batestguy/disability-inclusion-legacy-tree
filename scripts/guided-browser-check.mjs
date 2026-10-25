import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";

const bundle = JSON.parse(await readFile("content/dashboard/v1/bundle.json", "utf8"));
const base = process.env.TEST_URL || "http://127.0.0.1:8767";
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
const context = await browser.newContext({ viewport: { width: 1440, height: 1050 }, reducedMotion: "reduce", acceptDownloads: true });
const page = await context.newPage();
const results = { date: new Date().toISOString(), base, completed: false, checks: [], axe: [], errors: [], failedResponses: [], externalRequests: [] };
page.on("pageerror", (e) => results.errors.push(e.message));
page.on("response", (r) => { if (r.status() >= 400) results.failedResponses.push({ status: r.status(), url: r.url() }); });
page.on("request", (r) => { if (new URL(r.url()).origin !== new URL(base).origin) results.externalRequests.push(r.url()); });
await mkdir("output/playwright", { recursive: true });
const current = () => page.locator("#guided-answer");
const toolbar = () => page.getByRole("navigation", { name: /Conversation navigation|Kewayawa a tattaunawa/ });
async function back() { await toolbar().getByRole("button", { name: /Back|Koma baya/ }).click(); }
async function start() {
  const reset = page.getByRole("button", { name: /^(Start again|Fara sabo)$/ });
  if (await reset.count()) await reset.click();
  else await page.goto(`${base}/chat/`);
  await page.locator('#guided-answer[data-node="start"][data-view="answer"]').waitFor();
}
async function choose(target) {
  const pager = page.getByRole("navigation", { name: /^(Option pages|Shafukan zaɓi)$/ });
  if (await pager.count()) {
    const previous = pager.getByRole("button", { name: /^(Previous|Na baya)$/ });
    while (await previous.isEnabled()) await previous.click();
  }
  for (let attempt = 0; attempt < 64; attempt++) {
    const button = page.locator(`.guided-options button[data-target="${target}"]`);
    if (await button.count()) { await button.click(); await page.locator(`#guided-answer[data-node="${target}"]`).waitFor(); return; }
    const next = pager.getByRole("button", { name: /More options|Ƙarin zaɓi/ });
    assert.ok(await next.count() && await next.isEnabled(), `choice not reachable: ${target}`);
    await next.click();
  }
  assert.fail(`choice pagination did not terminate: ${target}`);
}
async function audit(label) {
  const a = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  results.axe.push({ label, violations: a.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target) })) });
}
async function compact({ fitsScreen = false } = {}) {
  assert.ok(await page.locator(".guided-options > button").count() <= 3, "too many choices displayed");
  assert.equal(await page.locator(".guided-intro,.guided-breadcrumb,.guided-inventory,.guided-history,.guided-bottom-note,details").count(), 0);
  assert.equal(await page.locator(".guided-answer").count(), 1);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "horizontal overflow");
  const scrollers = await page.locator(".guided-conversation").evaluate((el) => [el, ...el.querySelectorAll("*")].filter((n) => ["auto", "scroll"].includes(getComputedStyle(n).overflowY) && n.scrollHeight > n.clientHeight + 1).length);
  assert.equal(scrollers, 0, "chatbot has an internal scroller");
  if (fitsScreen) {
    await page.evaluate(() => window.scrollTo(0, 0));
    const box = await page.locator(".guided-conversation").boundingBox();
    assert.ok(box && box.y + box.height <= await page.evaluate(() => innerHeight), "ordinary phone step needs page scrolling");
  }
  const group = page.getByRole("group", { name: "Change language / Canja harshe", exact: true });
  const en = await group.getByRole("link", { name: "English", exact: true }).boundingBox();
  const ha = await group.getByRole("link", { name: "Hausa", exact: true }).boundingBox();
  assert.ok(en && ha && en.y + en.height <= ha.y && Math.abs(en.x - ha.x) < 2);
}
async function sources() {
  await current().getByRole("button", { name: /^(View sources|Duba tushe)$/ }).click();
  await page.locator('#guided-answer[data-view="sources"]').waitFor();
}
async function openFirstSource() {
  const choice = page.locator(".guided-options button[data-source]").first();
  const id = await choice.getAttribute("data-source");
  await choice.click();
  await page.locator('#guided-answer[data-view="source"]').waitFor();
  assert.equal(await page.locator(".guided-source-link").getAttribute("href"), bundle.sources.find((s) => s.id === id).url);
  return id;
}
try {
  await page.goto(`${base}/chat/`);
  await page.locator('#guided-answer[data-node="start"]').waitFor();
  assert.equal(await page.locator('.guided-options > button').first().getAttribute('data-target'), 'programmes');
  assert.equal(await current().locator("p").count(), 0, "start should contain just the question and options");
  assert.equal(await page.locator(".guided-options button").count(), 3);
  const oldFirst = await page.locator(".guided-options button").first().getAttribute("data-target");
  await page.getByRole("button", { name: "More options", exact: true }).click();
  assert.equal(await page.locator(`.guided-options button[data-target="${oldFirst}"]`).count(), 0, "old options remained after replacement");
  await compact();
  await page.getByRole("button", { name: "Previous", exact: true }).click();
  const colors = await page.locator('.guided-options > button').evaluateAll((buttons) => buttons.map((button) => ({ background: getComputedStyle(button).backgroundColor, color: getComputedStyle(button).color })));
  assert.deepEqual(colors.map((entry) => entry.background), ['rgb(23, 83, 59)', 'rgb(255, 255, 255)', 'rgb(23, 83, 59)']);
  assert.equal(colors[0].color, 'rgb(255, 255, 255)');
  assert.ok((await page.locator('.guided-options > button').first().evaluate((button) => getComputedStyle(button).cursor)).includes('/branding/ossap-cursor.jpg'));
  assert.ok(!(await page.locator('.guided-workspace').evaluate((el) => getComputedStyle(el).cursor)).includes('/branding/ossap-cursor.jpg'));
  const cursorSwitch = page.getByRole('checkbox', { name: 'Logo cursor', exact: true });
  await cursorSwitch.uncheck();
  assert.ok(!(await page.locator('.guided-options > button').first().evaluate((button) => getComputedStyle(button).cursor)).includes('/branding/ossap-cursor.jpg'));
  await cursorSwitch.check();
  await audit("Minimal English start");
  await page.screenshot({ path: "output/playwright/chat-guided-desktop.png", fullPage: true });
  results.checks.push("Question-only start, three replacing choices per page, no sidebar, duplicate path, transcript or internal scroller");
  results.checks.push('Activities/results lead the start; green/white/green choices have readable text; official local logo cursor is limited to links/buttons and can be disabled');

  await choose("women");
  assert.match(await current().innerText(), /45/); assert.match(await current().innerText(), /20/);
  assert.doesNotMatch(await current().innerText(), /\b65\b/);
  assert.match(await current().innerText(), /Do not add/);
  await sources();
  await page.locator('.guided-options button[data-source="3531"]').click();
  assert.match(await current().innerText(), /45 women with disabilities/);
  await back(); await back();
  await choose("activity:nigwed-skills-2024");
  await choose("measure:nigwed-skills-2024:trainees");
  assert.equal(await current().evaluate((el) => el === document.activeElement), true);
  await back();
  await page.getByRole("link", { name: "Hausa", exact: true }).click();
  await page.waitForURL(/\/ha\/chat\//);
  const next = toolbar().getByRole("button", { name: /^Gaba/ });
  await next.focus(); await page.keyboard.press("Enter");
  await page.locator('#guided-answer[data-node="measure:nigwed-skills-2024:trainees"]').waitFor();
  await sources(); const sourceId = await openFirstSource();
  const excerpt = await current().locator(".guided-detail p, .guided-detail blockquote").innerText();
  assert.equal(await page.getByRole('status').locator('span[lang="en"]').textContent(), await current().locator('.guided-detail p, .guided-detail blockquote').textContent());
  const selectedEvidence = bundle.observations.find((o) => o.id === "nigwed-skills-2024:trainees").evidence.find((e) => (e.source_ids ?? [e.source_id]).includes(sourceId));
  assert.ok(selectedEvidence.text.includes(excerpt.trim()));
  assert.equal(await current().locator("blockquote").count(), selectedEvidence.kind === "exact-source-excerpt" ? 1 : 0);
  await page.getByRole("link", { name: "English", exact: true }).click();
  await page.waitForURL(/(?<!ha)\/chat\//);
  await page.locator('#guided-answer[data-view="source"]').waitFor();
  assert.equal(await page.locator(".guided-source-link").getAttribute("href"), bundle.sources.find((s) => s.id === sourceId).url);
  await back();
  await page.locator('.guided-options button[data-source="3531"]').click();
  const sourceParts = [];
  for (let part = 0; part < 64; part++) {
    sourceParts.push(await current().locator(".guided-detail p, .guided-detail blockquote").textContent());
    assert.ok((await page.getByRole('status').textContent()).includes(sourceParts.at(-1)), 'source reader did not announce its new content');
    const more = page.getByRole("button", { name: "Continue", exact: true });
    if (!await more.isEnabled()) break;
    await more.click();
  }
  const original = bundle.observations.find((o) => o.id === "nigwed-skills-2024:trainees").evidence.find((e) => e.source_id === "3531");
  assert.equal(sourceParts.join(""), [original.text, original.isa_role, original.limitations, original.date_basis].join(""), "paged source content was lost or duplicated");
  await back(); await back();
  await back();
  await choose("evidence:nigwed-skills-2024");
  assert.equal(await current().getAttribute("data-view"), "sources");
  assert.equal(await toolbar().getByRole("button", { name: /^Next/ }).count(), 0);
  await page.goBack();
  await page.locator('#guided-answer[data-node="activity:nigwed-skills-2024"]').waitFor();
  await page.goForward();
  await page.locator('#guided-answer[data-node="evidence:nigwed-skills-2024"]').waitFor();
  assert.equal(await current().getAttribute('data-view'), 'sources');
  await page.reload();
  await page.locator('#guided-answer[data-node="evidence:nigwed-skills-2024"][data-view="sources"]').waitFor();
  results.checks.push("Separate women cohorts, keyboard Back/Next, branch replacement, browser history and selected source preserved across languages");

  await start(); await choose("programmes");
  await page.getByRole('button', { name: 'More options', exact: true }).click();
  const priorChoices = await page.locator('.guided-options button').evaluateAll((buttons) => buttons.map((button) => button.dataset.target));
  await current().getByRole('button', { name: 'Details', exact: true }).click();
  await back();
  assert.deepEqual(await page.locator('.guided-options button').evaluateAll((buttons) => buttons.map((button) => button.dataset.target)), priorChoices, 'Details reset the option page');
  const figureNames = new Map();
  for (const observation of bundle.observations) {
    await choose(`measure:${observation.id}`);
    assert.match(await current().innerText(), new RegExp(observation.value.toLocaleString("en-GB")));
    if (observation.bound === "greater-than") assert.match(await current().innerText(), /More than/);
    if (observation.bound === "at-least") assert.match(await current().innerText(), /At least/);
    if (observation.bound === "approximate") assert.match(await current().innerText(), /About/);
    if (observation.stage === "target") assert.match(await current().innerText(), /Target|planned/);
    await sources(); await openFirstSource(); await back(); await back();
    await current().getByRole("button", { name: "Details", exact: true }).click();
    const pending = page.waitForEvent("download");
    await current().getByRole("button", { name: /Download answer record/ }).click();
    const receipt = JSON.parse(await readFile(await (await pending).path(), "utf8"));
    for (const key of ["value", "bound", "unit", "stage", "population"]) assert.equal(receipt.claims[0][key], observation[key]);
    assert.deepEqual(receipt.claims[0].observationIds, [observation.id]);
    await compact(); await back(); await back();
    await page.locator('#guided-answer[data-node="programmes"]').waitFor();
  }
  results.checks.push("All 11 numerical choices reachable through pagination; bounds, stages and units stay visible; full source links and receipt claims preserved");

  const figurePages = page.getByRole('navigation', { name: 'Option pages', exact: true });
  while (await figurePages.getByRole('button', { name: 'Previous', exact: true }).isEnabled()) await figurePages.getByRole('button', { name: 'Previous', exact: true }).click();
  for (let index = 0; index < 10; index++) {
    for (const button of await page.locator('.guided-options button').all()) figureNames.set(await button.getAttribute('data-target'), await button.innerText());
    const more = figurePages.getByRole('button', { name: 'More options', exact: true });
    if (!await more.isEnabled()) break;
    await more.click();
  }
  const karuObservation = bundle.observations.find((observation) => observation.activity_id === 'karu-food-cash-2024' && observation.stage === 'reported-delivery');
  const karuFigure = figureNames.get(`measure:${karuObservation.id}`);
  const ramadanObservation = bundle.observations.find((observation) => observation.activity_id === 'ramadan-food-2024');
  const ramadanFigure = figureNames.get(`measure:${ramadanObservation.id}`);
  assert.ok(karuFigure && ramadanFigure && karuFigure !== ramadanFigure, 'same-value programme choices are indistinguishable');
  assert.match(karuFigure, /Karu/i); assert.match(ramadanFigure, /Ramadan/i);
  await start(); await choose('scope'); await sources();
  await page.getByRole('button', { name: 'More sources', exact: true }).click();
  const sourcePage = await page.locator('.guided-options button').evaluateAll((buttons) => buttons.map((button) => button.dataset.source));
  await openFirstSource(); await back();
  assert.deepEqual(await page.locator('.guided-options button').evaluateAll((buttons) => buttons.map((button) => button.dataset.source)), sourcePage, 'source reader reset the source list page');
  results.checks.push('Option and source page positions survive detail viewing; equally sized figures identify their programme; summary sources contain stored findings; history restores source lists; reader changes announce meaningful content');

  await start(); await choose("timeline"); await choose("year:2024");
  assert.match(await current().innerText(), /10 activity records/);
  const targets = [];
  do {
    targets.push(...await page.locator('.guided-options button[data-target^="activity:"]').evaluateAll((els) => els.map((el) => el.dataset.target)));
    const more = page.getByRole("button", { name: "More options", exact: true });
    if (!await more.isEnabled()) break;
    await more.click();
  } while (true);
  assert.equal(new Set(targets).size, 10);
  await compact(); await audit("Paged year choices");
  await start(); await choose("connections"); await choose("relationships"); await choose("relationship:toolkit-developers");
  assert.match(await current().innerText(), /not Isa/);
  await sources(); await openFirstSource();
  assert.match(await current().innerText(), /Deaf-in-Tech.*DataLead Africa/);
  await audit("Source finding with original English excerpt");
  results.checks.push("Paginated year activities remain complete; relationship attribution qualification stays visible and exact source text is available on demand");

  await start(); await context.setOffline(true); await choose("women");
  assert.match(await current().innerText(), /45/);
  await context.setOffline(false);
  await start(); await page.setViewportSize({ width: 390, height: 844 });
  await compact({ fitsScreen: true });
  await audit("English mobile question choices");
  await page.screenshot({ path: "output/playwright/chat-guided-mobile.png", fullPage: true });
  await choose("women"); await compact({ fitsScreen: true });
  await page.getByRole("link", { name: "Hausa", exact: true }).click();
  await page.waitForURL(/\/ha\/chat\//); await compact({ fitsScreen: true });
  await audit("Hausa mobile concise women answer");
  await page.screenshot({ path: "output/playwright/chat-guided-hausa.png", fullPage: true });
  await page.setViewportSize({ width: 320, height: 720 });
  await page.addStyleTag({ content: "html{font-size:200%!important}" });
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await compact();
  assert.ok(!(await page.locator('.guided-options > button').first().evaluate((button) => getComputedStyle(button).cursor)).includes('/branding/ossap-cursor.jpg'));
  assert.equal(await page.getByRole("link", { name: "Hausa", exact: true }).getAttribute("aria-current"), "page");
  results.checks.push("Loaded choices work offline; ordinary English/Hausa phone steps fit without scrolling; 320px, 200% text and forced colours reflow without clipped content");

  await page.goto(`${base}/chat/#flow=${encodeURIComponent("start|activity:missing")}`);
  await page.locator('#guided-answer[data-node="start"]').waitFor();
  await page.goto(`${base}/chat/#flow=${encodeURIComponent("start|women|activity:nigwed-skills-2024")}`);
  await page.locator('#guided-answer[data-node="activity:nigwed-skills-2024"]').waitFor();
  await page.reload(); await page.locator('#guided-answer[data-node="activity:nigwed-skills-2024"]').waitFor();
  assert.deepEqual(results.errors, []); assert.deepEqual(results.failedResponses, []); assert.deepEqual(results.externalRequests, []);
  assert.ok(results.axe.every((a) => a.violations.length === 0), JSON.stringify(results.axe));
  results.completed = true;
  console.log(JSON.stringify(results, null, 2));
} finally {
  await writeFile("output/guided-browser-results.json", JSON.stringify(results, null, 2) + "\n");
  await browser.close();
}
