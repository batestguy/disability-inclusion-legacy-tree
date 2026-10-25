# Standalone chatbot — Hausa human-review packet

25 October 2026. **Draft; no fluent-human approval is recorded.** This packet
extends the [Phase 2 labels](phase2-hausa-review.md). Automated semantic tests
do not assess naturalness, dialect, tone or cultural suitability.

## Review surfaces

Open `/ha/chat/` in the local static preview. Use the shared selector and browser
history. English must stay above Hausa; the exact instruction remains
**Change language / Canja harshe**. Check readability on a narrow phone.

Review all Hausa chrome in
[ChatWorkspace.tsx](../apps/web/components/ChatWorkspace.tsx), programme names,
questions, clarification reasons and answer templates in
[chat-engine.mjs](../apps/web/lib/chat-engine.mjs), and the Phase 2 activity,
category and topic labels. Source titles, attributed roles, exact excerpts and
source limitations can remain original English, clearly labelled. They must not
be presented as approved Hausa translations.

## Required conversational journeys

Owner-feedback addition: review “Me ya yi wa mata masu nakasa?” and the new
women-focused summary in `chat-engine.mjs`. It presents the NigWED (>45) and
startup-support (>20) reports separately. Check the wording for reusable sanitary
pads, programme-level POS/startup support (individual packages unverified), unknown
cohort overlap, and unestablished later income/employment. Do not translate the
two figures into an overall unique-woman count. This addition remains unsigned.

| English meaning | Current Hausa draft / action | Check |
| --- | --- | --- |
| Count documented activities | Ayyuka nawa aka rubuta? | Selected inventory, not full career |
| Report-year list | Nuna ayyuka a shekarar rahoto 2024 | Report year, not assumed event year |
| Five SMEDAN participants | Mutane nawa SMEDAN ta tallafa wa? | One cohort, training and kits not counted twice |
| Strict lower bound for NigWED | Mata nawa suka samu horon NIGWED? | More than 45, not exactly 45 |
| Startup recipients | Mutane nawa suka samu tallafin startup? | More than 20, office-reported support |
| Borno employment report | Mutane nawa suka samu aikin yi a Borno? | Attribution, not sole personal credit |
| Target versus delivery | An samar da ayyukan yi 36,551? | Target; delivery not established |
| Contextual follow-up | Kuma wace shekara aka bayar da wannan rahoto? | Same programme and report-date basis |
| Unique-person total refusal | Mutane daban daban nawa suka amfana gaba daya? | Explain overlap without sounding dismissive |
| Literal keyword lookup | nemo: SMEDAN | Records, not a demographic total |
| Categories and topics | Nuna rukunai / Nuna jigogi | Topics describe English text patterns |
| Institutions and places | Nuna kungiyoyi / Nuna wurare | Mentions do not prove delivered coverage |
| Relationships | Nuna alaka | Intentions, reported collaboration and signing distinguished |

Also review greeting, draft notice, composer help, reset, context correction,
empty-year results, unsupported money/unit/stage questions, error wording,
source disclosures, download/close controls and the privacy explanation.
Ensure targeted clarifications are understandable for people unfamiliar with
data terminology. Test typed Hausa paraphrases beyond the supplied examples;
record excess clarification as a usability gap rather than approving it silently.

## Sign-off record

- Reviewer name / fluency: pending
- Date and exact dataset/code revision: pending
- Wording corrections and checked journeys: pending
- Release approval: **not given**

Human approval must be explicitly recorded before changing release gates.
