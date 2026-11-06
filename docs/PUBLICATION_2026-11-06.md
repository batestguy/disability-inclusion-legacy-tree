# Initial website publication - 6 November 2026

## Owner authorisation

After approving the desktop/mobile previews, the owner selected free Cloudflare
Pages hosting and said "go with it". Asked specifically about photographs and
organisation logos recorded as local-only/unverified, the owner replied:
"I have permission to publish them". This records owner-confirmed permission for
the currently displayed images, not an independently verified licence or blanket
permission for future assets. Existing source attribution and licence notices
remain. This explicit publication decision supersedes earlier local-only scope
for these assets; historical asset manifests are retained as provenance.

## Release scope

Publish the approved source checkpoint 0b55bdd73377fe5b55ff1d80fa96f736eefec9bf
as the initial owner-authorised, shareable draft. Build with RELEASE_MODE=preview
and SITE_URL=https://mohammed-abba-isa-legacy.pages.dev. Translation draft labels
and robots noindex/nofollow remain. No Hausa/Yoruba/Igbo review approval is claimed;
no frozen dataset or approval flag has been changed. RELEASE_MODE=public and its
stricter indexed-reveal checks remain unchanged. A noindex directive requests
search-engine exclusion; it does not restrict visitor access.

## Hosting

Cloudflare Pages project: mohammed-abba-isa-legacy. Free static hosting, direct
upload of apps/web/out, production branch main. No paid service, domain purchase,
Sanity dataset, analytics or server-side chatbot is provisioned. Pushing source
to GitHub does not deploy this project automatically.

Redeploy from the repository root after appropriate checks and a web build:

```powershell
$env:RELEASE_MODE='preview'
$env:SITE_URL='https://mohammed-abba-isa-legacy.pages.dev'
npm.cmd run build -w apps/web
npx.cmd wrangler@4 pages deploy apps/web/out --project-name mohammed-abba-isa-legacy --branch main
```

Credentials stay in Wrangler's external OAuth store. Do not store them in this
repository. A custom .com.ng domain can be connected after the owner selects and
purchases it; free pages.dev hosting requires no domain purchase.

## Verification

Published successfully: https://mohammed-abba-isa-legacy.pages.dev/
Immutable deployment: https://a0aeeb49.mohammed-abba-isa-legacy.pages.dev/
Upload: 305 static files, from application checkpoint 0b55bdd.
Verified at 2026-11-06T06:04:50Z: all four home locales, Explore, About,
Methodology and chat returned HTTP 200 and matched local HTML byte-for-byte.
See output/cloudflare-publication-results.json for SHA-256 evidence.

Live mobile-network browser checks passed eight locale/width states and enlarged
text, including exact desktop layout/path baseline, focused partner paths,
complete source relationships, source-detail navigation and List switching.
Live landing checks passed desktop/tablet/phone, orbital interaction, four entry
links, history/locale persistence, 200% text, failed-image fallback, forced colours,
reduced motion, unavailable storage and no-JavaScript navigation. No page errors,
failed responses or external requests were reported by the landing suite.
Thirteen axe states across these two live suites reported zero violations.
