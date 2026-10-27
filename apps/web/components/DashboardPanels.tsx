"use client";

import { useState } from "react";
import type { getChatData } from "../lib/chat-data";
import type { DashboardFilters, DashboardObservation, DashboardView } from "../lib/dashboard-data.mjs";
import { getFlowNode } from "../lib/guided-flow.mjs";
import { getConciseAnswer, paginate } from "../lib/guided-presentation.mjs";

export interface DashboardPanelProps {
  lang: "en" | "ha";
  bundle: ReturnType<typeof getChatData>["bundle"];
  view: DashboardView;
  onFilter: (patch: Partial<DashboardFilters>) => void;
  onEvidence: (id: string) => void;
  titleFor: (id: string) => string;
}

const local = (lang: "en" | "ha", en: string, ha: string) => lang === "ha" ? ha : en;
const boundMark = { exact: "", "greater-than": ">", "at-least": "≥", approximate: "≈" };
const boundName = {
  exact: ["Exactly", "Daidai"], "greater-than": ["More than", "Fiye da"],
  "at-least": ["At least", "Aƙalla"], approximate: ["About", "Kusan"],
};

function Heading({ title }: { number: string; title: string }) {
  return <header className="dashboard-section-heading"><h2>{title}</h2></header>;
}

export function DashboardTimeline({ lang, view, onFilter }: DashboardPanelProps) {
  const say = (en: string, ha: string) => local(lang, en, ha);
  const maximum = Math.max(1, ...view.timeline.map((entry) => entry.count));
  return <section className="dashboard-section" id="timeline" tabIndex={-1} aria-label={say("Report timeline", "Jadawalin rahotanni")}>
    <Heading number="01" title={say("Activities by report year", "Ayyuka bisa shekarar rahoto")} />
    <div className="dashboard-timeline">
      {view.timeline.map(({ year, count }) => <button key={year} type="button" aria-pressed={view.filters.year === year} onClick={() => onFilter({ year: view.filters.year === year ? "all" : year })} aria-label={`${year}: ${count} ${say("activity records. Filter this year", "bayanan ayyuka. Zaɓi wannan shekara")}`}>
        <span className="dashboard-year-count">{count}</span>
        <span className="dashboard-year-track" aria-hidden="true"><span style={{ height: `${count / maximum * 100}%` }} /></span>
        <span>{year}{year === "2026" ? say(" · partial", " · ba cikakke ba") : ""}</span>
      </button>)}
    </div>
    <details><summary>{say("View timeline table", "Duba jadawalin lambobi")}</summary>
      <table className="dashboard-table-alternative"><caption>{say("Different units: activity records and distinct canonical model reports", "Ma'aunai dabam: bayanan ayyuka da rahotannin samfurin da ba su maimaitu ba")}</caption>
        <thead><tr><th scope="col">{say("Report year", "Shekarar rahoto")}</th><th scope="col">{say("Activities", "Ayyuka")}</th><th scope="col">{say("Canonical reports", "Rahotanni ba maimaitu ba")}</th></tr></thead>
        <tbody>{view.timeline.map((entry) => <tr key={entry.year}><th scope="row">{entry.year}</th><td>{entry.count}</td><td>{view.canonicalReportYears.find((r) => r.year === entry.year)?.count ?? 0}</td></tr>)}</tbody>
      </table>
    </details>
  </section>;
}

