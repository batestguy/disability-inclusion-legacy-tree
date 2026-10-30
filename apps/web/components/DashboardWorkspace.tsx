"use client";

import { useEffect, useMemo, useRef, type MouseEvent } from "react";
import Image from "next/image";
import LanguageChoice from "./LanguageChoice";
import GuidedWorkspace from "./GuidedWorkspace";
import DashboardHighlights from "./DashboardHighlights";
import DashboardAdvocacy from "./DashboardAdvocacy";
import DashboardNetwork from "./DashboardNetwork";
import portrait from "../../../content/dashboard-portrait.json";
import { initialPresentation, useDashboardSession, type PresentationSelection } from "./DashboardSession";
import { initialGuidedScreen, useGuidedSession } from "./GuidedSession";
import { buildDashboardPresentation } from "../lib/dashboard-presentation.mjs";
import type { Lang } from "../lib/content";
import type { getChatData } from "../lib/chat-data";
import "../app/dashboard.css";
import "../app/presentation.css";

type Props = ReturnType<typeof getChatData> & { lang: Lang };
export type Presentation = ReturnType<typeof buildDashboardPresentation>;
const pathHash = (path: string[]) => path.length > 1 ? `#flow=${encodeURIComponent(path.join("|"))}` : "";
function queryFor(selection: PresentationSelection, record: string | null) {
  const params = new URLSearchParams();
  if (selection.area !== "all") params.set("area", selection.area);
  if (selection.cloudMode !== "concepts") params.set("cloud", selection.cloudMode);
  if (selection.cloudId) params.set("term", selection.cloudId);
  if (selection.networkArea !== "all") params.set("partners", selection.networkArea);
  if (selection.initiative) params.set("initiative", selection.initiative);
  if (selection.actor) params.set("actor", selection.actor);
  if (record) params.set("record", record);
  return params.size ? `?${params}` : "";
}

