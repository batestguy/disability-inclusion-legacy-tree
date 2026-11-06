/** Real-site demo capture and local FFmpeg assembly. No website/source mutation. */
import { chromium } from "playwright";
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { spawn, execFileSync } from "node:child_process";
import path from "node:path";
import assert from "node:assert/strict";

const args = process.argv.slice(2);
const mode = args.includes("--mobile") ? "mobile" : "desktop";
const check = args.includes("--check");
const renderOnly = args.includes("--render-only");
const selected = args.includes("--scene") ? args[args.indexOf("--scene") + 1] : null;
const base = process.env.DEMO_URL || "https://mohammed-abba-isa-legacy.pages.dev";
const output = path.resolve("output/demo", mode);
const ffmpeg = process.env.FFMPEG_PATH || "ffmpeg";
const ffprobe = process.env.FFPROBE_PATH || "ffprobe";
const music = path.resolve("African Child - Jeremiah Gyang.mp3");
const mobile = mode === "mobile";
const viewport = mobile ? { width: 450, height: 720 } : { width: 1920, height: 936 };
const width = mobile ? 1080 : 1920, height = mobile ? 1920 : 1080;
const pictureHeight = mobile ? 1728 : 936;
const errors = [];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
await mkdir(output, { recursive: true });
await access(music);

function command(exe, argv, log) {
  return new Promise((resolve, reject) => {
    const child = spawn(exe, argv, { windowsHide: true });
    let tail = "";
    child.stdout.on("data", chunk => { tail = (tail + chunk).slice(-6000); });
    child.stderr.on("data", chunk => { tail = (tail + chunk).slice(-6000); });
    child.on("error", reject);
    child.on("close", async code => {
      if (log) await writeFile(log, tail);
      code === 0 ? resolve(tail) : reject(new Error(`${exe} exited ${code}\n${tail}`));
    });
  });
}
const probe = file => JSON.parse(execFileSync(ffprobe, ["-v", "error", "-show_format", "-show_streams", "-of", "json", file], { encoding: "utf8", windowsHide: true }));

async function ready(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].filter(img => img.complete || img.loading !== "lazy").map(img => Promise.race([img.decode().catch(() => {}), new Promise(resolve => setTimeout(resolve, 3000))])));
  });
  await page.waitForTimeout(400);
}
async function go(page, url) {
  await page.goto(base + url, { waitUntil: "networkidle" });
  await ready(page);
}
async function focus(page, selector, duration = 1400, fraction = 0) {
  const locator = typeof selector === "string" ? page.locator(selector).first() : selector;
  await locator.waitFor({ state: "visible" });
  await locator.evaluate(async (el, options) => {
    const start = scrollY;
    const header = document.querySelector(".dashboard-header");
    const sticky = header && getComputedStyle(header).position === "sticky" ? header.getBoundingClientRect().height : 0;
    const target = Math.max(0, start + el.getBoundingClientRect().top - sticky - 24 - innerHeight * options.fraction);
    if (!options.duration) { scrollTo({top:target,behavior:"instant"}); return; }
    await new Promise(resolve => {
      const began = performance.now();
      function frame(now) {
        const t = Math.min(1, (now - began) / options.duration);
        const ease = t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
        scrollTo({top:start + (target - start)*ease,behavior:"instant"});
        t < 1 ? requestAnimationFrame(frame) : resolve();
      }
      requestAnimationFrame(frame);
    });
  }, { duration: check ? 0 : duration, fraction });
  await page.waitForTimeout(200);
}
async function click(page, locator) {
  if (typeof locator === "string") locator = page.locator(locator).first();
  await locator.scrollIntoViewIfNeeded();
  const bounds = await locator.boundingBox();
  if (bounds) {
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2, { steps: check ? 1 : 22 });
    await page.waitForTimeout(check ? 0 : 350);
  }
  await locator.click();
  await page.waitForTimeout(check ? 120 : 550);
}
async function choose(page, target) {
  for (let n = 0; n < 12; n++) {
    const option = page.locator(`.guided-options button[data-target="${target}"]`);
    if (await option.count()) { await click(page, option); return; }
    const more = page.getByRole("button", { name: "More options", exact: true });
    assert.ok(await more.count() && await more.isEnabled(), `Unreachable chat choice: ${target}`);
    await click(page, more);
  }
  throw new Error(`Choice not found: ${target}`);
}
async function cloud(page) {
  await go(page, "/explore/?section=advocacy");
  await click(page, '[data-cloud-mode="concepts"]');
  await focus(page, ".advocacy-composition", 0);
}
async function network(page, chosen = false) {
  await go(page, "/explore/?section=collaborations");
  if (mobile) {
    if (chosen) await click(page, '[data-mobile-actor="datalead"]');
    await focus(page, chosen ? ".mobile-flow-subject" : ".mobile-flow-actors", 0);
  } else {
    await page.locator("[data-network-area]").selectOption("accessibility");
    await focus(page, ".network-map-viewport", 0);
  }
}

