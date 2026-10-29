# Making the bilingual chatbot impressive within free tiers

Research checked 29 October 2026. Owner requested new improvement ideas and
free-tier research, not implementation, account changes or public deployment.
Recommendations below are experiments, not measured quality or approved UI.
This note updates the earlier [modernisation research](CHATBOT_MODERNISATION_RESEARCH.md)
for the current guided product. Existing numerical, privacy, locale and release
contracts remain in force.

## Recommendation

Build a conversational guide that can explain a contribution, remember the
current subject, suggest the next useful question and open the corresponding
dashboard view. Keep the successful clickable flow as the default. Add optional
typed-question understanding only after it outperforms the local baseline on
fresh English/Hausa tests and fits a real free account's limits.

Most visible improvements do not need runtime AI. Curated bilingual answers,
structured session context, relevant follow-ups, graph traversal and small
verified answer components can all run locally. A free model is most useful for
mapping unfamiliar phrasing to those operations, not inventing programme facts.

## Starting evidence

- Current guided flow reaches all 33 selected activities and 11 observations.
  It shows a replacing answer with at most three choices; Sources and Details
  replace the view. The owner rejected an accumulating transcript, internal
  scrolling, visible path/sidebar and excessive explanatory copy.
- Back/Next/Start again, locale retention and explicit dashboard-to-chat record
  selection already exist. They are baseline features, not new proposals.
- The old free-text parser fully answered 0/34 answerable challenge questions.
  That is historical parser evidence, not a score for the current guided mode.
- The bundle has nine sourced relationship records and a separate co-occurrence
  graph. Full offline reload/cache readiness remains unfinished.
- Active guided routes/components, not the retained legacy ChatWorkspace parser,
  are the starting point. See [implementation](GUIDED_CHAT_IMPLEMENTATION.md),
  [specification](CHATBOT_SPEC.md) and [accuracy audit](CHATBOT_ACCURACY_AUDIT.md).

## Ranked product improvements

| Priority | Improvement | Visitor experience | Runtime inference |
| --- | --- | --- | --- |
| 1 | Context-sensitive follow-ups | After an answer: the most useful next question, a partner/related programme, and Source; at most three choices | None |
| 1 | Concise answer components | A short answer, sourced figure where available, role and material qualification; Details on request | None |
| 1 | Dashboard actions from chat | Show the relevant category, initiative or collaboration selection without losing the conversation | None |
| 1 | Short curated journeys | Optional Highlights, Women & livelihoods, Accessibility, or Research sources, with easy exit | None |
| 2 | Comparison on request | Compare two compatible records; otherwise explain different populations, stages or units | None |
| 2 | Partner exploration | Follow actor → initiative → participants using reviewed memberships and roles | None |
| 2 | Citation brief | Copy/download the selected answer with programme, bound/unit/stage, source/date and dataset version | None |
| 2 | Offline continuity | Cached guide, sources already bundled, metrics and clear cache/update readiness | None |
| 3 | Optional typed question | Accept paraphrases, typos, code-switching and context-dependent follow-ups | One bounded planner call when needed |
| 4 | Optional read-aloud | Read the active answer only when a suitable voice exists and the visitor requests it | Device-dependent |

These are proposed upgrades, not claims that existing guided answers lack all
follow-ups, sources or session state. First inspect and improve the weakest
journeys rather than rebuilding existing navigation.

### Make follow-ups respond to the conversation

Store a compact language-neutral frame: selected activity/observation/actor IDs,
comparison candidate, current question type, requested detail, visited nodes and
dataset version. Use it to avoid asking what the visitor just answered and to
prefer an unvisited, relevant next step. Do not hide essential actions because
they were visited. Keep session state local and give Start again a clear effect.

Suggested next-question ranking can use fixed rules: same selected programme,
compatible comparison, explicit relationship, then another area. No model call
is needed to choose three meaningful options. Guided journeys are authored
sequences, not automatically generated claims or a visitor quiz.

### Chat should operate the dashboard

Example proposed journey:

1. Visitor selects Women & livelihoods.
2. Guide offers NigWED training or startup support, with their separate figures.
3. Visitor chooses NigWED, then Who worked with the office?
4. Guide gives the sourced role and offers Show collaboration, Source, or another
   useful question. The network selection preserves the chat's current context.

Network selection must be an explicit action. Scrolling, focus and locale changes
must not erase the current node/hash or silently narrow the whole dashboard.
Do not reintroduce the rejected dashboard-wide year filter through chat.

### Compose answers from verified pieces

