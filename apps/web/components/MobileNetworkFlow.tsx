"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import "../app/mobile-network.css";
import { translate } from "../lib/locales.mjs";
import type { Lang } from "../lib/content";
import type { Presentation } from "./DashboardWorkspace";

type Activity = Presentation["networkActivities"][number];
type Actor = Presentation["collaborations"][number]["participants"][number];
type Props = {
  lang: Lang; actors: Actor[]; initiatives: Activity[];
  collaborations: Presentation["collaborations"];
  actorId: string | null; selectedActivityId: string | null; directCount: number;
  onActor: (id: string | null) => void; onActivity: (id: string, actor: string | null) => void; onDirect: () => void;
  image: (id: string, label: string) => ReactNode; thumbnail: (activity: Activity) => ReactNode;
};
type Point = { x: number; y: number };
type Box = { left: number; right: number; top: number; bottom: number; cx: number; cy: number };
type Edge = { id: string; from: string; to: string; kind: string; d: string };

/** Rounded orthogonal bends keep each connection outside the text cards. */
function roundedPath(input: Point[]) {
  const points = input.filter((p, i) => !i || p.x !== input[i - 1].x || p.y !== input[i - 1].y);
  const point = (p: Point) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  let d = `M ${point(points[0])}`;
  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i - 1], b = points[i], c = points[i + 1];
    const before = Math.hypot(b.x - a.x, b.y - a.y), after = Math.hypot(c.x - b.x, c.y - b.y);
    const radius = Math.min(8, before / 2, after / 2);
    const entry = { x: b.x + (a.x - b.x) * radius / before, y: b.y + (a.y - b.y) * radius / before };
    const exit = { x: b.x + (c.x - b.x) * radius / after, y: b.y + (c.y - b.y) * radius / after };
    d += ` L ${point(entry)} Q ${point(b)} ${point(exit)}`;
  }
  return `${d} L ${point(points.at(-1)!)}`;
}

