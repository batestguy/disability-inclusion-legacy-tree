import art from "../../../content/tree-art.json";
import { Lang, t } from "../lib/content";
export default function TreeCredit({ lang }: { lang: Lang }) {
  return (
    <aside className="tree-credit" aria-labelledby="tree-credit-title">
      <div>
        <p className="eyebrow">
          {t(
            lang,
            "THE TREE BEHIND THE TRIBUTE",
            "BISHIYAR DA TA BA DA RA AYI",
          )}
        </p>
        <h3 id="tree-credit-title">
          {t(lang, "Rooted in Yobe.", "Tushen Yobe.")}
        </h3>
        <p>
          {t(
            lang,
            "Inspired by a baobab (kuka) photographed in Danchuwa, Yobe, as described by its photographer. A regional artistic reference; his exact hometown and personal connection to this tree remain unverified.",
            "An samo ra ayi daga hoton bishiyar kuka a Danchuwa, Yobe, a bayanin mai daukar hoton. Wannan wakilcin yankin ne; ba a tabbatar da garinsa ko dangantakarsa da wannan bishiya ba.",
          )}
        </p>
      </div>
      <div className="tree-credit-source">
        <p>
          {t(lang, "Original photograph", "Hoton asali")}:{" "}
          <a href={art.sourceUrl}>{art.sourceTitle}</a> {t(lang, "by", "na")}{" "}
          <a href={art.authorUrl}>{art.author}</a>.
        </p>
        <p>
          {t(
            lang,
            "AI-adapted: colour restored, background removed, crown and base artistically completed.",
            "An inganta da AI: an dawo da launuka, an cire bango, an cika rassa da gindin bishiya a fasaha.",
          )}
        </p>
        <p>
          <a href={art.licenseUrl}>{art.license}</a> &middot;{" "}
          <a href={art.asset} download>
            {t(lang, "Download adapted artwork", "Sauke hoton da aka inganta")}
          </a>{" "}
          &middot;{" "}
          <a href="/tree-art-license.txt">
            {t(
              lang,
              "Credit and change notice",
              "Bayani kan hakki da sauye sauye",
            )}
          </a>
        </p>
      </div>
    </aside>
  );
}
