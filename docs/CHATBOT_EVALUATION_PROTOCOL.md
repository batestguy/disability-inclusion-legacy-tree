# Fifty-question chatbot audit protocol

25 October 2026. Evaluate the current chatbot without changing its implementation
or lowering expectations after seeing its replies. This is an exploratory product
audit, not a representative estimate of all future visitor questions.

## Question selection, frozen before execution

An independent author reads the reviewed bundle and product specification but not
the parser, its tests or its outputs. The author supplies 60 candidate questions:
30 English and 30 draft Hausa. Each language has 20 answerable questions, six
questions needing clarification and four unsupported requests. Answerability is
judged from the evidence, including information the current parser may not handle.
Existing advertised examples can appear only as a small explicit control subset.

Use xorshift32 with seed **20261025**, Fisher–Yates shuffle, and sample without
replacement within each language/disposition: 17 answerable, five clarification
and three unsupported. Shuffle the resulting 50 questions once more using the
same RNG stream. This gives 25 questions per language and an explicit random draw
from a designed pool, rather than pretending that generated questions represent
real visitor traffic. Store the selected questions, gold expectations, selection
seed and candidate/bundle/engine hashes before calling the chatbot.

## Scoring fixed before execution

- Answerable questions must receive the relevant answer, not a generic fallback.
  Compare expected facts, bounds, units, stage, population, scope/year, selected
  activity IDs and cited sources with the independent gold expectations.
- A true number for the wrong programme, population, outcome or year is an
  incorrect answer/interpretation. Arithmetic agreement alone does not pass.
- When the records support the answer but the bot clarifies or refuses, classify
  it as a coverage gap or excessive refusal; do not count it as correct safety.
- Ambiguous questions should clarify; unsupported requests should explain their
  limitation. Report disposition mistakes separately from false factual answers.
- A substantive corrective limitation can answer a question such as whether
  cohorts may be summed, regardless of whether the engine internally calls it
  `unsupported`. Accept it only when the required meaning is present. Separately
  report generic clarifications: safe abstention is not evidence that the visitor
  received useful, targeted help.
- Check English and Hausa separately. Inspect each rendered reply against its
  expectation; a source-ID match and the engine's own validator are supplementary,
  not substitutes for semantic review. Mark uncertain gold items explicitly.
- Preserve baseline failures. Any later fixes use a separate result snapshot;
  this exposed sample becomes regression material, not a fresh held-out test.

Report overall correct handling, successful answers among answerable questions,
incorrect answered questions, unnecessary clarification/refusal, safe handling of
unanswerable questions and correctness among answered questions. Include counts,
denominators, every question and reply, failure examples and source/code identity.
Execution latency covers local engine calls only, not browser or network latency.

Provisional engineering targets for this audit: zero incorrect answered questions,
at least 80% answerable-question success in each language, and at least 90% correct
handling overall. These are diagnostic targets, not owner-approved release gates.
No confidence interval or general population accuracy is claimed from this small
purpose-built sample. Draft Hausa needs fluent-human review regardless of score.

## Scope and artifacts

Only synthetic evaluation questions are saved. No real visitor history, credentials,
external inference, dependency installation or production app change is required.
The fixed bundle is source-context reviewed, not independent proof of delivery.
The main runner calls the same deterministic engine used by the web component.
This scores the response engine; existing browser tests cover the interaction UI.

Expected outputs: `research/chat-evaluation-candidates.json`, a frozen selected
`research/chat-evaluation-50.json`, `output/chat-evaluation-50.json`, a flat CSV,
and `docs/CHATBOT_ACCURACY_AUDIT.md`. Human Hausa, portrait and reveal gates remain
unchanged. Start continuations with HANDOFF.md and retain all existing staged work.