export function DashboardFigures(props: DashboardPanelProps & { figurePage?: number; onFigurePage?: (page: number) => void }) {
  const { lang, bundle, view, onEvidence, titleFor, figurePage, onFigurePage } = props;
  const [localPage, setLocalPage] = useState(0);
  const movePage = onFigurePage ?? setLocalPage;
  const say = (en: string, ha: string) => local(lang, en, ha);
  const reported = paginate(view.observations.filter((o) => o.stage === "reported-delivery"), figurePage ?? localPage, 4);
  const targets = view.observations.filter((o) => o.stage === "target");
  const unit = (value: string) => lang === "en" ? value : ({ people: "mutane", households: "gidaje", "job opportunities": "damar ayyukan yi" }[value] ?? value);
  const card = (observation: DashboardObservation) => {
    const answer = getConciseAnswer(getFlowNode(bundle, `measure:${observation.id}`));
    const target = observation.stage === "target";
    const value = observation.value.toLocaleString(lang === "ha" ? "ha-NG" : "en-NG");
    const accessibleValue = `${boundName[observation.bound][lang === "ha" ? 1 : 0]} ${value} ${unit(observation.unit)}`;
    return <article key={observation.id} className={`dashboard-figure${target ? " is-target" : ""}`}>
      <h3>{titleFor(observation.activity_id)}</h3>
      <p className="dashboard-figure-value" role="img" aria-label={accessibleValue}><span aria-hidden="true">{boundMark[observation.bound]}{value}</span><span aria-hidden="true"> {unit(observation.unit)}</span></p>
      <p className="dashboard-figure-note">{answer.paragraphs[1]?.[lang]}</p>
      <p className="dashboard-muted">{say("Report date", "Ranar rahoto")}: <time dateTime={observation.report_date}>{observation.report_date}</time></p>
      <button type="button" className="dashboard-text-button" onClick={() => onEvidence(observation.activity_id)} aria-label={`${say("Evidence for", "Hujjar")} ${titleFor(observation.activity_id)}`}>{say("Read evidence", "Karanta hujja")} <span aria-hidden="true">↗</span></button>
    </article>;
  };
  return <section className="dashboard-section" id="figures" aria-label={say("Reported figures and targets", "Lambobin rahoto da manufofi")}>
    <Heading number="02" title={say("What the figures say", "Abin da lambobi suka bayyana")} />
    <p className="dashboard-muted">{say("Each figure belongs to its own programme and population. Overlapping cohorts cannot be added as unique people; reported support is not independently verified impact.", "Kowace lamba ta shafi nata shiri da rukunin mutane. Ba za a haɗa rukunoni a matsayin mutane mabambanta ba; tallafin rahoto ba tasiri da aka tabbatar ta hanya mai zaman kanta ba ne.")}</p>
    <h3 className="dashboard-group-title">{say("Reported delivery measures", "Ma'aunan tallafin da rahoto ya bayyana")}</h3>
    {reported.items.length ? <div className="dashboard-figures-grid">{reported.items.map(card)}</div> : <p className="dashboard-muted">{say("No reviewed delivery figure for this selection. This does not mean zero support.", "Babu lambar tallafin da aka bincika ga wannan zaɓi. Wannan ba ya nufin babu tallafi.")}</p>}
    {reported.pageCount > 1 && <nav className="dashboard-pagination" aria-label={say("Reported figure pages", "Shafukan lambobin rahoto")}>
      <button type="button" disabled={reported.page === 0} onClick={() => movePage(reported.page - 1)}>{say("Previous", "Na baya")}</button>
      <span role="status">{reported.page + 1} / {reported.pageCount}</span>
      <button type="button" disabled={reported.page >= reported.pageCount - 1} onClick={() => movePage(reported.page + 1)}>{say("More figures", "Ƙarin lambobi")}</button>
    </nav>}
    <div className="dashboard-target-section"><h3 className="dashboard-group-title">{say("Plans remain plans", "Tsare-tsare har yanzu tsare-tsare ne")}</h3>
      {targets.length ? <div className="dashboard-figures-grid is-targets">{targets.map(card)}</div> : <p className="dashboard-muted">{say("No reviewed numerical target in this selection.", "Babu manufar lamba da aka bincika a wannan zaɓi.")}</p>}
    </div>
  </section>;
}

