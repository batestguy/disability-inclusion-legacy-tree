"use client";
import { translate } from "../lib/locales.mjs";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LanguageChoice from "./LanguageChoice";
import visualAssets from "../../../content/dashboard-visual-assets.json";
import type { Lang } from "../lib/content";
import type { WorkspacePage, ExploreSection } from "./WorkspaceNavigation";

type Props = { lang: Lang; page: WorkspacePage; href: (page: WorkspacePage, lang: Lang, section?: ExploreSection | null) => string };
export default function WorkspaceHeader({ lang, page, href }: Props) {
  const [failed, setFailed] = useState(false);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = header.current;
    if (!element) return;
    const media = matchMedia("(min-width: 761px)");
    const measure = () => document.documentElement.style.setProperty("--workspace-header-height", `${media.matches ? element.getBoundingClientRect().height : 0}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    media.addEventListener("change", measure);
    measure();
    return () => { observer.disconnect(); media.removeEventListener("change", measure); document.documentElement.style.removeProperty("--workspace-header-height"); };
  }, []);
  const say = (en: string, ha: string) => translate(lang, en, ha);
  return <header className="dashboard-header" ref={header}><div className="dashboard-header-inner">
    <Link className="dashboard-brand" href={href("home", lang)} prefetch={false}><span className="brand-portrait" aria-hidden="true">{failed ? "MAI" : <Image onError={() => setFailed(true)} src={visualAssets.header.localPath} width={540} height={600} sizes="56px" alt="" />}</span><div>MOHAMMED ABBA ISA<small>{say("DISABILITY INCLUSION", "SHIGAR MASU NAKASA")}</small></div></Link>
    <nav className="dashboard-navigation" aria-label={say("Main navigation", "Babban kewayawa")}>
      {(["home", "explore", "chat", "about"] as const).map(target => <Link key={target} href={href(target, lang)} prefetch={false} aria-current={page === target ? "page" : page === "about/methodology" && target === "about" ? "location" : undefined}>{target === "home" ? say("Home", "Gida") : target === "explore" ? say("Explore", "Bincika") : target === "chat" ? say("Chat", "Tattauna") : say("About", "Game da shafin")}</Link>)}
    </nav>
    <LanguageChoice lang={lang} destinations={{ en: href(page, "en"), ha: href(page, "ha"), yo: href(page, "yo"), ig: href(page, "ig") }} />
  </div></header>;
}
