"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ChatbotMark from "./ChatbotMark";
import WorkspaceHeader from "./WorkspaceHeader";
import { useWorkspaceNavigation } from "./WorkspaceNavigation";
import "../app/dashboard.css";
import "../app/presentation.css";
import "../app/landing.css";
import { initialGuidedScreen, useGuidedSession } from "./GuidedSession";
import { getFlowNode } from "../lib/guided-flow.mjs";
import { getConciseAnswer, getSourceEvidence, paginate, splitText } from "../lib/guided-presentation.mjs";
import { t, type Lang } from "../lib/content";
import type { getChatData } from "../lib/chat-data";
import "../app/(chat)/chat.css";
import "../app/(chat)/guided.css";

type Props = ReturnType<typeof getChatData> & { lang: Lang; embedded?: boolean };
type Detail = { label: string; text: string; quote?: boolean; lang: Lang };
const flowHash = (path: string[]) => path.length > 1 ? `#flow=${encodeURIComponent(path.join("|"))}` : "";

export default function GuidedWorkspace({ lang, bundle, manifest, embedded = false }: Props) {
  const { session, setSession } = useGuidedSession();
  const { href } = useWorkspaceNavigation(bundle, "chat");
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [pending, setPending] = useState<{ label: string; origin: string } | null>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answerPanel = useRef<HTMLElement>(null);
  const path = useMemo(() => session.path.slice(0, session.cursor + 1), [session.path, session.cursor]);
  const say = (en: string, ha: string) => t(lang, en, ha);
  const node = useMemo(() => {
    try { return getFlowNode(bundle, path.at(-1)); } catch { return null; }
  }, [bundle, path]);
  const concise = node ? getConciseAnswer(node) : null;
  const transitionKey = `${lang}:${path.join("|")}:${session.view}`;
  const preparing = pending?.origin === transitionKey;
  const previousNode = path.length > 1 ? getFlowNode(bundle, path.at(-2)) : null;
  const questionLabel = preparing ? pending.label : previousNode?.options.find((option) => option.target === node?.id)?.label[lang];
  useEffect(() => () => {
    if (transitionTimer.current !== null) clearTimeout(transitionTimer.current);
    transitionTimer.current = null;
  }, [transitionKey]);
  const choices = paginate(node?.options.filter((option) => option.target !== "start") ?? [], session.optionPage);
  const sourceChoices = paginate(node?.sourceIds ?? [], session.sourcePage);
  const source = bundle.sources.find((entry) => entry.id === session.sourceId);
  const summaryParts = splitText(concise?.paragraphs.map((p) => p[lang]).join("\n\n") ?? "", 360);
  const summaryIndex = Math.min(session.summaryPage, Math.max(0, summaryParts.length - 1));
  const details: Detail[] = [];
  const detail = (label: string, text: string | undefined, quote = false, textLang: Lang = "en") => {
    if (text) splitText(text, 340).forEach((part) => details.push({ label, text: part, quote, lang: textLang }));
  };
  if (session.view === "source" && node && source) {
    for (const evidence of getSourceEvidence(bundle, node, source.id)) {
      detail(evidence.kind === "exact-source-excerpt" ? say("Source excerpt · English", "Rubutun tushe · Turanci") : say("Record summary · English", "Taƙaitaccen bayani · Turanci"), evidence.text, evidence.kind === "exact-source-excerpt");
      detail(say("Reported role · English", "Rawar da aka ruwaito · Turanci"), evidence.role);
      detail(say("Qualification · English", "Iyaka · Turanci"), evidence.limitations);
      detail(say("Date basis · English", "Bayanin rana · Turanci"), evidence.dateBasis);
    }
  } else if (node) {
    if (node.record) {
      detail("Report date / date basis", `${node.record.reportDate}. ${node.record.dateBasis}`);
      detail("Reported role", node.record.role);
      detail("Stage", node.record.stage);
      node.record.limitations.forEach((text) => detail("Qualification", text));
    }
    node.claims.forEach((claim) => {
      detail("Value / bound / unit / stage", `${claim.value.toLocaleString("en-GB")} · ${claim.bound} · ${claim.unit} · ${claim.stage}`);
      detail("Population", claim.population);
      detail("Reported role", claim.attribution);
      detail("Report date / date basis", `${claim.reportDate}. ${claim.evidenceDateBasis}`);
      claim.limitations.forEach((text) => detail("Qualification", text));
    });
    // Full explanations remain available on demand instead of crowding every answer.
    node.paragraphs.forEach((paragraph) => detail(say("Record notes", "Bayanan aiki"), paragraph[lang], false, lang));
  }
  const detailIndex = Math.min(session.detailPage, Math.max(0, details.length - 1));
  const currentDetail = details[detailIndex];

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => {
    function readPath() {
      if (location.hash && !location.hash.startsWith("#flow=")) return;
      let nextPath = ["start"];
      try {
        if (location.hash.startsWith("#flow=")) {
          const candidate = decodeURIComponent(location.hash.slice(6)).split("|");
          if (candidate.length > 256 || candidate[0] !== "start") throw new Error("Invalid path");
          candidate.forEach((id, index) => {
            const step = getFlowNode(bundle, id);
            if (index < candidate.length - 1 && !step.options.some((option) => option.target === candidate[index + 1])) throw new Error("Disconnected path");
          });
          nextPath = candidate;
        }
      } catch { nextPath = ["start"]; }
      setSession((previous) => {
        if (previous.path.slice(0, previous.cursor + 1).join("|") === nextPath.join("|")) return previous;
        const isPrefix = nextPath.every((id, index) => previous.path[index] === id);
        return { ...previous, path: isPrefix ? previous.path : nextPath, cursor: nextPath.length - 1, ...initialGuidedScreen,
          view: nextPath.at(-1)?.startsWith("evidence:") ? "sources" : "answer" };
      });
    }
    readPath();
    window.addEventListener("popstate", readPath);
    window.addEventListener("hashchange", readPath);
    return () => {
      window.removeEventListener("popstate", readPath);
      window.removeEventListener("hashchange", readPath);
    };
  }, [bundle, setSession]);

  function focusAnswer() { requestAnimationFrame(() => answerPanel.current?.focus({ preventScroll: true })); }
  function navigate(nextPath: string[], retrace = false) {
    if (transitionTimer.current !== null) clearTimeout(transitionTimer.current);
    transitionTimer.current = null;
    setPending(null);
    setSession({ path: retrace ? session.path : nextPath, cursor: nextPath.length - 1, photoCursor: session.photoCursor, ...initialGuidedScreen,
      view: nextPath.at(-1)?.startsWith("evidence:") ? "sources" : "answer" });
    setDownloadError(null);
    window.history.pushState(null, "", location.pathname + location.search + flowHash(nextPath));
    focusAnswer();
  }
  function choose(target: string) {
    if (transitionTimer.current !== null) return;
    const previous = path.indexOf(target);
    const nextPath = target === "start" ? ["start"] : previous >= 0 ? path.slice(0, previous + 1) : [...path, target];
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { navigate(nextPath); return; }
    setPending({ label: node?.options.find((option) => option.target === target)?.label[lang] ?? "", origin: transitionKey });
    transitionTimer.current = setTimeout(() => navigate(nextPath), 250);
  }
  function show(view: "answer" | "sources" | "source" | "details", sourceId: string | null = null) {
    setSession((previous) => ({ ...previous, view, sourceId, detailPage: 0 }));
    focusAnswer();
  }
  function back() {
    if (session.view === "source") show("sources");
    else if (session.view === "sources" && node?.id.startsWith("evidence:")) navigate(path.slice(0, -1), true);
    else if (session.view !== "answer") show("answer");
    else navigate(path.slice(0, -1), true);
  }
  function turnPage(key: "optionPage" | "sourcePage" | "detailPage" | "summaryPage", value: number) {
    setSession((previous) => ({ ...previous, [key]: value }));
    focusAnswer();
  }
  function download() {
    if (!node) return;
    try {
      const receipt = { operationVersion: "guided-conversation-v1", nodeId: node.id, path, datasetVersion: bundle.dataset_version, datasetDate: bundle.dataset_date, suppliedBundleSha256: manifest.bundle_sha256, claims: node.claims, activityIds: node.activityIds, sourceIds: node.sourceIds, limits: "Source-context-checked subset; not independent verification. Manifest identity is supplied build metadata." };
      const url = URL.createObjectURL(new Blob([JSON.stringify(receipt, null, 2)], { type: "application/json" }));
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = "guided-records-answer.json"; anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setDownloadError(node.id); }
  }
  function pager(page: number, count: number, key: "optionPage" | "sourcePage" | "detailPage" | "summaryPage", more: string) {
    if (count < 2) return null;
    return <nav className="guided-pager" aria-label={key === "optionPage" || key === "sourcePage" ? say("Option pages", "Shafukan zaɓi") : say("Answer pages", "Shafukan amsa")}>
      <button type="button" disabled={page === 0} onClick={() => turnPage(key, page - 1)}>{say("Previous", "Na baya")}</button>
      <span>{page + 1} / {count}</span>
      <button type="button" disabled={page >= count - 1} onClick={() => turnPage(key, page + 1)}>{more}</button>
    </nav>;
  }

  const heading = session.view === "sources" ? say("Sources", "Tushe") : session.view === "source" ? say("Source finding", "Bayanin tushe") : session.view === "details" ? say("Details", "Ƙarin bayani") : concise?.title[lang];
  const Main = embedded ? "div" : "main";
  const Heading = embedded ? "h3" : "h1";
  const DetailHeading = embedded ? "h4" : "h2";
  return <div className={`chat-preview guided-workspace${embedded ? " guided-embedded" : " dashboard-shell dashboard-redesign standalone-chat"}`} lang={lang}>
    {!embedded && <a className="skip" href="#guided-answer">{say("Skip to questions", "Tsallaka zuwa tambayoyi")}</a>}
    {!embedded && <WorkspaceHeader lang={lang} page="chat" href={href} />}
    <Main className="guided-main">
      <section className="guided-conversation" aria-label={say("Guided conversation", "Tattaunawa mai jagora")}>
        <div className="guided-frame-header"><span className="guided-guide-mark"><ChatbotMark /></span><div><strong>{say("Explore with the guide", "Bincika da jagora")}</strong><span>{say("Questions, stories and sources", "Tambayoyi, labarai da tushe")}</span></div></div>
        {(preparing || path.length > 1 || session.view !== "answer" || session.cursor < session.path.length - 1) && <nav className="guided-toolbar" aria-label={say("Conversation navigation", "Kewayawa a tattaunawa")}>
          {(path.length > 1 || session.view !== "answer") && <button type="button" onClick={back}>← {say("Back", "Koma baya")}</button>}
          {session.view === "answer" && session.cursor < session.path.length - 1 && <button type="button" onClick={() => navigate(session.path.slice(0, session.cursor + 2), true)}>{say("Next", "Gaba")} →</button>}
          {(preparing || path.length > 1 || session.view !== "answer") && <button type="button" onClick={() => navigate(["start"])}>{say("Start again", "Fara sabo")}</button>}
        </nav>}
        {questionLabel && <p className="guided-visitor-bubble">{questionLabel}</p>}
        {preparing && <div className="guided-thinking" role="status"><span className="sr-only">{say("Preparing answer", "Ana shirya amsa")}</span><span aria-hidden="true">●</span><span aria-hidden="true">●</span><span aria-hidden="true">●</span></div>}
        <section id="guided-answer" hidden={preparing} ref={answerPanel} tabIndex={-1} className="guided-answer" data-node={node?.id} data-view={session.view} aria-labelledby="guided-question">
          <Heading id="guided-question">{heading ?? say("Records unavailable", "Bayanai ba su samuwa")}</Heading>
          {!node || !concise ? <button type="button" onClick={() => window.location.reload()}>{say("Reload", "Sake buɗewa")}</button> : session.view === "answer" ? <>
            {summaryParts.length > 0 && <p className="guided-summary">{summaryParts[summaryIndex]}</p>}
            {pager(summaryIndex, summaryParts.length, "summaryPage", say("Continue answer", "Ci gaba da amsa"))}
            {node.id !== "women" && concise.items.length > 0 && <ul className="guided-facts">{concise.items.filter((item) => !node.id.startsWith("relationship:") || item.id.startsWith("limitations:")).map((item) => <li key={item.id}><span lang={item.originalLanguage}>{item.label[lang]}</span>{item.meta && <strong>{item.meta[lang]}</strong>}</li>)}</ul>}
            <div className="guided-options">{choices.items.map((option) => {
              const cohort = node.id === "women" ? concise.items[node.activityIds.indexOf(option.target.slice("activity:".length))] : null;
              const label = cohort?.label[lang] ?? (node.id === "programmes" ? option.description?.[lang] : null) ?? option.label[lang];
              const figure = cohort?.meta?.[lang] ?? (node.id === "programmes" ? option.label[lang] : null);
              return <button type="button" key={option.id} data-target={option.target} onClick={() => choose(option.target)}><span>{label}{figure && <small>{figure}</small>}</span><span aria-hidden="true">→</span></button>;
            })}</div>
            {pager(choices.page, choices.pageCount, "optionPage", say("More options", "Ƙarin zaɓi"))}
            {node.id !== "start" && <div className="guided-actions">
              {node.sourceIds.length > 0 && <button type="button" onClick={() => show("sources")}>{say("View sources", "Duba tushe")}</button>}
              <button type="button" onClick={() => show("details")}>{say("Details", "Ƙarin bayani")}</button>
            </div>}
          </> : session.view === "sources" ? <>
            <div className="guided-options">{sourceChoices.items.map((id) => {
              const entry = bundle.sources.find((value) => value.id === id);
              return entry ? <button type="button" key={id} data-source={id} onClick={() => show("source", id)}><span lang="en">{entry.title}</span><span aria-hidden="true">→</span></button> : null;
            })}</div>
            {pager(sourceChoices.page, sourceChoices.pageCount, "sourcePage", say("More sources", "Ƙarin tushe"))}
          </> : <>
            {session.view === "source" && source && <a className="guided-source-link" href={source.url} target="_blank" rel="noopener noreferrer"><span lang="en">{source.title}</span><span className="sr-only">{say(" (opens a new tab)", " (yana buɗe sabon shafi)")}</span> ↗</a>}
            {session.view === "source" && source && <p className="guided-meta">{source.publisher} · {source.date}</p>}
            {session.view === "source" && source && !currentDetail && <p>{say("Open the original report above. No extract is stored for this report.", "Buɗe asalin rahoton da ke sama. Ba a adana wani rubutun wannan rahoto ba.")}</p>}
            {currentDetail && <div className="guided-detail" data-detail-page={detailIndex}>
              <DetailHeading>{session.view === "details" ? <span lang="en">{currentDetail.label}</span> : currentDetail.label}</DetailHeading>
              {currentDetail.quote ? <blockquote lang="en">{currentDetail.text}</blockquote> : <p lang={currentDetail.lang}>{currentDetail.text}</p>}
            </div>}
            {pager(detailIndex, details.length, "detailPage", say("Continue", "Ci gaba"))}
            {session.view === "details" && <button className="guided-download" type="button" onClick={download}>{say("Download answer record", "Sauke bayanin amsa")} ↓</button>}
            {downloadError === node.id && <p role="alert">{say("Download failed. Try again.", "Saukewa ya gaza. Sake gwadawa.")}</p>}
          </>}
        </section>
      </section>
      <div className="guided-preferences">
        <p className="guided-draft">{say("Selected reports · Hausa draft", "Zaɓaɓɓun rahotanni · Hausa na gwaji")}</p>
        <label className="guided-cursor-control"><input type="checkbox" checked={session.photoCursor} onChange={(event) => {
          const photoCursor = event.currentTarget.checked;
          setSession((previous) => ({ ...previous, photoCursor }));
        }} />{say("Photo cursor", "Siginan hoto")}</label>
      </div>
    </Main>
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{!preparing && <>{heading}. {session.view === "answer"
      ? `${summaryParts[summaryIndex] ?? ""} ${choices.page + 1}/${choices.pageCount}`
      : session.view === "sources" ? `${sourceChoices.page + 1}/${sourceChoices.pageCount}`
      : currentDetail ? <><span>{detailIndex + 1}/{details.length}. {currentDetail.label}. </span><span lang={currentDetail.lang}>{currentDetail.text}</span></>
      : <span lang="en">{source?.title}</span>}</>}</div>
  </div>;
}
