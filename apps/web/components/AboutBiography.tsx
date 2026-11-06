"use client";

import { useState } from "react";
import Image from "next/image";
import copy from "../../../content/about.json";
import assets from "../../../content/about-assets.json";
import { translate } from "../lib/locales.mjs";
import type { Lang } from "../lib/content";

const sources = [
  ["State House", "https://statehouse.gov.ng/president-tinubu-appoints-presidential-aide-on-disability-matters/"],
  ["TheCable · 2025", "https://www.thecable.ng/interview-fg-working-to-develop-a-centralised-database-of-pwds-says-mohammed-isa/"],
  ["TheCable · 2024", "https://www.thecable.ng/tinubu-committed-to-inclusive-education-for-pwds-says-aide/"],
  ["SMEDAN", "https://peoplesdaily.ng/tinubu-aideabba-facilitates-empowerment-program-for-pwds/"],
];

function Photograph({ id, lang, alt, caption }: { id: keyof typeof assets.assets; lang: Lang; alt: string; caption: string }) {
  const [failed, setFailed] = useState(false);
  const asset = assets.assets[id];
  return <figure className={`biography-photo biography-photo-${id}`} data-biography-photo={id}>
    {failed ? <div className="biography-photo-fallback" role="img" aria-label={alt}>{translate(lang, "Photo unavailable", "Hoto bai samu ba")}</div> :
      <Image src={asset.localPath} width={asset.width} height={asset.height} sizes={id === "ceremony" ? "(max-width: 1040px) 90vw, 880px" : id === "education" || id === "speaking" ? "(max-width: 700px) 85vw, 360px" : id === "creator" ? "(max-width: 700px) 156px, 168px" : "(max-width: 700px) 80vw, 300px"} alt={alt} onError={() => setFailed(true)} />}
    <figcaption><span>{caption}</span><a href={asset.sourcePage} target="_blank" rel="noopener noreferrer">{id === "creator" ? "GitHub" : translate(lang, "Photograph source", "Tushen hoto")} ↗</a></figcaption>
  </figure>;
}

export default function AboutBiography({ lang }: { lang: Lang }) {
  const say = (en: string, ha: string) => translate(lang, en, ha);
  return <>
    <section className="biography-subject" aria-labelledby="subject-biography-title">
      <div className="biography-layout">
        <Photograph id="subjectPortrait" lang={lang} alt={copy.subjectPortraitAlt[lang]} caption={copy.subjectPortraitCaption[lang]} />
        <div className="biography-prose"><h2 id="subject-biography-title">Mohammed Abba Isa</h2>
          {copy.subjectParagraphs.map((paragraph, index) => <p key={index}>{paragraph[lang]}</p>)}
          <nav className="biography-sources" aria-label={say("Sources for this biography", "Majiyoyin wannan tarihin")}>
            {sources.map(([label, url]) => <a key={url} href={url} target="_blank" rel="noopener noreferrer" lang="en">{label} ↗</a>)}
          </nav>
        </div>
      </div>
      <Photograph id="ceremony" lang={lang} alt={copy.ceremonyAlt[lang]} caption={copy.ceremonyCaption[lang]} />
      <div className="biography-chapters">
        {copy.subjectSections.map(section => <section key={section.id} className={`biography-chapter${section.image ? " has-photo" : ""}`} aria-labelledby={`biography-${section.id}`}>
          <div className="biography-prose">
            <h3 id={`biography-${section.id}`}>{section.title[lang]}</h3>
            <p>{section.text[lang]}</p>
            <a className="biography-chapter-source" href={section.sourceUrl} target="_blank" rel="noopener noreferrer" lang="en">{section.sourceLabel} ↗</a>
          </div>
          {(section.image === "speaking" || section.image === "education") && <Photograph id={section.image} lang={lang} alt={copy.documentaryPhotos[section.image].alt[lang]} caption={copy.documentaryPhotos[section.image].caption[lang]} />}
        </section>)}
      </div>
    </section>
    <section className="biography-creator" aria-labelledby="creator-biography-title">
      <h2 id="creator-biography-title" className="calligraphy-title">{say("About the creator", "Game da wanda ya ƙirƙira shafin")}</h2>
      <div className="biography-layout">
        <Photograph id="creator" lang={lang} alt={copy.creatorPortraitAlt[lang]} caption={copy.creatorPortraitCaption[lang]} />
        <div className="biography-prose"><h3>Jerry Zachary Bannister</h3>
          <address className="creator-contact"><a href="tel:+2347061674831">07061674831</a><a href="mailto:jzbannister@atbu.edu.ng">jzbannister@atbu.edu.ng</a></address>
          {copy.creatorParagraphs.map((paragraph, index) => <p key={index}>{paragraph[lang]}</p>)}
          <a className="creator-work-link" href="https://github.com/batestguy" target="_blank" rel="noopener noreferrer">{say("View Jerry’s work on GitHub", "Duba ayyukan Jerry a GitHub")} ↗</a>
        </div>
      </div>
    </section>
  </>;
}
