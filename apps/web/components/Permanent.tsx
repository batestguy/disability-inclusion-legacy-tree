import { Collection, Lang, home, t } from "../lib/content";
import { Record } from "./Record";
import Preferences from "./Preferences";
import LanguageChoice from "./LanguageChoice";
export default function Permanent({
  slug,
  lang,
  data,
}: {
  slug: string;
  lang: Lang;
  data: Collection;
}) {
  const r = data.achievements.find((a) => a.slug === slug)!;
  return (
    <div lang={lang}>
      <a className="skip" href="#record">
        {t(lang, "Skip to record", "Tsallaka zuwa bayani")}
      </a>
      <header className="topbar">
        <a className="brand" href={home(lang)}>
          &#10035; <span>THE LEGACY TREE</span>
        </a>
        <LanguageChoice lang={lang} record={slug} permanent />
      </header>
      <main id="record" className="permanent">
        <a href={`${home(lang)}#leaf=${slug}`}>
          &#8592; {t(lang, "Return to the tree", "Koma bishiyar")}
        </a>
        {lang === "ha" && !r.haReviewed && (
          <p className="draft">Fassarar Hausa na jiran bitar mutum.</p>
        )}
        <h1>{t(lang, "A record of inclusion", "Bayanan shigar kowa")}</h1>
        <Record record={r} data={data} lang={lang} />
        <aside className="citation">
          <h2>
            {t(lang, "Cite this record", "Yadda za a ambaci wannan bayani")}
          </h2>
          <p>
            Mohammed Abba Isa Legacy Tree. &ldquo;{r.title[lang]}.&rdquo;{" "}
            {r.date}.{" "}
            {t(
              lang,
              "Independent tribute; consult the original sources above.",
              "Kyauta mai zaman kanta; a duba majiyoyin asali a sama.",
            )}
          </p>
        </aside>
      </main>
      <Preferences lang={lang} />
    </div>
  );
}
