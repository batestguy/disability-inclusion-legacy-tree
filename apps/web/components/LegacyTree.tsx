import { useRef } from "react";
import Image from "next/image";
import TreeCredit from "./TreeCredit";
import { Collection, Lang, branches, t } from "../lib/content";
export default function LegacyTree({
  lang,
  data,
  branch,
  onBranch,
  onOpen,
}: {
  lang: Lang;
  data: Collection;
  branch: string;
  onBranch: (id: string) => void;
  onOpen: (slug: string, el: HTMLElement) => void;
}) {
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const limbPaths = [
    { id: "policy", d: "M640 600 Q530 390 345 345" },
    { id: "economic", d: "M700 650 Q970 450 1165 285" },
    { id: "digital", d: "M670 790 Q450 710 245 730" },
    { id: "assistive", d: "M800 915 Q1000 810 1170 805" },
  ];
  const portrait = data.settings.portrait;
  const permitted =
    portrait &&
    ["permission", "licensed", "public-domain"].includes(portrait.rightsStatus);
  return (
    <>
      <div
        className={`tree-stage living-tree ${branch !== "all" ? "has-open-branch" : ""}`}
      >
        <div className="botanical" aria-hidden="true" />
        {/* Pointer hit regions follow the illustrated wood. The labelled disclosure buttons below provide the identical keyboard action. */}
        <svg
          className="limb-hit-areas"
          viewBox="0 0 1400 1000"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {limbPaths.map((limb) => (
            <path
              key={limb.id}
              className={`limb-hit limb-hit-${limb.id}`}
              d={limb.d}
              onPointerDown={(e) => {
                if (e.button === 0)
                  pointer.current = {
                    id: e.pointerId,
                    x: e.clientX,
                    y: e.clientY,
                  };
              }}
              onPointerCancel={() => {
                pointer.current = null;
              }}
              onPointerUp={(e) => {
                const start = pointer.current;
                pointer.current = null;
                if (
                  start?.id === e.pointerId &&
                  Math.hypot(e.clientX - start.x, e.clientY - start.y) < 8
                )
                  onBranch(branch === limb.id ? "all" : limb.id);
              }}
            />
          ))}
        </svg>
        <div className="tree-center">
          <div className="stump-portrait">
            {permitted ? (
              <Image
                src={portrait.url}
                width={320}
                height={380}
                alt={portrait.alt[lang]}
                priority
                sizes="(max-width: 700px) 180px, 260px"
              />
            ) : (
              <div
                className="portrait-seal"
                aria-label={t(
                  lang,
                  "Portrait awaiting permission",
                  "Ana jiran izinin hoton",
                )}
              >
                <span>MAI</span>
                <small>{t(lang, "A LIFE OF SERVICE", "RAYUWAR HIDIMA")}</small>
                <span className="portrait-pending">
                  {t(lang, "Portrait to be added", "Za a saka hoto")}
                </span>
              </div>
            )}
          </div>
          <p>
            Hon. Mohammed
            <br />
            <strong>Abba Isa</strong>
          </p>
          <span className="trunk-caption">
            {t(
              lang,
              "Rooted in service. Growing in possibility.",
              "Tushen hidima. Ci gaban damammaki.",
            )}
          </span>
        </div>
        <div
          className="branch-list"
          aria-label={t(
            lang,
            "Explore the branches of the legacy tree",
            "Binciki rassan bishiyar gadon aiki",
          )}
        >
          {branches.map((b, i) => {
            const stories = data.achievements.filter((a) => a.branch === b.id),
              expanded = branch === b.id;
            return (
              <div
                key={b.id}
                className={`branch-group branch-group-${b.id} ${expanded ? "is-expanded" : ""}`}
              >
                <button
                  className={`branch branch-${b.id} ${expanded ? "active" : ""}`}
                  aria-expanded={expanded}
                  aria-controls={`twigs-${b.id}`}
                  onClick={() => onBranch(expanded ? "all" : b.id)}
                >
                  <span className="branch-number">0{i + 1}</span>
                  <span className="branch-label">
                    <strong>{b[lang]}</strong>
                    <small>
                      {expanded
                        ? t(lang, "Select a story below", "Zabi labari a kasa")
                        : t(
                            lang,
                            "Click to grow this branch",
                            "Danna domin bude reshe",
                          )}
                    </small>
                  </span>
                  <span className="branch-arrow" aria-hidden="true">
                    {expanded ? "−" : "+"}
                  </span>
                </button>
                <div
                  className="sub-branches"
                  id={`twigs-${b.id}`}
                  hidden={!expanded}
                >
                  <p className="sub-branch-label">
                    {stories.length}{" "}
                    {t(lang, "story branches", "rassan labarai")}
                  </p>
                  <ul>
                    {stories.map((a) => (
                      <li key={a.slug}>
                        <button
                          className="twig-story"
                          onClick={(e) => onOpen(a.slug, e.currentTarget)}
                        >
                          <span className="twig-year">
                            {a.date.slice(0, 4)}
                          </span>
                          <span>{a.title[lang]}</span>
                          <span aria-hidden="true">&#8599;</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
        <p className="tree-footnote">
          {t(
            lang,
            "Choose a main branch. Follow the smaller branches to a story.",
            "Zabi babban reshe. Bi kananan rassa zuwa labari.",
          )}
        </p>
      </div>
      <TreeCredit lang={lang} />
    </>
  );
}
