"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import type { Presentation } from "./DashboardWorkspace";
import type { Lang } from "../lib/content";
import type { getChatData } from "../lib/chat-data";
import speakingPhoto from "../../../content/dashboard-speaking-photo.json";

type Props = Pick<ReturnType<typeof getChatData>, "bundle"> & { lang: Lang; data: Presentation; mode: "areas" | "concepts"; selectedId: string | null; onSelect: (id: string | null) => void; onMode: (mode: "areas" | "concepts") => void; onAsk: (id: string) => void };
type Match = { id: string; title: string; url: string; text?: string; activityId?: string };
function SourceMatches({ matches, lang, onAsk }: { matches: Match[]; lang: Lang; onAsk: Props["onAsk"] }) {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(matches.length / 3);
  const say = (en: string, ha: string) => lang === "ha" ? ha : en;
  return <><ul className="cloud-matches">{matches.slice(page * 3, page * 3 + 3).map((match) => <li key={match.id} data-source-match={match.id}><a href={match.url} target="_blank" rel="noopener noreferrer" lang="en">{match.title} <span aria-hidden="true">↗</span></a>{match.text && <p className="source-excerpt" lang="en">{match.text}</p>}{match.activityId && <button className="text-action" type="button" onClick={() => onAsk(match.activityId!)}>{say("Explore this activity", "Bincika wannan aiki")} <span aria-hidden="true">↗</span></button>}</li>)}</ul>{pages > 1 && <nav className="local-pagination" aria-label={say("Matching report pages", "Shafukan rahotannin da suka dace")}><button type="button" disabled={page === 0} onClick={() => setPage(page - 1)}>{say("Previous", "Na baya")}</button><span>{page + 1} / {pages}</span><button type="button" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>{say("More reports", "Ƙarin rahotanni")}</button></nav>}</>;
}

