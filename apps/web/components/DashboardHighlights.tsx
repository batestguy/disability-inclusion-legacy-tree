"use client";

import type { DashboardPanelProps } from "./DashboardPanels";
import type { HighlightCategory } from "./DashboardSession";
import type { DashboardObservation } from "../lib/dashboard-data.mjs";
import type { ReactNode } from "react";
import "../app/highlights.css";

const marks = { exact: "", "greater-than": ">", "at-least": "≥", approximate: "≈" };
const bounds = {
  exact: ["Exactly", "Daidai"], "greater-than": ["More than", "Fiye da"],
  "at-least": ["At least", "Aƙalla"], approximate: ["About", "Kusan"],
};

export default function DashboardHighlights({ lang, bundle, view, titleFor, onFilter, category, onCategory, filterControls }: DashboardPanelProps & {
  category: HighlightCategory;
  onCategory: (category: HighlightCategory) => void;
  filterControls: ReactNode;
}) {
  const say = (en: string, ha: string) => lang === "ha" ? ha : en;
  const targets = view.observations.filter((entry) => entry.stage === "target").sort((a, b) => b.value - a.value);
  const achievements = view.observations.filter((entry) => entry.stage === "reported-delivery").sort((a, b) => b.value - a.value);
  const categories = [
    { id: "all" as const, label: say("All figures", "Dukkan lambobi"), count: view.observations.length },
    { id: "targets" as const, label: say("Planned targets", "Manufofin shiri"), count: targets.length },
    { id: "achievements" as const, label: say("Achievements", "Nasarori"), count: achievements.length },
  ];
  const unit = (value: string) => lang === "en" ? value : ({ people: "mutane", households: "gidaje", "job opportunities": "damar ayyukan yi" }[value] ?? value);
  const shortTitles: Record<string, [string, string]> = {
    "beyond-disability-coordination-2024": ["Beyond Disability", "Beyond Disability"],
    "northeast-food-support-target-2024": ["Northeast food support", "Tallafin abinci a Arewa maso Gabas"],
    "karu-food-cash-2024": ["Karu food & cash support", "Tallafin abinci da kuɗi a Karu"],
    "ramadan-food-2024": ["Ramadan food support", "Tallafin abincin Ramadan"],
    "ayubson-event-2025": ["Ayubson programme", "Shirin Ayubson"],
    "nigwed-skills-2024": ["NigWED women’s training", "Horon mata na NigWED"],
    "startup-support-march-2024": ["Startup support for women", "Tallafin fara sana’a ga mata"],
    "borno-employment-2024": ["Borno employment", "Samun aikin yi a Borno"],
    "inclusive-business-skills": ["SMEDAN enterprise training", "Horon kasuwanci na SMEDAN"],
    "fha-stalls-2025": ["FHA stall allotments", "Rabon rumfunan FHA"],
  };
  const activeFilters = [
    view.filters.year !== "all" ? view.filters.year : null,
    view.filters.category !== "all" ? view.categoryOptions.find((entry) => entry.id === view.filters.category)?.label[lang] : null,
    view.filters.activity !== "all" ? titleFor(view.filters.activity) : null,
  ].filter(Boolean);
  const yearLabel = view.filters.year === "all" ? `${view.years.at(0)}–${view.years.at(-1)}` : view.filters.year;
  const card = (observation: DashboardObservation, index: number) => {
    const target = observation.stage === "target";
    const sourceIds = observation.evidence.flatMap((entry) => entry.source_ids ?? (entry.source_id ? [entry.source_id] : []));
    const source = sourceIds.map((id) => bundle.sources.find((entry) => entry.id === id)).find(Boolean);
    const number = observation.value.toLocaleString(lang === "ha" ? "ha-NG" : "en-NG");
    const spoken = `${bounds[observation.bound][lang === "ha" ? 1 : 0]} ${number} ${unit(observation.unit)}`;
    return <article className={`highlight-card ${target ? "is-plan" : "is-achievement"}${target && index === 0 ? " is-lead" : ""}`} key={observation.id} data-highlight={observation.id} data-highlight-stage={observation.stage}>
      <div className="highlight-number-wrap">
        {target && index === 0 && <span className="highlight-spark" aria-hidden="true">✦</span>}
        <p className="highlight-number" role="img" aria-label={`${target ? say("Planned target", "Manufar shiri") : say("Reported figure", "Lambar rahoto")}: ${spoken}`}><span aria-hidden="true">{marks[observation.bound]}{number}</span></p>
        <p className="highlight-unit">{unit(observation.unit)}</p>
      </div>
      <h3>{shortTitles[observation.activity_id]?.[lang === "ha" ? 1 : 0] ?? titleFor(observation.activity_id)}</h3>
      <div className="highlight-card-footer">{source && <a href={source.url} target="_blank" rel="noopener noreferrer" title={source.title} aria-label={`${say("Source for", "Majiyar")} ${titleFor(observation.activity_id)} · ${say("opens a new tab", "yana buɗe sabon shafi")}`}>{say("Source", "Tushe")} <span aria-hidden="true">↗</span></a>}</div>
    </article>;
  };
  const groups = [
    { id: "targets", title: say("Planned targets", "Manufofin shiri"), items: targets },
    { id: "achievements", title: say("Achievements", "Nasarori"), items: achievements },
  ].filter((group) => category === "all" || category === group.id);
  return <section id="overview" className="kpi-showcase" tabIndex={-1} aria-labelledby="dashboard-title">
    <div className="highlight-heading"><h1 id="dashboard-title">{say("Work in numbers", "Ayyuka a cikin lambobi")}</h1><p className="highlight-edition">{yearLabel}{lang === "ha" && <><br /><span>Hausa na gwaji</span></>}</p></div>
    <div className="highlight-category-bar"><div role="group" aria-label={say("KPI categories", "Rukunonin lambobi")}>{categories.map((entry) => <button key={entry.id} type="button" aria-pressed={category === entry.id} data-highlight-category={entry.id} onClick={() => onCategory(entry.id)}>{entry.label} <span>{entry.count}</span></button>)}</div><details className="highlight-filter-disclosure"><summary>{say("Filters", "Tacewa")}{activeFilters.length > 0 && <span>{activeFilters.length}</span>}</summary>{filterControls}</details></div>
    {activeFilters.length > 0 && <div className="highlight-active-filters" aria-label={say("Current filters", "Tacewar yanzu")}><p>{activeFilters.join(" / ")}</p><button type="button" onClick={() => onFilter({ year: "all", category: "all", activity: "all" })}>{say("Clear", "Share")}</button></div>}
    <p className="sr-only" role="status">{say(`${groups.reduce((count, group) => count + group.items.length, 0)} figures shown`, `An nuna lambobi ${groups.reduce((count, group) => count + group.items.length, 0)}`)}</p>
    {groups.map((group) => <section className={`highlight-group is-${group.id}`} key={group.id} aria-labelledby={`highlight-${group.id}-title`}>
      <div className="highlight-group-heading"><h2 id={`highlight-${group.id}-title`}>{group.title}</h2></div>
      {group.items.length ? <div className="highlight-grid">{group.items.map(card)}</div> : <p className="highlight-empty">{say("No figures for this selection. Try another filter.", "Babu lambobi ga wannan zaɓi. Gwada wata tacewa.")}</p>}
    </section>)}
  </section>;
}
