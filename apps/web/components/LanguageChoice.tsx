import { Lang, home, t } from "../lib/content";
export default function LanguageChoice({
  lang,
  record,
  permanent = false,
}: {
  lang: Lang;
  record?: string | null;
  permanent?: boolean;
}) {
  const href = (target: Lang) =>
    record
      ? permanent
        ? `${home(target)}achievements/${record}/`
        : `${home(target)}#leaf=${record}`
      : home(target);
  return (
    <div
      className="language-choice"
      role="group"
      aria-label="Choose your language / Zabi yare"
    >
      <span className="language-prompt">
        <span aria-hidden="true">&#9678;</span>{" "}
        {t(lang, "Choose your language", "Zabi yaren karatu")}
      </span>
      <div className="language-options">
        <a
          href={href("en")}
          hrefLang="en"
          lang="en"
          aria-current={lang === "en" ? "page" : undefined}
        >
          English <span aria-hidden="true">{lang === "en" ? "✓" : ""}</span>
        </a>
        <a
          href={href("ha")}
          hrefLang="ha"
          lang="ha"
          aria-current={lang === "ha" ? "page" : undefined}
        >
          Hausa <span aria-hidden="true">{lang === "ha" ? "✓" : ""}</span>
        </a>
      </div>
    </div>
  );
}