export function DashboardThemes({ lang, bundle, view, onFilter }: DashboardPanelProps) {
  const say = (en: string, ha: string) => local(lang, en, ha);
  const label = (text: { en: string; ha?: string | null }) => lang === "ha" && text.ha ? text.ha : text.en;
  const maximum = Math.max(1, ...view.categories.map((c) => c.count));
  const percent = (share: number | null) => share === null ? "—" : `${(share * 100).toLocaleString(lang === "ha" ? "ha-NG" : "en-NG", { maximumFractionDigits: 1 })}%`;
  return <section className="dashboard-section" id="themes" aria-label={say("Categories and text themes", "Rukunoni da jigogin rubutu")}>
    <Heading number="03" title={say("Activities & themes", "Ayyuka da jigogi")} />
    <div className="dashboard-chart-pair">
      <div className="dashboard-chart-panel"><h3>{say("Activities by category", "Ayyuka bisa rukuni")}</h3>
        <p className="dashboard-muted">{say("Some activities belong to more than one category.", "Wasu ayyuka suna cikin rukuni fiye da ɗaya.")}</p>
        <div className="dashboard-bars">{view.categories.map((category) => <button key={category.id} type="button" aria-pressed={view.filters.category === category.id} onClick={() => onFilter({ category: view.filters.category === category.id ? "all" : category.id })}>
          <span>{label(category.label)} <strong>{category.count}</strong></span>
          <span className="dashboard-bar-track" aria-hidden="true"><span style={{ width: `${category.count / maximum * 100}%` }} /></span>
        </button>)}</div>
        <details><summary>{say("View category table", "Duba jadawalin rukunoni")}</summary><table className="dashboard-table-alternative"><caption>{say("Selected activity records, multilabel categories", "Zaɓaɓɓun ayyuka, rukunoni masu maimaituwa")}</caption><thead><tr><th scope="col">{say("Category", "Rukuni")}</th><th scope="col">{say("Activities", "Ayyuka")}</th></tr></thead><tbody>{view.categories.map((c) => <tr key={c.id}><th scope="row">{label(c.label)}</th><td>{c.count}</td></tr>)}</tbody></table></details>
      </div>
      <div className="dashboard-chart-panel is-topics"><h3>{say("Themes in published words", "Jigogi a kalmomin da aka wallafa")}</h3>
        <p className="dashboard-muted">{say("Average theme share across", "Matsakaicin kaso na jigo daga")} <strong>{view.modelledDocumentCount}</strong> {say("English reports.", "rahotannin Turanci.")}</p>
        <div className="dashboard-topics">{view.topics.map((topic) => {
          const source = bundle.sources.find((s) => s.id === topic.representativeSourceIds[0]);
          return <article key={topic.id}>
            <h4 className="dashboard-topic-label"><span>{label(topic.label)}</span><span>{percent(topic.meanShare)}</span></h4>
            <div className="dashboard-bar-track" aria-hidden="true"><span style={{ width: `${Math.max(0, Math.min(100, (topic.meanShare ?? 0) * 100))}%` }} /></div>
            <p className="dashboard-muted"><span lang="en">{topic.terms.slice(0, 3).join(" · ")}</span> <small>{say("English source terms", "Kalmomin tushen Turanci")}</small></p>
            {source && <a className="dashboard-topic-sources" href={source.url} target="_blank" rel="noopener noreferrer" aria-label={`${say("Selected example for", "Zaɓaɓɓen misali na")} ${label(topic.label)} · ${say("opens a new tab", "yana buɗe sabon shafi")}`}>{say("Selected source example", "Zaɓaɓɓen misalin majiya")} ↗</a>}
          </article>;
        })}</div>
        <details><summary>{say("View theme table", "Duba jadawalin jigogi")}</summary><table className="dashboard-table-alternative"><caption>{say("Mean stored model shares; unavailable when no modelled texts match", "Matsakaicin ma'aunan samfurin; babu idan ba a sami rubutun da ya dace ba")}</caption><thead><tr><th scope="col">{say("Theme", "Jigo")}</th><th scope="col">{say("Mean share", "Matsakaicin ma'auni")}</th><th scope="col">{say("Modelled texts", "Rubutun samfurin")}</th></tr></thead><tbody>{view.topics.map((t) => <tr key={t.id}><th scope="row">{label(t.label)}</th><td>{t.meanShare === null ? say("Unavailable", "Babu") : percent(t.meanShare)}</td><td>{t.modelledDocumentCount}</td></tr>)}</tbody></table></details>
      </div>
    </div>
  </section>;
}

