import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { buildDashboardPresentation } from "../apps/web/lib/dashboard-presentation.mjs";

const base = process.env.TEST_URL || "http://127.0.0.1:8767";
const bundle = JSON.parse(await readFile("content/dashboard/v1/bundle.json", "utf8"));
const data = buildDashboardPresentation(bundle);
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
const context = await browser.newContext({ viewport: { width: 1440, height: 1050 } });
const page = await context.newPage();
const results = { date: new Date().toISOString(), base, completed: false, checks: [], axe: [], errors: [], failedResponses: [], externalRequests: [] };
page.on("pageerror", e => results.errors.push(e.message));
page.on("response", r => { if (r.status() >= 400) results.failedResponses.push(r.url()); });
page.on("request", r => { if (new URL(r.url()).origin !== new URL(base).origin) results.externalRequests.push(r.url()); });
await mkdir("output/playwright", { recursive: true });
const nav = () => page.locator(".dashboard-navigation");
async function pointAtPlanet(link) {
  await link.evaluate(element => element.scrollIntoView({ block: "center", inline: "center", behavior: "instant" }));
  const box = await link.boundingBox();
  await page.mouse.move(box.x + box.width/2, box.y + box.height/2);
  await page.waitForFunction(() => document.querySelector(".solar-system").dataset.orbitPaused === "true");
}
async function audit(label) {
  const a = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  results.axe.push({ label, violations: a.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })) });
}
async function layout() {
  await page.evaluate(() => document.fonts.ready.then(() => true));
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "horizontal overflow");
  const language = page.getByRole("group", { name: "Change language / Canja harshe / Yí èdè padà / Gbanwee asụsụ", exact: true });
  assert.equal(await language.count(), 1);
  const en = await language.getByRole("link", { name: "English", exact: true }).boundingBox();
  const ha = await language.getByRole("link", { name: "Hausa", exact: true }).boundingBox();
  assert.ok(en && ha && en.y + en.height <= ha.y, "visible, vertically stacked locale control");
  await page.waitForFunction(() => document.querySelector(".landing-workspace").dataset.effects === "off" || parseFloat(getComputedStyle(document.documentElement).fontSize) > 20 || document.querySelector(".solar-arena").clientWidth < 300 || document.querySelector(".solar-system").dataset.mode === "orbit");
  await page.locator(".bubble-overview").focus();
  await page.waitForTimeout(80);
  const boxes = await page.locator(".landing-bubble").evaluateAll(links => links.map(link => {
    const b = link.getBoundingClientRect(); return { x: b.x, y: b.y, r: b.right, b: b.bottom, width: b.width, height: b.height };
  }));
  assert.equal(boxes.length, 4);
  boxes.forEach((a, i) => {
    assert.ok(a.width >= 44 && a.height >= 44);
    boxes.slice(i + 1).forEach(b => assert.ok(a.r <= b.x || b.r <= a.x || a.b <= b.y || b.b <= a.y, "overlapping bubble hit areas"));
  });
  const overflowing = await page.locator(".bubble-surface").evaluateAll(surfaces => surfaces.filter(surface => {
    const frame = surface.getBoundingClientRect();
    return [surface.querySelector("strong"), surface.querySelector(".bubble-detail")].some(element => {
      if (getComputedStyle(element).display === "none") return false;
      const rect = element.getBoundingClientRect();
      // Briem Hand's descenders extend beyond its heading line box into the
      // normal gap. Only the description's own scroll box signals clipped copy.
      return rect.left < frame.left - 1 || rect.right > frame.right + 1 || rect.top < frame.top - 1 || rect.bottom > frame.bottom + 1 || (element.classList.contains("bubble-detail") && element.scrollHeight > element.clientHeight + 1);
    });
  }).map(surface => surface.textContent));
  assert.deepEqual(overflowing, [], "entry descriptions overflow their bubble");
}
try {
  await page.goto(base + "/");
  await page.locator(".landing-workspace").waitFor();
  await layout();
  assert.equal(await page.locator("h1").innerText(), "Hon. Mohammed Abba Isa");
  assert.match(await page.locator(".dashboard-subtitle").innerText(), /reports, figures, themes and connections/);
  assert.equal(await page.locator("[data-highlight],.guided-embedded").count(), 0);
  assert.match(await page.locator(".opening-portrait blockquote").innerText(), /Our strength lies/);
  const image = await page.locator(".opening-portrait img").boundingBox();
  const opening = await page.locator(".dashboard-opening").boundingBox();
  assert.ok(Math.abs(image.x + image.width / 2 - opening.x - opening.width / 2) < 2);
  assert.equal(await page.locator(".opening-portrait img").evaluate(el => getComputedStyle(el).objectFit), "cover");
  assert.equal(await page.locator(".opening-portrait img").evaluate(el => getComputedStyle(el).borderRadius), "50%");
  const circle = await page.locator(".opening-portrait img").boundingBox();
  assert.ok(Math.abs(circle.width - circle.height) < 1, "portrait is circular rather than oval");
  assert.notEqual(await page.locator(".brand-portrait img").getAttribute("src"), await page.locator(".opening-portrait img").getAttribute("src"));
  const terms = new Set(data.concepts.map(term => term.id));
  assert.deepEqual(new Set(await page.locator("[data-concept-word]").evaluateAll(words => words.map(word => word.dataset.conceptWord))), terms);
  const photoBox = await page.locator(".solar-sun img").boundingBox();
  const leftLane = await page.locator(".lane-0").boundingBox();
  const rightLane = await page.locator(".lane-1").boundingBox();
  assert.ok(leftLane.x+leftLane.width < photoBox.x && rightLane.x > photoBox.x+photoBox.width, "word lanes must remain beside the portrait");
  assert.equal(await page.locator(".bubble-chat strong").innerText(), "Chat assistant");
  await audit("English landing desktop");
  await page.screenshot({ path: "output/playwright/landing-desktop.png", fullPage: true });
  const bubble = page.locator(".bubble-overview");
  await page.evaluate(() => document.activeElement?.blur());
  await page.mouse.move(0, 0);
  await page.waitForFunction(() => document.querySelector(".solar-system").dataset.orbitPaused === "false");
  const startBox = await bubble.boundingBox();
  await page.waitForTimeout(700);
  const movedBox = await bubble.boundingBox();
  assert.ok(Math.hypot(movedBox.x-startBox.x,movedBox.y-startBox.y)>5, "planets must visibly revolve in real time");
  const depths = await page.locator(".landing-bubble").evaluateAll(links => links.map(link => getComputedStyle(link).transform));
  assert.ok(depths.every(matrix => matrix.startsWith("matrix3d")), "planet movement must have perspective/depth");
  await pointAtPlanet(bubble);
  await page.waitForTimeout(100);
  const hitbox = await bubble.boundingBox();
  await page.waitForTimeout(350);
  const pausedBox = await bubble.boundingBox();
  assert.ok(Math.abs(pausedBox.x-hitbox.x)<1 && Math.abs(pausedBox.y-hitbox.y)<1, "hover must stop the orbit for accurate clicking");
  assert.equal(await page.getByRole("button", { name: /Pause motion|Resume motion/ }).count(), 0);
  assert.equal(await page.locator(".falling-concept").count(), 14);
  await page.locator(".landing-appearance summary").click();
  const effects = page.getByRole("checkbox", { name: "Visual effects", exact: true });
  await effects.uncheck();
  await page.waitForFunction(() => document.querySelector(".landing-workspace").dataset.effects === "off");
  await pointAtPlanet(bubble);
  for (const selector of [".bubble-surface", ".bubble-art svg", ".falling-concept"]) {
    assert.equal(await page.locator(selector).first().evaluate(el => getComputedStyle(el).animationName), "none");
  }
  await page.reload();
  await page.waitForFunction(() => document.querySelector(".landing-appearance input").checked === false);
  await page.getByRole("link", { name: "Hausa", exact: true }).click();
  await page.locator('.landing-workspace[lang="ha"]').waitFor();
  await page.waitForFunction(() => document.querySelector(".landing-appearance input").checked === false);
  await page.getByRole("link", { name: "English", exact: true }).click();
  await page.locator('.landing-workspace[lang="en"]').waitFor();
  await page.waitForFunction(() => document.querySelector(".landing-appearance input").checked === false);
  await page.locator(".landing-appearance summary").click();
  await effects.check();
  await page.waitForFunction(() => document.querySelector(".landing-workspace").dataset.effects === "on");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForFunction(() => document.querySelector(".landing-workspace").dataset.effects === "off");
  assert.equal(await page.locator(".bubble-surface").first().evaluate(el => getComputedStyle(el).animationName), "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForFunction(() => document.querySelector(".landing-workspace").dataset.effects === "on");
  for (const id of ["overview", "advocacy", "collaborations", "chat"]) {
    await pointAtPlanet(page.locator(`.bubble-${id}`));
    await page.locator(`.bubble-${id}`).focus();
    assert.equal(await page.locator(".landing-preview,#landing-preview-panel").count(), 0);
  }
  assert.doesNotMatch(await page.locator("body").innerText(), /A glimpse of the story|Follow your curiosity/);
  assert.doesNotMatch(await page.locator("body").evaluate(el => getComputedStyle(el).cursor), /url\(/);
  results.checks.push("Centred circular portrait, planet orbits with hover/focus pause, no extra preview panel, persistent footer effects setting and live reduced-motion override");

  for (const [id, section] of [["overview", "overview"], ["advocacy", "advocacy"], ["collaborations", "collaborations"]]) {
    await page.goto(base + "/");
    const link = page.locator(`.bubble-${id}`);
    await link.focus(); await page.keyboard.press("Enter");
    await page.waitForURL(url => url.pathname === "/explore/" && url.searchParams.get("section") === section);
    await page.waitForFunction(id => document.activeElement?.id === id, section);
    assert.equal(await page.locator(".opening-portrait,.guided-embedded").count(), 0);
    await page.goBack(); await page.locator(".landing-workspace").waitFor();
    await page.goForward(); await page.locator(".explore-workspace").waitFor();
    await page.reload(); await page.locator(".explore-workspace").waitFor();
    assert.equal(new URL(page.url()).searchParams.get("section"), section);
  }
  await page.goto(base + "/");
  await page.locator(".bubble-chat").focus();
  await page.locator(".bubble-chat").click();
  await page.locator('#guided-answer[data-node="start"]').waitFor();
  assert.equal(new URL(page.url()).pathname, "/chat/");
  results.checks.push("All four bubbles support keyboard/touch-style links, direct sections, refresh and browser Back/Forward; new chat starts at welcome");

  const concept = data.concepts[0].id;
  const collaboration = data.collaborations.find(c => c.id === "toolkit-developers");
  const actor = collaboration.participants[0].id;
  const query = `area=health-welfare&term=${concept}&initiative=${collaboration.id}&actor=${actor}&section=collaborations`;
  const flow = "#flow=" + encodeURIComponent("start|programmes");
  await page.goto(base + "/explore/?" + query + flow);
  await page.locator('[data-area="health-welfare"][aria-pressed="true"]').waitFor();
  await nav().getByRole("link", { name: "Chat", exact: true }).click();
  await page.locator('#guided-answer[data-node="programmes"]').waitFor();
  await nav().getByRole("link", { name: "Home", exact: true }).click();
  await page.locator(".landing-workspace").waitFor();
  assert.equal(new URL(page.url()).searchParams.get("view"), "home");
  await page.reload(); await page.locator(".landing-workspace").waitFor();
  await page.getByRole("link", { name: "Hausa", exact: true }).click();
  await page.locator('.landing-workspace[lang="ha"]').waitFor();
  assert.equal(await page.locator(".dashboard-header .translation-draft,.quote-translation-status").count(), 0);
  assert.equal(await page.locator('.dashboard-footer [data-translation-status="draft"]').count(), 1);
  assert.equal(await page.locator(".opening-portrait blockquote").getAttribute("lang"), "ha");
  assert.match(await page.locator(".quote-original").innerText(), /Asalin magana/);
  await page.locator(".bubble-chat").focus();
  await page.locator(".bubble-chat").click();
  await page.locator('#guided-answer[data-node="programmes"]').waitFor();
  assert.equal(new URL(page.url()).pathname, "/ha/chat/");
  await nav().getByRole("link", { name: "Bincika", exact: true }).click();
  await page.locator('.explore-workspace[lang="ha"]').waitFor();
  assert.equal(new URL(page.url()).searchParams.get("area"), "health-welfare");
  assert.equal(new URL(page.url()).searchParams.get("term"), concept);
  assert.equal(new URL(page.url()).searchParams.get("actor"), actor);
  assert.equal(new URL(page.url()).searchParams.get("initiative"), collaboration.id);
  assert.equal(await page.locator("#advocacy-title").innerText(), "Jigogin fafutukarsa.");
  assert.ok(decodeURIComponent(new URL(page.url()).hash).includes("start|programmes"));
  results.checks.push("Home/Explore/Chat and locale changes retain figures, concepts, actor/initiative, entry section and conversation across refresh; Hausa keeps one discreet footer draft label");

  await page.goto(base + "/?area=health-welfare&section=advocacy" + flow);
  await page.waitForURL(url => url.pathname === "/explore/" && url.searchParams.get("area") === "health-welfare");
  assert.equal(new URL(page.url()).hash, flow);
  await page.goto(base + "/" + flow);
  await page.waitForURL(url => url.pathname === "/explore/" && url.hash === flow);
  await page.goto(base + "/ha/#collaborations");
  await page.waitForURL(url => url.pathname === "/ha/explore/" && url.searchParams.get("section") === "collaborations");
  await page.goto(base + "/#ask-records"); await page.waitForURL(/\/chat\//);
  await page.goto(base + "/explore/?section=unrecognised&area=invalid");
  await page.waitForURL(url => !url.searchParams.has("section") && !url.searchParams.has("area"));
  await page.goto(base + "/ha/explore/?section=overview" + flow);
  await page.locator(".explore-sections").getByRole("link", { name: "Jigogi", exact: true }).click();
  await page.waitForFunction(() => document.activeElement?.id === "advocacy");
  await page.locator(".explore-sections").getByRole("link", { name: "Jigogi", exact: true }).click();
  await page.waitForFunction(() => document.activeElement?.id === "advocacy");
  await page.goBack();
  await page.goBack();
  await page.waitForURL(url => url.searchParams.get("section") === "overview");
  await page.waitForFunction(() => document.activeElement?.id === "overview");
  await page.goto(base + "/explore/?initiative=toolkit-developers&section=collaborations");
  await page.locator(".network-detail .detail-actions button").click();
  await page.waitForURL(url => url.pathname === "/chat/");
  await page.locator('#guided-answer[data-node="activity:disability-readiness-toolkit-2025"]').waitFor();
  await nav().getByRole("link", { name: "Explore", exact: true }).click();
  await page.locator('[data-selected-initiative="toolkit-developers"]').waitFor();
  assert.equal(new URL(page.url()).searchParams.get("record"), "disability-readiness-toolkit-2025");
  assert.doesNotMatch(await page.locator("html").evaluate(el => getComputedStyle(el).cursor), /url\(/);
  results.checks.push("Recognised legacy dashboard queries/hashes forward to Explore (old chat anchor to Chat); invalid sections/selections are discarded independently of flow");

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(base + "/"); await layout(); await audit("Landing tablet");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "/ha/"); await layout(); await audit("Hausa landing phone");
  assert.equal(await page.locator(".falling-concept").evaluateAll(items => items.filter(item => getComputedStyle(item).display !== "none").length), 14);
  await page.screenshot({ path: "output/playwright/landing-hausa-phone.png", fullPage: true });
  await page.setViewportSize({ width: 320, height: 720 });
  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  await layout(); await audit("Landing 320px 200% text");
  await page.emulateMedia({ forcedColors: "active" }); await layout();
  assert.equal(await page.locator(".solar-word-streams").evaluate(element => getComputedStyle(element).display), "none");
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.emulateMedia({ forcedColors: "none" });
  await page.route("**/branding/mohammed-abba-isa-seated.jpg", route => route.fulfill({ status: 200, contentType: "image/jpeg", body: "invalid image" }));
  await page.goto(base + "/");
  await page.locator(".portrait-fallback").waitFor();
  assert.match(await page.locator(".opening-portrait figcaption").innerText(), /Our strength lies/);
  assert.equal(await page.locator(".landing-bubble").count(), 4);
  await page.unroute("**/branding/mohammed-abba-isa-seated.jpg");
  const visuals = JSON.parse(await readFile("content/dashboard-visual-assets.json", "utf8"));
  await page.route("**" + visuals.header.localPath, route => route.fulfill({ status: 200, contentType: "image/jpeg", body: "invalid image" }));
  await page.reload();
  await page.waitForFunction(() => document.querySelector(".brand-portrait")?.textContent === "MAI");
  assert.deepEqual(await nav().getByRole("link").allTextContents(), ["Home", "Explore", "Chat", "About"]);
  await page.unroute("**" + visuals.header.localPath);
  results.checks.push("Phone and enlarged text layouts, forced colours and failed portrait keep readable labels, sources and usable destinations");

  const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const touch = await touchContext.newPage();
  touch.on("pageerror", error => results.errors.push(error.message));
  await touch.goto(base + "/");
  const touchPlanet = touch.locator(".bubble-advocacy");
  await touchPlanet.evaluate(element => element.scrollIntoView({ block: "center", behavior: "instant" }));
  const touchBox = await touchPlanet.boundingBox();
  await touch.touchscreen.tap(touchBox.x + touchBox.width/2, touchBox.y + touchBox.height/2);
  await touch.waitForURL(url => url.pathname === "/explore/" && url.searchParams.get("section") === "advocacy");
  await touchContext.close();

  for (const scenario of ["legacy-pause", "storage-denied"]) {
    const isolated = await browser.newContext();
    await isolated.addInitScript(scenario => {
      if (scenario === "legacy-pause") sessionStorage.setItem("landing-motion-paused", "true");
      else for (const method of ["getItem", "setItem"]) Object.defineProperty(Storage.prototype, method, { value() { throw new Error("Storage unavailable"); } });
    }, scenario);
    const probe = await isolated.newPage();
    probe.on("pageerror", error => results.errors.push(error.message));
    await probe.goto(base + "/");
    await probe.waitForFunction(off => document.querySelector(".landing-appearance input").checked === !off && document.querySelector(".landing-workspace").dataset.effects === (off ? "off" : "on"), scenario === "legacy-pause");
    if (scenario === "storage-denied") {
      await probe.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: true }); document.dispatchEvent(new Event("visibilitychange")); });
      await probe.waitForFunction(() => document.querySelector(".landing-workspace").dataset.pageHidden === "true");
      assert.equal(await probe.locator(".falling-concept").first().evaluate(element => getComputedStyle(element).animationPlayState), "paused");
      await probe.locator(".landing-appearance summary").click();
      await probe.getByRole("checkbox", { name: "Visual effects", exact: true }).uncheck();
      await probe.waitForFunction(() => document.querySelector(".landing-workspace").dataset.effects === "off");
    }
    await isolated.close();
  }
  const noScriptContext = await browser.newContext({ javaScriptEnabled: false });
  const noScript = await noScriptContext.newPage();
  await noScript.goto(base + "/");
  assert.equal(await noScript.locator(".landing-bubble").count(), 4);
  assert.match(await noScript.locator("#dashboard-title").innerText(), /Hon\. Mohammed Abba Isa/);
  await noScript.locator(".bubble-overview").click();
  await noScript.waitForURL(url => url.pathname === "/explore/");
  await noScriptContext.close();
  results.checks.push("Touch links preserve one-tap navigation; previous Pause preference migrates; unavailable storage remains usable; hidden tabs suspend orbit and falling words; essential links work without JavaScript");
  assert.deepEqual(results.errors, []); assert.deepEqual(results.failedResponses, []); assert.deepEqual(results.externalRequests, []);
  assert.ok(results.axe.every(a => !a.violations.length), JSON.stringify(results.axe));
  results.completed = true;
  console.log(JSON.stringify(results, null, 2));
} finally {
  await writeFile("output/landing-browser-results.json", JSON.stringify(results, null, 2) + "\n");
  await browser.close();
}
