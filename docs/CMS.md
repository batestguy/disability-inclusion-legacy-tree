# Editing the legacy archive

The website works from checked-in local content without a CMS account. `studio/` is a standalone native Sanity Studio for optional editing. No project, administrator, hosting account, webhook, or credential has been provisioned.

## Connect a real project

1. Create a Sanity project and a `production` dataset in an account controlled by the long-term owner. Confirm current free-plan limits and user allowances in the account before inviting editors. This repository creates no paid resources and cannot guarantee future free-plan terms.
2. Copy `studio/.env.example` to `studio/.env.local`; set `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`. These identifiers are public. Never put tokens in `SANITY_STUDIO_*` variables, which are bundled into the browser.
3. Run `npm install` in the repository root, then `npm run dev --workspace=@legacy/studio`. Sign in through Sanity and grant the least privileges needed. Test with a non-administrator editor.
4. Add the exact trusted Studio origin to the project's CORS origins if needed. Avoid wildcard credentialed origins. Set the website's documented CMS build variables to the same project and dataset.
5. Build and review the website before deploying. `npm run build --workspace=@legacy/studio` produces the separate admin application in `studio/dist/`. Host it independently or use Sanity's authenticated CLI deploy workflow after the owner has chosen its Studio URL.

Type checks and the Studio bundle support a literal `placeholder` project ID when environment values are absent. This is not a working backend; the Studio title labels it clearly. Configure a real project to edit. No read token is needed for an intentionally public dataset. This implementation supports public datasets only; do not add authenticated browser requests or bundle a private dataset token.

## Evidence and publication

Create sources first. Open original URLs, confirm publishers and dates, distinguish office statements from independent reporting, and record the date checked. Leave an undated source's publication date blank.

Each achievement needs its documented role, evidence limits and sources. Choose the status established by evidence: advocacy, announced, reported, completed, or measured. An announcement does not prove completion, reach, impact, or an attributable personal outcome. A measured result needs its measurement source. CMS validation requires fields; an editor still has to assess the evidence.

Content starts with `reviewed: false` and `haReviewed: false`. Check claims and citations, enable review, then publish. Publish referenced sources and mark them reviewed too. Studio validation is an editing aid, not a security boundary; maintain equivalent public-build checks. Never fetch drafts for public builds. Enable `haReviewed` only after a fluent human editor checks all Hausa fields; preview Hausa is visibly marked as a draft; public builds require complete, human-reviewed Hausa in every story and timeline record.

Keep one reviewed `siteSettings` record (recommended ID: `siteSettings`). Optional creator attribution and a public corrections inbox require authorisation. Portraits need alt text, credit, original URL and permission/licence evidence. `rightsStatus: unconfirmed` excludes the image from the public site. Public availability is not permission. Store private permissions correspondence outside a public dataset and record only its filing reference.

## Data contract

Preserve Sanity `_id` as the stable frontend `id`. Bilingual fields are `{en, ha}`. Studio allows draft translations to be empty; website validation requires complete English and Hausa before a record can enter this bilingual preview.

| Document | Fields | Public mapping |
| --- | --- | --- |
| `achievement` | bilingual `title`, `description`, `role`, `evidenceLimits`; `slug.current`; ISO `date`; `branch`; `status`; `sources[]`; `reviewed`; `haReviewed` | Initiative card with explicit role and limitations; slug becomes a string |
| `timelineEvent` | bilingual `date`, `label`, `detail`; integer `sortOrder`; `sources[]`; review flags | Ordered roots timeline; date is a display label permitting honestly imprecise dates |
| `source` | `title`, `url`, `publisher`, `type`, optional ISO `date`, ISO `accessed`, `reviewed`; editorial `notes` | Evidence citation; omit notes |
| `siteSettings` | `title`; optional `creator: {name, bio: {en, ha}, url}`, `correctionEmail`, `portrait`; review flags | Attribution, contact and rights-cleared portrait |
| `provenanceImage` | image asset plus bilingual `alt`, `credit`, `provenance`, `permission`, `rightsStatus` | Portrait only when rights confirmed; show credit and meaningful alt text |

