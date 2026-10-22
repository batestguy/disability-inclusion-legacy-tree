"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Lang, t } from "../lib/content";
const defaults = {
  contrast: false,
  size: "100",
  motion: false,
  font: false,
  underline: false,
};
export default function Preferences({ lang }: { lang: Lang }) {
  const [prefs, setPrefs] = useState(defaults),
    [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const p = JSON.parse(
          localStorage.getItem("legacy-preferences") || "null",
        );
        if (p)
          setPrefs({
            ...defaults,
            ...p,
            size: ["100", "125", "150"].includes(p.size) ? p.size : "100",
          });
      } catch {}
      setReady(true);
      document.documentElement.lang = lang;
    }, 0);
    return () => clearTimeout(timer);
  }, [lang]);
  useEffect(() => {
    if (!ready) return;
    const el = document.documentElement;
    for (const [name, enabled] of [
      ["high-contrast", prefs.contrast],
      ["reduce-motion", prefs.motion],
      ["reading-font", prefs.font],
      ["underline-links", prefs.underline],
    ] as const) {
      if (el.classList.contains(name) !== enabled)
        el.classList.toggle(name, enabled);
    }
    // Avoid a full-document style invalidation for the default size on first hydration.
    const size = prefs.size === "100" ? "" : prefs.size + "%";
    if (el.style.fontSize !== size) el.style.fontSize = size;
    window.dispatchEvent(
      new CustomEvent("legacy-motion", { detail: prefs.motion }),
    );
    try {
      localStorage.setItem("legacy-preferences", JSON.stringify(prefs));
    } catch {}
  }, [prefs, ready]);
  return (
    <Dialog.Root>
      <Dialog.Trigger className="preferences-button">
        &#9673; <span>{t(lang, "Reading preferences", "Zabin karatu")}</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="preferences dialog">
          <Dialog.Title>
            {t(lang, "Make yourself comfortable", "Zabi yadda za ka karanta")}
          </Dialog.Title>
          <Dialog.Description>
            {t(
              lang,
              "Your reading choices stay on this device when storage is available.",
              "Ana adana zabinka a wannan na’ura idan akwai damar ajiya.",
            )}
          </Dialog.Description>
          {(["contrast", "motion", "font", "underline"] as const).map(
            (key, i) => (
              <label className="toggle" key={key}>
                <input
                  type="checkbox"
                  checked={prefs[key]}
                  onChange={(e) =>
                    setPrefs({ ...prefs, [key]: e.target.checked })
                  }
                />
                {
                  [
                    t(lang, "High contrast", "Bambancin launi mai karfi"),
                    t(lang, "Reduce motion", "Rage motsi"),
                    t(lang, "Simple reading font", "Saukin rubutu"),
                    t(lang, "Underline links", "Ja layi karkashin mahada"),
                  ][i]
                }
              </label>
            ),
          )}
          <label className="toggle">
            {t(lang, "Text size", "Girman rubutu")}
            <select
              value={prefs.size}
              onChange={(e) => setPrefs({ ...prefs, size: e.target.value })}
            >
              <option>100</option>
              <option>125</option>
              <option>150</option>
            </select>
            %
          </label>
          <button className="text-link" onClick={() => setPrefs(defaults)}>
            {t(lang, "Reset preferences", "Sake saita zabi")}
          </button>
          <Dialog.Close className="close">
            {t(lang, "Close", "Rufe")} &#215;
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
