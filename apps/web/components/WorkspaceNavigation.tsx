"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { initialPresentation, useDashboardSession, type PresentationSelection } from "./DashboardSession";
import { initialGuidedScreen, useGuidedSession } from "./GuidedSession";
import { buildDashboardPresentation } from "../lib/dashboard-presentation.mjs";
import { getFlowNode } from "../lib/guided-flow.mjs";
import type { getChatData } from "../lib/chat-data";
import type { Lang } from "../lib/content";

export type WorkspacePage = "home" | "explore" | "chat" | "about" | "about/methodology";
export type ExploreSection = "overview" | "advocacy" | "collaborations";
export const exploreSection = (value: string | null): ExploreSection | null =>
  value === "overview" || value === "advocacy" || value === "collaborations" ? value : null;
export const pathHash = (path: string[]) => path.length > 1 ? `#flow=${encodeURIComponent(path.join("|"))}` : "";
export function selectionQuery(selection: PresentationSelection, record: string | null, section: ExploreSection | null = null, home = false) {
  const params = new URLSearchParams();
  if (selection.area !== "all") params.set("area", selection.area);
  if (selection.cloudMode !== "concepts") params.set("cloud", selection.cloudMode);
  if (selection.cloudId) params.set("term", selection.cloudId);
  if (selection.networkArea !== "all") params.set("partners", selection.networkArea);
  if (selection.initiative) params.set("initiative", selection.initiative);
  if (selection.actor) params.set("actor", selection.actor);
  if (record) params.set("record", record);
  if (section) params.set("section", section);
  // Distinguish an intentional stateful Home visit from an old dashboard URL.
  if (home) params.set("view", "home");
  return params.size ? `?${params}` : "";
}

export function useWorkspaceNavigation(bundle: ReturnType<typeof getChatData>["bundle"], page: WorkspacePage) {
  const pathname = usePathname();
  const { dashboard, setDashboard } = useDashboardSession();
  const { session, setSession } = useGuidedSession();
  const [section, setSection] = useState<ExploreSection | null>(null);
  const data = useMemo(() => { try { return buildDashboardPresentation(bundle); } catch { return null; } }, [bundle]);
  useEffect(() => {
    if (!data) return;
    const validatedData = data;
    function readLocation() {
      const params = new URLSearchParams(location.search);
      const area = (value: string | null) => validatedData.groups.some((group) => group.id === value) ? value! : "all";
      const cloudMode = params.get("cloud") === "areas" ? "areas" as const : "concepts" as const;
      const term = params.get("term");
      const cloudIds = cloudMode === "concepts" ? validatedData.concepts.map((entry) => entry.id) : bundle.categories.map((entry) => entry.id);
      const initiative = params.get("initiative");
      const actor = params.get("actor");
      const networkArea = validatedData.networkGroups.some((group) => group.id === params.get("partners")) ? params.get("partners")! : "all";
      const visibleActivities = validatedData.networkActivities.filter((entry) => networkArea === "all" || entry.groupIds.includes(networkArea));
      const visibleInitiatives = validatedData.collaborations.filter((entry) => visibleActivities.some((activity) => activity.id === entry.activityId));
      const selectedInitiative = visibleInitiatives.find((entry) => entry.id === initiative);
      const selectedActivity = visibleActivities.find((entry) => entry.id === initiative || entry.id === selectedInitiative?.activityId);
      const validActor = visibleInitiatives.some((entry) => entry.participants.some((person) => person.id === actor) && (!selectedActivity || entry.activityId === selectedActivity.id));
      const next: PresentationSelection = {
        ...initialPresentation, area: area(params.get("area")), cloudMode,
        cloudId: term && cloudIds.includes(term) ? term : null,
        initiative: selectedInitiative?.id ?? selectedActivity?.id ?? null,
        networkArea,
        actor: validActor ? actor : null,
      };
      const requested = params.get("record");
      const selectedId = bundle.activities.some((entry) => entry.id === requested) ? requested : null;
      setDashboard((previous) => ({ ...previous, presentation: next, selectedId, filters: { year: "all", category: "all", activity: "all" } }));
      const nextSection = exploreSection(params.get("section"));
      setSection(nextSection);
      const clean = selectionQuery(next, selectedId, nextSection, page === "home");
      // Home handles its own legacy redirect before canonicalising dashboard links.
      if (page !== "home" && clean !== location.search) history.replaceState(null, "", location.pathname + clean + location.hash);
    }
    readLocation();
    window.addEventListener("popstate", readLocation);
    return () => window.removeEventListener("popstate", readLocation);
  }, [bundle, data, page, pathname, setDashboard]);

  useEffect(() => {
    if (page === "chat") return; // The guide also restores its forward history and evidence screen.
    function readFlow() {
      // Restore shared flow links on informational pages, but leave reading
      // anchors (including the skip link) out of the conversation history.
      if ((page === "about" || page === "about/methodology") && !location.hash.startsWith("#flow=")) return;
      let path = ["start"];
      try {
        if (location.hash.startsWith("#flow=")) {
          const candidate = decodeURIComponent(location.hash.slice(6)).split("|");
          if (candidate[0] !== "start" || candidate.length > 256) throw new Error("Invalid path");
          candidate.forEach((id, i) => {
            const node = getFlowNode(bundle, id);
            if (i < candidate.length - 1 && !node.options.some(option => option.target === candidate[i + 1])) throw new Error("Disconnected path");
          });
          path = candidate;
        }
      } catch { path = ["start"]; }
      setSession(previous => previous.path.slice(0, previous.cursor + 1).join("|") === path.join("|") ? previous :
        { ...previous, ...initialGuidedScreen, path, cursor: path.length - 1 });
    }
    readFlow();
    window.addEventListener("popstate", readFlow);
    window.addEventListener("hashchange", readFlow);
    return () => { window.removeEventListener("popstate", readFlow); window.removeEventListener("hashchange", readFlow); };
  }, [bundle, page, pathname, setSession]);

  const flow = pathHash(session.path.slice(0, session.cursor + 1));
  const href = (target: WorkspacePage, lang: Lang, entry: ExploreSection | null = section) =>
    (lang === "ha" ? "/ha/" : "/") + (target === "home" ? "" : `${target}/`) +
    selectionQuery(dashboard.presentation, dashboard.selectedId, entry, target === "home") + flow;
  return { data, dashboard, setDashboard, session, setSession, section, href };
}
