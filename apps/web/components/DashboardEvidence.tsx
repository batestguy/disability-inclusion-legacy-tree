"use client";

import { useMemo, type RefObject } from "react";
import { getFlowNode } from "../lib/guided-flow.mjs";
import { getSourceEvidence } from "../lib/guided-presentation.mjs";
import { recordUrl, type Lang } from "../lib/content";
import type { getChatData } from "../lib/chat-data";

type Bundle = ReturnType<typeof getChatData>["bundle"];
type Props = { lang: Lang; bundle: Bundle; activity: Bundle["activities"][number]; panelRef: RefObject<HTMLElement | null>; onAsk: () => void; onClose: () => void };

export default function DashboardEvidence({ lang, bundle, activity, panelRef, onAsk, onClose }: Props) {
  const node = useMemo(() => getFlowNode(bundle, `activity:${activity.id}`), [bundle, activity.id]);
  const observations = bundle.observations.filter((observation) => observation.activity_id === activity.id);
  const say = (en: string, ha: string) => lang === "ha" ? ha : en;
  return <section className="dashboard-evidence-reader" ref={panelRef} tabIndex={-1} aria-labelledby="selected-record-title" data-selected-record={activity.id}>
    <div className="dashboard-evidence-reader-top"><p className="dashboard-eyebrow">{say("SELECTED RECORD", "BAYANIN DA AKA ZAƁA")}</p><button type="button" onClick={onClose}>{say("Close", "Rufe")} <span aria-hidden="true">×</span></button></div>
    <h3 id="selected-record-title">{node.title[lang]}</h3><p>{node.paragraphs[0][lang]}</p>
    <dl className="dashboard-record-facts"><div><dt>{say("Report date", "Ranar rahoto")}</dt><dd>{activity.report_date}</dd></div><div><dt>{say("Date basis · original English", "Bayanin rana · asalin Turanci")}</dt><dd lang="en">{activity.date_basis}</dd></div><div><dt>{say("Attributed role · original English", "Rawar da aka ruwaito · asalin Turanci")}</dt><dd lang="en">{activity.isa_role}</dd></div></dl>
    <details className="dashboard-record-qualifications"><summary>{say("Record qualifications · English", "Iyakokin bayani · Turanci")}</summary><ul lang="en">{activity.limitations.map((limit, index) => <li key={index}>{limit}</li>)}</ul></details>
    {observations.map((observation) => <div className="dashboard-evidence-measure" key={observation.id} data-evidence-observation={observation.id}><strong>{getFlowNode(bundle, `measure:${observation.id}`).paragraphs[0][lang]}</strong><p lang="en">{observation.population}</p><ul lang="en">{observation.limitations.map((limit, index) => <li key={index}>{limit}</li>)}</ul></div>)}
    <div className="dashboard-source-list">{activity.source_ids.map((id) => {
      const source = bundle.sources.find((entry) => entry.id === id);
      if (!source) return null;
      const evidence = getSourceEvidence(bundle, node, id);
      return <article key={id}><a href={source.url} target="_blank" rel="noopener noreferrer" lang="en">{source.title}<span className="sr-only">{say(" (opens a new tab)", " (yana buɗe sabon shafi)")}</span> ↗</a><p className="dashboard-muted">{source.publisher} · {source.date}</p>{evidence.map((entry, index) => <div key={index}>{entry.kind === "exact-source-excerpt" ? <blockquote lang="en">{entry.text}</blockquote> : <p lang="en">{entry.text}</p>}<small>{entry.kind === "exact-source-excerpt" ? say("Source excerpt · original English", "Rubutun tushe · asalin Turanci") : say("Reviewed paraphrase · original English", "Taƙaitaccen bayanin da aka duba · asalin Turanci")}</small>{entry.limitations && <p className="dashboard-source-qualification" lang="en">{entry.limitations}</p>}</div>)}</article>;
    })}</div>
    {bundle.review_notes.filter((note) => note.activity_id === activity.id).map((note) => <aside className="dashboard-variation" key={note.id}><strong>{say("Source variation · original English", "Bambancin tushe · asalin Turanci")}</strong><p lang="en">{note.note}</p><blockquote lang="en">{note.evidence.text}</blockquote></aside>)}
    <div className="dashboard-reader-actions"><button type="button" onClick={onAsk}>{say("Ask the chatbot about this record", "Tambayi bot game da wannan bayani")} <span aria-hidden="true">↓</span></button>{"achievement_slug" in activity && activity.achievement_slug && <a href={recordUrl(lang, activity.achievement_slug)}>{say("Permanent achievement page", "Shafin aikin dindindin")} <span aria-hidden="true">↗</span></a>}</div>
  </section>;
}