export default function DashboardAdvocacy({ lang, bundle, data, mode, selectedId, onSelect, onMode, onAsk }: Props) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const say = (en: string, ha: string) => lang === "ha" ? ha : en;
  const entries = mode === "concepts" ? data.concepts.map((entry) => ({ id: entry.id, label: entry.label[lang], count: entry.count })) : bundle.categories.map((category) => ({ id: category.id, label: category.label[lang] ?? category.label.en, count: bundle.activities.filter((activity) => activity.categories.includes(category.id)).length }));
  const maximum = Math.max(1, ...entries.map((entry) => entry.count));
  const minimum = Math.min(maximum, ...entries.map((entry) => entry.count));
  const frequencyRange = maximum - minimum;
  const selected = entries.find((entry) => entry.id === selectedId);
  const concept = mode === "concepts" ? data.concepts.find((entry) => entry.id === selectedId) : undefined;
  const matches: Match[] = concept ? concept.excerpts.flatMap((excerpt) => {
    const source = bundle.sources.find((entry) => entry.id === excerpt.sourceId);
    return source ? [{ id: source.id, title: source.title, url: source.url, text: excerpt.text }] : [];
  }) : mode === "areas" && selected ? bundle.activities.filter((activity) => activity.categories.includes(selected.id)).flatMap((activity) => {
    const source = bundle.sources.find((entry) => entry.id === activity.source_ids[0]);
    return source ? [{ id: activity.id, title: activity.title.en, url: source.url, activityId: activity.id }] : [];
  }) : [];

  return <section id="advocacy" className="dashboard-section advocacy-section" tabIndex={-1} aria-labelledby="advocacy-title">
    <div className="section-heading"><div><p className="dashboard-eyebrow">02 / {say("IDEAS & ADVOCACY", "RA’AYOYI DA KIRA")}</p><h2 id="advocacy-title">{say("A voice for inclusion.", "Murya domin shigar kowa.")}</h2></div><p>{say("Explore the ideas that appear across the selected reports.", "Bincika ra’ayoyin da suka bayyana a zaɓaɓɓun rahotanni.")}</p></div>
    <div className="advocacy-composition"><figure className="speaking-portrait">{!photoFailed ? <Image src="/branding/mohammed-abba-isa-speaking.webp" width={600} height={800} sizes="(max-width: 700px) 90vw, 32vw" alt={speakingPhoto.alt[lang]} onError={() => setPhotoFailed(true)} /> : <div className="photo-fallback"><span aria-hidden="true">MI</span><p>{say("Mohammed Abba Isa", "Mohammed Abba Isa")}</p></div>}<figcaption><span>{say("Mohammed Abba Isa", "Mohammed Abba Isa")}</span><a href={speakingPhoto.source_page} target="_blank" rel="noopener noreferrer">{say("Photograph source", "Tushen hoto")} <span aria-hidden="true">↗</span></a></figcaption></figure>
      <div className="speech-panel"><div className="segmented-controls" role="group" aria-label={say("Explore report themes", "Bincika jigogin rahotanni")}><button type="button" aria-pressed={mode === "areas"} data-cloud-mode="areas" onClick={() => onMode("areas")}>{say("Contribution areas", "Fannonin gudummawa")}</button><button type="button" aria-pressed={mode === "concepts"} data-cloud-mode="concepts" onClick={() => onMode("concepts")}>{say("Concepts in reports", "Ra’ayoyi a rahotanni")}</button></div>
        <p className="cloud-caption">{mode === "concepts" ? say("Concepts from the selected reports", "Ra’ayoyi daga zaɓaɓɓun rahotanni") : say("Contribution areas in the selected record", "Fannonin gudummawa a zaɓaɓɓun bayanai")}</p>
        <div className="concept-cloud" aria-label={say("Choose a concept to see its sources", "Zaɓi ra’ayi don ganin majiyoyinsa")}>{entries.map((entry, index) => <button key={entry.id} type="button" data-cloud-id={entry.id} data-cloud-count={entry.count} data-cloud-tone={["green", "blue", "gold"][index % 3]} aria-label={`${entry.label} · ${entry.count} ${mode === "concepts" ? say("reports", "rahotanni") : say("activities", "ayyuka")}`} aria-pressed={selectedId === entry.id} onClick={() => onSelect(selectedId === entry.id ? null : entry.id)} style={{ "--concept-weight": frequencyRange ? (entry.count - minimum) / frequencyRange : .5 } as CSSProperties}>{entry.label}</button>)}</div>
        <div className="cloud-underlay"><p>{mode === "concepts" ? say("Larger words appear in more reports. Select one to see its sources.", "Manyan kalmomi sun fi bayyana a rahotanni. Zaɓi ɗaya don ganin tushe.") : say("Larger labels cover more activities. Select one to explore.", "Manyan sunaye sun shafi ayyuka da yawa. Zaɓi ɗaya don bincika.")}</p><details className="cloud-list"><summary>{say("View as a list", "Duba a jeri")}</summary><ul>{entries.map((entry) => <li key={entry.id}><button type="button" onClick={() => onSelect(entry.id)} aria-pressed={selectedId === entry.id}>{entry.label}<span>{entry.count} {mode === "concepts" ? say("reports", "rahotanni") : say("activities", "ayyuka")}</span></button></li>)}</ul></details></div>
      </div>
    </div>
    {selected && <section className="cloud-selection" aria-label={say("Selected concept sources", "Majiyoyin ra’ayin da aka zaɓa")} aria-live="polite"><div className="selection-heading"><div><h3>{selected.label}</h3><p data-cloud-selection-count>{mode === "concepts" ? say(`${selected.count} of ${data.conceptReportCount} selected reports`, `${selected.count} daga zaɓaɓɓun rahotanni ${data.conceptReportCount}`) : say(`${selected.count} classified activity records`, `Bayanan ayyuka ${selected.count} da aka rarraba`)}</p></div><button className="text-action" type="button" onClick={() => onSelect(null)}>{say("Close sources", "Rufe majiyoyi")}</button></div><SourceMatches key={`${mode}:${selected.id}`} matches={matches} lang={lang} onAsk={onAsk} /><details className="cloud-method"><summary>{say("How these counts work", "Yadda aka ƙirga")}</summary><p>{mode === "concepts" ? say("Each phrase counts once per distinct selected report, however often it appears. The cloud represents report wording, not a transcript of the pictured speech or a measure of impact.", "An ƙirga kowace magana sau ɗaya a kowane rahoto daban, ko da ta maimaitu. Girgijen yana nuna kalmomin rahotanni, ba rubutun jawabin hoton ko ma’aunin tasiri ba.") : say("Counts refer to classified activity records. Categories may overlap; they do not count people or establish delivered outcomes.", "Lambobin suna nufin bayanan ayyukan da aka rarraba. Rukunoni na iya haɗuwa; ba ƙidayar mutane ko tabbatar da sakamakon da aka samu ba ne.")}</p></details></section>}
  </section>;
}
