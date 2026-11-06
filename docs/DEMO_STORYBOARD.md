# Captioned desktop and mobile demos

Approved format: two separate 3:16 videos, desktop first, with an opening tribute
card, the original three-minute walkthrough and a brief closing author segment.
English explanatory captions and the supplied African Child track, no narration.
No generated footage, paid tools, production dependencies or website changes.

| Time | Scene |
|---|---|
| 0:00-0:06 | Opening card honouring Isa's disability-inclusion advocacy and public service |
| 0:06-0:18 | Portrait, heading, orbiting links and falling concepts |
| 0:18-0:36 | Isa's biography and documentary photographs |
| 0:36-1:01 | Contribution figures, filters and source qualifications |
| 1:01-1:21 | Concept cloud, relative weights and matching reports |
| 1:21-1:46 | Desktop network / mobile partner chooser, initiative and roles |
| 1:46-2:08 | Guided questions, follow-up topic and source finding |
| 2:08-2:18 | Shared four-language control and visible draft status |
| 2:18-2:58 | Collection, cleaning, source checks, TF-IDF/NMF, categories, phrase counts, limitations and agent support |
| 2:58-3:06 | Portrait, invitation and public URL |
| 3:06-3:16 | Creator's About profile: portrait, name, contact details and statistics/ML/AI purpose |

The methodology segment distinguishes text exploration from independent impact
verification. Agents supported collection/analysis scripts, interface development,
draft translations and automated checks; owner feedback directed revisions.
The visitor chatbot follows prepared questions and does not impersonate Isa.

## Reproduce locally

Use Node and the installed Playwright browser, FFmpeg/libass and Arial fonts.
Set FFMPEG_PATH and FFPROBE_PATH to actual executables if Windows shortcuts fail.
The existing FFprobe PATH shortcut is broken; the binary beside FFmpeg works.

```powershell
$env:FFMPEG_PATH=(Get-Command ffmpeg.exe).Source
$env:FFPROBE_PATH=Join-Path (Split-Path $env:FFMPEG_PATH) 'ffprobe.exe'
node scripts/demo-video.mjs --check
node scripts/demo-video.mjs
node scripts/demo-video.mjs --mobile --check
node scripts/demo-video.mjs --mobile
```

Use --scene ID to check/capture one scene, --recapture to replace saved takes,
or --render-only to assemble existing takes. DEMO_URL defaults to the live Pages
site. The browser uses a fresh context per scene, records only website content,
and adds a transient click ring in that recording context. Site code is unchanged.

Desktop: 1920x1080, website viewport 1920x936 with a reserved caption strip.
Mobile: 1080x1920, independently captured at 450x720 and scaled proportionally
above its caption strip. Captions never obscure the site's controls. Exports use
H.264/AAC, 30fps, faststart MP4 and a separate SRT. Browser capture cadence is
resampled to 30fps; this does not claim 30 distinct recorded frames per second.
The soundtrack uses its first 196 seconds, normalisation and opening/closing fades.

Raw WebM takes, edit metadata, ASS/SRT captions, final MP4, validation reports and
preview frames live under output/demo/. Keep them and the supplied MP3 out of
Git; do not upload video files as website assets. Delivery status and actual
checks belong in HANDOFF.md and docs/VALIDATION.md when completed.

## Delivered and verified

The current videos include the owner's requested six-second opening tribute
card and ten-second author ending. Their revised duration is exactly 196 seconds
(3:16), with 40 timed caption cues each. Desktop is 1920x1080; mobile is
1080x1920. The 40-second methods segment now starts at 2:18. Earlier 180-second
exports are superseded. Revised verification results are recorded in the handoff.

Start the optional local review page with `node scripts/serve-demo.mjs` and visit
http://127.0.0.1:8770/. Its template is scripts/demo-review.html. This server
supports byte-range requests so seeking works; an ordinary static server without
range support may restart playback instead of seeking. The page does not autoplay
music, pauses the previous video when switching, and offers downloads and a direct
methodology jump. It is local only and does not change the published website.

The opening title card is generated from scripts/demo-introduction.html; the
creator ending records the existing About page without changing the website.
For this append/prepend revision, --reuse-clips reuses the first 17 original
walkthrough clips because their in-clip content, timing and captions are unchanged;
it always re-encodes the introduction, old closing and author ending. Do not use
that flag after modifying any of those first 17 scenes or their captions.
