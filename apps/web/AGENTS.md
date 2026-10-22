## Accepted chatbot and locale contract

Before implementing the dashboard chatbot, read [the specification](../../docs/CHATBOT_SPEC.md) and [the handoff](../../HANDOFF.md). Build a polished conversational English/Hausa component before dashboard integration. Page locale controls chat automatically. Always expose **Change language / Canja harshe**, with **English** above **Hausa**, vertically stacked and visible without a menu. One control changes page and chat together. Implementation and human Hausa review are pending. Preserve the managed Next.js guidance below.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
