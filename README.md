# Disability Inclusion Legacy Tree

An appreciation project for people and organisations who have supported, and continue to support, disability causes. The first tribute celebrates Hon. Mohammed Abba Isa through an interactive, sourced tree of advocacy and inclusion.

This public source repository contains a working bilingual preview. The project is independently created and does not imply official endorsement. The original brief remains in [HonAbbas.txt](HonAbbas.txt); decisions and release gates are in [PROJECT_PLAN.md](PROJECT_PLAN.md). Start ongoing work with [HANDOFF.md](HANDOFF.md).

## Run locally

Requires Node 22.12+ (validated with Node 24.15) and npm 11. On Windows, use npm.cmd in place of npm.

```sh
npm ci
npm run dev          # Next.js at http://localhost:3000
npm run studio       # standalone Sanity Studio at http://localhost:3333
npm run preflight
npm run lint
npm run typecheck
npm test
npm run build        # apps/web/out and studio/dist
npm run preview      # static site at http://127.0.0.1:8767
npm run test:browser # install Chromium first; see docs/VALIDATION.md
npm run test:performance
```

The npm workspace contains apps/web (Next.js, TypeScript, Tailwind, Radix UI and GSAP) and studio (Sanity). Root package private: true prevents accidental npm publication; it does not control GitHub visibility.

## Explore the tribute

Four connected branches reveal sourced achievement twigs: Policy Advocacy, Economic Empowerment, Digital Inclusion and Assistive Tech. Search and year filters support research; roots present the biography. English is at /, Hausa at /ha/, with permanent achievement pages in both languages. Keyboard controls, focus restoration and local accessibility preferences are implemented.

The tree is an AI adaptation of Adamu ab's CC BY-SA 4.0 baobab photograph, described by its uploader as Danchuwa, Yobe. Its personal connection to Hon. Isa's hometown is unverified. Attribution and reuse terms are in [docs/TREE_ART.md](docs/TREE_ART.md). A Nigerian flag watermark spans the viewport. The enlarged portrait frame uses a monogram until a genuine portrait has documented reuse permission.

## Content and publishing

Without public Sanity IDs, builds use five sourced starter records in content/records.json, alongside clearly labelled, unreviewed Hausa drafts. See [docs/RESEARCH.md](docs/RESEARCH.md) for evidence boundaries. The broader appreciation purpose does not imply that a multi-person archive has already been implemented.

Copy .env.example to apps/web/.env.local for local configuration; Studio configuration is separate. Keep credentials outside the repository and public bundle. [docs/CMS.md](docs/CMS.md) explains reviewed-content publishing. Optional creator information stays hidden when empty; GoatCounter is opt-in and unconfigured.

Cloudflare Pages and a live Sanity project are not connected. The intended Pages build is `npm ci && npm run build -w apps/web`, output apps/web/out. The requested Pages name is mohammed-abba-isa-legacy, subject to availability. Public GitHub source access does not deploy the website. See [docs/OPERATIONS.md](docs/OPERATIONS.md) for setup, backups, rollback and ownership transfer.

RELEASE_MODE=public enforces portrait permission, human Hausa review and a correction address. Human accessibility review, fresh performance measurements and live publishing verification also remain release work. See [docs/VALIDATION.md](docs/VALIDATION.md) for recorded results and their limits.

## Reuse

The adapted tree artwork is CC BY-SA 4.0, with source attribution and changes documented in the artwork notice. No blanket open-source licence has been granted for application code or third-party photographs. A public repository alone does not grant additional reuse rights.
