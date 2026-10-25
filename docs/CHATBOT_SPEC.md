# Bilingual dashboard chatbot specification

## Latest presentation correction — 25 October 2026

The owner rejected internal scrolling and unnecessary explanatory material.
Use one concise question/answer with up to three replacing choices. Page option
sets with Previous / More options. Remove the introduction/sidebar, duplicate
navigation, statistics and routine evidence dumps. Sources and Details replace
the screen only when chosen; long source text/metadata are paged, not expanded.
Keep material bounds, stages and attribution qualifications, English/Hausa
synchronisation and truthful draft status. This supersedes the scrollable-panel
presentation below. See GUIDED_CHAT_IMPLEMENTATION.md for the current contract.

## Latest owner direction — compact guided chatbot, 25 October 2026

The main flow is now clickable questions, answers and useful follow-up choices,
leading to source findings. See [GUIDED_CHAT_IMPLEMENTATION.md](GUIDED_CHAT_IMPLEMENTATION.md).
Build this standalone component before the main dashboard. Each click replaces
the current step inside a stable-height, scrollable panel. Back/Next retrace
visited steps, a new choice clears forward steps, and Start again resets the
path. English/Hausa share one visible control and preserve the current step.
This supersedes free-text-first/transcript requirements below. Hausa stays draft;
no hiring or outside sign-off is required for continuing development. Existing
approval flags and release gates must remain truthful. The legacy parser and
its failed audit remain preserved; graph coverage is not language accuracy.

## Current quality audit — supersedes readiness wording below

25 October: the independently authored fifty-question audit fully answered none
of 34 evidence-answerable questions. Five total replies gave useful complete
handling, plus one partial. All fifty browser replies matched the engine. The
interface and narrow fixtures work, but ordinary conversational quality is not
validated. See [CHATBOT_ACCURACY_AUDIT.md](CHATBOT_ACCURACY_AUDIT.md). Improve
question understanding and retest on fresh unseen questions; preserve the baseline.

## Implementation checkpoint — 25 October 2026

The standalone component is now implemented at `/chat/` and `/ha/chat/` using
the reviewed-subset v1 bundle. [PHASE3_IMPLEMENTATION.md](PHASE3_IMPLEMENTATION.md)
records its supported catalogue, privacy, locale behaviour and limits;
[VALIDATION.md](VALIDATION.md) records actual checks. Earlier status text below
is historical specification context, not the current implementation status.

Owner-feedback update: the natural question “what has he done for disabled women?”
and Hausa equivalents now yield a source-bound two-programme summary, with no
combined unique-person total. This replaces its earlier generic clarification;
other unsupported questions still clarify. Hausa summary wording remains draft.

The active inventory is 33 distinct reviewed-subset activities; six-activity
examples below refer to the old starter ledger. Direct numerical query support
currently covers five named programmes. Other activity evidence is available via
lists and literal keyword lookups. No unrestricted model parser is provided.
Hausa chrome/templates remain drafts, with human sign-off pending in
[phase3-hausa-review.md](../research/phase3-hausa-review.md). Dashboard integration,
human reviews, full offline use and public reveal remain pending.

Updated 22 October 2026. This is the continuation source of truth for the owner's chatbot and language-control requirements. Read with [HANDOFF.md](../HANDOFF.md), [PROJECT_PLAN.md](../PROJECT_PLAN.md), [CONTRIBUTION_METRICS.md](CONTRIBUTION_METRICS.md) and [NUMERICAL_QA_REVIEW.md](NUMERICAL_QA_REVIEW.md).

## Status and decision precedence

The owner wants a beautifully designed, conversational English/Hausa chatbot, built and validated as a component before integration as a dedicated section of the planned contribution dashboard. This supersedes the earlier suggestion to present the feature primarily as a compact question tool or query builder. Suggested questions and clarification choices can support the chat experience; they must not replace it.

The owner explicitly requires automatic page/chat language synchronisation, an immediately visible vertical language selector, and a bilingual instruction explaining that selector. These are accepted product requirements. No chatbot, new language control, dashboard integration, model service or related browser validation has been implemented in this documentation session. The current tree preview and contribution-metrics foundation remain the existing implementation.

New.txt is preserved as the original numerical-Q&A proposal. Its package choices and guarantees were reviewed, not accepted wholesale. The numerical and evidence safeguards in NUMERICAL_QA_REVIEW.md remain applicable behind the conversational interface. This document accepts the chatbot presentation without claiming that any particular model or service has been selected.

## Owner requirements

