# Project handoff

Updated 22 October 2026. Read AGENTS.md and PROJECT_PLAN.md; preserve HonAbbas.txt.

## Purpose and repository

Appreciate people and organisations who supported or continue to support disability causes. Hon. Mohammed Abba Isa is the first tribute. The owner explicitly authorised public source publication.

Repository: https://github.com/batestguy/disability-inclusion-legacy-tree
Branch: main. Website reveal remains a separate milestone. Consult Git history for the current delivery commit and GitHub Actions for remote validation.

## Implemented

- npm workspace: static Next.js application in apps/web and standalone Sanity Studio in studio.
- Five sourced records, six sources, three roots milestones; English and visibly unreviewed Hausa drafts. Preserve distinctions between announcements, activities and measured outcomes.
- Regional Yobe baobab artwork, connected branch disclosures and story twigs, responsive layout, search/year filters, sourced panels, keyboard and browser Back, clear language choice, bilingual permanent links and persistent accessibility preferences.
- Full-screen flag watermark and enlarged portrait frame. A monogram remains until a genuine portrait has documented reuse permission.
- Reviewed public Sanity adapter, schemas, seed tools and public-mode build gates. No live Sanity project or Cloudflare deployment connected.

The regional approximation was explicitly authorised when an exact hometown tree could not be established. Do not claim a personal hometown connection. Source and adapted artwork carry CC BY-SA 4.0 attribution; see docs/TREE_ART.md and content/tree-art.json. Unused exploratory downloads stay local and ignored. No blanket licence has been granted for application code.

## Validation and next work

Repository delivery verification on 22 October 2026: preflight, workspace lint, typecheck, all five content tests and both production builds passed. Initial implementation commit 1a1049c was pushed to public main; the GitHub API returned the same SHA as local HEAD. A follow-up documentation commit records this result. GitHub Actions was queued at verification; inspect Actions for its current result. Earlier browser validation passed 19 journeys and axe in nine states; see docs/VALIDATION.md and output/browser-results.json. Earlier Lighthouse results predate the current artwork and miss performance targets; they are not current certification.

1. Obtain a genuine portrait with permission, fluent human Hausa review and correction mailbox.
2. Profile current artwork performance; complete screen-reader, zoom and journalist verification tasks.
3. Provision public Sanity content and Cloudflare Pages Git integration; exercise preview publication/deletion, failed-build retention and rollback using docs/CMS.md and docs/OPERATIONS.md.
4. Verify routes, attribution, contact and review gates before reveal. Do not bypass RELEASE_MODE=public checks.

## Commands and credentials

Use npm.cmd on Windows: npm run preflight, npm run lint, npm run typecheck, npm test, npm run build. For browser checks serve the export with npm run preview, install Playwright Chromium or set CHROMIUM_PATH, then npm run test:browser.

Keep credentials and deploy hooks outside the workspace. Optional creator fields may remain empty. The original sandbox created .git under a different Windows identity; if Git reports dubious ownership use the command-scoped option `git -c safe.directory=D:/HonAbbas ...`. No global safe-directory exception is needed.
