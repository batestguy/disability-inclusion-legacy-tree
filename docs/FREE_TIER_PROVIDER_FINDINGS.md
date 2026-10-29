# Free-tier provider findings

## Follow-up research — 29 October 2026

See [the current guided-chat research](CHATBOT_IMPROVEMENT_RESEARCH_2026-10-29.md)
for rechecked provider limits, strict-schema planning, prompt caching, voice and
Hausa/browser-model constraints. In particular, Groq's opened rate-limit page
mixes tabbed plan tables with Developer wording; account-specific free limits
remain unverified. The earlier indicative figures below are not measured account
capacity. No provider was called, configured or selected for production.

Verified 25 October 2026 from opened official documentation. Research only: no account creation, credential inspection, model calls, billing changes, dependency installation or deployment. Read with the main chatbot research/decision document. These are changing service terms, not a production availability promise or a Hausa quality benchmark.

## Decision implications

**Inference:** shortlist Groq Free behind a Cloudflare Workers Free endpoint for a controlled evaluation, with Cloudflare Workers AI as an alternative to benchmark. Gemini has useful capabilities, but its unpaid-data and public-audience restrictions make it a less straightforward default for this public civic chatbot. No provider can currently be declared the best Hausa model from this pricing research.

The architecture should permit only an explicitly chosen free model, cap input/output and calls per turn, enforce application rate limits, keep secrets server-side, and stop gracefully on quota exhaustion. Never enable automatic paid fallback. Keep deterministic evidence validation and arithmetic outside model authority. These are engineering recommendations, not provider guarantees. A free inference quota and a free endpoint are separate resource budgets.

## Google Gemini API

