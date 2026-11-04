import Link from "next/link";
import { Lang, home } from "../lib/content";
import { languages } from "../lib/locales.mjs";
export default function LanguageChoice({
  lang,
  record,
  permanent = false,
  destinations,
}: {
  lang: Lang;
  record?: string | null;
  permanent?: boolean;
  destinations?: Record<Lang, string>;
}) {
  const href = (target: Lang) =>
    destinations
      ? destinations[target]
      : record
        ? permanent
          ? `${home(target)}achievements/${record}/`
          : `${home(target)}#leaf=${record}`
        : home(target);
  return (
    <div
      className="language-choice"
      role="group"
      aria-label="Change language / Canja harshe / Yí èdè padà / Gbanwee asụsụ"
    >
      <span className="language-prompt">
        <span className="language-prompt-icon" aria-hidden="true">&#9678;</span>{" "}
        <span lang="en">Change language</span> / <span lang="ha">Canja harshe</span> / <span lang="yo">Yí èdè padà</span> / <span lang="ig">Gbanwee asụsụ</span>
      </span>
      <div className="language-options">
        {languages.map(({ code, label }) => <Link
          key={code}
          scroll={false}
          prefetch={false}
          href={href(code)}
          hrefLang={code}
          lang={code}
          aria-current={lang === code ? "page" : undefined}
        >
          {label} <span aria-hidden="true">{lang === code ? "✓" : ""}</span>
        </Link>)}
      </div>
    </div>
  );
}
