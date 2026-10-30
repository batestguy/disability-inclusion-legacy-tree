"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import type { Presentation } from "./DashboardWorkspace";
import type { Lang } from "../lib/content";
import type { getChatData } from "../lib/chat-data";
import { scrollAndFocus } from "../lib/scroll-focus";
import assets from "../../../content/dashboard-network-assets.json";

type Props = Pick<ReturnType<typeof getChatData>, "bundle"> & { lang: Lang; data: Presentation; area: string; selectedId: string | null; actorId: string | null; onSelect: (id: string | null) => void; onArea: (id: string) => void; onActor: (id: string | null) => void; onAsk: (id: string) => void };
const colours = ["#156146", "#245dc1", "#7943b5", "#087c83", "#b14d17", "#ac286e"];
const kindLabel = (kind: string, lang: Lang) => ({ "reported-programme-collaboration": ["Reported collaboration", "Haɗin gwiwar da aka ruwaito"], "stated-cooperation": ["Cooperation intention", "Niyyar haɗin gwiwa"], "signed-mou-reported": ["Reported MOU signing", "Sa hannun yarjejeniya da aka ruwaito"] }[kind]?.[lang === "ha" ? 1 : 0] ?? kind);
function NodeImage({ id, label }: { id: string; label: string }) {
  const [failed, setFailed] = useState(false);
  const asset = assets.assets.find((entry) => entry.id === id);
  const src = id === "mohammed-abba-isa" ? "/branding/mohammed-abba-isa.webp" : asset?.localPath;
  return <span className={`collage-avatar${id === "jac" ? " is-logo" : ""}`} aria-hidden="true">{src && !failed ? <Image src={src} width={180} height={200} sizes="180px" alt="" onError={() => setFailed(true)} /> : <span>{label.split(/[\s-]+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("")}</span>}</span>;
}

export default function DashboardNetwork({ lang, bundle, data, area, selectedId, actorId, onSelect, onArea, onActor, onAsk }: Props) {
  const [listView, setListView] = useState(false);
  const [page, setPage] = useState(0);
  const [directOnly, setDirectOnly] = useState(false);
  const activityBrowser = useRef<HTMLDetailsElement>(null);
  const say = (en: string, ha: string) => lang === "ha" ? ha : en;
  const inArea = data.networkActivities.filter((a) => area === "all" || a.groupIds.includes(area));
  const collaborations = data.collaborations.filter((c) => inArea.some((a) => a.id === c.activityId));
  const actors = [...new Map(collaborations.flatMap((c) => c.participants.filter((p) => p.id !== "mohammed-abba-isa").map((p) => [p.id, p] as const))).values()].sort((a, b) => a.label.localeCompare(b.label));
  const actor = actors.find((a) => a.id === actorId);
  const activities = inArea.filter((a) => actor ? collaborations.some((c) => c.activityId === a.id && c.participants.some((p) => p.id === actor.id)) : !directOnly || !a.collaborationIds.length);
  const legacy = data.collaborations.find((c) => c.id === selectedId);
  const selected = activities.find((a) => a.id === selectedId || a.id === legacy?.activityId);
  const relationships = collaborations.filter((c) => c.activityId === selected?.id);
  const pages = Math.ceil(activities.length / 6);
  const currentPage = Math.min(page, Math.max(0, pages - 1));
  const activeIndex = activities.findIndex((a) => a.id === selected?.id);
  const selectionId = (id: string) => data.collaborations.find((c) => c.activityId === id)?.id ?? id;
  function chooseArea(id: string) { setPage(0); setDirectOnly(false); onArea(id); }
  function chooseActor(id: string | null) { setPage(0); setDirectOnly(false); onActor(id); }
  function step(offset: number) { const index = Math.max(0, Math.min(activities.length - 1, activeIndex + offset)); setPage(Math.floor(index / 6)); onSelect(selectionId(activities[index].id)); }
  const linkedActivities = inArea.filter((a) => a.collaborationIds.length);
  const directActivities = inArea.filter((a) => !a.collaborationIds.length);
  const rows = Math.max(actors.length, linkedActivities.length + (directActivities.length ? 1 : 0), 3);
  const height = rows * 88 + 72;
  const y = (index: number, total: number) => 52 + index * (height - 104) / Math.max(1, total - 1);
  const actorColour = (id: string) => colours[Math.max(0, data.collaborations.flatMap((c) => c.participants).filter((p, index, all) => all.findIndex((a) => a.id === p.id) === index).findIndex((p) => p.id === id)) % colours.length];
  const connects = (personId: string, activityId: string) => collaborations.some((c) => c.activityId === activityId && c.participants.some((p) => p.id === personId));
  const activeConnection = (personId: string, activityId?: string) => (!actor || actor.id === personId) && (!selected || (activityId ? selected.id === activityId : connects(personId, selected.id)));
  function selectActivity(id: string) { onSelect(selectionId(id)); requestAnimationFrame(() => scrollAndFocus(document.getElementById("network-detail-title"))); }
  function showDirect() { if (activityBrowser.current) activityBrowser.current.open = true; setPage(0); setDirectOnly(true); onActor(null); onSelect(null); requestAnimationFrame(() => scrollAndFocus(document.getElementById("network-activity-browser"))); }
  return <section id="collaborations" className="dashboard-section collaboration-section" tabIndex={-1} aria-labelledby="collaboration-title">
    <div className="section-heading"><div><p className="dashboard-eyebrow">III. {say("CONNECTIONS", "HAƊIN GWIWA")}</p><h2 id="collaboration-title">{say("Connected by a shared purpose.", "Manufa ɗaya ta haɗa su.")}</h2></div><p>{say("Follow the activities, people and organisations around Mohammed Abba Isa.", "Bi ayyuka, mutane da ƙungiyoyin da ke da alaƙa da Mohammed Abba Isa.")}</p></div>
    <div className="network-toolbar"><label>{say("Contribution area", "Fannin gudummawa")}<select data-network-area value={area} onChange={(e) => chooseArea(e.target.value)}><option value="all">{say("All activities", "Dukkan ayyuka")}</option>{data.networkGroups.map((g) => <option key={g.id} value={g.id}>{g.label[lang]}</option>)}</select></label><div className="segmented-controls network-view-controls" role="group" aria-label={say("Collaboration view", "Yadda za a nuna haɗin gwiwa")}><button type="button" aria-pressed={!listView} onClick={() => setListView(false)}>{say("Network", "Cibiyar haɗin gwiwa")}</button><button type="button" aria-pressed={listView} onClick={() => setListView(true)}>{say("List", "Jeri")}</button></div></div>
    <div className="network-legend"><span><i className="legend-line" />{kindLabel("reported-programme-collaboration", lang)}</span><span><i className="legend-line is-intention" />{kindLabel("stated-cooperation", lang)}</span><span><i className="legend-line is-mou" />{kindLabel("signed-mou-reported", lang)}</span></div>
    <div className={`network-composition pathway-composition${listView ? " use-list" : ""}`}>
      <div className="network-map pathway-map" style={{ height: `${height / 16}rem` }} aria-label={say("Isa, people and organisations, then their initiatives", "Isa, mutane da ƙungiyoyi, sannan shirye-shiryensu")}>
        <div className="pathway-column-label subject">{say("Isa & his office", "Isa da ofishinsa")}</div><div className="pathway-column-label participants">{say("People & organisations", "Mutane da ƙungiyoyi")}</div><div className="pathway-column-label initiatives">{say("Initiatives", "Shirye-shirye")}</div>
        <svg viewBox={`0 0 1000 ${height}`} preserveAspectRatio="none" aria-hidden="true">
          {actors.map((person, index) => <path key={`isa:${person.id}`} data-isa-actor={person.id} d={`M 190 ${height / 2} C 270 ${height / 2}, 275 ${y(index, actors.length)}, 350 ${y(index, actors.length)}`} style={{ "--node-colour": actorColour(person.id) } as CSSProperties} className={`pathway-edge isa-connection${activeConnection(person.id) ? " is-active" : " is-muted"}`} />)}
          {collaborations.flatMap((c) => c.participants.filter((p) => p.id !== "mohammed-abba-isa").map((person) => {
            const from = y(actors.findIndex((p) => p.id === person.id), actors.length);
            const to = y(linkedActivities.findIndex((a) => a.id === c.activityId), linkedActivities.length + (directActivities.length ? 1 : 0));
            return <path key={`${c.id}:${person.id}`} data-actor-edge={person.id} data-activity-edge={c.activityId} d={`M 610 ${from} C 665 ${from}, 680 ${to}, 735 ${to}`} style={{ "--node-colour": actorColour(person.id) } as CSSProperties} className={`pathway-edge ${c.kind}${activeConnection(person.id, c.activityId) ? " is-active" : " is-muted"}`} />;
          }))}
          {!!directActivities.length && <path data-direct-edge d={`M 190 ${height / 2} C 265 ${height / 2}, 265 ${height - 22}, 650 ${height - 22} Q 695 ${height - 22}, 735 ${height - 52}`} className={`pathway-edge direct-connection${selected && !selected.collaborationIds.length || directOnly ? " is-active" : " is-muted"}`} />}
        </svg>
        <div className="pathway-subject"><NodeImage id="mohammed-abba-isa" label="Mohammed Abba Isa" /><strong>Mohammed Abba Isa</strong><span>{say("Recorded work & connections", "Ayyuka da alaƙa da aka rubuta")}</span></div>
        {actors.map((person, index) => <button key={person.id} type="button" data-network-actor={person.id} aria-pressed={actor?.id === person.id} className={`pathway-person${activeConnection(person.id) ? " is-connected" : " is-dimmed"}${actor?.id === person.id ? " is-selected" : ""}`} style={{ top: `${y(index, actors.length) / height * 100}%`, "--node-colour": actorColour(person.id) } as CSSProperties} onClick={() => chooseActor(actor?.id === person.id ? null : person.id)}><NodeImage id={person.id} label={person.label} /><span>{person.label}</span><svg className="pathway-kind-symbol" viewBox="0 0 24 24" aria-hidden="true">{person.kind === "person" ? <><circle cx="12" cy="7" r="4" /><path d="M4 22v-4a8 8 0 0 1 16 0v4" /></> : <><path d="M3 22V7l9-4 9 4v15M7 10h2m6 0h2M7 14h2m6 0h2M10 22v-5h4v5" /></>}</svg></button>)}
        {linkedActivities.map((activity, index) => <button key={activity.id} type="button" data-network-map-initiative={selectionId(activity.id)} aria-pressed={selected?.id === activity.id} className={`pathway-initiative${selected?.id === activity.id ? " is-selected" : ""}${actor && !connects(actor.id, activity.id) || selected && selected.id !== activity.id ? " is-dimmed" : ""}`} style={{ top: `${y(index, linkedActivities.length + (directActivities.length ? 1 : 0)) / height * 100}%` }} onClick={() => { setDirectOnly(false); selectActivity(activity.id); }}><span className="pathway-initiative-symbol" aria-hidden="true">◇</span><span>{activity.title[lang]}</span><span aria-hidden="true">→</span></button>)}
        {!!directActivities.length && <button type="button" className={`pathway-initiative pathway-direct${directOnly ? " is-selected" : ""}`} style={{ top: `${(height - 52) / height * 100}%` }} onClick={showDirect}><span className="pathway-initiative-symbol" aria-hidden="true">↗</span><span>{say("More recorded activities", "Ƙarin ayyukan da aka rubuta")}<small>{directActivities.length} · {say("Direct activity connections", "Alaƙar ayyuka kai tsaye")}</small></span></button>}
      </div>
      <div className="network-list pathway-list"><div className="collage-list-centre"><NodeImage id="mohammed-abba-isa" label="Mohammed Abba Isa" /><strong>Mohammed Abba Isa</strong><span aria-hidden="true">↓</span>{say("People, organisations & initiatives", "Mutane, ƙungiyoyi da shirye-shirye")}</div><ul>{actors.map((person) => <li key={person.id}><button type="button" data-network-list-actor={person.id} aria-pressed={actor?.id === person.id} onClick={() => chooseActor(actor?.id === person.id ? null : person.id)}><NodeImage id={person.id} label={person.label} /><span>{person.label}</span></button><ul>{linkedActivities.filter((a) => connects(person.id, a.id)).map((activity) => <li key={activity.id}><button type="button" data-network-list-initiative={selectionId(activity.id)} aria-pressed={selected?.id === activity.id} onClick={() => { setDirectOnly(false); selectActivity(activity.id); }}>{activity.title[lang]}<span aria-hidden="true">→</span></button></li>)}</ul></li>)}</ul>{!!directActivities.length && <button type="button" className="text-action" onClick={showDirect}>↗ {say("More recorded activities", "Ƙarin ayyukan da aka rubuta")} · {directActivities.length}</button>}</div>
    </div>
      {actor && <div className="network-actor-selection" role="status"><p>{actor.label} · {say("Recorded activities", "Ayyuka masu tushe")}: {activities.length}</p><button type="button" className="text-action" onClick={() => chooseActor(null)}>{say("Show all connections", "Nuna dukkan haɗin gwiwa")}</button></div>}
    {selected && <section className="network-detail" data-selected-initiative={selectedId} data-selected-activity={selected.id} aria-labelledby="network-detail-title"><div className="selection-heading"><div><p className="dashboard-eyebrow">{say("Recorded activity", "Aikin da aka rubuta")}</p><h3 id="network-detail-title" tabIndex={-1}>{selected.title[lang]}</h3></div><button className="text-action" type="button" onClick={() => onSelect(null)}>{say("Close details", "Rufe bayanai")}</button></div><p>{selected.description[lang]}</p><p><strong>{say("Isa’s reported role", "Rawar Isa da aka ruwaito")}</strong></p><p lang="en">{selected.role}</p>
      {relationships.map((r) => <div key={r.id} className="collage-relationship"><p className="relationship-kind">{kindLabel(r.kind, lang)}</p><dl className="participant-roles">{r.participants.map((p) => <div key={p.id}><dt>{p.label}</dt><dd>{p.role[lang]}</dd></div>)}</dl></div>)}
      <details><summary>{say("Source context & limits", "Bayanan tushe da iyakoki")}</summary>{relationships.map((r) => <blockquote key={r.id} lang="en" className="source-excerpt">{r.excerpt}</blockquote>)}{[...new Set([...selected.limitations, ...relationships.flatMap((r) => r.limitations)])].map((limit) => <p lang="en" key={limit}>{limit}</p>)}<p lang="en">{selected.reportDate} · {selected.dateBasis}</p></details>
      <div className="detail-actions">{selected.sourceIds.map((id) => { const source = bundle.sources.find((s) => s.id === id); return source && <a key={id} href={source.url} target="_blank" rel="noopener noreferrer">{say("Source", "Tushe")} <span className="sr-only" lang="en">: {source.title}</span> ↗</a>; })}<button type="button" onClick={() => onAsk(selected.id)}>{say("Explore this with the guide", "Bincika wannan da jagora")} ↗</button></div>
      <nav className="local-pagination" aria-label={say("Walk through activities", "Bi ayyuka")}><button type="button" disabled={activeIndex <= 0} onClick={() => step(-1)}>{say("Previous activity", "Aikin baya")}</button><span>{activeIndex + 1} / {activities.length}</span><button type="button" disabled={activeIndex + 1 >= activities.length} onClick={() => step(1)}>{say("Next activity", "Aiki na gaba")}</button></nav>
    </section>}
    <details className="network-browser" ref={activityBrowser}>
      <summary>{!actor && !directOnly && area === "all" ? say(`View all ${data.networkActivities.length} activities`, `Duba dukkan ayyuka ${data.networkActivities.length}`) : say(`Browse activities (${activities.length})`, `Bincika ayyuka (${activities.length})`)}</summary>
    <div className="collage-branch">
      <div className="selection-heading"><h3 id="network-activity-browser" tabIndex={-1}>{directOnly && !actor ? say("Direct activity connections", "Alaƙar ayyuka kai tsaye") : area === "all" ? say("All recorded activities", "Dukkan ayyukan da aka rubuta") : data.networkGroups.find((g) => g.id === area)?.label[lang]}</h3><p>{activities.length} {say("activities in this selection", "ayyuka a wannan zaɓi")}</p></div>
      <p className="collage-breadcrumb">Mohammed Abba Isa <span aria-hidden="true">→</span> {selected ? selected.title[lang] : say("Choose an activity to follow its connections", "Zaɓi aiki don bin alaƙarsa")}</p>
      <div className="collage-activities">{activities.slice(currentPage * 6, currentPage * 6 + 6).map((a) => <button type="button" key={a.id} data-network-initiative={selectionId(a.id)} data-network-activity={a.id} aria-pressed={selected?.id === a.id} onClick={() => selectActivity(a.id)}><span className="collage-activity-dot" aria-hidden="true" /><span>{a.title[lang]}<small>{a.reportDate.slice(0, 4)}</small></span><span aria-hidden="true">→</span></button>)}</div>
      {pages > 1 && <nav className="local-pagination network-pagination" aria-label={say("Activity pages", "Shafukan ayyuka")}><button type="button" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>{say("Previous activities", "Ayyukan baya")}</button><span>{currentPage + 1} / {pages}</span><button type="button" disabled={currentPage + 1 >= pages} onClick={() => setPage(currentPage + 1)}>{say("More activities", "Ƙarin ayyuka")}</button></nav>}

      {directOnly && !actor && <button type="button" className="text-action" onClick={() => { setDirectOnly(false); setPage(0); }}>{say("Show all activities", "Nuna dukkan ayyuka")}</button>}
    </div>
    </details>
    <details className="network-method"><summary>{say("About this network & image credits", "Game da alaƙar nan da hotuna")}</summary><p>{say("Lines from Isa identify recorded connections involving him or his office. Middle-to-right lines show documented participant roles in specific initiatives. Direct activity connections cover records without a documented partner. Advocacy, representation, intentions and ceremonial roles do not imply sole delivery. Areas can overlap. Participant links require documented roles in an initiative. Shared report mentions alone create no link. Cooperation intentions and MOU signings do not establish completed services.", "Tsakiyar ta haɗa Isa da ayyukan da aka rubuta, ciki har da kira, wakilci, manufofi da bukukuwa; ba ta nufin shi kaɗai ya yi aikin ba. Fannoni na iya maimaituwa. Alaƙar mahalarta tana buƙatar rubutacciyar rawa a shiri. Ambaton sunaye tare kaɗai ba ya samar da alaƙa. Niyya da yarjejeniya ba su tabbatar da kammala ayyuka ba.")}</p>{assets.assets.map((a) => <p key={a.id} lang="en"><a href={a.page} target="_blank" rel="noopener noreferrer">{a.label}</a> · {a.author} · <a href={a.licenseUrl} target="_blank" rel="noopener noreferrer">{a.license}</a>. {a.modifications} <a href={a.localPath} download>Download image</a>.</p>)}</details>
  </section>;
}