// Original three-minute walkthrough, followed by the owner-requested author coda.
const scenes = [
  { id: "00-introduction", seconds: 6, chapter: "A SOURCE-LED TRIBUTE", captions: ["Honouring Mohammed Abba Isa's disability-inclusion advocacy.", "A record of public service, access and equal opportunity."],
    setup: async p => { await p.setContent(await readFile(new URL("./demo-introduction.html", import.meta.url), "utf8")); await ready(p); }, actions: [] },
  { id: "01-opening", seconds: 12, chapter: "A RECORD OF INCLUSION", captions: ["Hon. Mohammed Abba Isa", "Explore his recorded work through figures, themes and connections."],
    setup: async p => { await go(p, "/"); await p.locator('.solar-system[data-layout-ready="true"]').waitFor(); await focus(p, ".dashboard-opening", 0); },
    actions: [[2.5, p => focus(p, mobile ? ".solar-system" : ".solar-sun", 1500, mobile ? 0 : .15)], [6, async p => { const planet = p.locator(".bubble-overview"); await planet.hover({ force: true }); await sleep(check ? 20 : 900); await p.mouse.move(5, 5); }]] },
  { id: "02-biography", seconds: 10, chapter: "THE PERSON BEHIND THE RECORD", captions: ["From disability advocacy in Yobe to national public service.", "Education, livelihoods and equal opportunity run through his story."],
    setup: async p => { await go(p, "/about/"); await focus(p, mobile ? ".biography-subject" : ".biography-layout", 0); },
    actions: [[4, p => focus(p, ".biography-prose p:nth-of-type(2)", 1500)]] },
  { id: "03-documentary", seconds: 8, chapter: "HIS STORY, WITH SOURCES", captions: ["Documentary photographs accompany the biography.", "Source links let readers follow the underlying reports."],
    setup: async p => { await go(p, "/about/"); await focus(p, '[data-biography-photo="ceremony"]', 0); },
    actions: [[3, p => focus(p, ".biography-chapter.has-photo", 1800)]] },
  { id: "04-figures", seconds: 13, chapter: "EXPLORE THE FIGURES", captions: ["Browse reported activities by contribution area.", "Reported delivery and planned commitments are presented separately."],
    setup: async p => { await go(p, "/explore/?section=overview"); await focus(p, ".contribution-categories", 0); },
    actions: [[3, p => click(p, '[data-area="health-welfare"]')], [7, p => focus(p, ".contribution-results", 1500)]] },
  { id: "05-evidence", seconds: 12, chapter: "KEEP THE EVIDENCE VISIBLE", captions: ["Open a figure to examine its report and qualifications.", "Dates, attributed roles and limits stay attached to the numbers."],
    setup: async p => { await go(p, "/explore/?section=overview"); await focus(p, '[data-highlight="borno-employment-2024:placements"]', 0); },
    actions: [[2, p => click(p, '[data-highlight="borno-employment-2024:placements"] summary')], [6, p => focus(p, '[data-highlight="borno-employment-2024:placements"] .figure-source-context', 1400)]] },
  { id: "06-concepts", seconds: 12, chapter: "THEMES IN THE REPORTS", captions: ["The concept cloud makes recurring phrases explorable.", "Larger words appear in more selected reports; superscripts show their share."],
    setup: cloud,
    actions: [[5, async p => { await p.locator('[data-cloud-id="disability-inclusion"]').hover(); await sleep(check ? 20 : 1200); await p.mouse.move(5,5); }], [8, p => focus(p, ".concept-cloud", 1000)]] },
  { id: "07-concept-sources", seconds: 8, chapter: "FOLLOW A THEME TO ITS SOURCES", captions: ["Select a theme to read its matching reports.", "Report frequency describes wording, not independently proven impact."],
    setup: cloud,
    actions: [[1, p => click(p, '[data-cloud-id="disability-inclusion"]')], [4, p => focus(p, ".cloud-selection", 1200)]] },
  { id: "08-network", seconds: 13, chapter: "FOLLOW THE CONNECTIONS", captions: [mobile ? "Choose a partner to reveal a clear, focused connection path." : "Follow Isa and his office through recorded people and organisations.", "Connections lead to initiatives with documented participant roles."],
    setup: p => network(p),
    actions: mobile ? [[3, p => click(p, '[data-mobile-actor="datalead"]')], [6, p => focus(p, ".mobile-flow-subject", 1500)], [9, p => focus(p, ".mobile-flow-actors", 1400)]] : [[4, p => click(p, '[data-network-actor="datalead"]')], [8, p => focus(p, ".network-map-viewport", 1000)]] },
  { id: "09-network-record", seconds: 12, chapter: "ROLES MATTER", captions: ["The toolkit record names DataLead Africa and Deaf-in-Tech as developers.", "Explore the initiative, attributed roles and supporting sources."],
    setup: p => network(p, true),
    actions: [[2, p => click(p, mobile ? '[data-mobile-initiative="disability-readiness-toolkit-2025"]' : '[data-network-map-initiative="toolkit-developers"]')], [5, p => focus(p, ".network-detail", 1400)], [8, p => focus(p, ".participant-roles", 1200)]] },
  { id: "10-guided-chat", seconds: 10, chapter: "ASK THE RECORDS", captions: ["Prepared questions make the evidence easier to navigate.", "Choose a topic and follow its answers at your own pace."],
    setup: async p => { await go(p, "/chat/"); await focus(p, ".guided-conversation", 0); },
    actions: [[3, p => choose(p, "programmes")], [6, p => focus(p, "#guided-answer", 1200)]] },
  { id: "11-guided-sources", seconds: 12, chapter: "ANSWERS THAT KEEP THEIR SOURCES", captions: ["Follow up on a topic, then open its source records.", "A prepared question tree, without impersonation or live AI."],
    setup: async p => { await go(p, "/chat/"); await choose(p, "women"); await focus(p, "#guided-answer", 0); },
    actions: [[4, p => click(p, p.getByRole("button", { name: "View sources", exact: true }))], [7, p => click(p, ".guided-options button[data-source]")], [9, p => focus(p, "#guided-answer", 1000)]] },
  { id: "12-languages", seconds: 10, chapter: "FOUR WAYS TO EXPLORE", captions: ["English, Hausa, Yoruba and Igbo share one language control.", "Translations remain visibly marked as drafts."],
    setup: async p => { await go(p, "/chat/"); await focus(p, ".language-options", 0); },
    actions: [[2, p => click(p, p.getByRole("link", { name: "Hausa", exact: true }))], [5, p => focus(p, ".guided-conversation", 1100)], [8, p => click(p, p.getByRole("link", { name: "English", exact: true }))]] },
  { id: "13-method-collection", seconds: 8, chapter: "METHODS / COLLECTION AND CLEANING", captions: ["Python and the WordPress API collected public office reports.", "Beautiful Soup extracted readable text while source links were retained."],
    setup: async p => { await go(p, "/about/methodology/"); await focus(p, "#method-0", 0); },
    actions: [[3, p => focus(p, "#method-1", 1300)]] },
  { id: "14-method-checks", seconds: 7, chapter: "METHODS / SOURCE CHECKS", captions: ["Exact copies were removed and figures checked against source reports.", "Plans, reported delivery and overlapping beneficiary groups stay distinct."],
    setup: async p => { await go(p, "/about/methodology/"); await focus(p, "#method-2", 0); }, actions: [] },
  { id: "15-method-model", seconds: 8, chapter: "METHODS / TEXT ANALYSIS", captions: ["TF-IDF highlights distinctive words; NMF explores eight recurring themes.", "Activities were categorised by reading the reports."],
    setup: async p => { await go(p, "/about/methodology/"); await focus(p, "#method-3", 0); },
    actions: [[4, p => focus(p, "#method-4", 1300)]] },
  { id: "16-method-counts", seconds: 7, chapter: "METHODS / COUNTS AND LIMITS", captions: ["Concept phrases count once per report; category counts refer to activities.", "Reports do not prove impact or cover his entire career."],
    setup: async p => { await go(p, "/about/methodology/"); await focus(p, "#method-5", 0); },
    actions: [[3, p => focus(p, "#method-6", 1300)]] },
  { id: "17-method-agents", seconds: 10, chapter: "METHODS / HOW AGENTS HELPED", captions: ["Agents helped build scripts, pages, draft translations and checks.", "Owner feedback guided revisions; agents did not certify the evidence."],
    setup: async p => { await go(p, "/about/methodology/"); await focus(p, ".methodology-workflow", 0); },
    actions: [[5, async p => { await click(p, ".methodology-settings summary"); await focus(p, ".methodology-settings", 1000); }], [8, p => focus(p, ".methodology-records", 1000)]] },
  { id: "18-closing", seconds: 8, chapter: "EXPLORE THE RECORD", captions: ["A source-led record of inclusion. Follow your curiosity.", "mohammed-abba-isa-legacy.pages.dev"],
    setup: async p => { await go(p, "/"); await p.locator('.solar-system[data-layout-ready="true"]').waitFor(); await focus(p, mobile ? ".solar-system" : ".solar-sun", 0, mobile ? 0 : .15); }, actions: [] },
  { id: "19-author", seconds: 10, chapter: "ABOUT THE CREATOR", captions: ["Jerry Zachary Bannister — researcher and Statistician.", "Statistics, machine learning and AI for practical local problems."],
    setup: async p => { await go(p, "/about/"); await focus(p, ".biography-creator", 0); await p.locator(".biography-creator img").evaluate(img => img.decode()); await p.waitForTimeout(600); },
    actions: mobile ? [[4, p => focus(p, ".biography-creator .biography-prose", 1400)]] : [] },
];
const duration = scenes.reduce((sum, scene) => sum + scene.seconds, 0);
assert.equal(duration, 196);

