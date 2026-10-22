# Validation evidence - 22 October 2026

## Latest handoff status

Both repository delivery workflows completed successfully: [implementation CI](https://github.com/batestguy/disability-inclusion-legacy-tree/actions/runs/39722399277) and [delivery documentation CI](https://github.com/batestguy/disability-inclusion-legacy-tree/actions/runs/39722444939), the latter at b614322584f911810be52f5cbc23766b1c3ad1fd. These ran preflight, lint, typecheck, five content tests and both builds. CI does not run browser/axe/Lighthouse or deploy the website.

This handoff refresh changes documentation only. Preflight and Git whitespace checks passed again; application builds and browser/performance tests were not rerun for this refresh. Earlier dated results below retain their original scope. Current-artwork performance, human Hausa/portrait approval, guided accessibility review and live publishing verification remain open. Start the next session with [HANDOFF.md](../HANDOFF.md).

## Result
A runnable bilingual preview is implemented. It is not release-ready. No public deployment or live CMS publishing test is claimed.

Passed: root preflight; web and Studio lint/type checks; five content/publishing tests; both production builds; Studio HTTP 200 at localhost:3333; Next development server ready at 127.0.0.1:3000; static preview HTTP 200 at 127.0.0.1:8767. The Studio placeholder build validates configuration and bundle only, not a live account.

The static export includes English and Hausa home routes, five permanent records in each language, and a 404. Studio import generation parses 15 documents with all editorial review flags false. The original HonAbbas.txt was preserved.

## Browser checks
Production static export, Chromium 148 (local Playwright chromium-1243), Windows, Node 24.15.0. See output/browser-results.json, recorded 2026-10-22T03:15:07.038Z. 13 functional checks passed, zero uncaught page errors. Desktop viewport 1440 x 1000; mobile 390 x 844; 320px reflow; 150% font preference. System reduced motion enabled during core flows. Storage-denied context checked separately.

Checks cover branch/year filtering, search and empty results, panels, Escape, focus restoration, browser Back, permanent bilingual routes, selected-story language switch, preference persistence, unavailable storage, mobile focus containment, and horizontal reflow.

Axe: zero violations across eight tested states under WCAG 2 A/AA, 2.1 AA and 2.2 AA tags. Off-screen sections are forced into layout during axe scans to avoid content-visibility hiding errors. This is not proof of WCAG conformance. The first run found small branch-number contrast and high-contrast timeline text failures; fixed. An enlarged-text mobile headline overflow was also fixed.

Screenshots: output/playwright/desktop.png, mobile.png and mobile-panel.png. Artwork is original procedural SVG; the monogram is explicitly a portrait placeholder.

## Performance ? gate remains open
Latest Lighthouse 13.5.0, 2026-10-22T03:14:18.637Z, Chromium via Playwright CDP port 8766. Compressed Node static server at 127.0.0.1:8767 (gzip, immutable asset cache headers); cold runs; mobile screen 412 x 823, DPR 1.75; simulated throttling; 4x CPU slowdown on this workstation. These are local synthetic measurements, not Cloudflare or real-user results. Full settings, timing and audits are retained in the JSON reports.

| Test | Performance | Accessibility | LCP | TBT |
| --- | ---: | ---: | ---: | ---: |
| Standard mobile (150ms RTT, 1638.4 Kbps) | 72 | 100 | 2.80s | 1142ms |
| Slower 3G-like (300ms RTT, 700 Kbps) | 77 | 100 | 4.60s | 281ms |

Targets: mobile Performance >=95 and LCP <=2.5s. The latest run does not meet them. Runs varied (one intermediate optimised run scored 85 with 2.43s LCP); use the latest retained reports, not the best score. Initial uncompressed Python serving scored 66 with 5.41s LCP and is not comparable to compressed hosting. Optimisations applied: defer GSAP/ScrollTrigger until scrolling, render botanical artwork as a static SVG asset, skip off-screen paint/layout and avoid unnecessary preference style invalidation. Remaining cost is principally style/layout and React/Next script processing. Profile on an otherwise idle reference device and real preview CDN; preserve functionality while reducing initial client work before reveal. Do not describe the performance gate as passed.

## Reproduce
```powershell
npm.cmd run preflight
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run preview
# In another terminal, with a compatible Chromium installed:
npx.cmd playwright install chromium
npm.cmd run test:browser
npm.cmd run test:performance
```

For this session an existing compatible browser was used through CHROMIUM_PATH=C:/Users/TOSHIBA/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe. The automation accepts CHROMIUM_PATH and TEST_URL. The performance script uses fixed local debugger port 8766; ensure it is free. Standalone Lighthouse launcher failed to expose its debugger in this sandbox, so the reproducible script attaches to Playwright-launched Chrome.

## Required human / live reviews
- Fluent Hausa review of all copy and controls, including source and evidence-status terms.
- Genuine portrait, photographer attribution and reuse permission; then remeasure LCP with the real image.
- Guided keyboard-only journey, 200/400% browser zoom, Windows forced-colours and screen-reader review with NVDA or VoiceOver. Automated focus/reflow checks do not substitute for these.
- Journalist task: find biography and verify three records within five minutes; not yet observed with a participant.
- Live Sanity publish/update/delete -> preview rebuild, failed-build retention, correction mailbox and backup/restore/ownership handover tests.
- Live deployment URL, name availability, CDN headers, permanent routes and production analytics check.

Source/editorial boundaries are in docs/RESEARCH.md. No top-1-percent, PhD or unverified headline statistics were published. No photograph was copied without permission.


## Owner-requested tree revision ? 22 October 2026
The preceding Lighthouse figures are from the earlier vector-tree build; they do not measure this new image-based revision and the performance release gate remains open.

Replaced the abstract tree with a realistic generated botanical cutout (desktop/mobile alpha WebP). Added branch-shaped pointer hit areas following the actual limbs, accessible labelled disclosure controls, connected story twigs, clearer English/Hausa language choices on home and record pages, a public-domain Natural Earth Nigeria watermark and a much larger stump portrait frame. The genuine photo remains pending permission/supply; no likeness was generated.

Validation: both workspace lint and type checks pass; five content/publishing tests pass; root production build passed and the latest web rebuild passed after the limb-hit update. Final production-static browser run at 2026-10-22T03:50:13.587Z passed 17 functional checks, including actual limb clicks, keyboard expansion/Tab order, twig focus restoration and retained expansion, plus previous panel, search, language, preference and reflow journeys. Zero uncaught page errors. Axe found zero violations in 9 states, including expanded story branches and mobile expanded branches at 150% text. Human review limits and launch gates still apply.

Updated screenshots: output/playwright/tree-revision-desktop.png, tree-revision-expanded.png, tree-revision-mobile-top.png and tree-revision-mobile.png. Artwork, source files, full generation prompt and method: docs/TREE_ART.md.


## Sourced Yobe baobab / full-screen flag revision
Owner authorised a grounded regional approximation when an exact hometown tree could not be verified. The displayed artwork now adapts Adamu ab's CC BY-SA 4.0 photograph, described by its uploader as Danchuwa, Yobe. Visible credit includes original source, photographer, licence, AI changes, derivative download and licence notice. Personal hometown/tree connection remains explicitly unverified. The reference's unverified age claim is omitted. Source/derivative provenance, original SHA-256 and full prompts: content/tree-art.json, docs/TREE_ART.md and docs/tree-art-generation.json.

A single CSS green-white-green flag is fixed across the entire viewport on every route while scrolling, with pointer events disabled. High-contrast and forced-colour modes hide it. Former local map watermarks were removed from the rendered tree and intro.

Final run 2026-10-22T04:07:21.929Z: 19 browser checks passed, zero page errors, zero axe violations across 9 tested states. New checks verify full-screen geometry while scrolling, high-contrast suppression, visible author/source/licence links, public derivative download and change notice. Both builds, workspace lint/typecheck and all five content tests passed. Updated screenshots remain in output/playwright/tree-revision-*.png. Earlier Lighthouse figures predate this artwork revision; performance is not newly certified and existing reveal gates remain open.

## Public repository delivery — 22 October 2026

Repository: https://github.com/batestguy/disability-inclusion-legacy-tree (PUBLIC, main). Preflight, workspace lint, typecheck, all five content/publishing tests and both production builds passed again before delivery. Staged source was inspected for credential patterns with zero matches; environment examples contain empty public identifiers. Build output, dependency caches and unused exploratory downloads are ignored. Initial implementation commit 1a1049c was pushed and its full SHA matched the GitHub commits API. GitHub Actions was queued at verification; consult its live result. No new browser, Lighthouse, translation approval or public website deployment is claimed by this documentation-only delivery.
