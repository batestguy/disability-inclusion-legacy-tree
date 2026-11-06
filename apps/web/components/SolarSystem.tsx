"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Lang, Bilingual } from "../lib/content";
import { fitSolarOrbit, orbitPoint } from "../lib/solar-orbit.mjs";
import copy from "../../../content/landing-interactions.json";

type Term = { id: string; label: Bilingual };
type Props = { lang: Lang; active: boolean; suspended: boolean; terms: Term[]; planets: ReactNode; children: ReactNode };

/** A projected orbit: depth changes size and stacking while labels face the reader. */
export default function SolarSystem({ lang, active, suspended, terms, planets, children }: Props) {
  const arena = useRef<HTMLDivElement>(null);
  const layoutKey = useRef("");
  const phase = useRef(-Math.PI * .75);
  const [size, setSize] = useState({ width: 0, largeText: false });
  const [orbit, setOrbit] = useState<ReturnType<typeof fitSolarOrbit>>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovered || focused;
  const orbiting = active && orbit !== null && !size.largeText;

  useEffect(() => {
    const element = arena.current;
    if (!element) return;
    let alive = true;
    let pending = 0;
    const measure = () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => {
        if (!alive) return;
        const width = element.clientWidth;
        const style = getComputedStyle(element.parentElement!);
        const css = (name: string) => parseFloat(style.getPropertyValue(name));
        const dimensions = [width, css("--base-sun-width"), css("--base-planet-width"), css("--base-word-lane"), css("--base-word-gap")] as const;
        const key = dimensions.join(":");
        if (layoutKey.current !== key) {
          layoutKey.current = key;
          setOrbit(fitSolarOrbit(...dimensions));
        }
        const largeText = parseFloat(getComputedStyle(document.documentElement).fontSize) > 20;
        setSize(previous => previous.width === width && previous.largeText === largeText ? previous : { width, largeText });
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
    if (!orbit) return;
    const paint = () => links.forEach((link, index) => {
      const angle = phase.current + index * Math.PI / 2;
      const point = orbitPoint(orbit, angle);
      link.style.transform = `translate3d(${point.x}px,${point.y}px,${point.z}px) scale(${point.scale})`;
      link.style.zIndex = point.z >= 0 ? "30" : "10";
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
  }, [orbiting, paused, suspended, size.width, orbit]);

  return <div className="solar-system" data-layout-ready={size.width > 0} data-compact-orbit={orbit?.compact ?? false} data-vertical-words={orbit?.verticalWords ?? false} style={orbit ? { "--orbit-height": `${orbit.height}px`, "--word-height": `${orbit.laneHeight}px`, "--flag-band": `${orbit.ring / 4}px`, "--sun-width": `${orbit.sun}px`, "--planet-width": `${orbit.planet}px`, "--word-lane": `${orbit.lane}px`, "--word-gap": `${orbit.gap}px` } as CSSProperties : undefined} data-mode={orbiting ? "orbit" : "static"} data-orbit-paused={paused || suspended}>
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
