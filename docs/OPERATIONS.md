# Release, operation and handover

## Planned chatbot operations boundary

[CHATBOT_SPEC.md](CHATBOT_SPEC.md) records the accepted chatbot section and shared page/chat language control: **Change language / Canja harshe**, with visible vertically stacked **English** and **Hausa** options. Implementation is pending. Preserve static hosting unless a separately evaluated model/service is selected; no inference endpoint, raw-question logging or new service has been provisioned. Future promotion checks must include both page locales and synchronised chat behaviour. Existing reveal gates remain in force.

## Current gate state
Public source repository: https://github.com/batestguy/disability-inclusion-legacy-tree (main). Public source publication is explicitly authorised separately from website reveal. See ../HANDOFF.md for ongoing work. No Cloudflare project or Sanity dataset has been provisioned by this workspace. No website deployment is claimed. Reveal requires approved genuine portrait, fluent Hausa review and correction contact. Personal creator fields are optional. Keep preview noindex until these gates pass.

## Cloudflare Pages with Git integration

Next-session snapshot (22 October 2026): public main delivery b614322 passed [GitHub Actions](https://github.com/batestguy/disability-inclusion-legacy-tree/actions/runs/39722444939). CI uploads the static export as an artifact and does not deploy it. No Pages address, deploy hook, recovery/restore drill or live publishing test has been verified. Continue from [the handoff](../HANDOFF.md); keep private recovery material outside this public repository.
Connect batestguy/disability-inclusion-legacy-tree through Cloudflare dashboard > Workers & Pages > Pages > Import existing Git repository. Use project mohammed-abba-isa-legacy if available; do not claim availability before provider confirmation. Root build directory /, build command npm ci && npm run build -w apps/web, output apps/web/out, Node 24. Use preview branch first with RELEASE_MODE=preview. Configure public SANITY_PROJECT_ID, SANITY_DATASET and SITE_URL; secrets such as a rebuild hook are stored only in provider settings, outside source. When review gates pass, set RELEASE_MODE=public on production. Existing production stays on its last successful deployment if a new build fails.

The app uses Next static export with unoptimized image handling: upload an appropriately sized compressed portrait to Sanity; its CDN URL is served directly via next/image. Do not expect runtime Next image optimisation. Cloudflare Pages serves the generated index.html files and needs no Node server or Functions.

See [Next static export](https://nextjs.org/docs/app/guides/static-exports) and [Cloudflare static Next guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/).

## Review before promotion
Check English and Hausa home, direct achievement URLs, sources, image credit/permission, corrected dates, mobile/keyboard, correction email and preference persistence. Time a journalist finding the biography and verifying three stories (target under five minutes). Record URL, commit SHA, deployment ID, timestamp, HTTP status and a browser smoke check against that URL. Compare built and served asset filenames. Configure GoatCounter only after a free account is owned and NEXT_PUBLIC_GOATCOUNTER_CODE supplied; no analytics secrets belong in the bundle.

## Sanity rebuilds
Publish only editorially reviewed English records and human-reviewed Hausa. A document's publication is distinct from review. Connect a Cloudflare preview Deploy Hook to a Sanity webhook on published create/update/delete for achievement, timelineEvent, source and siteSettings. Review a successful preview before production promotion. Hook URLs grant rebuild capability: keep them out of the repository. See CMS.md for projections and seed import. Test a publication and deletion, and force a failed preview build to confirm production remains unchanged.

## Backups / recovery / rollback
Keep source and package-lock in Git; monthly export the Sanity dataset and referenced image assets to owner-controlled external storage. Before changing schemas make a fresh export and test restore in a separate dataset. Log last successful Cloudflare deployment ID and source commit. Roll back via Pages > Deployments > known good deployment > rollback; verify both languages and an achievement after rollback. Never delete the production project as a rollback method. If an account is inaccessible use its recovery methods and provider support; store recovery codes in the owner's password manager, never this repository.

## Free tiers and monthly review
No paid add-ons or domain purchase. Check actual provider free-tier quotas before reveal and monthly: Pages builds/bandwidth policies, Sanity seats/API/assets/dataset use, GoatCounter retention/usage and GitHub repository visibility. Alert on build failures and broken citations. Review new additions, corrections, source availability, translations, rights, dependency security and account service notices monthly. Preserve original source URLs and record last checked dates; do not replace a source silently.

## Handover without passwords
Invite the recipient to GitHub, Cloudflare, Sanity and GoatCounter using each service's membership/ownership controls. Transfer repository/project ownership with provider-supported flows, billing responsibility staying free, after confirming access and recovery. Test edit/publish/rebuild/rollback with the new owner, then remove unneeded access. Supply README, plan, source ledger, latest backup, release log and correction mailbox ownership; never share account passwords.