export default function MobileNetworkFlow({ lang, actors, initiatives, collaborations, actorId, selectedActivityId, directCount, onActor, onActivity, onDirect, image, thumbnail }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);
  const marker = `mobile-network-arrow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [drawing, setDrawing] = useState<{ width: number; height: number; edges: Edge[] }>({ width: 0, height: 0, edges: [] });
  const say = (en: string, ha: string) => translate(lang, en, ha);
  const connections = collaborations.flatMap(c => c.participants.filter(p => p.id !== "mohammed-abba-isa").map(p => ({ actor: p.id, activity: c.activityId, kind: c.kind, id: `${c.id}:${p.id}` })));
  const connected = (actor: string, activity: string) => connections.some(c => c.actor === actor && c.activity === activity);
  const focused = !showAll ? actors.find(a => a.id === actorId) ?? (selectedActivityId ? actors.find(a => connected(a.id, selectedActivityId)) : undefined) : undefined;
  const focusId = focused?.id ?? null;
  const visibleActors = focused ? [focused] : actors;
  const visibleInitiatives = showAll ? initiatives : focused ? initiatives.filter(a => connected(focused.id, a.id)) : [];
  const bridgeHeight = showAll ? connections.length * 6 + 48 : 32;

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let frame = 0, alive = true;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!alive) return;
        const bounds = element.getBoundingClientRect();
        if (!bounds.width) return;
        const boxes = new Map<string, Box>();
        element.querySelectorAll<HTMLElement>("[data-mobile-node]").forEach(node => {
          const b = node.getBoundingClientRect();
          boxes.set(node.dataset.mobileNode!, { left: b.left - bounds.left, right: b.right - bounds.left, top: b.top - bounds.top, bottom: b.bottom - bounds.top, cx: b.x + b.width / 2 - bounds.x, cy: b.y + b.height / 2 - bounds.y });
        });
        const source = boxes.get("source");
        if (!source) return;
        const edges: Edge[] = [];
        if (showAll || focusId) actors.forEach(person => {
          const target = boxes.get(`actor:${person.id}`);
          if (!target) return;
          const left = target.cx < bounds.width / 2;
          edges.push({ id: `source:${person.id}`, from: "source", to: `actor:${person.id}`, kind: "office-connection", d: roundedPath(!showAll ? [
            { x: source.cx, y: source.bottom + 1 }, { x: target.cx, y: target.top - 1 },
          ] : [
            { x: source.cx, y: source.bottom + 1 },
            { x: source.cx, y: target.cy },
            { x: left ? target.right + 1 : target.left - 1, y: target.cy },
          ]) });
        });
        const grid = element.querySelector(".mobile-flow-actors")?.getBoundingClientRect();
        const routes = collaborations.flatMap(c => c.participants.filter(p => p.id !== "mohammed-abba-isa").map(p => ({ actor: p.id, activity: c.activityId, kind: c.kind, id: `${c.id}:${p.id}` })));
        routes.forEach((connection, index) => {
          const from = boxes.get(`actor:${connection.actor}`), to = boxes.get(`initiative:${connection.activity}`);
          if (!from || !to || !grid) return;
          if (!showAll) {
            edges.push({ id: connection.id, from: `actor:${connection.actor}`, to: `initiative:${connection.activity}`, kind: connection.kind, d: roundedPath([
              { x: from.cx, y: from.bottom + 1 }, { x: from.cx, y: to.top - 14 },
              { x: to.cx, y: to.top - 14 }, { x: to.cx, y: to.top - 1 },
            ]) });
            return;
          }
          const leftFrom = from.cx < bounds.width / 2, leftTo = to.cx < bounds.width / 2;
          const inset = 4 + index % 3 * 4;
          const fromRail = leftFrom ? inset : bounds.width - inset;
          const toRail = leftTo ? inset : bounds.width - inset;
          const start = { x: leftFrom ? from.left - 1 : from.right + 1, y: from.cy };
          const end = { x: leftTo ? to.left - 1 : to.right + 1, y: to.cy };
          const bridge = grid.bottom - bounds.top + 24 + index * 6;
          const points = [start, { x: fromRail, y: from.cy }];
          if (leftFrom !== leftTo) points.push({ x: fromRail, y: bridge }, { x: toRail, y: bridge });
          points.push({ x: toRail, y: to.cy }, end);
          edges.push({ id: connection.id, from: `actor:${connection.actor}`, to: `initiative:${connection.activity}`, kind: connection.kind, d: roundedPath(points) });
        });
        const direct = boxes.get("direct");
        if (direct && showAll) edges.push({ id: "source:direct", from: "source", to: "direct", kind: "direct-connection", d: roundedPath([
          { x: source.right + 1, y: source.cy }, { x: bounds.width - 2, y: source.cy },
          { x: bounds.width - 2, y: direct.top - 18 }, { x: direct.cx, y: direct.top - 18 },
          { x: direct.cx, y: direct.top - 1 },
        ]) });
        const next = { width: bounds.width, height: bounds.height, edges };
        setDrawing(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element.querySelectorAll("[data-mobile-node], .mobile-flow-actors").forEach(node => observer.observe(node));
    document.fonts.ready.then(() => { if (alive) measure(); });
    measure();
    return () => { alive = false; cancelAnimationFrame(frame); observer.disconnect(); };
  }, [actors, initiatives, collaborations, directCount, lang, showAll, focusId]);

  const actorActive = (id: string) => (!actorId || actorId === id) && (!selectedActivityId || connected(id, selectedActivityId));
  const edgeActive = (edge: Edge) => {
    if (edge.to === "direct") return !actorId && (!selectedActivityId || !initiatives.some(a => a.id === selectedActivityId));
    if (edge.from === "source") return actorActive(edge.to.slice(6));
    return (!actorId || edge.from === `actor:${actorId}`) && (!selectedActivityId || edge.to === `initiative:${selectedActivityId}`);
  };

  return <div className="mobile-network-flow" ref={root} role="group" aria-label={say("Connection graph", "Jadawalin alaƙa")} data-show-all={showAll} data-focus-actor={focusId ?? ""}>
    <svg className="mobile-flow-svg" viewBox={`0 0 ${drawing.width || 1} ${drawing.height || 1}`} preserveAspectRatio="none" aria-hidden="true">
      <defs><marker id={marker} viewBox="0 0 8 8" refX="8" refY="4" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L8 4L0 8Z" className="mobile-flow-arrow" /></marker></defs>
      {drawing.edges.filter(edge => showAll || focusId && (edge.to === `actor:${focusId}` || edge.from === `actor:${focusId}`)).map(edge => <path key={edge.id} d={edge.d} data-mobile-from={edge.from} data-mobile-to={edge.to} data-mobile-kind={edge.kind} markerEnd={`url(#${marker})`} className={`mobile-flow-edge ${edge.kind}${edgeActive(edge) ? " is-active" : " is-muted"}`} />)}
    </svg>
    <div className="mobile-flow-subject" data-mobile-node="source">
      {image("mohammed-abba-isa", "Mohammed Abba Isa")}
      <h3>Mohammed Abba Isa</h3><span>{say("Isa & his office", "Isa da ofishinsa")}</span>
      {focused && <button type="button" className="mobile-flow-change" onClick={() => onActor(null)}>{say("Choose another partner", "Zaɓi wani abokin hulɗa")}</button>}
    </div>
    {!showAll && !focused && <p className="mobile-flow-hint">{say("Choose a partner to see its initiatives.", "Zaɓi abokin hulɗa don ganin shirye-shiryensa.")}</p>}
    {!!actors.length && <>
      <h3 className="mobile-flow-stage-title">{say("People & organisations", "Mutane da ƙungiyoyi")}</h3>
      <div className={`mobile-flow-actors${focused ? " is-focused" : ""}`}>
        {visibleActors.map(person => <button key={person.id} type="button" data-mobile-node={`actor:${person.id}`} data-mobile-actor={person.id} aria-pressed={(showAll ? actorId : focusId) === person.id} className={`mobile-flow-partner${actorActive(person.id) ? "" : " is-dimmed"}`} onClick={() => onActor((showAll ? actorId : focusId) === person.id ? null : person.id)}>
          {image(person.id, person.label)}<span>{person.label}</span>
        </button>)}
      </div>
    </>}
    {!!visibleInitiatives.length && <>
      <div className="mobile-flow-bridge" style={{ height: bridgeHeight }} aria-hidden="true" />
      <h3 className="mobile-flow-stage-title">{say("Initiatives", "Shirye-shirye")}</h3>
      <div className={`mobile-flow-initiatives${!showAll && visibleInitiatives.length === 1 ? " is-focused" : ""}`}>
        {visibleInitiatives.map(activity => <button key={activity.id} type="button" data-mobile-node={`initiative:${activity.id}`} data-mobile-initiative={activity.id} aria-pressed={selectedActivityId === activity.id} className={`mobile-flow-tile${actorId && !connected(actorId, activity.id) || selectedActivityId && selectedActivityId !== activity.id ? " is-dimmed" : ""}`} onClick={() => onActivity(activity.id, showAll ? null : focusId)}>
          {thumbnail(activity)}<span>{activity.title[lang]}</span><small aria-hidden="true">↗</small>
        </button>)}
      </div>
    </>}
    {showAll && !!directCount && <button type="button" className="mobile-flow-direct" data-mobile-node="direct" onClick={onDirect}>
      <strong>{say("More recorded activities", "Ƙarin ayyukan da aka rubuta")}</strong><span>{directCount} · {say("Direct activity connections", "Alaƙar ayyuka kai tsaye")} <span aria-hidden="true">↗</span></span>
    </button>}
    <button type="button" className="mobile-flow-all" aria-pressed={showAll} onClick={() => { setShowAll(!showAll); onActor(null); }}>{showAll ? say("Simplify view", "Sauƙaƙa kallo") : say("Show all connections", "Nuna dukkan haɗin gwiwa")}</button>
  </div>;
}
