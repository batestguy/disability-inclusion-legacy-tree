"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import LanguageChoice from "./LanguageChoice";
import { useChatSession, type ChatTurn } from "./ChatSession";
import { t, recordUrl, type Lang } from "../lib/content";
import {
  answerQuestion,
  renderAnswer,
  createReceipt,
  suggestedQuestions,
  validateAnswer,
} from "../lib/chat-engine.mjs";
import type { getChatData } from "../lib/chat-data";

type Props = ReturnType<typeof getChatData> & { lang: Lang };

export default function ChatWorkspace({ lang, bundle, manifest }: Props) {
  const { session, setSession } = useChatSession();
  const [inputError, setInputError] = useState(false);
  const [receiptError, setReceiptError] = useState(false);
  const composer = useRef<HTMLTextAreaElement>(null);
  const latest = useRef<HTMLElement>(null);
  const evidencePanel = useRef<HTMLElement>(null);
  const lastTurn = session.turns.at(-1);
  const selected = session.turns.find(
    (turn) => turn.id === session.evidenceTurn,
  );
  const years = [
    ...new Set([
      ...bundle.activities.map((a) => a.report_date.slice(0, 4)),
      ...(session.reportYear ? [session.reportYear] : []),
    ]),
  ]
    .sort()
    .reverse();
  const say = (en: string, ha: string) => t(lang, en, ha);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (lastTurn)
      latest.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [lastTurn]);

  function ask(question: string) {
    if (!question.trim() || question.length > 500) {
      setInputError(true);
      composer.current?.focus();
      return;
    }
    setInputError(false);
    const context = {
      ...session.context,
      reportYear: session.reportYear ? Number(session.reportYear) : undefined,
    };
    // Synchronous local execution: no request or delayed language-specific prose.
    let answer;
    try {
      answer = answerQuestion(bundle, question.trim(), context);
      if (answer.status === "answered" && !validateAnswer(bundle, answer))
        answer = answerQuestion(null, "");
    } catch {
      answer = answerQuestion(null, "");
    }
    if (answer.reason === "reset") {
      reset();
      return;
    }
    setSession((previous) => ({
      ...previous,
      draft: "",
      turns: [
        ...previous.turns,
        {
          id: (previous.turns.at(-1)?.id ?? 0) + 1,
          question: question.trim(),
          answer,
        },
      ],
      context: answer.context,
      reportYear: answer.context.reportYear
        ? String(answer.context.reportYear)
        : previous.reportYear,
    }));
    composer.current?.focus();
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    ask(session.draft);
  }

  function reset() {
    setSession({
      draft: "",
      turns: [],
      context: {},
      reportYear: "",
      evidenceTurn: null,
    });
    setInputError(false);
    setReceiptError(false);
    composer.current?.focus();
  }

  function showRecords(turn: ChatTurn) {
    setSession((previous) => ({ ...previous, evidenceTurn: turn.id }));
    requestAnimationFrame(() => evidencePanel.current?.focus());
  }

  function downloadReceipt(turn: ChatTurn) {
    try {
      const blob = new Blob(
        [JSON.stringify(createReceipt(turn.answer, manifest), null, 2)],
        { type: "application/json" },
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `records-v1-answer-${turn.id}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setReceiptError(false);
    } catch {
      setReceiptError(true);
    }
  }

  return (
    <div className="chat-preview" lang={lang}>
      <a className="skip" href="#conversation">
        {say("Skip to conversation", "Tsallaka zuwa tattaunawa")}
      </a>
      <header className="chat-header">
        <div className="chat-identity">
          <span className="chat-monogram" aria-hidden="true">
            MI<span>✦</span>
          </span>
          <div>
            <span className="chat-kicker">MOHAMMED ABBA ISA</span>
            <p>{say("The work, in perspective.", "Ayyuka da bayanansu.")}</p>
          </div>
        </div>
        <LanguageChoice
          lang={lang}
          destinations={{ en: "/chat/", ha: "/ha/chat/" }}
        />
      </header>

      <main className="chat-main">
        <section className="chat-introduction" aria-labelledby="chat-title">
          <p className="chat-kicker">
            <span className="chat-dot" aria-hidden="true" />
            {say(
              "AN OPEN RECORD · STANDALONE PREVIEW",
              "BAYANAI A BUƊE · GWAJI",
            )}
          </p>
          <h1 id="chat-title">
            {say("A question.", "Tambaya.")}
            <br />
            <em>{say("A clearer picture.", "Ƙarin fahimta.")}</em>
          </h1>
          <p className="chat-lede">
            {say(
              "Explore documented work on disability inclusion. Ask about a programme, follow the figures, and see the sources behind the answer.",
              "Bincika ayyukan da aka rubuta kan shigar masu nakasa. Yi tambaya game da shiri, duba alkaluma da tushen amsa.",
            )}
          </p>
          <div className="chat-scope">
            <span className="chat-kicker">
              {say("IN THIS REVIEWED SUBSET", "A CIKIN WANNAN ZAƁAƁƁEN BAYANI")}
            </span>
            <dl>
              <div>
                <dt>{say("Activities", "Ayyuka")}</dt>
                <dd>{bundle.activities.length}</dd>
              </div>
              <div>
                <dt>{say("Citations", "Tushe")}</dt>
                <dd>{bundle.sources.length}</dd>
              </div>
            </dl>
            <p>
              {say(
                "A selected record, still growing. These reports do not establish a complete career history or independently verified delivery.",
                "Zaɓaɓɓun bayanai ne da ba su cika ba. Rahotannin ba cikakken tarihin aiki ba ne, kuma ba tabbacin aiwatarwa daga mai zaman kansa ba ne.",
              )}
            </p>
          </div>
          <aside className="chat-draft-notice">
            <span className="chat-kicker">
              {say("RESEARCH PREVIEW", "GWAJIN BINCIKE")}
            </span>
            <p>
              {say(
                "Hausa wording is a draft awaiting fluent human review. Public release is pending.",
                "Rubutun Hausa na gwaji ne, yana jiran bitar ƙwararren mai Hausa. Ba a amince da wallafawar jama'a ba tukuna.",
              )}
            </p>
          </aside>
          <details className="chat-privacy">
            <summary>
              {say("About this conversation", "Game da wannan tattaunawa")}
            </summary>
            <p>
              {say(
                "Answers are calculated on this device from a fixed reviewed subset. Questions are not sent to an AI service or stored by this chat. Refreshing clears the conversation. Linked articles need an internet connection; full offline support comes later.",
                "Ana lissafa amsoshi a wannan na'ura daga zaɓaɓɓun bayanai. Ba a aika tambayoyi zuwa sabis na AI ko adana su ba. Sake buɗe shafin yana share tattaunawa. Buɗe labaran da aka haɗa yana buƙatar intanet; cikakken aiki ba tare da intanet ba zai zo daga baya.",
              )}
            </p>
          </details>
        </section>

        <section
          id="conversation"
          className="chat-card"
          aria-labelledby="conversation-title"
        >
          <div className="chat-card-top">
            <div>
              <span className="chat-kicker">
                {say("ASK THE RECORDS", "TAMBAYI BAYANAI")}
              </span>
              <h2 id="conversation-title">
                {say("Let’s look together.", "Mu duba tare.")}
              </h2>
            </div>
            <button className="chat-reset" type="button" onClick={reset}>
              {say("Start again", "Fara sabo")}{" "}
              <span aria-hidden="true">↺</span>
            </button>
          </div>
          <div className="chat-filter">
            <label htmlFor="chat-year">
              {say("Report year", "Shekarar rahoto")}
            </label>
            <select
              id="chat-year"
              value={session.reportYear}
              onChange={(event) =>
                setSession((previous) => ({
                  ...previous,
                  reportYear: event.target.value,
                  context: {
                    ...previous.context,
                    reportYear: event.target.value
                      ? Number(event.target.value)
                      : undefined,
                  },
                }))
              }
            >
              <option value="">
                {say("All report years", "Duk shekarun rahoto")}
              </option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <span>
              {say(
                "Publication dates, not assumed event dates",
                "Ranakun wallafawa, ba ranar taro da aka ɗauka ba",
              )}
            </span>
          </div>
          {session.context.programme && (
            <div className="chat-context">
              <span>
                {say(
                  "Programme in this conversation:",
                  "Shirin wannan tattaunawa:",
                )}{" "}
                <strong>
                  {session.context.programme === "beyond"
                    ? "Beyond Disability"
                    : session.context.programme.toUpperCase()}
                </strong>
              </span>
              <button
                type="button"
                onClick={() =>
                  setSession((previous) => ({
                    ...previous,
                    context: { reportYear: previous.context.reportYear },
                  }))
                }
              >
                {say("Clear programme", "Cire shirin")} ×
              </button>
            </div>
          )}
          <div
            className="chat-transcript"
            aria-label={say("Conversation", "Tattaunawa")}
          >
            <article className="chat-welcome">
              <span className="chat-speaker">
                {say("RECORDS GUIDE", "JAGORAN BAYANAI")}
              </span>
              <p>
                {say(
                  "Hello. What would you like to understand? I can help with documented activities, programme figures and how this record was put together.",
                  "Sannu. Me kake son fahimta? Zan taimaka da ayyukan da aka rubuta, alkaluman shirye-shirye da yadda aka tattara bayanan.",
                )}
              </p>
              <p className="chat-welcome-note">
                {say(
                  "Every figure keeps its source and its limits.",
                  "Kowane adadi yana tare da tushensa da iyakokinsa.",
                )}
              </p>
            </article>
            {session.turns.map((turn) => {
              const rendered = renderAnswer(turn.answer, lang);
              return (
                <section
                  className="chat-turn"
                  key={turn.id}
                  ref={turn.id === lastTurn?.id ? latest : undefined}
                  aria-label={say(
                    `Exchange ${turn.id}`,
                    `Tattaunawa ${turn.id}`,
                  )}
                >
                  <article className="chat-question">
                    <span className="chat-speaker">{say("YOU", "KAI")}</span>
                    <p dir="auto">{turn.question}</p>
                  </article>
                  <article
                    className={`chat-answer chat-answer-${turn.answer.status}`}
                  >
                    <span className="chat-speaker">
                      {say("RECORDS GUIDE", "JAGORAN BAYANAI")}
                    </span>
                    {rendered.heading && <h3>{rendered.heading}</h3>}
                    <p>{rendered.text}</p>
                    {rendered.detail && turn.answer.kind !== "summary" && (
                      <p className="chat-answer-detail">{rendered.detail}</p>
                    )}
                    {rendered.items.length > 0 && (
                      <ul className="chat-result-items">
                        {rendered.items.map((item) => (
                          <li key={item.id}>
                            <span lang={item.untranslated ? "en" : undefined}>
                              {item.text}
                            </span>
                            {item.reportDate && (
                              <small>
                                {say("Report date:", "Ranar rahoto:")}{" "}
                                {item.reportDate}
                              </small>
                            )}
                            {item.kind && <small lang="en">{item.kind}</small>}
                            {item.evidence && (
                              <details>
                                <summary>
                                  {say("Supporting evidence", "Tushen bayani")}
                                </summary>
                                <blockquote lang="en">
                                  {item.evidence}
                                </blockquote>
                                {item.limitations && (
                                  <p lang="en">{item.limitations}</p>
                                )}
                                {item.sourceIds?.map((id) => {
                                  const source = bundle.sources.find(
                                    (source) => source.id === id,
                                  );
                                  return source ? (
                                    <a
                                      key={id}
                                      href={source.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      lang="en"
                                    >
                                      {source.title}
                                    </a>
                                  ) : null;
                                })}
                              </details>
                            )}
                            {item.untranslated && (
                              <small>
                                {say(
                                  "English record label",
                                  "Sunan bayanin da Turanci",
                                )}
                              </small>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                    {rendered.detail && turn.answer.kind === "summary" && (
                      <p className="chat-answer-detail">{rendered.detail}</p>
                    )}
                    {turn.answer.choices?.length > 0 && (
                      <div
                        className="chat-choices"
                        aria-label={say(
                          "Clarify your question",
                          "Bayyana tambayarka",
                        )}
                      >
                        {turn.answer.choices.map((choice) => (
                          <button
                            type="button"
                            key={choice.question}
                            onClick={() => ask(choice.question)}
                          >
                            {choice.label[lang]}
                          </button>
                        ))}
                      </div>
                    )}
                    {(turn.answer.sourceIds.length > 0 ||
                      turn.answer.activityIds.length > 0) && (
                      <div className="chat-answer-actions">
                        <button
                          type="button"
                          onClick={() => showRecords(turn)}
                          aria-controls={selected ? "chat-evidence" : undefined}
                        >
                          {say("Show these records", "Nuna waɗannan bayanai")}{" "}
                          <span aria-hidden="true">↗</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadReceipt(turn)}
                        >
                          {say("Download calculation", "Sauke lissafi")}
                        </button>
                      </div>
                    )}
                    {turn.answer.sourceIds.length > 0 && (
                      <details className="chat-sources">
                        <summary>
                          {say(
                            "Sources and qualifications",
                            "Tushe da iyakoki",
                          )}
                        </summary>
                        <ul>
                          {turn.answer.sourceIds.map((id) => {
                            const source = bundle.sources.find(
                              (source) => source.id === id,
                            );
                            return source ? (
                              <li key={id}>
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {source.title}
                                  <span className="sr-only">
                                    {say(
                                      " (opens a new tab)",
                                      " (yana buɗe sabon shafi)",
                                    )}
                                  </span>
                                </a>
                                <small>
                                  {source.publisher} · {source.date} ·{" "}
                                  {say(
                                    "source title in English",
                                    "sunan tushe da Turanci",
                                  )}
                                </small>
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </details>
                    )}
                  </article>
                </section>
              );
            })}
          </div>

          <div className="chat-suggestions">
            <span className="chat-kicker">
              {say("A PLACE TO START", "FARA DA WANNAN")}
            </span>
            <div>
              {suggestedQuestions(lang, session.context).map((suggestion) => (
                <button
                  key={suggestion.question}
                  type="button"
                  onClick={() => ask(suggestion.question)}
                >
                  {suggestion.label}
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          </div>
          <form className="chat-composer" onSubmit={submit}>
            <label htmlFor="chat-question">
              {say("Your question", "Tambayarka")}
            </label>
            <div>
              <textarea
                id="chat-question"
                ref={composer}
                value={session.draft}
                rows={2}
                maxLength={500}
                aria-describedby="chat-input-note"
                aria-invalid={inputError || undefined}
                placeholder={say(
                  "For example, how many SMEDAN participants were reported?",
                  "Misali, mutum nawa aka ruwaito a SMEDAN?",
                )}
                onChange={(event) => {
                  setInputError(false);
                  setSession((previous) => ({
                    ...previous,
                    draft: event.target.value,
                  }));
                }}
              />
              <button
                type="submit"
                aria-label={say("Send question", "Aika tambaya")}
              >
                <span>{say("Send", "Aika")}</span>{" "}
                <span aria-hidden="true">↑</span>
              </button>
            </div>
            <p id="chat-input-note">
              {inputError
                ? say(
                    "Enter a question of 1–500 characters.",
                    "Rubuta tambaya mai haruffa 1–500.",
                  )
                : say(
                    "Ask in English or Hausa. Responses follow the page language.",
                    "Yi tambaya da Turanci ko Hausa. Amsa tana bin harshen shafin.",
                  )}
            </p>
          </form>
          <div
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {lastTurn
              ? `${say("Answer", "Amsa")} ${lastTurn.id}. ${renderAnswer(lastTurn.answer, lang).text}`
              : say("Ready for your question.", "A shirye don tambayarka.")}
          </div>
          {receiptError && (
            <p className="chat-error" role="alert">
              {say(
                "The download could not be created. Please try again.",
                "An kasa shirya abin saukewa. Sake gwadawa.",
              )}
            </p>
          )}
        </section>

        {selected && (
          <section
            id="chat-evidence"
            className="chat-evidence"
            ref={evidencePanel}
            tabIndex={-1}
            aria-labelledby="evidence-heading"
          >
            <div className="chat-evidence-heading">
              <div>
                <p className="chat-kicker">
                  {say("FOLLOW THE EVIDENCE", "BI TUSHEN BAYANI")}
                </p>
                <h2 id="evidence-heading">
                  {say("Behind this answer", "Tushen wannan amsa")}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSession((previous) => ({
                    ...previous,
                    evidenceTurn: null,
                  }));
                  composer.current?.focus();
                }}
              >
                {say("Close records", "Rufe bayanai")} ×
              </button>
            </div>
            <p>
              {say(
                "Report dates describe publication. Delivery claims are attributed reports, not an independent audit. Source excerpts and unreviewed record titles remain in English.",
                "Ranakun rahoto na wallafawa ne. Bayanin aiwatarwa rahoto ne daga tushensa, ba binciken mai zaman kansa ba. Ɗan bayanin tushe da taken bayanan da ba a fassara ba suna Turanci.",
              )}
            </p>
            {bundle.activities
              .filter((activity) =>
                selected.answer.activityIds.includes(activity.id),
              )
              .map((activity) => (
                <article key={activity.id}>
                  <p className="chat-kicker">
                    {activity.report_date} ·{" "}
                    {say("REPORT DATE", "RANAR RAHOTO")}
                  </p>
                  <h3>
                    {typeof activity.title === "string"
                      ? activity.title
                      : activity.title[lang] || activity.title.en}
                  </h3>
                  <p lang="en">{activity.isa_role}</p>
                  {activity.limitations.map((limit, index) => (
                    <p className="chat-record-limit" lang="en" key={index}>
                      {limit}
                    </p>
                  ))}
                  {activity.evidence.map((evidence, index) => (
                    <blockquote lang="en" key={index}>
                      {evidence.text}
                    </blockquote>
                  ))}
                  <ul>
                    {activity.source_ids.map((id) => {
                      const source = bundle.sources.find(
                        (source) => source.id === id,
                      );
                      return source ? (
                        <li key={id}>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {source.title}
                            <span className="sr-only">
                              {say(
                                " (opens a new tab)",
                                " (yana buɗe sabon shafi)",
                              )}
                            </span>
                          </a>
                        </li>
                      ) : null;
                    })}
                  </ul>
                  {"achievement_slug" in activity &&
                    activity.achievement_slug && (
                      <a href={recordUrl(lang, activity.achievement_slug)}>
                        {say(
                          "Open permanent achievement page",
                          "Buɗe shafin aikin dindindin",
                        )}{" "}
                        ↗
                      </a>
                    )}
                </article>
              ))}
            {selected.answer.activityIds.length === 0 && (
              <ul>
                {selected.answer.sourceIds.map((id) => {
                  const source = bundle.sources.find(
                    (source) => source.id === id,
                  );
                  return source ? (
                    <li key={id}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {source.title}
                      </a>
                    </li>
                  ) : null;
                })}
              </ul>
            )}
          </section>
        )}
      </main>
      <footer className="chat-footer">
        <p>
          {say(
            "An independent, source-led tribute.",
            "Jinjina mai zaman kanta, bisa tushe.",
          )}
        </p>
        <p>
          {say("Reviewed subset", "Zaɓaɓɓun bayanai")} {bundle.dataset_version}{" "}
          · {bundle.dataset_date} · {say("Hausa draft", "Hausa na gwaji")}
        </p>
      </footer>
    </div>
  );
}