export default function DashboardWorkspace({ lang, bundle, manifest }: Props) {
  const { dashboard, setDashboard } = useDashboardSession();
  const { session, setSession } = useGuidedSession();
  const chatSection = useRef<HTMLElement>(null);
  const say = (en: string, ha: string) => lang === "ha" ? ha : en;
  const data = useMemo(() => { try { return buildDashboardPresentation(bundle); } catch { return null; } }, [bundle]);
  const selection = dashboard.presentation;

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => {
    if (!data) return;
    function readLocation() {
      const params = new URLSearchParams(location.search);
      const area = (value: string | null) => data!.groups.some((group) => group.id === value) ? value! : "all";
      const cloudMode = params.get("cloud") === "areas" ? "areas" as const : "concepts" as const;
      const term = params.get("term");
      const cloudIds = cloudMode === "concepts" ? data!.concepts.map((entry) => entry.id) : bundle.categories.map((entry) => entry.id);
      const initiative = params.get("initiative");
      const actor = params.get("actor");
      const networkArea = data!.networkGroups.some((group) => group.id === params.get("partners")) ? params.get("partners")! : "all";
      const visibleActivities = data!.networkActivities.filter((entry) => networkArea === "all" || entry.groupIds.includes(networkArea));
      const visibleInitiatives = data!.collaborations.filter((entry) => visibleActivities.some((activity) => activity.id === entry.activityId));
      const selectedInitiative = visibleInitiatives.find((entry) => entry.id === initiative);
      const selectedActivity = visibleActivities.find((entry) => entry.id === initiative || entry.id === selectedInitiative?.activityId);
      const validActor = visibleInitiatives.some((entry) => entry.participants.some((person) => person.id === actor) && (!selectedActivity || entry.activityId === selectedActivity.id));
      const next: PresentationSelection = {
        ...initialPresentation, area: area(params.get("area")), cloudMode,
        cloudId: term && cloudIds.includes(term) ? term : null,
        initiative: selectedInitiative?.id ?? selectedActivity?.id ?? null,
        networkArea,
        actor: validActor ? actor : null,
      };
      const requested = params.get("record");
      const selectedId = bundle.activities.some((entry) => entry.id === requested) ? requested : null;
      setDashboard((previous) => ({ ...previous, presentation: next, selectedId, filters: { year: "all", category: "all", activity: "all" } }));
      // Legacy year filters must never silently shrink the full-record overview.
      const clean = queryFor(next, selectedId);
      if (clean !== location.search) history.replaceState(null, "", location.pathname + clean + location.hash);
    }
    readLocation(); window.addEventListener("popstate", readLocation);
    return () => window.removeEventListener("popstate", readLocation);
  }, [data, bundle, setDashboard]);

  function updateSelection(patch: Partial<PresentationSelection>) {
    const next = { ...selection, ...patch };
    setDashboard((previous) => ({ ...previous, presentation: next }));
    history.pushState(null, "", location.pathname + queryFor(next, dashboard.selectedId) + location.hash);
  }
  function scrollToSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const section = document.getElementById(id);
    if (!section) return;
    event.preventDefault(); section.scrollIntoView({ block: "start" }); section.focus({ preventScroll: true });
  }
  function askAbout(id: string) {
    const activity = bundle.activities.find((entry) => entry.id === id);
    if (!activity) return;
    const path = ["start", "timeline", `year:${activity.report_date.slice(0, 4)}`, `activity:${activity.id}`];
    setSession((previous) => ({ ...previous, ...initialGuidedScreen, path, cursor: path.length - 1 }));
    setDashboard((previous) => ({ ...previous, selectedId: id }));
    history.pushState(null, "", location.pathname + queryFor(selection, id) + pathHash(path));
    requestAnimationFrame(() => { chatSection.current?.scrollIntoView({ block: "start" }); document.getElementById("guided-answer")?.focus({ preventScroll: true }); });
  }
  const currentPath = session.path.slice(0, session.cursor + 1);
  const destination = (target: Lang) => (target === "en" ? "/" : "/ha/") + queryFor(selection, dashboard.selectedId) + pathHash(currentPath);
  if (!data) return <main className="dashboard-error" role="alert"><h1>{say("The records could not be loaded safely.", "Ba a iya loda bayanan cikin aminci ba.")}</h1><button onClick={() => location.reload()}>{say("Reload", "Sake buɗewa")}</button></main>;

  return <div className="dashboard-shell dashboard-redesign" lang={lang}>
    <a className="skip" href="#dashboard-main" onClick={(event) => scrollToSection(event, "dashboard-main")}>{say("Skip to dashboard", "Tsallaka zuwa bayanai")}</a>
    <header className="dashboard-header"><div className="dashboard-header-inner">
      <a className="dashboard-brand" href={lang === "en" ? "/" : "/ha/"}><span aria-hidden="true">MI</span><div>MOHAMMED ABBA ISA<small>{say("DISABILITY INCLUSION", "SHIGAR MASU NAKASA")}</small></div></a>
      <nav className="dashboard-navigation" aria-label={say("Dashboard sections", "Sassan bayanai")}>
        {[{ id: "overview", en: "Contributions", ha: "Gudummawa" }, { id: "advocacy", en: "Ideas & advocacy", ha: "Ra’ayoyi da kira" }, { id: "collaborations", en: "Collaborations", ha: "Haɗin gwiwa" }, { id: "ask-records", en: "Explore with the guide", ha: "Bincika da jagora" }].map((item) => <a key={item.id} href={`#${item.id}`} onClick={(event) => scrollToSection(event, item.id)}>{item[lang]}</a>)}
      </nav><LanguageChoice lang={lang} destinations={{ en: destination("en"), ha: destination("ha") }} />
    </div></header>
    <main id="dashboard-main" className="dashboard-main" tabIndex={-1}>
      <section className="dashboard-opening" aria-labelledby="dashboard-title">
        <div><h1 id="dashboard-title">{say("Advancing Disability Inclusion", "Ci Gaban Shigar Masu Nakasa")}</h1><p className="dashboard-subtitle">{say("Mohammed Abba Isa’s contributions in figures", "Gudummawar Mohammed Abba Isa a cikin lambobi")}</p>{lang === "ha" && <p className="dashboard-draft">Hausa na gwaji</p>}</div>
        <figure className="opening-portrait"><Image src="/branding/mohammed-abba-isa.webp" width={540} height={600} sizes="(max-width: 700px) 220px, 260px" alt={say("Mohammed Abba Isa beside the Nigerian flag", "Mohammed Abba Isa kusa da tutar Najeriya")} preload /><figcaption><blockquote lang="en">“{portrait.quote_excerpt}”</blockquote><span>— Mohammed Abba Isa</span><a href={portrait.source_page} target="_blank" rel="noopener noreferrer">{say("Quote & portrait source", "Tushen magana da hoto")} <span aria-hidden="true">↗</span></a></figcaption></figure>
      </section>
      <DashboardHighlights lang={lang} bundle={bundle} data={data} area={selection.area} onArea={(area) => updateSelection({ area })} />
      <DashboardAdvocacy lang={lang} bundle={bundle} data={data} mode={selection.cloudMode} selectedId={selection.cloudId} onSelect={(cloudId) => updateSelection({ cloudId })} onMode={(cloudMode) => updateSelection({ cloudMode, cloudId: null })} onAsk={askAbout} />
      <DashboardNetwork lang={lang} bundle={bundle} data={data} area={selection.networkArea} selectedId={selection.initiative} actorId={selection.actor} onSelect={(initiative) => updateSelection({ initiative, actor: null })} onArea={(networkArea) => updateSelection({ networkArea, initiative: null, actor: null })} onActor={(actor) => updateSelection({ actor, initiative: null })} onAsk={askAbout} />
      <section id="ask-records" className="dashboard-section dashboard-chat-section" ref={chatSection} tabIndex={-1} aria-labelledby="dashboard-chat-title"><div className="section-heading"><div><p className="dashboard-eyebrow">IV. {say("FOLLOW YOUR CURIOSITY", "BI ABIN DA KAKE SON SANI")}</p><h2 id="dashboard-chat-title">{say("A question opens a new perspective.", "Tambaya tana buɗe sabuwar fahimta.")}</h2></div><p>{say("Choose a question. Follow the story. Find the source.", "Zaɓi tambaya. Bi labarin. Nemo tushe.")}</p></div><GuidedWorkspace lang={lang} bundle={bundle} manifest={manifest} embedded /></section>
      <footer className="dashboard-footer"><div><strong>MOHAMMED ABBA ISA</strong><p>{say("Access to opportunity. A place for everyone.", "Samun dama. Wuri ga kowa.")}</p></div><div><p>{say("Local preview · Hausa draft", "Samfurin gida · Hausa na gwaji")}</p><details><summary>{say("About these records", "Game da bayanan nan")}</summary><p>{say("A selected record, not a complete career account. Programme figures may overlap and must not be added into a unique-person total. Reports describe contributions and intentions; they do not establish causal impact. Photo reuse permission and public release remain pending.", "Zaɓaɓɓun bayanai ne, ba cikakken tarihin aiki ba. Mutanen shirye-shirye na iya maimaituwa; ba za a haɗa su a matsayin jimillar mutane mabambanta ba. Rahotanni suna bayyana gudummawa da manufofi, ba tasirin sanadi ba. Izinin amfani da hotuna da fitowar shafin ga jama’a suna jiran kammalawa.")}</p></details></div></footer>
    </main>
  </div>;
}