// An ephemeral presentation pointer never changes the website's source or default cursor.
const pointer = () => {
  addEventListener("pointerdown", event => {
    const ring = document.createElement("div");
    Object.assign(ring.style, { position:"fixed", left:`${event.clientX - 18}px`, top:`${event.clientY - 18}px`, width:"36px", height:"36px", border:"3px solid #008751", borderRadius:"50%", zIndex:"2147483647", pointerEvents:"none" });
    document.documentElement.append(ring);
    ring.animate([{ transform:"scale(.5)", opacity:1 }, { transform:"scale(1.5)", opacity:0 }], { duration:650 }).finished.then(() => ring.remove());
  }, true);
};

async function capture() {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const scene of scenes.filter(s => !selected || s.id === selected)) {
      const dir = path.join(output, scene.id);
      await mkdir(dir, { recursive: true });
      const metadataFile = path.join(dir, "capture.json");
      if (!check && !args.includes("--recapture")) {
        try { const saved = JSON.parse(await readFile(metadataFile)); await access(saved.raw); console.log(`REUSE ${mode} ${scene.id}`); continue; } catch {}
      }
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: "no-preference", locale: "en-NG", ...(mobile ? { isMobile: true, hasTouch: true } : {}), ...(!check ? { recordVideo: { dir, size: viewport } } : {}) });
      await context.addInitScript(pointer);
      const page = await context.newPage();
      page.on("pageerror", error => errors.push({ scene: scene.id, error: error.message }));
      page.on("response", response => { if (response.status() >= 400 && response.url().startsWith(base)) errors.push({scene:scene.id,status:response.status(),url:response.url()}); });
      page.setDefaultTimeout(20000);
      console.log(`PREPARE ${mode} ${scene.id}`);
      try {
        await scene.setup(page);
        await page.screenshot({ path: path.join(dir, "start.png") });
        const began = Date.now();
        console.log(`RECORD ${mode} ${scene.id} ${scene.seconds}s`);
        for (const [second, action] of scene.actions) {
          if (!check) await sleep(Math.max(0, second * 1000 - (Date.now() - began)));
          await action(page);
        }
        const elapsed = (Date.now() - began) / 1000;
        if (!check) {
          if (elapsed > scene.seconds - .2) throw new Error(`${scene.id} actions overran: ${elapsed.toFixed(1)} seconds`);
          await sleep(Math.max(0, (scene.seconds + .5) * 1000 - (Date.now() - began)));
        }
        await page.screenshot({ path: path.join(dir, "end.png") });
        const raw = !check ? await page.video().path() : null;
        await context.close();
        if (!check) {
          const rawDuration = Number(probe(raw).format.duration);
          await writeFile(metadataFile, JSON.stringify({ id: scene.id, mode, base, raw, rawDuration, duration: scene.seconds, trimStart: Math.max(0, rawDuration - scene.seconds - .65), viewport, capturedAt: new Date().toISOString() }, null, 2));
        }
      } catch (error) { await page.screenshot({ path: path.join(dir,"error.png") }).catch(() => {}); await context.close(); throw error; }
      console.log(`OK ${mode} ${scene.id}`);
    }
  } finally { await browser.close(); await writeFile(path.join(output, "capture-errors.json"), JSON.stringify(errors, null, 2)); }
  assert.deepEqual(errors, []);
}

