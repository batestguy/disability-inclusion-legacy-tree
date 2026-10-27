import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const base = process.env.TEST_URL || 'http://127.0.0.1:8767';
const bundle = JSON.parse(await readFile('content/dashboard/v1/bundle.json', 'utf8'));
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
const context = await browser.newContext({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'reduce', acceptDownloads: true });
const page = await context.newPage();
const results = { date: new Date().toISOString(), base, completed: false, checks: [], axe: [], errors: [], failedResponses: [], externalRequests: [] };
page.on('pageerror', (error) => results.errors.push(error.message));
page.on('response', (response) => { if (response.status() >= 400) results.failedResponses.push({ status: response.status(), url: response.url() }); });
page.on('request', (request) => { if (new URL(request.url()).origin !== new URL(base).origin) results.externalRequests.push(request.url()); });
await mkdir('output/playwright', { recursive: true });
const kpi = (name) => page.locator(`[data-kpi="${name}"]`);
const filter = (name) => page.locator(`[data-filter="${name}"]`);
const chat = () => page.locator('#guided-answer');
const reader = () => page.locator('.dashboard-evidence-reader');
async function openFilters() {
  if (!(await page.locator('.highlight-filter-disclosure').evaluate((element) => element.open))) await page.locator('.highlight-filter-disclosure > summary').click();
}
async function selectFilter(name, value) { await openFilters(); await filter(name).selectOption(value); }
async function audit(label) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  results.axe.push({ label, violations: result.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target) })) });
}
async function geometry() {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'horizontal document overflow');
  const heading = await page.locator('.highlight-heading h1').boundingBox();
  const edition = await page.locator('.highlight-edition').boundingBox();
  assert.ok(heading.x + heading.width <= edition.x, 'dashboard title overlaps the date');
  const language = page.getByRole('group', { name: 'Change language / Canja harshe', exact: true });
  assert.equal(await language.count(), 1, 'dashboard/chat must share one language control');
  const en = await language.getByRole('link', { name: 'English', exact: true }).boundingBox();
  const ha = await language.getByRole('link', { name: 'Hausa', exact: true }).boundingBox();
  assert.ok(en && ha && en.y + en.height <= ha.y && Math.abs(en.x - ha.x) < 2, 'language choices not vertically stacked');
  const overflowingNumbers = await page.locator('.highlight-number').evaluateAll((elements) => elements.filter((element) => {
    const box = element.getBoundingClientRect();
    const ink = element.querySelector('span').getBoundingClientRect();
    return ink.left < box.left - 1 || ink.right > box.right + 1;
  }).map((element) => element.textContent));
  assert.deepEqual(overflowingNumbers, [], 'KPI number spills outside its card');
}
function parseCsv(text) {
  text = text.replace(/^\uFEFF/, '');
  const rows = []; let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') { if (quoted && text[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted; }
    else if (c === ',' && !quoted) { row.push(cell); cell = ''; }
    else if (c === '\r' && text[i + 1] === '\n' && !quoted) { row.push(cell); rows.push(row); row = []; cell = ''; i++; }
    else cell += c;
  }
  return rows;
}
async function exportCsv(name) {
  const [file] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name, exact: true }).click(),
  ]);
  return parseCsv(await readFile(await file.path(), 'utf8'));
}
async function clear() { await openFilters(); await page.locator('.dashboard-reset').click(); await kpi('activities').filter({ hasText: /^33$/ }).waitFor(); }
try {
  await page.goto(base + '/');
  await page.locator('html[data-photo-cursor="true"]').waitFor({ state: 'attached' });
  await page.evaluate(() => document.fonts.ready.then(() => true));
  assert.equal(await kpi('activities').innerText(), '33');
  assert.equal(await kpi('reported').innerText(), '8');
  assert.equal(await kpi('targets').innerText(), '3');
  assert.match(await page.locator('.dashboard-selection-status').innerText(), /33 activities.*36 sources/);
  assert.equal(await page.locator('.guided-embedded').count(), 1);
  assert.equal(await page.locator('main').count(), 1);
  assert.equal(await page.locator('h1').count(), 1);
  const highlights = page.locator('#overview.kpi-showcase');
  assert.equal(await page.locator('main > section').first().getAttribute('id'), 'overview');
  assert.equal(await highlights.evaluate((element) => getComputedStyle(element).backgroundColor), 'rgb(255, 255, 255)');
  assert.equal(await highlights.locator('[data-highlight]').count(), 11);
  assert.equal(await highlights.locator('[data-highlight-stage="target"]').count(), 3);
  assert.equal(await highlights.locator('[data-highlight-stage="reported-delivery"]').count(), 8);
  assert.equal(await highlights.locator('.highlight-stage').count(), 0);
  assert.equal(await page.locator('.dashboard-figure .dashboard-stage, .dashboard-record-stage').count(), 0);
  assert.doesNotMatch(await highlights.innerText(), /PLANNED · NOT DELIVERED/);
  for (const observation of bundle.observations) {
    const sourceLink = highlights.locator(`[data-highlight="${observation.id}"] a`);
    const ids = observation.evidence.flatMap((entry) => entry.source_ids ?? (entry.source_id ? [entry.source_id] : []));
    const validUrls = ids.map((id) => bundle.sources.find((source) => source.id === id)?.url).filter(Boolean);
    assert.ok(validUrls.includes(await sourceLink.getAttribute('href')), `KPI source not tied to ${observation.id}`);
    assert.equal(await sourceLink.getAttribute('target'), '_blank');
  }
  assert.equal(await highlights.locator('[data-highlight]').first().getAttribute('data-highlight'), 'beyond-disability-coordination-2024:projected-opportunities');
  assert.match(await highlights.locator('[data-highlight]').first().innerText(), /36,551.*job opportunities/s);
  await highlights.locator('[data-highlight-category="targets"]').click();
  assert.equal(await highlights.locator('[data-highlight]').count(), 3);
  await highlights.locator('[data-highlight-category="achievements"]').focus(); await page.keyboard.press('Enter');
  assert.equal(await highlights.locator('[data-highlight]').count(), 8);
  assert.equal(await highlights.locator('[data-highlight-stage="target"]').count(), 0);
  await highlights.locator('[data-highlight-category="all"]').click();
  assert.equal(await highlights.locator('[data-highlight] button').count(), 0);
  assert.equal(await highlights.locator('[data-highlight] a').count(), 11);
  assert.doesNotMatch(await highlights.innerText(), /reviewed|verified|not delivered|Delivery remains/i);
  await page.evaluate(() => window.scrollTo(0, 0));
  assert.ok(await page.evaluate(() => Boolean(document.querySelector('#evidence').compareDocumentPosition(document.querySelector('#ask-records')) & Node.DOCUMENT_POSITION_FOLLOWING)), 'chatbot is not below dashboard evidence');
  await geometry(); await audit('English dashboard overview');
  const targetBaselines = await highlights.locator('.is-targets .highlight-unit').evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().bottom));
  assert.ok(Math.max(...targetBaselines) - Math.min(...targetBaselines) < 2, 'target unit baselines are uneven');
  const firstDesktopNumber = await highlights.locator('.highlight-number').first().boundingBox();
  assert.ok(firstDesktopNumber.y < 380, 'desktop chrome delays the first KPI');
  await page.screenshot({ path: 'output/playwright/dashboard-overview.png', fullPage: false });
  await page.setViewportSize({ width: 1060, height: 1000 });
  await geometry();
  await page.setViewportSize({ width: 1440, height: 1050 });
  results.checks.push('Dashboard is the bilingual home; 33 activities, eight delivery measures, three targets and 36 linked citations; one language control and chatbot below all dashboard sections');
  results.checks.push('White KPI showcase is first: all 11 sourced figures, three targets before eight reported achievements; keyboard category controls and record evidence work without combined totals');

  await selectFilter('year', '2024');
  assert.match(await highlights.locator('.highlight-edition').innerText(), /^2024/);
  assert.match(await highlights.locator('.highlight-active-filters').innerText(), /2024/);
  assert.equal(await kpi('activities').innerText(), '10');
  assert.match(await page.locator('.dashboard-selection-status').innerText(), /10 activities/);
  await page.getByRole('button', { name: /^2024: 10 activity records/ }).click();
  assert.equal(await filter('year').inputValue(), 'all');
  await selectFilter('activity', 'karu-food-cash-2024');
  assert.equal(await kpi('activities').innerText(), '1');
  assert.equal(await kpi('reported').innerText(), '1');
  assert.equal(await kpi('targets').innerText(), '1');
  assert.equal(await page.locator('#figures').count(), 0, 'duplicated figure dashboard remains');
  assert.equal(await highlights.getByRole('img', { name: 'Reported figure: More than 500 people', exact: true }).count(), 1);
  assert.equal(await highlights.getByRole('img', { name: 'Planned target: At least 500 households', exact: true }).count(), 1);
  assert.equal(await highlights.locator('[data-highlight]').count(), 2);
  const figures = await exportCsv('Figures CSV');
  assert.equal(figures.length, 3);
  const header = figures[0];
  assert.deepEqual(figures.slice(1).map((row) => [row[header.indexOf('value')], row[header.indexOf('bound')], row[header.indexOf('unit')], row[header.indexOf('stage')]]), [['500', 'greater-than', 'people', 'reported-delivery'], ['500', 'at-least', 'households', 'target']]);
  const activities = await exportCsv('Activities CSV');
  assert.equal(activities.length, 2);
  assert.equal(activities[1][0], 'karu-food-cash-2024');
  await page.evaluate(() => { window.savedCreateObjectURL = URL.createObjectURL; URL.createObjectURL = () => { throw new Error('Export unavailable'); }; });
  try {
    await page.getByRole('button', { name: 'Figures CSV', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'The export could not be created.' }).waitFor();
  } finally {
    await page.evaluate(() => { URL.createObjectURL = window.savedCreateObjectURL; delete window.savedCreateObjectURL; });
  }
  await exportCsv('Figures CSV');
  assert.equal(await page.getByRole('alert').filter({ hasText: 'The export could not be created.' }).count(), 0);
  await selectFilter('year', '2023');
  await page.locator('[data-empty="true"]').waitFor();
  assert.equal(await kpi('activities').innerText(), '0');
  assert.equal(await highlights.locator('[data-highlight]').count(), 0);
  assert.match(await highlights.innerText(), /No figures for this selection/);
  assert.equal(await page.getByRole('button', { name: 'Figures CSV', exact: true }).isDisabled(), true);
  await audit('Empty filter result');
  results.checks.push('Year/category/activity controls use AND filtering; timeline controls work; empty results are honest; Karu delivery and household target remain separate in cards and both filtered CSV exports');

  await clear(); await selectFilter('year', '2024'); await selectFilter('category', 'healthcare-welfare'); await selectFilter('activity', 'karu-food-cash-2024');
  const evidenceTrigger = page.locator('.dashboard-records > li').first().getByRole('button').first();
  await evidenceTrigger.click();
  await reader().waitFor();
  assert.equal(await reader().getAttribute('data-selected-record'), 'karu-food-cash-2024');
  await page.waitForFunction(() => document.activeElement?.matches('.dashboard-evidence-reader'));
  await reader().getByRole('button', { name: 'Close', exact: true }).click();
  await page.waitForFunction(() => document.activeElement?.closest('.dashboard-records'));
  assert.equal(await evidenceTrigger.evaluate((element) => element === document.activeElement), true);
  await evidenceTrigger.click();
  assert.ok(await reader().locator('blockquote[lang="en"]').count() > 0);
  assert.ok((await reader().locator('.dashboard-source-list a').first().getAttribute('href')).startsWith('https://'));
  await reader().getByRole('button', { name: 'Ask the chatbot about this record', exact: true }).click();
  await page.locator('#guided-answer[data-node="activity:karu-food-cash-2024"]').waitFor();
  const karu = bundle.observations.find((observation) => observation.activity_id === 'karu-food-cash-2024' && observation.stage === 'reported-delivery');
  await page.locator(`.guided-options button[data-target="measure:${karu.id}"]`).click();
  await page.locator(`#guided-answer[data-node="measure:${karu.id}"]`).waitFor();
  assert.equal(new URL(page.url()).searchParams.get('activity'), 'karu-food-cash-2024');
  assert.equal(new URL(page.url()).searchParams.get('category'), 'healthcare-welfare');
  await page.getByRole('checkbox', { name: 'Photo cursor', exact: true }).uncheck();
  await highlights.locator('[data-highlight-category="targets"]').click();
  await page.getByRole('link', { name: 'Hausa', exact: true }).focus(); await page.keyboard.press('Enter');
  await page.waitForURL(/\/ha\//);
  await page.locator('html[lang="ha"]').waitFor({ state: 'attached' });
  assert.equal(await page.locator('html').getAttribute('lang'), 'ha');
  assert.equal(await page.locator('html').getAttribute('data-photo-cursor'), 'false');
  assert.equal(await highlights.locator('[data-highlight-category="targets"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await highlights.locator('[data-highlight]').count(), 1);
  assert.equal(await filter('activity').inputValue(), 'karu-food-cash-2024');
  assert.equal(await reader().getAttribute('data-selected-record'), 'karu-food-cash-2024');
  assert.equal(await chat().getAttribute('data-node'), `measure:${karu.id}`);
  assert.match(await chat().innerText(), /500/);
  await reader().getByRole('button', { name: 'Rufe', exact: true }).click();
  await page.waitForFunction(() => document.activeElement?.id === 'evidence');
  await page.locator('.dashboard-records > li').first().getByRole('button').first().click();
  await reader().waitFor();
  await geometry(); await audit('Hausa filtered evidence and embedded chatbot');
  await page.screenshot({ path: 'output/playwright/dashboard-chat-hausa.png', fullPage: false });
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await page.waitForURL(/\/\?/);
  await page.locator('html[lang="en"]').waitFor({ state: 'attached' });
  await page.getByRole('navigation', { name: 'Dashboard sections', exact: true }).getByRole('link', { name: 'Evidence', exact: true }).click();
  assert.equal(await chat().getAttribute('data-node'), `measure:${karu.id}`, 'section navigation reset the conversation');
  assert.equal(await page.locator('#evidence').evaluate((element) => element === document.activeElement), true);
  await page.reload();
  await page.locator(`#guided-answer[data-node="measure:${karu.id}"]`).waitFor();
  assert.equal(await filter('activity').inputValue(), 'karu-food-cash-2024');
  await page.getByRole('navigation', { name: 'Dashboard sections', exact: true }).getByRole('link', { name: 'Chatbot', exact: false }).click();
  assert.equal(await chat().getAttribute('data-node'), `measure:${karu.id}`);
  await page.reload();
  await page.locator(`#guided-answer[data-node="measure:${karu.id}"]`).waitFor();
  await chat().getByRole('button', { name: 'View sources', exact: true }).click();
  await page.locator('.guided-options button[data-source]').first().click();
  assert.equal(await chat().getAttribute('data-view'), 'source');
  const firstSource = await page.locator('.guided-source-link').getAttribute('href');
  assert.ok(firstSource.startsWith('https://'));
  await page.getByRole('navigation', { name: 'Conversation navigation', exact: true }).getByRole('button', { name: /Back/ }).click();
  await page.getByRole('navigation', { name: 'Conversation navigation', exact: true }).getByRole('button', { name: /Back/ }).click();
  await page.getByRole('navigation', { name: 'Conversation navigation', exact: true }).getByRole('button', { name: /Back/ }).click();
  assert.equal(new URL(page.url()).searchParams.get('year'), '2024');
  await page.reload();
  await page.locator('#guided-answer[data-node="activity:karu-food-cash-2024"]').waitFor();
  assert.equal(await filter('activity').inputValue(), 'karu-food-cash-2024');
  assert.equal(await kpi('activities').innerText(), '1');
  results.checks.push('Evidence opens with source context; record-to-chat handoff works; one shared locale preserves filters, selected record, chat and cursor preference; section anchors and chat follow-ups retain dashboard URL filters through reload');

  await clear(); await selectFilter('activity', 'inclusive-business-skills');
  await page.locator('.dashboard-records > li').first().getByRole('button').first().click();
  const permanent = reader().getByRole('link', { name: /Permanent achievement page/ });
  const permanentHref = await permanent.getAttribute('href');
  await permanent.click(); await page.waitForURL(/\/achievements\/inclusive-business-skills\//);
  assert.equal(await page.locator('html').getAttribute('data-photo-cursor'), 'false');
  assert.ok(permanentHref.includes('/achievements/'));
  for (const activity of bundle.activities.filter((activity) => activity.achievement_slug)) {
    for (const prefix of ['', '/ha']) {
      const response = await context.request.get(`${base}${prefix}/achievements/${activity.achievement_slug}/`);
      assert.equal(response.status(), 200, activity.achievement_slug);
    }
  }
  results.checks.push('Existing permanent achievement URLs remain available in both languages; leaving the dashboard/chat layout restores a normal cursor');

  await page.goto(`${base}/?year=2025`);
  await page.locator('html[data-photo-cursor="true"]').waitFor({ state: 'attached' });
  await selectFilter('year', '2024');
  await page.goBack();
  assert.equal(await filter('year').inputValue(), '2025');
  await clear();
  await highlights.locator('[data-highlight-category="all"]').click();
  await page.locator('.highlight-filter-disclosure > summary').click();
  await page.setViewportSize({ width: 390, height: 844 });
  await geometry(); await audit('English mobile dashboard');
  await page.evaluate(() => window.scrollTo(0, 0));
  const firstMobileNumber = await highlights.locator('.highlight-number').first().boundingBox();
  const supportingMobileCard = await highlights.locator('.highlight-card:not(.is-lead)').first().boundingBox();
  assert.ok(firstMobileNumber.y < 460, 'mobile chrome delays the first KPI');
  assert.ok(supportingMobileCard.height < 180, 'supporting mobile KPI is still a tall card');
  results.layout = { firstDesktopNumberY: firstDesktopNumber.y, firstMobileNumberY: firstMobileNumber.y, supportingMobileCardHeight: supportingMobileCard.height };
  await page.screenshot({ path: 'output/playwright/dashboard-mobile.png', fullPage: false });
  await page.getByRole('link', { name: 'Hausa', exact: true }).click(); await page.waitForURL(/\/ha\//);
  await page.locator('html[lang="ha"]').waitFor({ state: 'attached' });
  await geometry(); await audit('Hausa mobile dashboard');
  await page.screenshot({ path: 'output/playwright/dashboard-mobile-hausa.png', fullPage: false });
  await page.setViewportSize({ width: 320, height: 720 });
  await page.addStyleTag({ content: 'html{font-size:200%!important}' });
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await geometry();
  assert.equal(await page.locator('.highlight-spark').first().evaluate((element) => getComputedStyle(element).animationName), 'none');
  await page.locator('.dashboard-records > li').first().getByRole('button').first().focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.activeElement?.matches('.dashboard-evidence-reader'));
  const headingStartVisible = await reader().locator('h3').evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight);
    const hit = document.elementFromPoint(rect.x + 4, rect.y + 4);
    return rect.y >= 0 && rect.y + Math.min(rect.height, lineHeight) <= innerHeight && (hit === element || element.contains(hit));
  });
  assert.ok(headingStartVisible, 'start of evidence heading hidden or obscured at 200% text');
  await page.screenshot({ path: 'output/playwright/dashboard-zoom.png', fullPage: false });
  const internalScrollers = await page.locator('.guided-conversation').evaluate((element) => [element, ...element.querySelectorAll('*')].filter((node) => ['auto','scroll'].includes(getComputedStyle(node).overflowY) && node.scrollHeight > node.clientHeight + 1).length);
  assert.equal(internalScrollers, 0);
  results.checks.push('Filter browser history, responsive English/Hausa dashboard, keyboard evidence focus/return including after locale navigation, 320px/200% focus visibility, reduced motion and forced colours work; embedded chatbot retains three replacing choices without an internal scroller');

  await page.goto(`${base}/?year=2024&activity=karu-food-cash-2024`);
  await filter('activity').waitFor({ state: 'attached' });
  await context.setOffline(true);
  await selectFilter('year', 'all');
  assert.equal(await kpi('activities').innerText(), '1');
  await page.locator('.dashboard-records > li').first().getByRole('button').first().click();
  await reader().getByRole('button', { name: 'Ask the chatbot about this record', exact: true }).click();
  await page.locator('#guided-answer[data-node="activity:karu-food-cash-2024"]').waitFor();
  await context.setOffline(false);
  results.checks.push('Already-loaded filtering, record evidence and dashboard-to-chat handoff work without network inference; offline refresh readiness is not claimed');
  assert.deepEqual(results.errors, []); assert.deepEqual(results.failedResponses, []); assert.deepEqual(results.externalRequests, []);
  assert.ok(results.axe.every((state) => state.violations.length === 0), JSON.stringify(results.axe));
  results.completed = true; console.log(JSON.stringify(results, null, 2));
} finally {
  await writeFile('output/dashboard-browser-results.json', JSON.stringify(results, null, 2) + '\n');
  await browser.close();
}