| ID | Required observable behaviour |
| --- | --- |
| CHAT-01 | Present a polished chatbot with a readable conversation, message composer and natural English/Hausa interaction. |
| CHAT-02 | Develop and validate the chatbot component, then integrate it as a dedicated dashboard section. The final section position is not specified. |
| LANG-01 | An English page starts the chatbot in English automatically. A Hausa page starts it in Hausa automatically. |
| LANG-02 | Changing the page language changes the chatbot language in the same interaction. There is no independent chat-language setting that can drift from the page. |
| LANG-03 | Always display the bilingual instruction **Change language / Canja harshe**, regardless of the active language. |
| LANG-04 | Always expose **English** above **Hausa**, one underneath the other. Both are visible without opening a menu, including on mobile. |
| LANG-05 | Clearly identify the active language visually and programmatically. Both options remain discoverable in either language. |
| LANG-06 | Localise the chatbot greeting, suggested questions, composer label/placeholder, send control, answers, follow-ups, clarifications, errors, empty states and status announcements to the page language. |
| LANG-07 | The language selector changes the page and chatbot together while preserving the equivalent page/record context where available. |
| LANG-08 | Fluent human Hausa review is required before public release. Documentation of the wording does not establish that approval. |

The owner typed "Changa Harshe" while requesting the bilingual instruction; the discussion settled on **Canja harshe** as the Hausa wording. Carry that exact proposed label into human Hausa review. Do not silently substitute another spelling or remove either half of the bilingual instruction.

Required visible arrangement, with current selection indicated by styling and accessible state:

```text
Change language / Canja harshe

English
Hausa
```

This is one shared page-language control, accessible before the user needs to understand the conversation. The exact placement may be refined during design, but it must be prominent and easy to find on first arrival. Do not hide one language behind a flag icon, a dropdown, a hover state, an untranslated settings panel or a mobile menu.

## Design direction

Use the established deep green, ivory and gold palette with strong readable contrast, generous spacing, clear message hierarchy and restrained motion. Give the section a welcoming introduction, elegant assistant/user messages, helpful starter-question chips and a comfortable composer. Keep evidence details expandable so the main answer remains conversational. Avoid decorative animation that obscures answers or delays interaction.

Recommended answer presentation: a short natural-language explanation, a prominent sourced figure when relevant, visible qualifiers, expandable evidence, and an action opening the corresponding dashboard rows. Show programme/year context for follow-ups and let the visitor correct that interpretation. The name "Ask the data" remains a working title; final naming has not been approved.

Design desktop and narrow mobile states. Provide keyboard operation, visible focus, semantic labels, meaningful active-language state, sensible message reading order, accessible status announcements, high-contrast support, enlarged-text reflow and reduced motion. Announce new answers without repeatedly reading the entire transcript.

## Shared language state and route behaviour

Use the page's resolved locale as the source of truth. Existing routes are English at `/` and Hausa at `/ha/`, with corresponding permanent record routes. A direct route load, refresh, browser Back/Forward or language change must leave page and chat in the same language. A stored preference must not override an explicitly selected route's language.

Recommended implementation behaviour, to validate during development:

- Update the route/page, shared language state, chatbot chrome and future responses together. Preserve selected record and compatible filters where the equivalent destination supports them.
- Preserve typed visitor text when switching languages; do not silently translate or submit it.
- Keep user-authored transcript messages as originally entered. Retain structured answer claims and re-render system/assistant template messages in the selected language where reviewed equivalents exist. Do not use unreviewed machine translation to make older prose appear approved. This transcript strategy is an implementation recommendation, not an extra owner-specified requirement.
- Cancel or invalidate an in-flight response on a language change so a stale reply cannot arrive in the previous language. Retain the pending question and provide an understandable retry path if needed.
- Use the selected page language for clarifications and responses even if the visitor types mixed-language text. Recognising mixed language should help understanding without silently switching the page. Whether an explicit conversational request to change language invokes the shared selector is a later design choice.

Do not introduce mandatory automatic language detection before visitors can use the feature. The visible shared selector already supplies the language choice. A future detector may assist parsing, but cannot override that explicit choice.

## Conversational scope and numerical integrity

Visitors should be able to ask questions and follow up about the reviewed contribution records. Carry forward a programme/year context only when it is clear; confirm ambiguous references. A confident conversational style must not imply comprehensive career coverage or independent auditing.

Use controlled query plans, deterministic calculations and typed answer claims with record IDs, source IDs, metric, unit, population, bound, stage, date basis and attribution. Prefer reviewed bilingual response templates for numerical claims. A later model parser may propose a query plan; validation and approved metric functions decide what may execute. Package/service selection remains open and must follow the existing review and dependency rules.

Preserve the current ledger's rules:

- Six documented activities describe the starter inventory, not all lifetime contributions.
- Five SMEDAN participants are one cohort; training and kits do not double the count.
- Fifteen Borno placements are office-reported employment, with source and attribution limits.
- More than 20 startup recipients and more than 45 NIGWED trainees retain strict lower bounds.
- The 36,551 opportunities are a target, not documented jobs delivered.
- Unknown quantities/geography remain missing. Overlapping cohorts cannot be summed as unique people. Report year does not establish event year.
- Clarification and unsupported answers are useful chat outcomes. Do not invent an answer to maintain conversational flow. Keep Hausa clarification understandable and measure any excess refusal as a usability gap.

Examples for design and test fixtures, with Hausa equivalents awaiting human review:

| Visitor prompt | Expected response meaning |
| --- | --- |
| How many activities are documented? | Six in this starter ledger, with incomplete coverage disclosed. |
| How many participants were supported in the SMEDAN activity? | Five reported participants; source available. |
| And which year was that reported? | Resolve the previous SMEDAN context and label the publication/report year. |
| How many women received NIGWED training? | More than 45 reportedly trained and supported; do not infer income or employment. |
| Were 36,551 jobs delivered? | Explain that the number is a programme target and documented delivery is not established by that record. |
| How many unique people benefited overall? | Explain that unresolved overlap prevents a reliable unique-person total. |

## Privacy, content and hosting

Use public reviewed content only. Keep credentials outside the repository and browser bundle. Default to session-local conversation state and no server storage of raw visitor questions. Persistence, analytics and any external inference require explicit implementation decisions and documented data handling; they are not implied by the chat interface.

The existing app is a static Next.js export. A local deterministic browser component can fit this deployment; a Python inference server, hosted model or server-side audit log introduces separate operational work. Do not claim a service exists, add a production dependency, or deploy one solely because New.txt names it. Model licences and costs must be checked before selecting a provider. Keep the genuine portrait, Hausa review, correction-contact, performance/accessibility and live-publishing gates intact.

## Implementation sequence for the next session

1. Read HANDOFF.md, this specification, metric definitions and the numerical-Q&A review. Inspect Git status, the existing LanguageChoice component, locale routes, preferences, metric functions and local Next.js guidance. Preserve all user changes and original briefs.
2. Expand or confirm the supported question/metric catalogue and reviewed bilingual content contract. Separate the owner's fixed requirements from routine design choices.
3. Build the polished chatbot component and shared vertical bilingual language control. Establish page/chat locale synchronisation before adding conversational complexity.
4. Connect reviewed data through controlled query plans, deterministic calculations, evidence links and natural response templates. Add context-aware follow-ups and targeted clarification states.
5. Validate the component and both languages; integrate it as a dashboard section alongside the dashboard build. Final page order remains a design choice rather than a recorded owner instruction.
6. Complete browser, accessibility, responsive and human Hausa reviews. Update documentation with actual evidence before claiming readiness. No deployment or public reveal is authorised by this documentation request alone.

## Acceptance checklist

- [ ] Direct English and Hausa routes start page and chatbot in the same language, including after refresh and browser history navigation.
- [ ] The exact bilingual instruction and both vertically stacked options are immediately discoverable on desktop and mobile; no menu is required.
- [ ] Active-language state is clear without relying only on colour, and both options work by keyboard.
- [ ] A language selection updates page, chat chrome, suggestions, answers/status templates and equivalent record context together.
- [ ] Draft input survives a switch; stale in-flight output cannot render in the old language.
- [ ] Greetings, suggestions, source disclosures, errors, clarification choices and status announcements exist in both languages and have a recorded human Hausa review before reveal.
- [ ] English/Hausa question pairs yield equivalent query plans, claims, qualifiers and sources. Test short prompts, paraphrases, code-switching, spelling variations, negation and ambiguous context.
- [ ] Follow-ups retain only supported context; a clear reset/start-again action is available.
- [ ] Wrong programme/year/unit/bound/stage/attribution cannot pass because the same number exists elsewhere. Targets and overlapping cohorts remain correctly handled.
- [ ] Loading, empty, unsupported, clarification, failed-response and long-transcript states are usable and accessible at narrow widths and enlarged text.
- [ ] No raw-query server logging, unapproved data exposure or client credentials are introduced.
- [ ] Preflight, lint, typecheck, tests and builds pass. Browser checks cover language changes, focus, history, mobile layout and evidence navigation; human review and performance results retain their actual scope.

## Continuation boundary

Documentation checkpoint verified on 22 October 2026: all project Markdown references and local links checked; preflight, lint, typecheck, all ten tests and both production builds passed. No chatbot implementation or chatbot browser/performance evidence is claimed. See HANDOFF.md and VALIDATION.md for the continuation status.

The product decisions above are documented and ready for the next implementation session. Chatbot code, final visual design, translated templates, model/provider choice, full dashboard redesign, CMS integration and hosting remain pending. Record future decisions here and summarise them in HANDOFF.md; preserve the research findings as historical evidence without allowing the earlier compact-tool recommendation to override the owner's chatbot requirement.