function wrap(text, limit) {
  const words = text.split(" "), lines = [""];
  for (const word of words) {
    if (lines.at(-1).length && lines.at(-1).length + word.length + 1 > limit) lines.push(word);
    else lines[lines.length - 1] += (lines.at(-1) ? " " : "") + word;
  }
  assert.ok(lines.length <= 2, `Caption too long: ${text}`);
  return lines;
}
const assTime = value => { const cent = Math.round(value * 100); return `${Math.floor(cent/360000)}:${String(Math.floor(cent/6000)%60).padStart(2,"0")}:${String(Math.floor(cent/100)%60).padStart(2,"0")}.${String(cent%100).padStart(2,"0")}`; };
const srtTime = value => new Date(Math.round(value*1000)).toISOString().slice(11,23).replace(".",",");
async function captions() {
  const entries = []; let time = 0;
  for (const scene of scenes) {
    const half = scene.seconds / 2;
    for (let n=0;n<2;n++) entries.push({ start:time+n*half, end:time+(n+1)*half, chapter:scene.chapter, text:scene.captions[n] });
    time += scene.seconds;
  }
  const font = mobile ? 44 : 42;
  const chapterY = pictureHeight + (mobile ? 32 : 25), captionY = pictureHeight + 72;
  let ass = `[Script Info]\nScriptType: v4.00+\nPlayResX: ${width}\nPlayResY: ${height}\nWrapStyle: 2\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Caption,Arial,${font},&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,8,40,40,0,1\nStyle: Chapter,Arial,${mobile?28:24},&H00BCE6CE,&H00BCE6CE,&H00000000,&H00000000,-1,0,0,0,100,100,1,0,1,0,0,8,40,40,0,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n`;
  let srt = "";
  for (const [index, entry] of entries.entries()) {
    const lines = wrap(entry.text, mobile ? 40 : 79);
    ass += `Dialogue: 0,${assTime(entry.start)},${assTime(entry.end)},Chapter,,0,0,0,,{\\an8\\pos(${width/2},${chapterY})}${entry.chapter}\n`;
    ass += `Dialogue: 1,${assTime(entry.start)},${assTime(entry.end)},Caption,,0,0,0,,{\\an8\\pos(${width/2},${captionY})}${lines.join("\\N")}\n`;
    srt += `${index+1}\n${srtTime(entry.start)} --> ${srtTime(entry.end)}\n${lines.join("\n")}\n\n`;
  }
  await writeFile(path.join(output,"captions.ass"),ass);
  await writeFile(path.join(output,`Hon-Mohammed-Abba-Isa-${mode}.srt`),srt);
}

