"use client";

import { useEffect } from "react";
import Link from "next/link";
import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceFooter from "./WorkspaceFooter";
import { useWorkspaceNavigation } from "./WorkspaceNavigation";
import { methodology, modelSettings } from "../lib/methodology";
import type { getChatData } from "../lib/chat-data";
import type { Lang } from "../lib/content";
import "../app/dashboard.css";
import "../app/presentation.css";
import "../app/about.css";

export default function AboutWorkspace({ lang, bundle, methods = false }: ReturnType<typeof getChatData> & { lang: Lang; methods?: boolean }) {
  const page = methods ? "about/methodology" : "about";
  const { href } = useWorkspaceNavigation(bundle, page);
  const say = (en: string, ha: string) => lang === "ha" ? ha : en;
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  return <div className="dashboard-shell dashboard-redesign about-workspace" lang={lang}>
    <a className="skip" href="#about-main">{say("Skip to content", "Tsallaka zuwa abun ciki")}</a>
    <WorkspaceHeader lang={lang} page={page} href={href} />
    <main id="about-main" className="dashboard-main about-main" tabIndex={-1}>
      <nav className="about-subnav" aria-label={say("About navigation", "Kewayawar bayanin shafi")}>
        <Link href={href("about", lang)} prefetch={false} aria-current={!methods ? "page" : undefined}>{say("About", "Game da shafin")}</Link>
        <span aria-hidden="true">/</span>
        <Link href={href("about/methodology", lang)} prefetch={false} aria-current={methods ? "page" : undefined}>{say("Methodology", "Hanyar bincike")}</Link>
      </nav>
      <article className="about-article">
        <header className="about-intro">
          <p className="dashboard-eyebrow">{say("ABOUT THE PROJECT", "GAME DA AIKIN")}</p>
          <h1 className="calligraphy-title">{methods ? say("Methodology", "Hanyar bincike") : say("About this project", "Game da wannan aiki")}</h1>
          <p className="about-lead">{methods ? say("From source reports to readable text, themes and evidence you can explore.", "Daga rahotannin tushe zuwa rubutu, jigogi da shaidar da za ku bincika.") : say("An independent, sourced tribute exploring Mohammed Abba Isa’s documented work in disability inclusion.", "Shafi mai zaman kansa da ke amfani da tushe don bincika ayyukan Mohammed Abba Isa da aka rubuta kan shigar masu nakasa.")}</p>
          {lang === "ha" && <p className="about-draft">Hausa na gwaji · {say("Draft translation; human Hausa review pending.", "Fassarar daftari ce; dubawar ɗan Adam kan Hausa tana jiran kammalawa.")}</p>}
        </header>
        {methods ? <>
          <ol className="methodology-steps">{methodology.map((step, index) => <li key={step.title.en}>
            <span className="methodology-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <section aria-labelledby={`method-${index}`}><h2 id={`method-${index}`}>{step.title[lang]}</h2><p>{step.text[lang]}</p></section>
          </li>)}</ol>
          <details className="methodology-settings"><summary>{say("Technical settings and implementation records", "Saitunan fasaha da bayanan aiwatarwa")}</summary>
            <p>{say("Settings for the selected English-text model. Technical parameter names are retained in English.", "Saitunan tsarin nazarin zaɓaɓɓun rubutun Turanci. An bar sunayen saitunan fasaha da Turanci.")}</p>
            <dl lang="en">{modelSettings.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            <p>{say("Inspect the implementation and saved methodology records:", "Duba yadda aka aiwatar da bayanan hanyar bincike da aka adana:")}</p>
            <ul>{[
              ["scripts/collect-office-evidence.py", say("Source collection and HTML extraction", "Tattara tushe da fitar da HTML")],
              ["scripts/prepare-analysis.py", say("Text preparation and TF-IDF/NMF", "Shirya rubutu da TF-IDF/NMF")],
              ["scripts/extract-dashboard-concepts.mjs", say("Word-cloud phrase counts", "Ƙirgar jimlolin girgijen kalmomi")],
              ["docs/PHASE2_FINDINGS.md", say("Selected analysis and its limitations", "Zaɓaɓɓen nazari da iyakokinsa")],
            ].map(([path, label]) => <li key={path}><a href={`https://github.com/batestguy/disability-inclusion-legacy-tree/blob/main/${path}`}>{label}</a></li>)}</ul>
          </details>
        </> : <section className="about-overview">
          <h2>{say("A record you can question", "Bayanan da za ku iya tambaya a kai")}</h2>
          <p>{say("Explore brings together reported figures, contribution areas, recurring concepts and documented connections. Chat offers a guided path to the supporting records. The selection is not a complete career history, and an office report is not independent verification of delivery or impact.", "Bincika yana haɗa lambobin da aka ruwaito, fannonin gudummawa, ra’ayoyi masu maimaituwa da alaƙoƙin da aka rubuta. Tattauna yana ba da hanyar jagora zuwa bayanan tushe. Zaɓin ba cikakken tarihin aiki ba ne, kuma rahoton ofishi ba tabbatarwa mai zaman kanta kan aiwatarwa ko tasiri ba ne.")}</p>
          <Link className="about-method-link" href={href("about/methodology", lang)} prefetch={false}><span><strong>{say("Read the methodology", "Karanta hanyar bincike")}</strong><small>{say("Collection, text preparation, NLP, categories and the word cloud", "Tattara bayanai, shirya rubutu, NLP, rukunoni da girgijen kalmomi")}</small></span><span aria-hidden="true">↗</span></Link>
        </section>}
      </article>
    </main>
    <WorkspaceFooter lang={lang} />
  </div>;
}
