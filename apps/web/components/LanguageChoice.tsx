import Link from "next/link";
import { Lang, home } from "../lib/content";
export default function LanguageChoice({
  lang,
  record,
  permanent = false,
  destinations,
}: {
  lang: Lang;
  record?: string | null;
  permanent?: boolean;
  destinations?: { en: string; ha: string };
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
      aria-label="Change language / Canja harshe"
    >
      <span className="language-prompt">
        <span aria-hidden="true">&#9678;</span> Change language / Canja harshe
      </span>
      <div className="language-options">
        <Link
          prefetch={false}
          href={href("en")}
          hrefLang="en"
          lang="en"
          aria-current={lang === "en" ? "page" : undefined}
        >
          English <span aria-hidden="true">{lang === "en" ? "✓" : ""}</span>
        </Link>
        <Link
          prefetch={false}
          href={href("ha")}
          hrefLang="ha"
          lang="ha"
          aria-current={lang === "ha" ? "page" : undefined}
        >
          Hausa <span aria-hidden="true">{lang === "ha" ? "✓" : ""}</span>
        </Link>
      </div>
    </div>
  );
}
