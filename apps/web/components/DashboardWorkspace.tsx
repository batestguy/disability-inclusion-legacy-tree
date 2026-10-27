"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import LanguageChoice from "./LanguageChoice";
import GuidedWorkspace from "./GuidedWorkspace";
import DashboardEvidence from "./DashboardEvidence";
import DashboardHighlights from "./DashboardHighlights";
import { DashboardTimeline, DashboardThemes, DashboardConnections } from "./DashboardPanels";
import { useDashboardSession } from "./DashboardSession";
import { initialGuidedScreen, useGuidedSession } from "./GuidedSession";
import { buildDashboardView, normalizeDashboardFilters, exportActivitiesCsv, exportObservationsCsv, type DashboardFilters } from "../lib/dashboard-data.mjs";
import { getFlowNode } from "../lib/guided-flow.mjs";
import { paginate } from "../lib/guided-presentation.mjs";
import type { Lang } from "../lib/content";
import type { getChatData } from "../lib/chat-data";
import "../app/dashboard.css";

type Props = ReturnType<typeof getChatData> & { lang: Lang };
type Activity = Props["bundle"]["activities"][number];
const pathHash = (path: string[]) => path.length > 1 ? `#flow=${encodeURIComponent(path.join("|"))}` : "";
function queryFor(filters: DashboardFilters, selected: string | null) {
  const params = new URLSearchParams();
  for (const key of ["year", "category", "activity"] as const) if (filters[key] !== "all") params.set(key, filters[key]);
  if (selected) params.set("record", selected);
  return params.size ? `?${params}` : "";
}

