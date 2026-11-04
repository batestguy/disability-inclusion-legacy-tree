"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Lang, Bilingual } from "../lib/content";
import copy from "../../../content/landing-interactions.json";

type Term = { id: string; label: Bilingual };
type Props = { lang: Lang; active: boolean; suspended: boolean; terms: Term[]; planets: ReactNode; children: ReactNode };

/** A projected orbit: depth changes size and stacking while labels face the reader. */
export default function SolarSystem({ lang, active, suspended, terms, planets, children }: Props) {
  const arena = useRef<HTMLDivElement>(null);
  const phase = useRef(-Math.PI * .75);
  const [size, setSize] = useState({ width: 0, height: 0, largeText: false });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovered || focused;
  const orbiting = active && size.width >= 300 && !size.largeText;

  useEffect(() => {
    const element = arena.current;
    if (!element) return;
    let alive = true;
    let pending = 0;
    const measure = () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => {
        if (!alive) return;
        const width = element.clientWidth, height = element.clientHeight;
        const largeText = parseFloat(getComputedStyle(document.documentElement).fontSize) > 20;
        setSize(previous => previous.width === width && previous.height === height && previous.largeText === largeText ? previous : { width, height, largeText });
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    observer.observe(document.documentElement);
    document.fonts.ready.then(measure);
    measure();
    return () => { alive = false; observer.disconnect(); cancelAnimationFrame(pending); };
  }, []);

  useLayoutEffect(() => {
    if (!orbiting || !arena.current) return;
    const links = Array.from(arena.current.querySelectorAll<HTMLAnchorElement>(".landing-bubble"));
    const largestWidth = Math.max(...links.map(link => link.offsetWidth));
    const largestHeight = Math.max(...links.map(link => link.offsetHeight));
    const compact = size.width < 600;
    const rx = Math.max(0, size.width / 2 - largestWidth * (compact ? .52 : .62) - (compact ? 4 : 12));
    const ry = Math.max(0, size.height / 2 - largestHeight * .66 - 20);
    const paint = () => links.forEach((link, index) => {
      const angle = phase.current + index * Math.PI / 2;
      const depth = Math.sin(angle);
      const scale = compact ? .94 + (depth + 1) * .025 : .88 + (depth + 1) * .055;
      link.style.transform = `translate3d(${Math.cos(angle) * rx}px,${depth * ry}px,${depth * (compact ? 26 : 90)}px) scale(${scale})`;
      link.style.zIndex = depth >= 0 ? "30" : "10";
      link.style.opacity = "1";
    });
    paint();
    if (paused || suspended) return;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      phase.current = (phase.current + Math.min(now - previous, 50) * Math.PI * 2 / 42000) % (Math.PI * 2);
      previous = now;
      paint();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [orbiting, paused, suspended, size.width, size.height]);

  return <div className="solar-system" data-mode={orbiting ? "orbit" : "static"} data-orbit-paused={paused || suspended}>
    <h2 id="landing-choices-title" className="solar-heading calligraphy-title">{copy.begin[lang]}</h2>
    <div className="solar-arena" ref={arena}>
      <div className="solar-rings" aria-hidden="true"><i /><i /><i /></div>
      <div className="solar-sun">{children}</div>
      <div className="solar-word-streams" aria-hidden="true">
        {[0, 1].map(side => <div className={`solar-word-lane lane-${side}`} key={side}>{terms.map((term, index) => <span className={`falling-concept concept-tone-${(index + side) % 3}`} key={term.id} data-concept-word={term.id} style={{
          "--word-delay": `${-index * 2.7 - side * 1.3}s`, "--word-period": "18s",
        } as CSSProperties}>{term.label[lang]}</span>)}</div>)}
      </div>
      <nav className="solar-planets" aria-labelledby="landing-choices-title"
        onPointerOver={event => { if ((event.target as Element).closest(".landing-bubble")) setHovered(true); }}
        onPointerOut={event => { if (!(event.relatedTarget instanceof Element && event.relatedTarget.closest(".landing-bubble"))) setHovered(false); }}
        onPointerCancel={() => setHovered(false)}
        onPointerDown={event => { if ((event.target as Element).closest(".landing-bubble")) setHovered(true); }}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
        {planets}
      </nav>
    </div>
  </div>;
}