**Models/pricing:** the current [pricing page](https://ai.google.dev/gemini-api/docs/pricing) lists free input/output for `gemini-3.8-flash`, `gemini-3.5-flash-lite` and `gemini-3.1-flash-lite`; Gemini 4 Argon and Gemini 3.1 Pro Preview are not free. Do not use an older remembered model name as the implementation decision. Verify availability again when configuring the actual project. Google Search grounding is unavailable through the API free tier for these newer text models; AI Studio testing is a different allowance.

**Quota:** [rate limits](https://ai.google.dev/gemini-api/docs/rate-limits) are model/project/tier dependent, apply per project rather than per key, and include RPM, input TPM and RPD. RPD resets at midnight Pacific. The public page directs users to AI Studio for active limits and says capacity is not guaranteed. This research therefore does **not** promise a universal free RPM/RPD figure. No account was opened to inspect actual allocations.

**Billing:** [billing documentation](https://ai.google.dev/gemini-api/docs/billing) says new accounts begin on Free; moving to Paid involves linking billing and a minimum $5 prepayment. An ordinary Free project is distinct from a time-limited Cloud trial. The opened page did not establish a universal card-verification requirement for Nigerian free accounts; do not promise that account onboarding can never request verification.

**Capabilities:** [structured outputs](https://ai.google.dev/gemini-api/docs/structured-output) support a JSON Schema subset, with current examples using Gemini 3.8 Flash; the application must still validate values and handle semantically incorrect output. [Function calling](https://ai.google.dev/gemini-api/docs/function-calling) is documented for the same model; the application executes selected functions. A single schema-constrained plan extraction need not invoke external tools.

**Region/privacy/audience gate:** [available regions](https://ai.google.dev/gemini-api/docs/available-regions) explicitly include Nigeria. The [additional terms](https://ai.google.dev/gemini-api/terms), effective 23 March 2026, say unpaid inputs/outputs can be used to improve Google products and human reviewers may process them; sensitive, confidential or personal information must not be submitted. The terms prohibit API clients directed toward or likely accessed by under-18s, and require Paid Services when clients are made available in the EEA, Switzerland or UK. **Inference:** an unrestricted public contribution website cannot assume that Nigerian operator eligibility resolves these audience restrictions. This is a provider-selection gate requiring an appropriate audience design/terms assessment, not an instruction to buy a paid tier.

## Groq Free

**Quota/model shortlist:** the default Free Plan table on [rate limits](https://console.groq.com/docs/rate-limits) lists the following, shared across the organization rather than per visitor:

| Model | RPM | RPD | TPM | TPD |
| --- | ---: | ---: | ---: | ---: |
| `openai/gpt-oss-120b` | 30 | 1,000 | 8,000 | 200,000 |
| `openai/gpt-oss-20b` | 30 | 1,000 | 8,000 | 200,000 |
| `qwen/qwen3.8-27b` | 30 | 1,000 | 8,000 | 200,000 |

Exact organization limits can differ and must be checked in the account; any exceeded limit yields HTTP 429. The page also has a Developer tab and describes Developer base limits, so do not confuse those with the default Free table above. Response headers expose remaining limits. **Inference:** a 1,000-request allowance is not 1,000 long conversations; the 200,000-token daily budget can bind first, and multiple model calls consume it faster.

**Structured plans:** [structured outputs](https://console.groq.com/docs/structured-outputs) document strict constrained decoding for GPT-OSS 20B/120B and Qwen 3.8 27B (also Muse Spark Open, whose free eligibility is not established here). Best-effort mode does not guarantee schema adherence. Streaming and tool use are currently unsupported together with Structured Outputs. **Inference:** one non-streaming strict plan extraction followed by deterministic execution is a suitable candidate to evaluate; schema compliance alone proves neither evidence correctness nor Hausa understanding.

**Billing boundary:** [billing FAQs](https://console.groq.com/docs/billing-faqs) describe upgrading from Free to Developer as requiring a valid payment method and enabling metered billing. Do not upgrade, attach billing, or interpret promotional credits as permanent free use. The opened source does not independently guarantee that no signup verification is ever required for Nigeria. Account eligibility remains untested.

**Privacy:** [Your Data](https://console.groq.com/docs/your-data) says ordinary inference customer content is not retained by default, with exceptions for features requiring persistence and troubleshooting/abuse investigations; the latter can retain content up to 30 days, longer if legally required. All customers can enable Zero Data Retention in Data Controls, which disables incompatible persistence features. Usage metadata is still collected and excludes customer inputs/outputs. Therefore do not advertise unconditional zero retention without configuring and checking the account. This source is a retention statement; this research does not extend it into a broader unverified guarantee about every provider policy.

**Application terms:** the current [services agreement](https://console.groq.com/docs/legal/services-agreement), modified 22 June 2026, permits customer applications serving end users. It requires an adult operator and places applicable privacy/consent and minor-user obligations on the customer. This differs from a claim that the site is automatically compliant or that no audience assessment is needed.

## Cloudflare Workers Free and Workers AI

**Endpoint hosting:** [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) says users have Free by default; Paid has a $5/month minimum. [Workers limits](https://developers.cloudflare.com/workers/platform/limits/) list 100,000 requests/day, 10 ms CPU/request and 128 MB memory on Free. Waiting on network requests does not consume CPU time. **Inference:** a small validation/proxy endpoint is plausible; benchmark the actual bundle/validation work against the CPU ceiling. This does not imply a full dynamic Next.js application fits without changes.

**Inference allowance:** [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/), checked 25 October 2026, provides 10,000 neurons/day on Free and Paid, resetting at 00:00 UTC. Free operations fail once exhausted; more usage requires Paid. Paid excess is $0.011/1,000 neurons. Some models require paid billing or prepaid Gateway credits, including Kimi K2.6/K2.7 Code, GLM 5.2/5.3/5.3 Flash and listed DeepSeek V4 variants. These are excluded from a strict-free design. Neurons are model-dependent compute units, not requests or a universal token allowance.

The official [28 July free-model change](https://developers.cloudflare.com/changelog/post/2026-07-28-models-require-workers-paid/) explicitly names GLM 4.7 Flash, Gemma 4 26B A4B and Nemotron 3 120B A12B as remaining on Workers Free. The [GLM 4.7 Flash catalog](https://developers.cloudflare.com/workers-ai/models/glm-4.7-flash/) documents function calling, reasoning, a 131,072-token context and multilingual positioning, with unit pricing $0.0605/million input and $0.40/million output tokens. **Inference:** this is a benchmark candidate; multilingual marketing is not a Hausa approval or evidence-accuracy result.

**Structured-output limitation:** [JSON Mode](https://developers.cloudflare.com/workers-ai/features/json-mode/) lists supported models including Llama 3.3 70B FP8 Fast and Llama 3.1 8B, accepts `response_format`/JSON Schema, does not support streaming, and warns that schema satisfaction can fail. GLM 4.7 Flash is **not listed** there. Do not infer JSON Mode support for GLM merely because it supports function calling; test its precise schema/tool behavior if selected. The documented JSON-mode failure must be handled.

**Privacy:** [Workers AI data usage](https://developers.cloudflare.com/workers-ai/platform/data-usage/), updated 16 October 2026, promises no model training on Customer Content and no retention beyond processing for standard stateless inference, subject to legal/security exceptions. Storage, Gateway logging/caching and other stateful features can retain content according to their configuration. Operational metadata may remain. A Groq/Gemini request routed through Cloudflare is still governed by the external inference provider's terms; Cloudflare's inference commitment does not transfer to it.

## Remaining checks before any implementation decision

- Record the actual selected Free account/model limits without upgrading or exposing keys.
- Evaluate fresh English/Hausa questions, follow-ups, ambiguity, numerical qualifiers, prompt injection and unsupported questions using the same evidence bundle and deterministic checks.
- Measure per-question input/output and number of calls before estimating visitors/day; provider request allowances alone are misleading.
- Verify audience/region terms, model licenses, privacy controls and graceful quota failure. No production SLA, Nigerian latency measurement, account acceptance, Hausa validation or unlimited free availability was established here.

Only this research file was added by the provider-research delegate. Application code and existing staged work were not changed; application checks belong to the main task's delivery record.
