"use client";
import { translate } from "../lib/locales.mjs";

import { useEffect } from "react";
import Link from "next/link";
import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceFooter from "./WorkspaceFooter";
import AboutBiography from "./AboutBiography";
import workflow from "../../../content/methodology-workflow.json";
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
  const say = (en: string, ha: string) => translate(lang, en, ha);
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
          <h1 className="calligraphy-title">{methods ? say("Methodology", "Hanyar bincike") : say("About Mohammed Abba Isa", "Game da Mohammed Abba Isa")}</h1>
          {methods && <p className="about-lead">{say("From source reports to readable text, themes and evidence you can explore.", "Daga rahotannin tushe zuwa rubutu, jigogi da shaidar da za ku bincika.")}</p>}
        </header>
        {methods ? <>
          <ol className="methodology-steps">{methodology.map((step, index) => <li key={step.title.en}>
            <span className="methodology-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <section aria-labelledby={`method-${index}`}><h2 id={`method-${index}`}>{step.title[lang]}</h2><p>{step.text[lang]}</p></section>
          </li>)}</ol>
          <section className="methodology-workflow" aria-labelledby="workflow-title">
            <h2 id="workflow-title">{workflow.title[lang]}</h2>
            {workflow.paragraphs.map((paragraph, index) => <p key={index}>{paragraph[lang]}</p>)}
          </section>
          <details className="methodology-settings"><summary>{say("Technical settings", "Saitunan fasaha")}</summary>
            <p>{say("Settings for the selected English-text model. Technical parameter names are retained in English.", "Saitunan tsarin nazarin zaɓaɓɓun rubutun Turanci. An bar sunayen saitunan fasaha da Turanci.")}</p>
            <dl lang="en">{modelSettings.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          </details>
          <section className="methodology-records" aria-labelledby="methodology-records-title">
            <h2 id="methodology-records-title">{say("Sources and implementation", "Tushe da aiwatarwa")}</h2>
            <p>{say("Inspect the implementation and saved methodology records:", "Duba yadda aka aiwatar da bayanan hanyar bincike da aka adana:")}</p>
            <ul>{[
              ["scripts/collect-office-evidence.py", say("Source collection and HTML extraction", "Tattara tushe da fitar da HTML")],
              ["scripts/prepare-analysis.py", say("Text preparation and TF-IDF/NMF", "Shirya rubutu da TF-IDF/NMF")],
              ["scripts/extract-dashboard-concepts.mjs", say("Word-cloud phrase counts", "Ƙirgar jimlolin girgijen kalmomi")],
              ["docs/PHASE2_FINDINGS.md", say("Selected analysis and its limitations", "Zaɓaɓɓen nazari da iyakokinsa")],
            ].map(([path, label]) => <li key={path}><a href={`https://github.com/batestguy/disability-inclusion-legacy-tree/blob/main/${path}`}>{label}</a></li>)}</ul>
          </section>
        </> : <>
          <AboutBiography lang={lang} />
          <Link className="about-method-link" href={href("about/methodology", lang)} prefetch={false}><span><strong>{say("Read the methodology", "Karanta hanyar bincike")}</strong><small>{say("Collection, text preparation, NLP, categories and the word cloud", "Tattara bayanai, shirya rubutu, NLP, rukunoni da girgijen kalmomi")}</small></span><span aria-hidden="true">↗</span></Link>
        </>}
      </article>
    </main>
    <WorkspaceFooter lang={lang} />
  </div>;
}