async function render() {
  await captions();
  let sceneStart = 0;
  for (const scene of scenes) {
    const dir = path.join(output,scene.id);
    const info = JSON.parse(await readFile(path.join(dir,"capture.json")));
    const target = path.join(dir,"clip.mp4");
    // Opt-in reuse for this append-only edit: first 17 scenes/captions are unchanged.
    if (args.includes("--reuse-clips") && !["00-introduction", "18-closing", "19-author"].includes(scene.id)) {
      await access(target);
      assert.ok(Math.abs(Number(probe(target).format.duration) - scene.seconds) < .1);
      console.log(`REUSE CLIP ${mode} ${scene.id}`);
      sceneStart += scene.seconds;
      continue;
    }
    console.log(`ENCODE ${mode} ${scene.id}`);
    const sceneAss = path.join(output,"captions.ass").replaceAll("\\","/").replace(":","\\:");
    const fades = `${sceneStart === 0 ? ",fade=t=in:st=0:d=0.4" : ""}${scene.id === "19-author" ? ",fade=t=out:st=9:d=1" : ""}`;
    await command(ffmpeg,["-hide_banner","-loglevel","warning","-y","-ss",String(info.trimStart),"-i",info.raw,"-t",String(scene.seconds),"-vf",`scale=${width}:${pictureHeight}:flags=lanczos,pad=${width}:${height}:0:0:color=0x0b3e2d,setsar=1,fps=30,setpts=PTS+${sceneStart}/TB,ass=filename='${sceneAss}',setpts=PTS-STARTPTS${fades}`,"-an","-c:v","libx264","-preset","veryfast","-crf","19","-pix_fmt","yuv420p","-threads","4",target],path.join(dir,"encode.log"));
    sceneStart += scene.seconds;
  }
  const listing = scenes.map(scene=>`file '${path.join(output,scene.id,"clip.mp4").replaceAll("\\","/")}'`).join("\n");
  await writeFile(path.join(output,"concat.txt"),listing);
  const final = path.join(output,`Hon-Mohammed-Abba-Isa-${mode}.mp4`);
  console.log(`ASSEMBLE ${mode}`);
  await command(ffmpeg,["-hide_banner","-loglevel","warning","-y","-f","concat","-safe","0","-i",path.join(output,"concat.txt"),"-i",music,"-t",String(duration),"-af",`atrim=0:${duration},asetpts=PTS-STARTPTS,loudnorm=I=-18:TP=-1.5:LRA=11,afade=t=in:st=0:d=2,afade=t=out:st=${duration-6}:d=6`,"-c:v","copy","-c:a","aac","-b:a","192k","-ar","48000","-metadata","title=Hon. Mohammed Abba Isa - A Record of Inclusion","-metadata","comment=Soundtrack: African Child - Jeremiah Gyang; owner-supplied audio","-movflags","+faststart",final],path.join(output,"assembly.log"));
  const info=probe(final);const video=info.streams.find(s=>s.codec_type==="video"),audio=info.streams.find(s=>s.codec_type==="audio");
  assert.equal(video.width,width);assert.equal(video.height,height);assert.equal(video.codec_name,"h264");assert.equal(audio.codec_name,"aac");assert.ok(Math.abs(Number(info.format.duration)-duration)<.1);
  const levels=await command(ffmpeg,["-hide_banner","-i",final,"-vn","-af","volumedetect","-f","null","-"],path.join(output,"audio-check.log"));
  assert.ok(!/max_volume: 0\.0 dB/.test(levels),"Audio must not clip");
  for(const [name,second] of [["introduction",3],["opening",11],["network",89],["methodology",156],["agents",172],["closing",182],["author",191]]) await command(ffmpeg,["-hide_banner","-loglevel","error","-y","-ss",String(second),"-i",final,"-frames:v","1",path.join(output,`${name}.jpg`)]);
  await command(ffmpeg,["-hide_banner","-loglevel","error","-i",final,"-f","null","-"],path.join(output,"decode-check.log"));
  await command(ffmpeg,["-hide_banner","-loglevel","error","-y","-i",final,"-vf",`select='eq(mod(n,300),150)',scale=${mobile?216:480}:${mobile?384:270},tile=4x5:nb_frames=20`,"-frames:v","1",path.join(output,"contact-sheet.jpg")]);
  await writeFile(path.join(output,"verification.json"),JSON.stringify({file:final,base,mode,duration:Number(info.format.duration),width,height,video:video.codec_name,audio:audio.codec_name,frameRate:video.avg_frame_rate,captionEntries:scenes.length*2,music:"African Child - Jeremiah Gyang.mp3",musicSeconds:duration,introductionSeconds:6,authorSeconds:10,narration:false,methodologySeconds:40,errors,verifiedAt:new Date().toISOString()},null,2));
  console.log(`DONE ${final}`);
}

await writeFile(path.resolve("output/demo/index.html"), await readFile(new URL("./demo-review.html", import.meta.url)));
await captions();
if(!renderOnly) await capture();
if(!check && !selected) await render();