Use reviewed bilingual fragments plus typed facts. Preserve >, ≥, approximate
values, units, populations, stages and attribution. Avoid arbitrary generated
summaries in the first wave. A compact two-record comparison must not become a
sum of potentially overlapping cohorts. A citation brief must retain limitations
when copied, not just in an on-screen tooltip.

## Research findings and their project implications

### 1. Contextual retrieval and a bilingual question catalogue

[Anthropic's contextual-retrieval research](https://www.anthropic.com/research/contextual-retrieval)
combines lexical matching, embeddings and chunk-specific context. Our adaptation
would index a fact card with its programme, actor role, population, stage, date
basis and source, rather than an isolated number. Its published benchmark gains
are not a predicted gain for this project.

For 33 activities, compare a complete compact catalogue with local lexical
retrieval first. Create an authored English/Hausa question catalogue and alias
glossary that maps to existing stable answer IDs; uncertain matches offer up to
three choices. Do not use keyword scores as calibrated confidence or silently
accept near matches involving different populations. Add embeddings only if
held-out retrieval tests show a material improvement. Document vectors alone
do not embed visitors' new questions; runtime query encoding still needs compute.

### 2. Graph-aware answers without a GraphRAG service

[Microsoft's LazyGraphRAG research](https://www.microsoft.com/en-us/research/blog/lazygraphrag-setting-a-new-standard-for-quality-and-cost/)
explores deferred model use for local/global evidence retrieval. Its findings do
not establish a free hosted service or an implementation fit for this website.

Our smaller opportunity is deterministic traversal of the reviewed actor–initiative
map. This can explain partners and related work without graph extraction models,
community summaries or repeated inference. Complete-set counts still run over the
full relevant dataset; top search results must not define an aggregate. See the
[network direction](COLLABORATION_NETWORK_DESIGN.md).

### 3. Optional model planner: strict output, bounded authority

[Groq structured outputs](https://console.groq.com/docs/structured-outputs) currently
list strict-schema support for GPT-OSS 20B/120B and Qwen 3.8 27B among supported
models. Streaming/tool use cannot currently accompany this mode. Strict schema
controls format, not correct meaning; validate IDs, scope, selected records and
supported operations before local execution.

Retain Groq Free as a candidate, with Workers AI Free as a comparison. Benchmark
GPT-OSS 20B/120B on the same unseen questions; include another eligible model only
if it has a clear hypothesis, such as better Hausa intent selection. No model
has been tested here and no winner is established. Do not spend extra calls on
an autonomous planning loop, generated reasoning transcript or model judge per
visitor turn. A later narrative model requires a separate attribution/claim audit.

### 4. Cache stable work and spend free quota on unfamiliar questions

Local guided answers need zero inference calls. Cache validated results only
under exact structured keys containing dataset version, locale, operation and
all relevant scope/context fields; never reuse an answer merely because two
questions have similar embeddings. Avoid storing raw visitor questions in a
shared cache or application logs.

[Groq prompt caching](https://console.groq.com/docs/prompt-caching) currently supports
GPT-OSS 20B/120B and the safeguard variant. It uses exact prompt prefixes, with
automatic expiration and unguaranteed hits. Put stable schema/catalogue first
and session/question last. The docs say cached tokens do not count towards rate
limits, but accounting follows processing and concurrent calls may still hit
limits. Treat this as a possible optimisation, not a capacity promise. Budget
and handle cold-cache requests successfully without assuming cache hits.

### 5. Free provider capacity and privacy

[Groq limits](https://console.groq.com/docs/rate-limits) publish multiple simultaneous
caps and organization-wide allowances. The opened page exposes Free/Developer
tabs and a table with GPT-OSS rows of 30 RPM, 1,000 RPD, 8,000 TPM and 200,000 TPD;
nearby explanatory wording also refers to Developer limits. Treat these as
indicative documentation values, not a verified allocation for our account.
Account console limits and an actual eligibility check are required before any
capacity estimate. At an assumed 200,000 daily tokens, 2,000 tokens per uncached
turn gives 100 turns/day before other traffic; this is arithmetic, not measurement.

[Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
currently provides 10,000 neurons/day, resetting at midnight UTC. Free usage
fails when exhausted; some models require paid billing or prepaid credits.
Neurons are model-dependent and cannot be converted into a universal number
of conversations. No automatic paid fallback, billing link or trial-credit plan.
Recheck [Workers endpoint limits](https://developers.cloudflare.com/workers/platform/limits/)
when testing a proxy; endpoint hosting and inference have distinct budgets.

[Groq data handling](https://console.groq.com/docs/your-data) describes ordinary
inference non-retention with reliability/abuse exceptions and configurable zero
data retention. Do not claim unconditional privacy. A hosted planner changes the
current local-only flow and needs truthful user-facing notice, server-side keys,
bounded requests, abort/stale-result handling and appropriate account settings.
Credentials stay outside the repository. No credentials were accessed here.

[Gemini's current terms](https://ai.google.dev/gemini-api/terms) retain unpaid-data
processing and audience/region restrictions. That makes it a less straightforward
default for this unrestricted public site. Do not add an age gate or buy a plan
as part of this research. Provider eligibility and terms must fit the actual use.

### 6. Hausa needs its own experiment

The [2025 Nigerian-language retrieval paper](https://aclanthology.org/2025.winlp-main.33/)
studies Hausa, Igbo and Yoruba embeddings and reports improvements under its
evaluation. This supports separate Hausa tests, not a claim about our chatbot's
quality. Evaluate natural Hausa wording, omitted diacritics, spelling variation,
code-switching, negation and follow-ups independently from English.

[Tiny Aya Earth](https://huggingface.co/CohereLabs/tiny-aya-earth) explicitly targets
African/West Asian languages, includes Hausa, and is a 3.35B research release with
a CC-BY-NC licence. It may inform a local research comparison, but is not an
unrestricted production licence or a free hosting service. No download, fine-tune
or licence-fit determination was performed. Preserve the chosen page locale;
language understanding must not silently change the response language. Hausa
copy remains visibly draft until actual review is recorded.

### 7. Voice and browser models: optional, later

[Transformers.js](https://huggingface.co/docs/transformers.js/en/index) supports browser
inference with WASM/WebGPU and quantisation. Its [WebGPU guide](https://huggingface.co/docs/transformers.js/guides/webgpu)
demonstrates embeddings and speech recognition. This shifts cost to the visitor's
device, download, memory and battery; it does not establish Hausa performance.
The shown whisper-tiny.en example is English-only. Benchmark model size, licence,
first-load time and low-end phone behaviour before offering any opt-in download.
Avoid a mandatory browser LLM for the core experience.

For read-aloud, [getVoices](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices)
enumerates voices available on the current device. A language tag is not a
guarantee that a suitable Hausa voice exists. Never autoplay or use an unrelated
voice as though it were Hausa. [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
has uneven browser support and can use a server-based recognition service;
browser speech input is not inherently offline/private. Confirm a transcript
before submitting it. Keep all features usable without a microphone or audio.

## Proposed delivery sequence and acceptance

Wave A — improve the local guided experience: audit the most important journeys,
choose useful next questions, add the short journeys and citation brief, and
define explicit dashboard/network handoffs. Preserve three choices, replacing
screens, no internal scroller and the shared visible vertical language selector.
Use actual source-based comparisons rather than decorative generated charts.

Wave B — local question search and offline continuity: bilingual aliases and
question catalogue, exact session context, approved evidence caching, versioned
cache readiness/update handling. Score retrieval and usability before adding
model weights or dependencies. Offline reload is a separate feature to verify.

Wave C — controlled optional free planner: one selected free model behind a small
server endpoint; one bounded call, validated plans, no arbitrary tools/SQL/code,
no paid fallback, graceful timeout/quota failure back to the guide. Future
implementation needs account access and the appropriate privacy/terms checks;
this research does not authorise deployment or credentials in browser code.

Wave D — optional read-aloud or voice input only if the target devices, language
quality and bandwidth tests justify it. Pre-authored audio would also need
provenance, speaker permission and actual language review.

Proposed evaluation, not results or owner-approved thresholds:

- Freeze a new 60-question set: 20 English, 20 Hausa, 10 code-switched and 10
  unsupported/ambiguous/adversarial cases, with matched difficulty and expected
  records/actions fixed before tuning. Keep the historical 50-question audit.
- Include follow-ups, wrong totals, targets versus delivery, household/person
  mismatch, role attribution, multi-party partnerships and unavailable evidence.
- Report language-specific complete-answer accuracy, correct clarifications,
  retrieval recall, unsupported claims, source correctness and qualifier retention.
  No unsupported numerical or attribution claims are acceptable in the test set.
- Compare local catalogue, full compact planner catalogue and retrieval-plus-planner
  under the same cases; add a route only when it improves accepted outcomes.
- Measure cold/warm latency, input/output/reasoning tokens where exposed, calls,
  retry counts and actual quota failures. Label capacity extrapolations as estimates.
- Verify phone/keyboard/200% text, locale changes mid-request, aborted/stale replies,
  offline reload, storage failure, exhausted quota and answer/source copy integrity.

No new feature, accuracy score, model call, provider account, dependency or public
release was produced by this research. The next decision is which local guide
improvements to implement first; typed AI and voice remain optional proposals.
