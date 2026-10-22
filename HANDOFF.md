# Project handoff

Updated 22 October 2026 after public repository delivery. Start the next session here. Read AGENTS.md and PROJECT_PLAN.md; preserve HonAbbas.txt.

## Purpose and repository

Appreciate people and organisations who supported or continue to support disability causes. Hon. Mohammed Abba Isa is the first tribute. The owner explicitly authorised public source publication.

Repository: https://github.com/batestguy/disability-inclusion-legacy-tree
Branch: main. Verified delivery commit: b614322584f911810be52f5cbc23766b1c3ad1fd. Local and remote HEAD matched at delivery. Both CI runs have since passed; [delivery CI](https://github.com/batestguy/disability-inclusion-legacy-tree/actions/runs/39722444939). Later documentation commits may advance HEAD; use Git history for the latest SHA. Website reveal remains a separate milestone.

## Implemented

- npm workspace: static Next.js application in apps/web and standalone Sanity Studio in studio.
- Five sourced records, six sources, three roots milestones; English and visibly unreviewed Hausa drafts. Preserve distinctions between announcements, activities and measured outcomes.
- Regional Yobe baobab artwork, connected branch disclosures and story twigs, responsive layout, search/year filters, sourced panels, keyboard and browser Back, clear language choice, bilingual permanent links and persistent accessibility preferences.
- Full-screen flag watermark and enlarged portrait frame. A monogram remains until a genuine portrait has documented reuse permission.
- Reviewed public Sanity adapter, schemas, seed tools and public-mode build gates. No live Sanity project or Cloudflare deployment connected.

The regional approximation was explicitly authorised when an exact hometown tree could not be established. Do not claim a personal hometown connection. Source and adapted artwork carry CC BY-SA 4.0 attribution; see docs/TREE_ART.md and content/tree-art.json. Unused exploratory downloads stay local and ignored. No blanket licence has been granted for application code.

## Validation and next work

Repository delivery verification on 22 October 2026: preflight, workspace lint, typecheck, all five content tests and both production builds passed locally and in GitHub Actions. CI uploads a static preview artifact; it does not run browser/axe/Lighthouse or deploy the website. Earlier browser validation passed 19 journeys and axe in nine states; see docs/VALIDATION.md and output/browser-results.json. Earlier Lighthouse results predate the current artwork and miss performance targets; they are not current certification.

1. Obtain a genuine portrait with permission, fluent human Hausa review and correction mailbox.
2. Profile current artwork performance; complete screen-reader, zoom and journalist verification tasks.
3. Provision public Sanity content and Cloudflare Pages Git integration; exercise preview publication/deletion, failed-build retention and rollback using docs/CMS.md and docs/OPERATIONS.md.
4. Verify routes, attribution, contact and review gates before reveal. Do not bypass RELEASE_MODE=public checks.

## Commands and credentials

Use npm.cmd on Windows: npm run preflight, npm run lint, npm run typecheck, npm test, npm run build. For browser checks serve the export with npm run preview, install Playwright Chromium or set CHROMIUM_PATH, then npm run test:browser.

Keep credentials and deploy hooks outside the workspace. Optional creator fields may remain empty. The original sandbox created .git under a different Windows identity; if Git reports dubious ownership use the command-scoped option `git -c safe.directory=D:/HonAbbas ...`. No global safe-directory exception is needed.

## Resume here next time

Begin with Git status, preflight and latest Actions status. Performance profiling and local accessibility review can proceed without new user inputs. No multi-person archive has been implemented; the broader appreciation purpose does not establish additional tribute subjects or achievements.

Reveal still needs genuine portrait permission, human Hausa approval, correction mailbox and external Sanity/Cloudflare setup. Creator name, biography and bio link remain optional. The requested Pages name is mohammed-abba-isa-legacy; availability is unverified.

Do not assume previous servers remain running. Fresh checkout: npm.cmd ci, npm.cmd run build, then npm.cmd run preview. In another terminal run npx.cmd playwright install chromium, npm.cmd run test:browser and npm.cmd run test:performance. The static server defaults to http://127.0.0.1:8767; TEST_URL overrides browser/performance targets and CHROMIUM_PATH can specify an installed browser. Reports/screenshots are overwritten; preserve test conditions and inspect diffs before committing.

GitHub CLI was authenticated as batestguy at delivery. Recheck without printing credentials. Earlier sandbox setup-refresh errors are historical; commands and writes succeeded after access was restored. Do not repeat login or sandbox repair without a current failure.

## Documentation map

- PROJECT_PLAN.md: current phase status and historical decisions/progress.
- docs/VALIDATION.md: local/CI evidence, test conditions and review limits.
- docs/OPERATIONS.md: Pages setup, backup, rollback and password-free transfer.
- docs/CMS.md: public dataset setup, schema contract, seed review and hooks.
- docs/RESEARCH.md: sources, omitted claims and evidence boundaries.
- docs/TREE_ART.md, content/tree-art.json and docs/tree-art-generation.json: photo provenance, rights and AI edits. TREE_ART_GENERIC.md is historical.

Before the next handoff, update this snapshot and relevant status documents together, run preflight and state which checks were rerun. Preserve evidence dates and distinguish public source publication from website reveal.
