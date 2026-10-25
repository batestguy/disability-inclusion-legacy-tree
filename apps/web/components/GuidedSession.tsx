"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type GuidedSession = {
  path: string[];
  cursor: number;
  view: "answer" | "sources" | "source" | "details";
  optionPage: number;
  detailPage: number;
  summaryPage: number;
  sourceId: string | null;
};
export const initialGuidedScreen = {
  view: "answer" as const,
  optionPage: 0,
  detailPage: 0,
  summaryPage: 0,
  sourceId: null,
};
const initial: GuidedSession = { path: ["start"], cursor: 0, ...initialGuidedScreen };
const Context = createContext<{
  session: GuidedSession;
  setSession: Dispatch<SetStateAction<GuidedSession>>;
} | null>(null);

export function GuidedSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<GuidedSession>(initial);
  return (
    <Context.Provider value={{ session, setSession }}>
      {children}
    </Context.Provider>
  );
}

export function useGuidedSession() {
  const session = useContext(Context);
  if (!session) throw new Error("Guided conversation needs its session layout");
  return session;
}
