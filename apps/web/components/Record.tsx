import { Achievement, Collection, Lang, recordUrl, t } from "../lib/content";
export function Record({
  record: r,
  data,
  lang,
}: {
  record: Achievement;
  data: Collection;
  lang: Lang;
}) {
  return (
    <article className="record-content">
      <p className="eyebrow">
        {r.date} ·{" "}
        {t(
          lang,
          r.status,
          (
            {
              advocacy: "Bayar da shawara",
              announced: "Sanarwa",
              reported: "An ruwaito",
            } as Record<string, string>
          )[r.status] || r.status,
        )}
      </p>
      <h2>{r.title[lang]}</h2>
      <p className="lede">{r.description[lang]}</p>
      <h3>{t(lang, "His documented role", "Matsayinsa a rahoto")}</h3>
      <p>{r.role[lang]}</p>
      <div className="evidence">
        <h3>
          {t(
            lang,
            "What the evidence establishes",
            "Abin da hujjoji suka tabbatar",
          )}
        </h3>
        <p>{r.evidenceLimits[lang]}</p>
      </div>
      <h3>{t(lang, "Follow the sources", "Duba majiyoyi")}</h3>
      <ol className="sources">
        {r.sources.map((id) => {
          const s = data.sources.find((x) => x.id === id);
          return s ? (
            <li key={id}>
              <a href={s.url}>{s.title} &#8599;</a>
              <small>
                {s.publisher} · {s.type} · {s.date}
                <br />
                {t(lang, "Accessed", "An duba")} {s.accessed}
              </small>
            </li>
          ) : null;
        })}
      </ol>
      <a className="text-link" href={recordUrl(lang, r.slug)}>
        {t(
          lang,
          "Permanent record & citation",
          "Shafin dindindin da manazarta",
        )}{" "}
        &#8599;
      </a>
    </article>
  );
}
