"use client";
import { translate } from "../lib/locales.mjs";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import visualAssets from "../../../content/dashboard-visual-assets.json";
import portrait from "../../../content/dashboard-portrait.json";
import type { Lang } from "../lib/content";
import { localizeText } from "../lib/locales.mjs";
import Link from "next/link";
import biography from "../../../content/about.json";
import SolarSystem from "./SolarSystem";
import type { PresentationConcept } from "../lib/dashboard-presentation.mjs";
import landingCopy from "../../../content/landing-interactions.json";

export default function OpeningPortrait({ lang, biographyHref, active, suspended, terms, planets }: { lang: Lang; biographyHref?: string; active: boolean; suspended: boolean; terms: PresentationConcept[]; planets: ReactNode }) {
  const [failed, setFailed] = useState(false);
  const say = (en: string, ha: string) => translate(lang, en, ha);
  const quote = localizeText({ en: portrait.quote_excerpt, ha: portrait.hausa_translation });
  return (<section className="dashboard-opening" aria-labelledby="dashboard-title">
        <div><p className="inclusion-statement">{landingCopy.statement[lang]}</p><h1 id="dashboard-title">{landingCopy.title[lang]}</h1><p className="dashboard-subtitle">{landingCopy.subtitle[lang]}</p></div>

        <figure className="opening-portrait"><SolarSystem lang={lang} active={active} suspended={suspended} terms={terms} planets={planets}>{failed ? <div className="portrait-fallback" role="img" aria-label={say("Portrait unavailable: Mohammed Abba Isa", "Hoton Mohammed Abba Isa bai samu ba")}>MOHAMMED ABBA ISA</div> : <Image onError={() => setFailed(true)} src={visualAssets.hero.localPath} width={visualAssets.hero.width} height={visualAssets.hero.height} sizes="(max-width: 500px) 34vw, (max-width: 700px) 140px, (max-width: 1000px) 220px, 360px" alt={say("Mohammed Abba Isa seated in his wheelchair, smiling with his hands in his lap", "Mohammed Abba Isa zaune a keken guragu yana murmushi, hannayensa a cinyarsa")} preload />}</SolarSystem><figcaption><blockquote lang={lang}>“{quote[lang]}”</blockquote>{lang !== "en" && <><details className="quote-original"><summary>{say("Original English quote", "Asalin magana a Turanci")}</summary><p lang="en">{portrait.quote_excerpt}</p></details></>}<span>— Mohammed Abba Isa</span><div className="portrait-source-links"><a href={portrait.source_page} target="_blank" rel="noopener noreferrer">{say("Quote source", "Tushen magana")} ↗</a><a href={visualAssets.hero.sourcePage} target="_blank" rel="noopener noreferrer">{say("Portrait source", "Tushen hoto")} ↗</a></div></figcaption></figure>
        <div className="home-biography-intro"><p>{biography.homeIntro[lang]}</p>{biographyHref && <Link href={biographyHref} prefetch={false}>{say("Read his biography", "Karanta tarihinsa")} ↗</Link>}</div>
      </section>);
}
