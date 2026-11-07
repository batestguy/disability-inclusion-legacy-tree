# C: project temporary-file cleanup - 7 November 2026

The owner requested committing/pushing the completed documentation before clearing project-related space on C:. Documentation commit `77886d13268535922c42fc1e449e93537e5cf9b2` was pushed to main before deletion. [GitHub verification passed](https://github.com/batestguy/disability-inclusion-legacy-tree/actions/runs/42328489688).

## Deleted disposable folders

All targets were immediate children of `C:\Users\TOSHIBA\AppData\Local\Temp`. Absolute boundaries and absence of filesystem links were checked before recursive deletion. No running Chrome/Edge/Node process referenced these project temporary directories.

| Folder | Logical bytes removed |
| --- | ---: |
| `honabbas-sanity-build` | 40 |
| `HonAbbas-wrangler-cache` | 323,034,150 |
| `HonAbbasMobileFlow-291bbddbc50e4cbfbef22ea93cbed0cd` | 189,128,022 |
| `HonAbbasPhonePreview-7c4dd1ca11b743438907b49b2fb76f8c` | 75,044,195 |

The Sanity folder held only disposable unauthenticated build configuration; `studio/scripts/cli.mjs` recreates it for builds. The Wrangler folder was a project-specific npm/tool cache. The two browser profiles were temporary project previews. Saved account credentials and normal browser profiles were left in place.

## Preserved reference images

Four `honabbas-plan-*` images had no identical copy among the checked D: project image locations. They were copied into `output/about-originals/recovered-c-temp/` on D: and verified with SHA-256 before removing the C: originals. This local archive is ignored by Git and grants no new image reuse permission.

| Preserved file | Bytes | SHA-256 |
| --- | ---: | --- |
| `honabbas-plan-fha.jpeg` | 152,695 | `195ada545394c0d38bd633087e3f3269f41206d470035705e44c602c6ed889d0` |
| `honabbas-plan-github-avatar.jpg` | 290,512 | `2f094bb305ade48c3dfb5283ed907be845f75775e6d970cb6683efae49051664` |
| `honabbas-plan-smedan-event.jpg` | 14,652 | `a9ef07d2e0f41cd63ce366fa5b2c117cd903828e697f951701ef6a649ca84ff0` |
| `honabbas-plan-smedan.jpg` | 66,247 | `48c5a1f594f3d86caa0f51f4d904215f0fcaccbe5aa3139ae940aa573b4ea016` |

## Result and scope

- Removed C: file data: **587,730,513 bytes** (about 588 MB, or 560.5 MiB).
- Observed C: free-space increase: **593,096,704 bytes** (about 593 MB). Filesystem allocation and other activity can differ from logical file sizes.
- C: free space after cleanup: approximately **67.50 GiB**.
- All eight named cleanup sources were confirmed absent afterward. No `HonAbbas`/`honabbas`-prefixed entries remain in the inspected Temp root.
- Generic Playwright profiles, shared npm caches, browser installations, Python/Conda environments, credentials and unrelated projects were preserved. Generic `demo_frames` content inspected belonged to another project and was not removed.
- The project itself, original analysis evidence, final demos and source files remain on D:. No live website redeployment was performed.
- This was a targeted project cleanup, not a claim that the entire C: drive was exhaustively scanned.
- Local machine-readable report: `output/c-drive-cleanup-2026-11-07.json` (ignored).
