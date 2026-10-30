"use client";

import type { Presentation } from "./DashboardWorkspace";
import type { Lang } from "../lib/content";
import type { getChatData } from "../lib/chat-data";
import ContributionIllustration from "./ContributionIllustration";
import "../app/highlights.css";

type Props = Pick<ReturnType<typeof getChatData>, "bundle"> & { lang: Lang; data: Presentation; area: string; onArea: (id: string) => void };
const marks = { exact: "", "greater-than": ">", "at-least": "≥", approximate: "≈" };
const boundWords = { exact: ["Exactly", "Daidai"], "greater-than": ["More than", "Fiye da"], "at-least": ["At least", "Aƙalla"], approximate: ["About", "Kusan"] };
export default function DashboardHighlights({ lang, bundle, data, area, onArea }: Props) {
  const say = (en: string, ha: string) => lang === "ha" ? ha : en;
  const group = data.groups.find((entry) => entry.id === area) ?? data.groups[0];
  const figures = data.figures.filter((entry) => group.id === "all" || entry.groupIds.includes(group.id));
  const achievements = figures.filter((entry) => entry.stage !== "target").sort((a, b) => b.value - a.value);
  const plans = figures.filter((entry) => entry.stage === "target").sort((a, b) => b.value - a.value);
  const unit = (value: string) => lang === "en" ? value : ({ people: "mutane", households: "gidaje", "job opportunities": "damar ayyukan yi", vehicle: "abin hawa", toolkit: "kayan jagora", vehicles: "abin hawa", toolkits: "kayan jagora" }[value] ?? value);
  function card(figure: Presentation["figures"][number]) {
    const sources = figure.sourceIds.flatMap((id) => { const source = bundle.sources.find((entry) => entry.id === id); return source ? [source] : []; });
    const number = figure.value.toLocaleString(lang === "ha" ? "ha-NG" : "en-NG");
    const milestone = figure.kind === "milestone";
    return <article key={figure.id} className={`contribution-card${milestone ? " is-milestone" : ""}`} data-highlight={figure.id} data-highlight-stage={figure.stage}>
      <div className="contribution-card-top"><p className="highlight-number" role="img" aria-label={`${boundWords[figure.bound][lang === "ha" ? 1 : 0]} ${number} ${unit(figure.unit)}`}><span aria-hidden="true">{marks[figure.bound]}{number}</span></p><ContributionIllustration activityId={figure.activityId} unit={figure.unit} /></div>
      <p className="highlight-unit">{unit(figure.unit)}</p><h3>{figure.label[lang]}</h3>
      {milestone && <p className="milestone-context">{figure.activityId === "disability-readiness-toolkit-2025" ? say("Developed by Deaf-in-Tech & DataLead Africa; unveiled through his office.", "Deaf-in-Tech da DataLead Africa ne suka samar; ofishinsa ya ƙaddamar.") : say("Vehicle demonstrated; nationwide distribution remains proposed.", "An nuna abin hawa; rabawa a faɗin ƙasa manufa ce har yanzu.")}</p>}
      <details className="contribution-source" data-figure-source={figure.id}><summary aria-label={`${say("Source for", "Majiyar")} ${figure.label[lang]}`}>{say("Source", "Tushe")}</summary><div className="figure-source-context"><dl><dt>{say("Population / scope", "Mutane ko abin da lambar ta shafa")}</dt><dd lang="en">{figure.population}</dd><dt>{say("Reported role", "Rawar da aka ruwaito")}</dt><dd lang="en">{figure.role}</dd></dl>{figure.limitations.map((limit) => <p key={limit} lang="en">{limit}</p>)}{sources.map((source, index) => <a key={source.id} className={index === 0 ? "primary-source" : undefined} href={source.url} target="_blank" rel="noopener noreferrer">{index === 0 ? say("Read original report", "Karanta rahoton asali") : say("Supporting report", "Rahoton ƙarin hujja")} <span aria-hidden="true">↗</span></a>)}</div></details>
    </article>;
  }
  return <section id="overview" className="contribution-section" tabIndex={-1} aria-labelledby="contributions-heading">
    <div className="section-heading inclusion-heading"><div><p className="dashboard-eyebrow">I. {say("Contribution in figures", "Gudummawa a cikin lambobi")}</p><h2 id="contributions-heading">{say("Inclusion takes", "Shigar kowa tana da")} <span>{say("many forms.", "hanyoyi da yawa.")}</span></h2></div></div>
    <div className="contribution-layout"><nav className="contribution-categories" aria-label={say("Contribution categories", "Rukunonin gudummawa")}>{data.groups.map((entry) => <button key={entry.id} type="button" data-area={entry.id} aria-pressed={group.id === entry.id} onClick={() => onArea(entry.id)}>{entry.label[lang]}<span aria-hidden="true">↗</span></button>)}</nav>
      <div className="contribution-results" data-area-panel={group.id} aria-live="polite" aria-atomic="false"><h3 className="active-area-heading">{group.label[lang]}</h3><p className="sr-only" role="status">{say(`${figures.length} sourced figures shown`, `An nuna lambobi ${figures.length} masu tushe`)}</p>
        {achievements.length > 0 && <section aria-labelledby="reported-heading"><h4 id="reported-heading" className="figure-group-title">{say("Reported achievements", "Nasarorin da aka ruwaito")}</h4><div className="contribution-grid">{achievements.map(card)}</div></section>}
        {plans.length > 0 && <section className="planned-support" aria-labelledby="planned-heading"><h4 id="planned-heading" className="figure-group-title">{say("Planned support", "Tallafin da aka tsara")}</h4><div className="contribution-grid">{plans.map(card)}</div></section>}
        {!figures.length && <p className="dashboard-empty">{say("No numerical figures are recorded for this selection.", "Ba a rubuta lambobi ga wannan zaɓi ba.")}</p>}
      </div>
    </div>
  </section>;
}
