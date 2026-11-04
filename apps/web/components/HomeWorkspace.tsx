"use client";
import { translate, localeHome } from "../lib/locales.mjs";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceFooter from "./WorkspaceFooter";
import OpeningPortrait from "./OpeningPortrait";
import ChatbotMark from "./ChatbotMark";
import ContributionIllustration from "./ContributionIllustration";
import { LandingEffectsSettings, useLandingEffects } from "./LandingEffects";
import interactionCopy from "../../../content/interaction-copy.json";
import { exploreSection, useWorkspaceNavigation, type ExploreSection } from "./WorkspaceNavigation";
import type { Lang } from "../lib/content";
import type { getChatData } from "../lib/chat-data";
import "../app/dashboard.css";
import "../app/presentation.css";
import "../app/landing.css";

export default function HomeWorkspace({ lang, bundle }: ReturnType<typeof getChatData> & { lang: Lang }) {
  const router = useRouter();
  const { data, href } = useWorkspaceNavigation(bundle, "home");
  const effects = useLandingEffects();
  const say = (en: string, ha: string) => translate(lang, en, ha);
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
      router.replace(localeHome(lang) + (legacyChat ? "chat/" : "explore/") + query + flow);
    }
    legacy(); window.addEventListener("popstate", legacy); window.addEventListener("hashchange", legacy);
    return () => { window.removeEventListener("popstate", legacy); window.removeEventListener("hashchange", legacy); };
  }, [lang, router]);
  const bubbles: { id: ExploreSection | "chat"; en: string; ha: string }[] = [
    { id: "overview", en: "Figures", ha: "Lambobi" },
    { id: "advocacy", en: "Themes", ha: "Jigogi" },
    { id: "collaborations", en: "Connections", ha: "Haɗin gwiwa" },
    { id: "chat", en: "Chat assistant", ha: "Mataimakin tattaunawa" },
  ];
  const destinations: Record<ExploreSection | "chat", string> = {
    overview: href("explore", lang, "overview"), advocacy: href("explore", lang, "advocacy"),
    collaborations: href("explore", lang, "collaborations"), chat: href("chat", lang),
  };
  return <div className="dashboard-shell dashboard-redesign landing-workspace" lang={lang} data-effects={effects.active ? "on" : "off"} data-page-hidden={effects.hidden}>
    <a className="skip" href="#home-main">{say("Skip to content", "Tsallaka zuwa abun ciki")}</a>
    <WorkspaceHeader lang={lang} page="home" href={href} />
    <main id="home-main" className="dashboard-main" tabIndex={-1}>
      <OpeningPortrait lang={lang} biographyHref={href("about", lang)} active={effects.active} suspended={effects.hidden} terms={data?.concepts ?? []} planets={
        bubbles.map(bubble => <Link key={bubble.id} className={`landing-bubble bubble-${bubble.id}`} href={destinations[bubble.id]} prefetch={false} aria-label={`${say(bubble.en, bubble.ha)} — ${interactionCopy.tools[bubble.id].format[lang]}. ${interactionCopy.tools[bubble.id].invitation[lang]}`}>
          <span className="bubble-surface"><span className="bubble-art" aria-hidden="true">{bubble.id === "chat" ? <ChatbotMark /> : <ContributionIllustration activityId={bubble.id === "overview" ? "startup-support-march-2024" : bubble.id === "advocacy" ? "disability-readiness-toolkit-2025" : "inclusive-business-skills"} unit={bubble.id === "advocacy" ? "toolkit" : "people"} />}</span><strong>{say(bubble.en, bubble.ha)}</strong><span className="bubble-detail"><span className="bubble-format">{interactionCopy.tools[bubble.id].format[lang]}</span><span className="bubble-invitation">{interactionCopy.tools[bubble.id].invitation[lang]} <span aria-hidden="true">↗</span></span></span></span>
        </Link>)
      } />
      <WorkspaceFooter lang={lang} controls={<LandingEffectsSettings lang={lang} enabled={effects.enabled} reduced={effects.reduced} onChange={effects.setEnabled} />} />
    </main>
  </div>;
}