export default function DashboardWorkspace({ lang, bundle, manifest }: Props) {
  const { dashboard, setDashboard } = useDashboardSession();
  const { session, setSession } = useGuidedSession();
  const [downloadError, setDownloadError] = useState(false);
  const evidencePanel = useRef<HTMLElement>(null);
  const evidenceOrigin = useRef<HTMLElement | null>(null);
  const chatSection = useRef<HTMLElement>(null);
  const say = (en: string, ha: string) => lang === "ha" ? ha : en;
  const activityNodes = useMemo(() => {
    try { return new Map(bundle.activities.map((activity) => [activity.id, getFlowNode(bundle, `activity:${activity.id}`)])); } catch { return null; }
  }, [bundle]);
  const view = useMemo(() => { try { return buildDashboardView(bundle, dashboard.filters); } catch { return null; } }, [bundle, dashboard.filters]);
  const visibleIds = useMemo(() => new Set(view?.activities.map((activity) => activity.id) ?? []), [view]);
  const selected = activityNodes && Array.isArray(bundle.activities) ? bundle.activities.find((activity) => activity.id === dashboard.selectedId && visibleIds.has(activity.id)) : undefined;
  const titleFor = (id: string) => activityNodes?.get(id)?.title[lang] ?? id;
  const dataReady = activityNodes !== null && view !== null;

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => {
    if (!dataReady) return;
    function readLocation() {
      const params = new URLSearchParams(location.search);
      const filters = normalizeDashboardFilters(bundle, { year: params.get("year") ?? "all", category: params.get("category") ?? "all", activity: params.get("activity") ?? "all" });
      const requested = params.get("record");
      const selectedId = buildDashboardView(bundle, filters).activities.some((activity) => activity.id === requested) ? requested : null;
      setDashboard((previous) => JSON.stringify(previous.filters) === JSON.stringify(filters) && previous.selectedId === selectedId ? previous : { ...previous, filters, selectedId, tablePage: 0, figurePage: 0 });
    }
    readLocation(); window.addEventListener("popstate", readLocation);
    return () => window.removeEventListener("popstate", readLocation);
  }, [bundle, setDashboard, dataReady]);

  function changeFilters(patch: Partial<DashboardFilters>) {
    const filters = normalizeDashboardFilters(bundle, { ...dashboard.filters, ...patch });
    const selectedId = buildDashboardView(bundle, filters).activities.some((activity) => activity.id === dashboard.selectedId) ? dashboard.selectedId : null;
    setDashboard((previous) => ({ ...previous, filters, selectedId, tablePage: 0, figurePage: 0 }));
    window.history.pushState(null, "", location.pathname + queryFor(filters, selectedId) + location.hash);
  }
  function clearFilters() { changeFilters({ year: "all", category: "all", activity: "all" }); }
  function scrollToSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const section = document.getElementById(id);
    if (!section) return;
    event.preventDefault();
    section.scrollIntoView({ block: "start" });
    section.focus({ preventScroll: true });
  }
  function openEvidence(id: string) {
    evidenceOrigin.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setDashboard((previous) => ({ ...previous, selectedId: id }));
    window.history.replaceState(null, "", location.pathname + queryFor(dashboard.filters, id) + location.hash);
    requestAnimationFrame(() => { evidencePanel.current?.scrollIntoView({ block: "start" }); evidencePanel.current?.focus({ preventScroll: true }); });
  }
  function askAbout(activity: Activity) {
    const path = ["start", "timeline", `year:${activity.report_date.slice(0, 4)}`, `activity:${activity.id}`];
    setSession((previous) => ({ ...previous, ...initialGuidedScreen, path, cursor: path.length - 1 }));
    setDashboard((previous) => ({ ...previous, selectedId: activity.id }));
    window.history.pushState(null, "", location.pathname + queryFor(dashboard.filters, activity.id) + pathHash(path));
    requestAnimationFrame(() => { chatSection.current?.scrollIntoView({ block: "start" }); document.getElementById("guided-answer")?.focus({ preventScroll: true }); });
  }
  function download(kind: "activities" | "observations") {
    if (!view) return;
    try {
      const csv = kind === "activities" ? exportActivitiesCsv(view) : exportObservationsCsv(view);
      const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = `abba-isa-${kind}-${dashboard.filters.year}-${bundle.dataset_version}.csv`; anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); setDownloadError(false);
    } catch { setDownloadError(true); }
  }
  const currentPath = session.path.slice(0, session.cursor + 1);
  const destination = (target: Lang) => (target === "en" ? "/" : "/ha/") + queryFor(dashboard.filters, dashboard.selectedId) + pathHash(currentPath);
  if (!view || !activityNodes) return <main className="dashboard-error" role="alert"><h1>{say("The records could not be loaded safely.", "Ba a iya loda bayanan cikin aminci ba.")}</h1><button onClick={() => window.location.reload()}>{say("Reload", "Sake buɗewa")}</button></main>;
  const records = paginate(view.activities, dashboard.tablePage, 6);
  const panelProps = { lang, bundle, view, onFilter: changeFilters, onEvidence: openEvidence, titleFor };
  const filterControls = <section className="dashboard-filters" aria-label={say("Filter the dashboard", "Tace bayanai")}>
    <label>{say("Report year", "Shekarar rahoto")}<select value={dashboard.filters.year} onChange={(event) => changeFilters({ year: event.target.value })} data-filter="year"><option value="all">{say("All years", "Dukkan shekaru")}</option>{view.years.map((year) => <option key={year} value={year}>{year}{year === "2026" ? say(" · partial", " · ba cikakke ba") : ""}</option>)}</select></label>
    <label>{say("Category", "Rukuni")}<select value={dashboard.filters.category} onChange={(event) => changeFilters({ category: event.target.value })} data-filter="category"><option value="all">{say("All categories", "Dukkan rukunoni")}</option>{view.categoryOptions.map((category) => <option key={category.id} value={category.id}>{category.label[lang] ?? category.label.en}</option>)}</select></label>
    <label>{say("Activity / programme", "Aiki / shiri")}<select value={dashboard.filters.activity} onChange={(event) => changeFilters({ activity: event.target.value })} data-filter="activity"><option value="all">{say("All activities", "Dukkan ayyuka")}</option>{view.activityOptions.map((activity) => <option key={activity.id} value={activity.id}>{titleFor(activity.id)}</option>)}</select></label>
    <button className="dashboard-reset" type="button" onClick={clearFilters}>{say("Clear filters", "Share tacewa")} <span aria-hidden="true">↺</span></button>
  </section>;

  return <div className="dashboard-shell" lang={lang}>
    <a className="skip" href="#dashboard-main" onClick={(event) => scrollToSection(event, "dashboard-main")}>{say("Skip to dashboard", "Tsallaka zuwa bayanai")}</a>
    <header className="dashboard-header"><div className="dashboard-header-inner">
      <a className="dashboard-brand" href={lang === "en" ? "/" : "/ha/"}><span aria-hidden="true">MI</span><div>MOHAMMED ABBA ISA<small>{say("THE WORK IN NUMBERS", "AYYUKA A CIKIN LAMBOBI")}</small></div></a>
      <nav className="dashboard-navigation" aria-label={say("Dashboard sections", "Sassan bayanai")}><a href="#overview" onClick={(event) => scrollToSection(event, "overview")}>{say("Overview", "Taƙaitawa")}</a><a href="#timeline" onClick={(event) => scrollToSection(event, "timeline")}>{say("Timeline", "Lokaci")}</a><a href="#evidence" onClick={(event) => scrollToSection(event, "evidence")}>{say("Evidence", "Hujjoji")}</a><a href="#ask-records" onClick={(event) => scrollToSection(event, "ask-records")}>{say("Chatbot", "Tattaunawa")} <span aria-hidden="true">↓</span></a></nav>
      <LanguageChoice lang={lang} destinations={{ en: destination("en"), ha: destination("ha") }} />
    </div></header>
    <main id="dashboard-main" className="dashboard-main" tabIndex={-1}>
      <DashboardHighlights {...panelProps} filterControls={filterControls} category={dashboard.highlightCategory} onCategory={(highlightCategory) => setDashboard((previous) => ({ ...previous, highlightCategory }))} />
      <p className="dashboard-selection-status" role="status" aria-live="polite"><strong data-kpi="activities">{view.inventory.activities}</strong> {say("activities", "ayyuka")} · <strong data-kpi="reported">{view.inventory.reportedFigures}</strong> {say("achievement figures", "lambobin nasarori")} · <strong data-kpi="targets">{view.inventory.targets}</strong> {say("targets", "manufofi")} · {view.inventory.citations} {say("sources", "majiyoyi")}</p>
      {!view.activities.length && <div className="dashboard-empty" data-empty="true"><h2>{say("No records match these filters.", "Babu bayanan da suka dace da tacewar nan.")}</h2><p>{say("Try another year, category or activity.", "Gwada wata shekara, rukuni ko aiki.")}</p><button type="button" onClick={clearFilters}>{say("Show all records", "Nuna dukkan bayanai")}</button></div>}
      <DashboardTimeline {...panelProps} />
      <DashboardThemes {...panelProps} />
      <DashboardConnections {...panelProps} />
      <section id="evidence" className="dashboard-section" tabIndex={-1} aria-label={say("Evidence explorer", "Binciken hujjoji")}>
        <div className="dashboard-section-heading"><div><p className="dashboard-eyebrow">05 / {say("BACK TO THE SOURCE", "KOMAWA ZUWA TUSHE")}</p><h2>{say("Explore the evidence", "Bincika hujjoji")}</h2></div><p>{say("Individual records retain their figures and limits. Linked citations include follow-up reports, which may have different publication years.", "Kowane aiki yana riƙe da lambobi da iyakokinsa. Hujjojin tushe sun haɗa da rahotannin biye da su waɗanda shekarunsu ka iya bambanta.")}</p></div>
        <div className="dashboard-export-actions"><button type="button" disabled={!view.activities.length} onClick={() => download("activities")}>{say("Activities CSV", "CSV na ayyuka")} <span aria-hidden="true">↓</span></button><button type="button" disabled={!view.observations.length} onClick={() => download("observations")}>{say("Figures CSV", "CSV na lambobi")} <span aria-hidden="true">↓</span></button><span>{say(`${records.items.length} of ${view.activities.length} records shown`, `An nuna bayanai ${records.items.length} daga ${view.activities.length}`)}</span></div>
        {downloadError && <p role="alert">{say("The export could not be created. Please try again.", "An kasa shirya fayil ɗin. Sake gwadawa.")}</p>}
        <ul className="dashboard-records">{records.items.map((activity) => <li key={activity.id} data-activity={activity.id}><div><span className="dashboard-record-date">{activity.report_date}</span><h3>{titleFor(activity.id)}</h3></div><div className="dashboard-record-actions"><button type="button" aria-expanded={selected?.id === activity.id} onClick={() => openEvidence(activity.id)}>{say("Evidence", "Hujja")}</button><button type="button" onClick={() => { const original = bundle.activities.find((entry) => entry.id === activity.id); if (original) askAbout(original); }}>{say("Ask about this", "Tambayi wannan")} ↓</button></div></li>)}</ul>
        {records.pageCount > 1 && <nav className="dashboard-pagination" aria-label={say("Evidence record pages", "Shafukan bayanan hujja")}><button type="button" disabled={records.page === 0} onClick={() => setDashboard((previous) => ({ ...previous, tablePage: records.page - 1 }))}>{say("Previous records", "Bayanan baya")}</button><span>{records.page + 1} / {records.pageCount}</span><button type="button" disabled={records.page >= records.pageCount - 1} onClick={() => setDashboard((previous) => ({ ...previous, tablePage: records.page + 1 }))}>{say("More records", "Ƙarin bayanai")}</button></nav>}
        {selected && <DashboardEvidence lang={lang} bundle={bundle} activity={selected} panelRef={evidencePanel} onAsk={() => askAbout(selected)} onClose={() => {
          setDashboard((previous) => ({ ...previous, selectedId: null }));
          window.history.replaceState(null, "", location.pathname + queryFor(dashboard.filters, null) + location.hash);
          requestAnimationFrame(() => { (evidenceOrigin.current?.isConnected ? evidenceOrigin.current : document.getElementById("evidence"))?.focus(); });
        }} />}
      </section>
      <section id="ask-records" className="dashboard-section dashboard-chat-section" ref={chatSection} tabIndex={-1} aria-labelledby="dashboard-chat-title"><div className="dashboard-section-heading"><div><p className="dashboard-eyebrow">06 / {say("FOLLOW YOUR CURIOSITY", "BI ABIN DA KAKE SON SANI")}</p><h2 id="dashboard-chat-title">{say("Ask the records", "Tambayi bayanai")}</h2></div><p>{say("Choose a question, follow the options, reach the source. Use “Ask about this” on a record to start there.", "Zaɓi tambaya, bi zaɓuɓɓuka, isa tushe. Zaɓi “Tambayi wannan” a kan aiki don farawa daga can.")}</p></div><GuidedWorkspace lang={lang} bundle={bundle} manifest={manifest} embedded /></section>
      <footer className="dashboard-footer"><div><strong>MOHAMMED ABBA ISA</strong><p>{say("A selected record of work, with evidence in view.", "Zaɓaɓɓun bayanan aiki, tare da hujjoji.")}</p></div><div><p>{say("Hausa draft · local preview", "Hausa na gwaji · samfurin gida")}</p><details><summary>{say("Coverage & method", "Iyakoki da hanya")}</summary><p>{say(`The catalogue contains ${bundle.sources.length} citations; ${view.inventory.citations} are linked to the current activity selection. Archive-wide review remains incomplete. Categories are reviewed labels; topics are a frozen model of English text. Shared mentions do not establish partnerships. No reliable total of unique people or causal impact is established.`, `Kundin yana da tushe ${bundle.sources.length}; tushe ${view.inventory.citations} sun shafi zaɓaɓɓun ayyukan yanzu. Binciken cikakken kundin bai kammala ba. Rukunoni bayanai ne da aka duba; jigogi daga samfurin rubutun Turanci ne. Ambaton sunaye tare ba hujjar haɗin gwiwa ba ne. Ba a tabbatar da jimillar mutane mabambanta ko tasirin sanadi ba.`)}</p></details></div></footer>
    </main>
  </div>;
}
