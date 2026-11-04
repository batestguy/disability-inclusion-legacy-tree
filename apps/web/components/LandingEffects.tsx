"use client";

import { useEffect, useState } from "react";
import type { Lang } from "../lib/content";
import copy from "../../../content/landing-interactions.json";

const preferenceKey = "landing-visual-effects";

export function useLandingEffects() {
  const [state, setState] = useState({ enabled: true, reduced: false, ready: false, hidden: false });
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const environment = () => setState(previous => ({ ...previous, reduced: media.matches, hidden: document.hidden }));
    const frame = requestAnimationFrame(() => {
      let enabled = true;
      try {
        const saved = localStorage.getItem(preferenceKey);
        enabled = saved !== "off";
        if (saved === null && sessionStorage.getItem("landing-motion-paused") === "true") {
          enabled = false;
          localStorage.setItem(preferenceKey, "off");
        }
      } catch { /* Motion choices are optional; system preferences still apply. */ }
      setState({ enabled, reduced: media.matches, ready: true, hidden: document.hidden });
    });
    const storage = (event: StorageEvent) => {
      if (event.key === preferenceKey || event.key === null) setState(previous => ({ ...previous, enabled: event.newValue !== "off" }));
    };
    media.addEventListener("change", environment);
    document.addEventListener("visibilitychange", environment);
    window.addEventListener("storage", storage);
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener("change", environment);
      document.removeEventListener("visibilitychange", environment);
      window.removeEventListener("storage", storage);
    };
  }, []);
  function setEnabled(enabled: boolean) {
    setState(previous => ({ ...previous, enabled }));
    try { localStorage.setItem(preferenceKey, enabled ? "on" : "off"); } catch { /* Works without storage. */ }
  }
  return { ...state, active: state.ready && state.enabled && !state.reduced, setEnabled };
}

export function LandingEffectsSettings({ lang, enabled, reduced, onChange }: { lang: Lang; enabled: boolean; reduced: boolean; onChange: (enabled: boolean) => void }) {
  return <details className="landing-appearance">
    <summary>{copy.appearance[lang]}</summary>
    <label><input type="checkbox" checked={enabled} onChange={event => onChange(event.currentTarget.checked)} />{copy.effects[lang]}</label>
    {reduced && <p>{copy.reducedMotion[lang]}</p>}
  </details>;
}
