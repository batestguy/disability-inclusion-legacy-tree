"use client";

import { useEffect, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardHighlights from "./DashboardHighlights";
import DashboardAdvocacy from "./DashboardAdvocacy";
import DashboardNetwork from "./DashboardNetwork";
import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceFooter from "./WorkspaceFooter";
import { useWorkspaceNavigation, selectionQuery, pathHash } from "./WorkspaceNavigation";
import { initialGuidedScreen } from "./GuidedSession";
import type { PresentationSelection } from "./DashboardSession";
import type { buildDashboardPresentation } from "../lib/dashboard-presentation.mjs";
import type { Lang } from "../lib/content";
import type { getChatData } from "../lib/chat-data";
import "../app/dashboard.css";
import "../app/presentation.css";
import "../app/landing.css";

type Props = ReturnType<typeof getChatData> & { lang: Lang };
export type Presentation = ReturnType<typeof buildDashboardPresentation>;
export default function DashboardWorkspace({ lang, bundle }: Props) {
  const router = useRouter();
  const { data, dashboard, setDashboard, setSession, section, href } = useWorkspaceNavigation(bundle, "explore");
  const selection = dashboard.presentation;
  const say = (en: string, ha: string) => lang === "ha" ? ha : en;
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => {
    if (!section) return;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(section);
      target?.scrollIntoView({ block: "start", behavior: "instant" });
      target?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [section]);
  function enterSection(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    history.pushState(null, "", event.currentTarget.href);
    window.dispatchEvent(new PopStateEvent("popstate"));
    const target = new URL(event.currentTarget.href).searchParams.get("section");
    if (target) requestAnimationFrame(() => {
      const element = document.getElementById(target);
      element?.scrollIntoView({ block: "start", behavior: "instant" });
      element?.focus({ preventScroll: true });
    });
  }
  function updateSelection(patch: Partial<PresentationSelection>) {
    const next = { ...selection, ...patch };
    setDashboard(previous => ({ ...previous, presentation: next }));
    history.pushState(null, "", location.pathname + selectionQuery(next, dashboard.selectedId, section) + location.hash);
  }
  function askAbout(id: string) {
    const activity = bundle.activities.find(entry => entry.id === id);
    if (!activity) return;
    const path = ["start", "timeline", `year:${activity.report_date.slice(0, 4)}`, `activity:${activity.id}`];
    setSession(previous => ({ ...previous, ...initialGuidedScreen, path, cursor: path.length - 1 }));
    setDashboard(previous => ({ ...previous, selectedId: id }));
    router.push((lang === "ha" ? "/ha/chat/" : "/chat/") + selectionQuery(selection, id, section) + pathHash(path));
  }
  if (!data) return <main role="alert"><h1>{say("The records could not be loaded safely.", "Ba a iya loda bayanan cikin aminci ba.")}</h1><button onClick={() => location.reload()}>{say("Reload", "Sake buɗewa")}</button></main>;
  return <div className="dashboard-shell dashboard-redesign explore-workspace" lang={lang}>
    <a className="skip" href="#dashboard-main">{say("Skip to dashboard", "Tsallaka zuwa bayanai")}</a>
    <WorkspaceHeader lang={lang} page="explore" href={href} />
    <main id="dashboard-main" className="dashboard-main" tabIndex={-1}>
      <div className="explore-heading"><div><h1>{say("Explore the record", "Bincika bayanan")}</h1>{lang === "ha" && <p className="dashboard-draft">Hausa na gwaji</p>}</div><Link href={href("chat", lang)} prefetch={false}>{say("Interact with me", "Mu tattauna")} ↗</Link></div>
      <nav className="explore-sections" aria-label={say("Explore sections", "Sassan bincike")}>
        <Link onClick={enterSection} href={href("explore", lang, "overview")} prefetch={false}>{say("Figures", "Lambobi")}</Link>
        <Link onClick={enterSection} href={href("explore", lang, "advocacy")} prefetch={false}>{say("Themes", "Jigogi")}</Link>
        <Link onClick={enterSection} href={href("explore", lang, "collaborations")} prefetch={false}>{say("Connections", "Haɗin gwiwa")}</Link>
      </nav>
      <DashboardHighlights lang={lang} bundle={bundle} data={data} area={selection.area} onArea={(area) => updateSelection({ area })} />
      <DashboardAdvocacy lang={lang} bundle={bundle} data={data} mode={selection.cloudMode} selectedId={selection.cloudId} onSelect={(cloudId) => updateSelection({ cloudId })} onMode={(cloudMode) => updateSelection({ cloudMode, cloudId: null })} onAsk={askAbout} />
      <DashboardNetwork lang={lang} bundle={bundle} data={data} area={selection.networkArea} selectedId={selection.initiative} actorId={selection.actor} onSelect={(initiative) => updateSelection({ initiative, actor: null })} onArea={(networkArea) => updateSelection({ networkArea, initiative: null, actor: null })} onActor={(actor) => updateSelection({ actor, initiative: null })} onAsk={askAbout} />
      <WorkspaceFooter lang={lang} />
    </main>
  </div>;
}
