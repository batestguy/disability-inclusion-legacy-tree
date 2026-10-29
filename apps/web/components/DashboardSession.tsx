"use client";

import { createContext, useContext, useState, type Dispatch, type SetStateAction } from "react";
import type { DashboardFilters } from "../lib/dashboard-data.mjs";

export type HighlightCategory = "all" | "targets" | "achievements";
export type PresentationSelection = { area: string; cloudMode: "areas" | "concepts"; cloudId: string | null; initiative: string | null; networkArea: string; actor: string | null };
export const initialPresentation: PresentationSelection = { area: "all", cloudMode: "concepts", cloudId: null, initiative: null, networkArea: "all", actor: null };
type DashboardSession = { filters: DashboardFilters; selectedId: string | null; tablePage: number; figurePage: number; highlightCategory: HighlightCategory; presentation: PresentationSelection };
const initial: DashboardSession = { filters: { year: "all", category: "all", activity: "all" }, selectedId: null, tablePage: 0, figurePage: 0, highlightCategory: "all", presentation: initialPresentation };
const Context = createContext<{ dashboard: DashboardSession; setDashboard: Dispatch<SetStateAction<DashboardSession>> } | null>(null);

export function DashboardSessionProvider({ children }: { children: React.ReactNode }) {
  const [dashboard, setDashboard] = useState(initial);
  return <Context.Provider value={{ dashboard, setDashboard }}>{children}</Context.Provider>;
}

export function useDashboardSession() {
  const session = useContext(Context);
  if (!session) throw new Error("Dashboard needs its workspace session");
  return session;
}