Branches: `policy`, `economic`, `digital`, `assistive`. Statuses: `advocacy`, `announced`, `reported`, `completed`, `measured`. Source types: `independent`, `official`, `office`. Image rights: `unconfirmed`, `permission`, `licensed`, `public-domain`.

Use a fixed API version and published perspective. The exact checked projection is in `apps/web/lib/content.ts`. It returns only reviewed, published documents, selects explicit public fields (excluding editorial notes), maps timeline label/detail into title/description and preserves source reference IDs. The adapter requires every reference to resolve to a reviewed source; it fails the build if a source is withdrawn instead of quietly hiding an unsupported citation.

The adapter must reject cards with no usable reviewed sources, malformed enum values, missing English text, or invalid URLs. Filter settings/timelines with the same review and draft rules and sort timelines by `sortOrder`. Use an explicit local/CMS build choice; fail a configured CMS build on fetch or validation failure instead of silently publishing stale or mixed content. The browser must not make authenticated CMS requests.

## Automatic static rebuild

A static site changes after a successful deployment. Start with a preview-branch deploy hook; promote reviewed output only after release gates pass. After that, create a production-branch deploy hook in Cloudflare Pages, then a Sanity webhook targeting it. The hook URL is a secret capability: keep it in service dashboards, never source code or public documents. Configure webhook verification if offered; otherwise protect hook access and monitor deployment usage.

Trigger create, update and delete events for published `achievement`, `timelineEvent`, `source`, and `siteSettings` documents, excluding drafts. Source changes must rebuild because cards depend on them. Suggested Sanity filter:

```groq
!(_id in path("drafts.**")) && _type in ["achievement", "timelineEvent", "source", "siteSettings"]
```

Test publishing, referenced-source edits, unpublishing and deletion. Confirm the deployment removes withdrawn records. Webhook delivery does not prove build success: check deployment logs and the live page. Batch edits to reduce duplicate builds. Leave automatic publishing disabled until the end-to-end check passes.

## Backups and ownership transfer

Export dataset and assets regularly using the authenticated CLI, for example from `studio/`: `npx sanity dataset export production <external-backup-path>.tar.gz`. Store exports outside this public workspace in owner-controlled storage. Back up before bulk edits and test importing into a separate test dataset. Keep a retention policy and record restore instructions; untested exports are untested backups.

Transfer the repository, Cloudflare/domain, Sanity project ownership and analytics account to the owner. Verify the replacement administrator before removing the original. Document public identifiers, environment variable names, English/Hausa review responsibilities, backup location and recovery steps. Rotate build credentials and deploy hooks through service dashboards; never place them in repositories, tickets or chat. Remove temporary access only after the owner verifies editing, rebuilding, rollback and backup recovery.

## Import the local content for review

Generate deterministic NDJSON from the local public records (no network or credentials):

```powershell
node studio/scripts/seed.mjs > output/sanity-seed.ndjson
```

The generator maps source IDs into references, achievement slugs into Sanity slug objects, and timeline title/description into label/detail. It intentionally resets **every** review flag to false and leaves out the placeholder portrait and empty contact/creator values. Review the NDJSON before importing into a separate test dataset first. The import creates published-but-unreviewed records, which the public build excludes. Editors must inspect evidence and explicitly enable review and publish their changes before those records appear.

From the authenticated Studio directory, use `npx sanity dataset import ../output/sanity-seed.ndjson production` only after confirming the destination project/dataset. Back up first. Do not use overwrite/replace flags against existing editorial work without inspecting the conflict list; deterministic IDs deliberately make repeated imports detectable. The script never imports automatically and never copies the local reveal-ready flag into CMS settings.

For restricted Windows build environments where the Sanity CLI cannot write its usual user configuration directory, set `XDG_CONFIG_HOME` to an allowed temporary directory for that process, and set `NO_UPDATE_NOTIFIER=1` and `DO_NOT_TRACK=1`. This permits an unauthenticated placeholder bundle build; it does not configure a live CMS account.
