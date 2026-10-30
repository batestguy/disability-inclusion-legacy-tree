"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceFooter from "./WorkspaceFooter";
import OpeningPortrait from "./OpeningPortrait";
import ChatbotMark from "./ChatbotMark";
import ContributionIllustration from "./ContributionIllustration";
import { exploreSection, useWorkspaceNavigation, type ExploreSection } from "./WorkspaceNavigation";
import type { Lang } from "../lib/content";
import type { getChatData } from "../lib/chat-data";
import "../app/dashboard.css";
import "../app/presentation.css";
import "../app/landing.css";

export default function HomeWorkspace({ lang, bundle }: ReturnType<typeof getChatData> & { lang: Lang }) {
  const router = useRouter();
  const { href } = useWorkspaceNavigation(bundle, "home");
  const [paused, setPaused] = useState(false);
  const say = (en: string, ha: string) => lang === "ha" ? ha : en;
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => {
    function legacy() {
      const params = new URLSearchParams(location.search);
      if (params.get("view") === "home") return;
      const legacySection = exploreSection(location.hash.slice(1));
      const legacyChat = location.hash === "#ask-records";
      const legacyKeys = ["area", "cloud", "term", "partners", "initiative", "actor", "record", "year", "category", "activity", "section"];
      if (!legacySection && !legacyChat && !legacyKeys.some(key => params.has(key)) && !location.hash.startsWith("#leaf=") && !location.hash.startsWith("#flow=")) return;
      if (legacySection) params.set("section", legacySection);
      if (location.hash.startsWith("#leaf=")) { try { params.set("record", decodeURIComponent(location.hash.slice(6))); } catch { /* Invalid legacy record is discarded. */ } }
      const query = params.size ? `?${params}` : "";
      const flow = location.hash.startsWith("#flow=") ? location.hash : "";
      router.replace((lang === "ha" ? "/ha/" : "/") + (legacyChat ? "chat/" : "explore/") + query + flow);
    }
    legacy(); window.addEventListener("popstate", legacy); window.addEventListener("hashchange", legacy);
    return () => { window.removeEventListener("popstate", legacy); window.removeEventListener("hashchange", legacy); };
  }, [lang, router]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => { try { setPaused(sessionStorage.getItem("landing-motion-paused") === "true"); } catch { /* Optional preference only. */ } });
    return () => cancelAnimationFrame(frame);
  }, []);
  function toggleMotion() {
    const next = !paused; setPaused(next);
    try { sessionStorage.setItem("landing-motion-paused", String(next)); } catch { /* Optional preference only. */ }
  }
  const bubbles: { id: ExploreSection | "chat"; en: string; ha: string; detailEn: string; detailHa: string }[] = [
    { id: "overview", en: "Figures", ha: "Lambobi", detailEn: "Contributions in figures", detailHa: "Gudummawa a cikin lambobi" },
    { id: "advocacy", en: "Themes", ha: "Jigogi", detailEn: "Themes in his advocacy", detailHa: "Jigogin fafutukarsa" },
    { id: "collaborations", en: "Connections", ha: "Haɗin gwiwa", detailEn: "Follow the connections", detailHa: "Bi hanyoyin haɗin gwiwa" },
    { id: "chat", en: "Interact with me", ha: "Mu tattauna", detailEn: "Choose a question", detailHa: "Zaɓi tambaya" },
  ];
  return <div className="dashboard-shell dashboard-redesign landing-workspace" lang={lang}>
    <a className="skip" href="#home-main">{say("Skip to content", "Tsallaka zuwa abun ciki")}</a>
    <WorkspaceHeader lang={lang} page="home" href={href} />
    <main id="home-main" className="dashboard-main" tabIndex={-1}>
      <OpeningPortrait lang={lang} />
      <section className="landing-choices" aria-labelledby="landing-choices-title" data-paused={paused}>
        <div className="landing-choice-heading"><h2 id="landing-choices-title" className="calligraphy-title">{say("Where shall we begin?", "Ina za mu fara?")}</h2><button type="button" className="motion-toggle" aria-pressed={paused} onClick={toggleMotion}>{paused ? say("Resume motion", "Ci gaba da motsi") : say("Pause motion", "Dakatar da motsi")}</button></div>
        <div className="bubble-constellation">
          {bubbles.map(bubble => <Link key={bubble.id} className={`landing-bubble bubble-${bubble.id}`} href={bubble.id === "chat" ? href("chat", lang) : href("explore", lang, bubble.id)} prefetch={false}>
            <span className="bubble-surface"><span className="bubble-art" aria-hidden="true">{bubble.id === "chat" ? <ChatbotMark /> : <ContributionIllustration activityId={bubble.id === "overview" ? "startup-support-march-2024" : bubble.id === "advocacy" ? "disability-readiness-toolkit-2025" : "inclusive-business-skills"} unit={bubble.id === "advocacy" ? "toolkit" : "people"} />}</span><strong>{bubble[lang]}</strong><span className="bubble-detail">{lang === "ha" ? bubble.detailHa : bubble.detailEn} <span aria-hidden="true">↗</span></span></span>
          </Link>)}
        </div>
      </section>
      <WorkspaceFooter lang={lang} />
    </main>
  </div>;
}
