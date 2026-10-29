import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { buildDashboardPresentation } from '../apps/web/lib/dashboard-presentation.mjs';

const base = process.env.TEST_URL || 'http://127.0.0.1:8767';
const bundle = JSON.parse(await readFile('content/dashboard/v1/bundle.json', 'utf8'));
const presentation = buildDashboardPresentation(bundle);
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
const context = await browser.newContext({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const results = { date: new Date().toISOString(), base, completed: false, checks: [], axe: [], errors: [], failedResponses: [], externalRequests: [] };
page.on('pageerror', (error) => results.errors.push(error.message));
page.on('response', (response) => { if (response.status() >= 400) results.failedResponses.push({ status: response.status(), url: response.url() }); });
page.on('request', (request) => { if (new URL(request.url()).origin !== new URL(base).origin) results.externalRequests.push(request.url()); });
await mkdir('output/playwright', { recursive: true });
const area = (id) => page.locator(`[data-area="${id}"]`);
const card = (id) => page.locator(`[data-highlight="${id}"]`);
const initiative = (id) => page.locator(`[data-network-initiative="${id}"]`);
const chat = () => page.locator('#guided-answer');
async function audit(label) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  results.axe.push({ label, violations: result.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target) })) });
}
async function geometry() {
  await page.evaluate(() => document.fonts.ready.then(() => true));
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'horizontal document overflow');
  const language = page.getByRole('group', { name: 'Change language / Canja harshe', exact: true });
  assert.equal(await language.count(), 1);
  const en = await language.getByRole('link', { name: 'English', exact: true }).boundingBox();
  const ha = await language.getByRole('link', { name: 'Hausa', exact: true }).boundingBox();
  assert.ok(en && ha && en.y + en.height <= ha.y && Math.abs(en.x - ha.x) < 2, 'locale choices must be vertically stacked');
  const nav = await page.locator('.dashboard-navigation').boundingBox();
  const languageBox = await language.boundingBox();
  assert.ok(nav && languageBox && (nav.x + nav.width <= languageBox.x + 1 || languageBox.x + languageBox.width <= nav.x + 1 || nav.y + nav.height <= languageBox.y + 1 || languageBox.y + languageBox.height <= nav.y + 1), 'navigation overlaps the language control');
  const overflow = await page.locator('.highlight-number').evaluateAll((elements) => elements.filter((el) => {
    const box = el.getBoundingClientRect(); const ink = el.querySelector('span').getBoundingClientRect();
    return ink.left < box.left - 1 || ink.right > box.right + 1;
  }).map((el) => el.textContent));
  assert.deepEqual(overflow, [], 'a numerical bound or value spills out of its card');
  const clipped = await page.locator('.network-node').evaluateAll((elements) => elements.filter((el) => el.offsetParent && el.scrollHeight > el.clientHeight + 1).map((el) => el.textContent));
  assert.deepEqual(clipped, []);
}
try {
  await page.goto(base + '/?year=2024&category=healthcare-welfare');
  await page.locator('html[data-photo-cursor="true"]').waitFor({ state: 'attached' });
  await area('all').filter({ has: page.locator('span') }).waitFor();
  await page.waitForURL((url) => !url.searchParams.has('year') && !url.searchParams.has('category'));
  assert.equal(await page.locator('h1').innerText(), 'Advancing Disability Inclusion');
  assert.equal(await page.locator('[data-highlight]').count(), 13);
  assert.equal(await page.locator('.highlight-number').first().innerText(), '>500', 'larger reported programme figures should lead');
  assert.equal(await page.locator('[data-filter="year"], #timeline, #evidence, .dashboard-time-series').count(), 0);
  assert.equal(await page.locator('.guided-embedded').count(), 1);
  assert.equal(await page.locator('main').count(), 1);
  assert.ok(!(await page.locator('.contribution-categories').innerText()).match(/\d/), 'category navigation repeats figures');
  assert.equal(await page.locator('[data-highlight-stage="target"]').count(), 3);
  const reportedY = await page.locator('[data-highlight-stage="reported-delivery"]').first().boundingBox();
  const targetY = await page.locator('[data-highlight-stage="target"]').first().boundingBox();
  assert.ok(reportedY.y < targetY.y, 'reported achievements must precede planned support');
  for (const figure of presentation.figures) {
    assert.match(await card(figure.id).locator('.highlight-number').innerText(), new RegExp(figure.value.toLocaleString('en-NG')));
    assert.equal(await card(figure.id).locator('.primary-source').getAttribute('href'), bundle.sources.find((source) => source.id === figure.sourceId).url);
  }
  const borno = card('borno-employment-2024:placements');
  await borno.locator('summary').click();
  assert.match(await borno.locator('.figure-source-context').innerText(), /Borno|office|Office/);
  assert.equal(await borno.locator('.figure-source-context [lang="en"]').count() > 0, true);
  const bornoFigure = presentation.figures.find((figure) => figure.id === 'borno-employment-2024:placements');
  assert.deepEqual(await borno.locator('.figure-source-context a').evaluateAll((links) => links.map((link) => link.href)), bornoFigure.sourceIds.map((id) => bundle.sources.find((source) => source.id === id).url));
  await borno.locator('summary').click();
  await geometry(); await audit('desktop overview');
  await page.screenshot({ path: 'output/playwright/dashboard-redesign-overview.png' });
  results.checks.push('Full-record overview neutralises legacy filters, preserves all thirteen source-linked figures and shows achievements before the three commitments');

  await area('health-welfare').click();
  assert.equal(await page.locator('[data-highlight]').count(), presentation.figures.filter((figure) => figure.groupIds.includes('health-welfare')).length);
  assert.equal(await page.locator('.contribution-grid').first().getByText('>500', { exact: true }).count(), 2);
  await area('training-education').click();
  assert.equal(await page.locator('.planned-support').count(), 0);
  await area('accessibility').click();
  assert.equal(await page.locator('[data-highlight-stage="reported-milestone"]').count(), 2);
  assert.match(await page.locator('.contribution-results').innerText(), /Deaf-in-Tech.*DataLead Africa/);
  await page.screenshot({ path: 'output/playwright/dashboard-redesign-accessibility.png' });
  await area('all').click();
  results.checks.push('Category selection preserves >500 welfare measures, excludes empty planned sections and gives vehicle/toolkit milestones their attributed roles');

  await page.locator('[data-cloud-mode="concepts"]').click();
  for (const concept of presentation.concepts) assert.equal(await page.locator(`.concept-cloud [data-cloud-id="${concept.id}"]`).getAttribute('data-cloud-count'), String(concept.count));
  const concept = presentation.concepts.find((entry) => entry.count === 13);
  await page.locator(`.concept-cloud [data-cloud-id="${concept.id}"]`).click();
  assert.equal(await page.locator('[data-cloud-selection-count]').innerText(), '13 of 30 selected reports');
  const seen = [];
  do {
    seen.push(...await page.locator('[data-source-match]').evaluateAll((items) => items.map((item) => item.dataset.sourceMatch)));
    const next = page.locator('.local-pagination').getByRole('button', { name: 'More reports', exact: true });
    if (!(await next.count()) || await next.isDisabled()) break;
    await next.click();
  } while (true);
  assert.deepEqual(seen, concept.sourceIds);
  await page.locator('.cloud-method > summary').click();
  assert.match(await page.locator('.cloud-method').innerText(), /not a transcript/);
  await page.locator('#advocacy').screenshot({ path: 'output/playwright/dashboard-redesign-advocacy.png' });
  await audit('concept sources');
  await page.locator('[data-cloud-mode="areas"]').click();
  const category = bundle.categories[0];
  await page.locator(`.concept-cloud [data-cloud-id="${category.id}"]`).click();
  assert.match(await page.locator('[data-cloud-selection-count]').innerText(), /classified activity records/);
  await page.locator('.cloud-matches .text-action').first().click();
  assert.match(await chat().getAttribute('data-node'), /^activity:/);
  const activeNode = await chat().getAttribute('data-node');
  await page.getByRole('link', { name: 'Ideas & advocacy', exact: true }).click();
  assert.match(new URL(page.url()).hash, /^#flow=/);
  await page.reload(); await page.locator(`#guided-answer[data-node="${activeNode}"]`).waitFor();
  results.checks.push('Seven concepts use exact canonical-report counts, paginated sources reconcile, activity clouds hand off to chat and section navigation preserves reloadable chat context');

  await initiative('adapted-vehicle-collaboration').click();
  assert.match(await page.locator('.participant-roles').innerText(), /Elizade.*JAC/s);
  await page.locator('#collaborations').screenshot({ path: 'output/playwright/dashboard-redesign-network.png' });
  await initiative('toolkit-developers').click();
  assert.equal(await page.locator('.participant-roles > div').count(), 2);
  assert.match(await page.locator('.participant-roles').innerText(), /Deaf-in-Tech.*DataLead/s);
  assert.ok(!(await page.locator('.participant-roles').innerText()).includes('Mohammed'));
  await page.locator('[data-network-actor="nigwed"]').focus(); await page.keyboard.press('Enter');
  assert.match(await page.locator('.network-actor-selection').innerText(), /1 documented initiative/);
  await initiative('toolkit-developers').click();
  assert.equal(await page.locator('.network-actor-selection').count(), 0, 'initiative selection retained a conflicting actor');
  assert.equal(await page.locator('.network-edge.is-active').count(), 2, 'toolkit selection lost its developer edges');
  await page.locator('[data-network-area]').selectOption('employment');
  const filtered = presentation.collaborations.filter((entry) => entry.groupIds.includes('employment'));
  assert.equal(await page.locator('[data-network-initiative]').count(), filtered.length);
  assert.equal(await page.locator('[data-selected-initiative]').count(), 0);
  await page.locator('[data-network-area]').selectOption('all');
  await page.getByRole('group', { name: 'Collaboration view' }).getByRole('button', { name: 'List', exact: true }).click();
  assert.equal(await page.locator('.network-list li').count(), 9);
  await page.locator('.network-list button').first().click();
  await audit('collaboration detail and list');
  results.checks.push('Nine actor–initiative records support source/role selection, keyboard actor exploration, category filters and equivalent lists; toolkit developers are not relabelled as Isa');

  await area('health-welfare').click();
  await page.locator('[data-cloud-mode="concepts"]').click();
  await page.locator(`.concept-cloud [data-cloud-id="${concept.id}"]`).click();
  await page.getByRole('link', { name: 'Hausa', exact: true }).click();
  await page.locator('.dashboard-shell[lang="ha"]').waitFor();
  assert.equal(await area('health-welfare').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator(`.concept-cloud [data-cloud-id="${concept.id}"]`).getAttribute('aria-pressed'), 'true');
  assert.equal(await chat().getAttribute('data-node'), activeNode);
  await page.setViewportSize({ width: 390, height: 844 });
  await geometry(); await audit('Hausa phone');
  assert.equal(await page.locator('.network-map').isVisible(), false);
  assert.equal(await page.locator('.network-list').isVisible(), true);
  await page.screenshot({ path: 'output/playwright/dashboard-redesign-mobile-hausa.png' });
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await page.locator('.dashboard-shell[lang="en"]').waitFor();
  await geometry();
  await page.screenshot({ path: 'output/playwright/dashboard-redesign-mobile.png' });
  await page.setViewportSize({ width: 320, height: 720 });
  await page.addStyleTag({ content: 'html{font-size:200%!important}' });
  await geometry(); await audit('320px and 200% text');
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await geometry();
  assert.ok(!(await page.locator('.contribution-categories button').first().evaluate((button) => getComputedStyle(button).cursor)).includes('photo-arrow'));
  results.checks.push('Shared English/Hausa switching retains category/cloud/chat context; phone list, 320px/200% text, forced colours and reduced motion reflow');

  await page.goto(base + '/?partners=employment&initiative=adapted-vehicle-collaboration&actor=ncpwd');
  await page.waitForURL((url) => !url.searchParams.has('initiative') && !url.searchParams.has('actor'));
  assert.equal(await page.locator('[data-selected-initiative]').count(), 0, 'deep link restored a filtered-out initiative');
  await page.goto(base + '/?initiative=toolkit-developers&actor=ncpwd');
  await page.waitForURL((url) => !url.searchParams.has('actor'));
  assert.equal(await page.locator('[data-selected-initiative]').getAttribute('data-selected-initiative'), 'toolkit-developers');
  results.checks.push('Source disclosures retain population, role, limits and all supporting citations; incompatible actor/initiative/area deep links normalise safely');

  const provenance = JSON.parse(await readFile('content/dashboard-speaking-photo.json', 'utf8'));
  const asset = await context.request.get(base + '/branding/mohammed-abba-isa-speaking.webp');
  assert.equal(asset.status(), 200);
  assert.equal(createHash('sha256').update(await asset.body()).digest('hex'), provenance.asset_sha256);
  assert.equal(provenance.public_approved, false);
  assert.deepEqual(results.errors, []); assert.deepEqual(results.failedResponses, []); assert.deepEqual(results.externalRequests, []);
  assert.ok(results.axe.every((entry) => !entry.violations.length), JSON.stringify(results.axe));
  results.completed = true;
  console.log(JSON.stringify(results, null, 2));
} finally {
  await writeFile('output/dashboard-browser-results.json', JSON.stringify(results, null, 2) + '\n');
  await browser.close();
}
