## Accepted chatbot and locale contract

31 October 2026: language prompt now includes all four equivalents: **Change
language / Canja harshe / Yí èdè padà / Gbanwee asụsụ**. Keep these visible with
the existing vertically stacked English/Hausa/Yorùbá/Igbo links. Creator profile
must use the owner's latest researcher/Statistician wording, ML areas rather than
named individual projects, and his AI vision. Methodology is deliberately short
and plain; settings/implementation links remain in the disclosure.

30 October 2026: owner added Yoruba and Igbo across the site and guided chat,
with all translations visibly marked draft. Shared locale codes are en/ha/yo/ig.
Keep **Change language / Canja harshe**, with visible vertically stacked links
in this order: **English**, **Hausa**, **Yorùbá**, **Igbo**. Preserve selected
records and guided flow across changes. Exact source evidence stays in its
original language. See ../../docs/YORUBA_IGBO_2026-10-30.md. No review flag or
public deployment is authorised by the language implementation.

Latest owner direction (25 October 2026): implement a guided clickable question
tree with answer/follow-up choices as the main conversation. No hired or outside
reviewer is required; use owner feedback and documented checks while labelling
Hausa draft honestly. See ../../docs/GUIDED_CHAT_IMPLEMENTATION.md. This supersedes
the earlier free-text-first and mandatory outside-signoff assumptions below.

Before implementing the dashboard chatbot, read [the specification](../../docs/CHATBOT_SPEC.md) and [the handoff](../../HANDOFF.md). Build a polished conversational English/Hausa component before dashboard integration. Page locale controls chat automatically. Always expose **Change language / Canja harshe**, with **English** above **Hausa**, vertically stacked and visible without a menu. One control changes page and chat together. Implementation and human Hausa review are pending. Preserve the managed Next.js guidance below.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
