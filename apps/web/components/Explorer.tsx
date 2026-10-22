"use client";
import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import LanguageChoice from "./LanguageChoice";
import LegacyTree from "./LegacyTree";
import type { gsap } from "gsap";
import { Collection, Lang, branches, home, t } from "../lib/content";
import { Record } from "./Record";
import Preferences from "./Preferences";
export default function Explorer({
  lang,
  data,
}: {
  lang: Lang;
  data: Collection;
}) {
  const [branch, setBranch] = useState("all"),
    [year, setYear] = useState("all"),
    [search, setSearch] = useState(""),
    [selected, setSelected] = useState<string | null>(null);
  const tree = useRef<HTMLElement>(null),
    lastTrigger = useRef<HTMLElement | null>(null);
  const r = data.achievements.find((a) => a.slug === selected);
  const filtered = data.achievements.filter(
    (a) =>
      (branch === "all" || a.branch === branch) &&
      (year === "all" || a.date.startsWith(year)) &&
      `${a.title[lang]} ${a.description[lang]} ${a.role[lang]}`
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()),
  );
  useEffect(() => {
    const read = () => {
      const match = location.hash.match(/^#leaf=([a-z0-9-]+)$/);
      setSelected(match?.[1] || null);
    };
    read();
    window.addEventListener("popstate", read);
    window.addEventListener("hashchange", read);
    return () => {
      window.removeEventListener("popstate", read);
      window.removeEventListener("hashchange", read);
    };
  }, []);
  useEffect(() => {
    let context: gsap.Context | undefined,
      started = false,
      cancelled = false;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () =>
      media.matches ||
      document.documentElement.classList.contains("reduce-motion");
    const begin = () => {
      if (reduced()) {
        context?.revert();
        return;
      }
      if (started || window.scrollY < 100) return;
      started = true;
      void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
        ([{ gsap }, { ScrollTrigger }]) => {
          if (cancelled || reduced()) return;
          gsap.registerPlugin(ScrollTrigger);
          context = gsap.context(() => {
            gsap.from(".botanical", {
              opacity: 0.5,
              scale: 0.98,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: tree.current,
                start: "top 90%",
                once: true,
              },
            });
          }, tree);
        },
      );
    };
    window.addEventListener("scroll", begin, { passive: true });
    window.addEventListener("legacy-motion", begin);
    media.addEventListener("change", begin);
    return () => {
      cancelled = true;
      context?.revert();
      window.removeEventListener("scroll", begin);
      window.removeEventListener("legacy-motion", begin);
      media.removeEventListener("change", begin);
    };
  }, []);
  function open(slug: string, el: HTMLElement) {
    lastTrigger.current = el;
    history.pushState({ legacyLeaf: true }, "", `#leaf=${slug}`);
    setSelected(slug);
  }
  function close() {
    if (history.state?.legacyLeaf) history.back();
    else {
      history.replaceState(null, "", location.pathname);
      setSelected(null);
    }
  }
  return (
    <div lang={lang}>
      <a className="skip" href="#explore">
        {t(lang, "Skip to the tree", "Tsallaka zuwa bishiyar")}
      </a>
      <header className="topbar">
        <a className="brand" href={home(lang)}>
          <span className="brand-symbol">&#10035;</span>
          <span>
            THE LEGACY TREE<small>MOHAMMED ABBA ISA</small>
          </span>
        </a>
        <nav aria-label={t(lang, "Main navigation", "Babban kewayawa")}>
          <a href="#roots">{t(lang, "The roots", "Tushen")}</a>
          <a href="#about">{t(lang, "About the gift", "Game da kyautar")}</a>
          <LanguageChoice lang={lang} record={selected} />
        </nav>
      </header>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Mohammed Abba Isa",
            alumniOf: {
              "@type": "CollegeOrUniversity",
              name: "University of Maiduguri",
            },
            description:
              "Nigerian disability advocate; appointed a presidential aide in November 2023.",
          }).replace(/</g, "\\u003c"),
        }}
      />
      <main>
        <section className="intro intro-with-map">
          <p className="eyebrow">
            <span className="gold-dot" />{" "}
            {t(
              lang,
              "AN INDEPENDENT TRIBUTE · NIGERIA",
              "KYAUTA MAI ZAMAN KANTA · NAJERIYA",
            )}
          </p>
          <h1>
            {t(lang, "A life rooted in", "Rayuwa mai tushe a")}
            <br />
            <em>{t(lang, "possibility.", "damammaki.")}</em>
          </h1>
          <p>
            {t(lang, "Hon. Mohammed Abba Isa", "Hon. Mohammed Abba Isa")}
            <span>
              {t(
                lang,
                "An evolving record of advocacy, opportunity and inclusion.",
                "Tarihin fafutuka, damammaki da shigar kowa da ke ci gaba.",
              )}
            </span>
          </p>
          <a className="explore-link" href="#explore">
            {t(lang, "Explore the living legacy", "Binciki gadon aiki")}{" "}
            <span>&#8599;</span>
          </a>
        </section>
        <section
          ref={tree}
          className="tree-section"
          id="explore"
          aria-labelledby="tree-heading"
        >
          <div className="section-caption">
            <span>01 / {t(lang, "THE CANOPY", "RASSA")}</span>
            <h2 id="tree-heading">
              {t(
                lang,
                "Every branch, a path to inclusion.",
                "Kowane reshe, hanya ce ta shigar kowa.",
              )}
            </h2>
            <span>
              {t(
                lang,
                "Click a branch to reveal more branches.",
                "Zabi reshe. Gano labaransa.",
              )}
            </span>
          </div>
          <LegacyTree
            lang={lang}
            data={data}
            branch={branch}
            onBranch={setBranch}
            onOpen={open}
          />
          <div className="archive">
            <div className="archive-heading">
              <div>
                <p className="eyebrow">
                  {t(lang, "THE ACHIEVEMENT LEAVES", "GANYEN AYYUKA")}
                </p>
                <h2>
                  {branch === "all"
                    ? t(lang, "Stories on the branches", "Labarai a kan rassa")
                    : branches.find((b) => b.id === branch)?.[lang]}
                </h2>
              </div>
              <button
                className="text-link"
                onClick={() => {
                  setBranch("all");
                  setYear("all");
                  setSearch("");
                }}
              >
                {t(lang, "Show all stories", "Nuna duk labarai")} &#8599;
              </button>
            </div>
            <div className="filters">
              <label>
                {t(lang, "Search the record", "Nemo bayani")}
                <input
                  type="search"
                  placeholder={t(
                    lang,
                    "Try education or enterprise...",
                    "Nemo ilimi ko sana’a...",
                  )}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <label>
                {t(lang, "Branch", "Reshe")}
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                >
                  <option value="all">
                    {t(lang, "All branches", "Duk rassa")}
                  </option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b[lang]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t(lang, "Year", "Shekara")}
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="all">
                    {t(lang, "All years", "Duk shekaru")}
                  </option>
                  {Array.from(
                    new Set(data.achievements.map((a) => a.date.slice(0, 4))),
                  )
                    .sort()
                    .map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                </select>
              </label>
            </div>
            <p role="status" className="result-count">
              {filtered.length}{" "}
              {t(lang, "sourced stories", "labarai masu tushe")}
            </p>
            <div className="leaves">
              {filtered.map((a, i) => (
                <button
                  className={`leaf leaf-${a.branch}`}
                  key={a.slug}
                  data-slug={a.slug}
                  onClick={(e) => open(a.slug, e.currentTarget)}
                >
                  <span className="leaf-top">
                    <span>
                      {a.date.slice(0, 4)} /{" "}
                      {branches.find((b) => b.id === a.branch)?.[lang]}
                    </span>
                    <span className="leaf-icon">&#10087;</span>
                  </span>
                  <h3>{a.title[lang]}</h3>
                  <p>{a.description[lang]}</p>
                  <span className="leaf-bottom">
                    {t(
                      lang,
                      a.status,
                      (
                        {
                          advocacy: "Bayar da shawara",
                          announced: "Sanarwa",
                          reported: "An ruwaito",
                        } as { [key: string]: string }
                      )[a.status] || a.status,
                    )}
                    <span aria-hidden="true">&#8599;</span>
                  </span>
                  <span className="sr-only">
                    {" "}
                    {t(lang, "Open story", "Bude labari")} {i + 1}
                  </span>
                </button>
              ))}
            </div>
            {!filtered.length && (
              <div className="empty">
                <h3>
                  {t(
                    lang,
                    "No leaves on this path yet.",
                    "Babu labarai a wannan zabin tukuna.",
                  )}
                </h3>
                <p>
                  {t(
                    lang,
                    "Try another word, branch or year.",
                    "Gwada wata kalma, reshe ko shekara.",
                  )}
                </p>
              </div>
            )}
          </div>
        </section>
        <section id="roots" className="roots">
          <p className="eyebrow">02 / {t(lang, "THE ROOTS", "TUSHEN")}</p>
          <div className="roots-intro">
            <h2>
              {t(lang, "Before the branches,", "Kafin rassa,")}
              <br />
              <em>{t(lang, "the roots.", "akwai tushe.")}</em>
            </h2>
            <p>
              {t(
                lang,
                "An education in public service. A history of advocacy. The foundations of a commitment to equal opportunity.",
                "Ilimin hidimar jama’a da tarihin fafutuka sun zama tushe na sadaukarwa ga daidaiton damammaki.",
              )}
            </p>
          </div>
          <ol className="timeline">
            {data.timeline.map((m, i) => (
              <li key={i}>
                <span className="timeline-dot" />
                <p className="eyebrow">{m.date[lang]}</p>
                <h3>{m.title[lang]}</h3>
                <p>{m.description[lang]}</p>
                {m.sources.map((id) => {
                  const s = data.sources.find((s) => s.id === id);
                  return s ? (
                    <a className="source-note" key={id} href={s.url}>
                      {s.publisher} &#8599;
                    </a>
                  ) : null;
                })}
              </li>
            ))}
          </ol>
        </section>
        <section id="about" className="about">
          <div>
            <p className="eyebrow">
              03 / {t(lang, "ABOUT THIS GIFT", "GAME DA WANNAN KYAUTA")}
            </p>
            <h2>
              {t(lang, "A tribute with", "Kyauta mai")}
              <br />
              <em>{t(lang, "an open record.", "bayanan hujjoji.")}</em>
            </h2>
          </div>
          <div>
            <p>
              {t(
                lang,
                "Created independently to celebrate a commitment to disability inclusion, and to make the supporting record easier to explore. This project is not an official government website or an endorsement by Hon. Isa.",
                "An kirkiro wannan kyauta mai zaman kanta domin nuna ayyukan shigar masu nakasa da saukaka binciken hujjoji. Ba shafin gwamnati ba ne ko amincewar Hon. Isa.",
              )}
            </p>
            <p>
              {t(
                lang,
                "Each leaf separates documented actions, announcements and advocacy from measured outcomes. Office statements are labelled. The collection is selective and will grow as evidence is reviewed.",
                "Kowane bayani ya bambanta aiki, sanarwa da bayar da shawara daga sakamakon da aka auna. Ana nuna rahotannin ofishi. Za a kara bayanai bayan bita.",
              )}
            </p>
            {!data.settings.revealReady && (
              <p className="draft">
                {t(
                  lang,
                  "Preview edition. Portrait permission, Hausa review and release checks are pending.",
                  "Samfurin gwaji. Ana jiran izinin hoto, bitar Hausa da tantancewa kafin kaddamarwa.",
                )}
              </p>
            )}
            {lang === "ha" && !data.settings.haReviewed && (
              <p className="draft">Fassarar Hausa na jiran bitar mutum.</p>
            )}
            {data.settings.creator?.name && (
              <p>
                {data.settings.creator.name}
                {data.settings.creator.bio?.[lang] && (
                  <> · {data.settings.creator.bio[lang]}</>
                )}
                {data.settings.creator.url && (
                  <>
                    {" "}
                    ·{" "}
                    <a href={data.settings.creator.url}>
                      {t(lang, "About the creator", "Game da mai kirkira")}
                    </a>
                  </>
                )}
              </p>
            )}
            {data.settings.correctionEmail && (
              <a href={`mailto:${data.settings.correctionEmail}`}>
                {t(lang, "Suggest a correction", "Bayar da gyara")} &#8599;
              </a>
            )}
            {data.settings.portrait &&
              ["permission", "licensed", "public-domain"].includes(
                data.settings.portrait.rightsStatus,
              ) && (
                <small>
                  {data.settings.portrait.credit} ·{" "}
                  {data.settings.portrait.permission}
                </small>
              )}
          </div>
        </section>
      </main>
      <footer>
        <span>
          &#10035; MOHAMMED ABBA ISA <small>THE LEGACY TREE</small>
        </span>
        <a href="#about">{t(lang, "About this gift", "Game da kyautar")}</a>
        <a href="https://deerflow.tech" target="_blank" rel="noreferrer">
          Created By Deerflow
        </a>
      </footer>
      <Dialog.Root
        open={!!r}
        onOpenChange={(value) => {
          if (!value) close();
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="overlay" />
          <Dialog.Content
            className="story-panel dialog"
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              (
                lastTrigger.current ||
                document.querySelector<HTMLElement>(`[data-slug="${selected}"]`)
              )?.focus();
            }}
          >
            <Dialog.Title className="sr-only">{r?.title[lang]}</Dialog.Title>
            <Dialog.Description className="sr-only">
              {t(
                lang,
                "Sourced achievement detail",
                "Cikakken bayani da majiyoyi",
              )}
            </Dialog.Description>
            <Dialog.Close className="close">
              {t(lang, "Close story", "Rufe labari")} &#215;
            </Dialog.Close>
            {r && (
              <a
                className="panel-language"
                href={`${home(lang === "en" ? "ha" : "en")}#leaf=${r.slug}`}
                hrefLang={lang === "en" ? "ha" : "en"}
              >
                {lang === "en" ? "Hausa" : "English"} &#8599;
              </a>
            )}
            {r && <Record record={r} data={data} lang={lang} />}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Preferences lang={lang} />
    </div>
  );
}