export function DashboardConnections({ lang, bundle, view }: DashboardPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const say = (en: string, ha: string) => local(lang, en, ha);
  const kinds: Record<string, string> = {
    "reported-programme-collaboration": say("Reported collaboration", "Haɗin gwiwar da aka ruwaito"),
    "stated-cooperation": say("Cooperation intention", "Niyyar haɗin gwiwa"),
    "signed-mou-reported": say("Reported MOU signing", "Sanya hannu kan MOU da aka ruwaito"),
  };
  const relationships = expanded ? view.relationships : view.relationships.slice(0, 4);
  return <section className="dashboard-section" id="connections" aria-label={say("Connections and cooperation", "Alaƙa da haɗin gwiwa")}>
    <Heading number="04" title={say("Who appears in the record", "Waɗanda suka bayyana a bayanai")} />
    <p className="dashboard-muted">{say("These relationship records share a cited report with this selection. That does not attribute every relationship to the selected activity. Intentions and agreements retain their own evidence and limits.", "Waɗannan bayanan alaƙa sun bayyana a rahoton da aka ambata a wannan zaɓi. Wannan ba ya danganta kowace alaƙa ga aikin da aka zaɓa. Niyya da yarjejeniyoyi suna da nasu hujjoji da iyakoki.")}</p>
    {relationships.length ? <div className="dashboard-relationship-grid" id="dashboard-relationship-cards">{relationships.map((relationship) => {
      const ids = relationship.evidence.source_ids ?? (relationship.evidence.source_id ? [relationship.evidence.source_id] : []);
      const names = relationship.entity_ids.map((id) => bundle.entities.find((e) => e.id === id)?.label ?? id);
      return <article key={relationship.id}>
        <p className="dashboard-stage">{kinds[relationship.kind] ?? relationship.kind}</p>
        <h3 lang="en">{names.join(" / ")}</h3>
        <p className="dashboard-muted">{say("Original English qualification", "Iyaka a Turanci na asali")}</p>
        <p lang="en">{relationship.limitations}</p>
        {ids.map((id) => { const source = bundle.sources.find((s) => s.id === id); return source ? <a className="dashboard-topic-sources" key={id} href={source.url} target="_blank" rel="noopener noreferrer" aria-label={`${say("Source for", "Majiyar")} ${names.join(" / ")} · ${say("opens a new tab", "yana buɗe sabon shafi")}`}>{say("Read relationship source", "Karanta majiyar alaƙa")} ↗</a> : null; })}
      </article>;
    })}</div> : <p className="dashboard-muted">{say("No separately evidenced relationship matches these cited reports.", "Babu bayanin alaƙa mai hujja dabam da ya dace da waɗannan rahotanni.")}</p>}
    {view.relationships.length > 4 && <button type="button" className="dashboard-text-button" aria-controls="dashboard-relationship-cards" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? say("Show fewer relationships", "Rage bayanan alaƙa") : say(`Show all ${view.relationships.length} relationships`, `Nuna duk bayanan alaƙa ${view.relationships.length}`)}</button>}
    <details className="dashboard-mentions"><summary>{say("Names and shared-report mentions", "Sunaye da ambato a rahoto ɗaya")} ({view.entities.length})</summary>
      <p>{view.coOccurrences.length} {say("shared-report name pairs. Appearing together is not proof of partnership; support counts refer to selected canonical articles.", "nau'ukan sunaye biyu a rahoto ɗaya. Bayyana tare ba hujjar haɗin gwiwa ba ce; adadin hujja na nufin zaɓaɓɓun rahotanni ba maimaitu ba.")}</p>
      {view.entities.length ? <ul>{view.entities.map((entity) => <li key={entity.id}><span lang="en">{entity.label}</span> · {entity.mentions} {say("report mentions", "ambato a rahotanni")}</li>)}</ul> : <p>{say("No dictionary-name mentions in the selected model reports.", "Babu ambaton sunayen ƙamus a zaɓaɓɓun rahotannin samfurin.")}</p>}
    </details>
  </section>;
}
