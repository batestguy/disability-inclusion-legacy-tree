"use client";

import {
  createContext,
  useEffect,
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
  sourcePage: number;
  detailPage: number;
  summaryPage: number;
  sourceId: string | null;
  photoCursor: boolean;
};
export const initialGuidedScreen = {
  view: "answer" as const,
  optionPage: 0,
  sourcePage: 0,
  detailPage: 0,
  summaryPage: 0,
  sourceId: null,
};
const initial: GuidedSession = { path: ["start"], cursor: 0, photoCursor: true, ...initialGuidedScreen };
const Context = createContext<{
  session: GuidedSession;
  setSession: Dispatch<SetStateAction<GuidedSession>>;
} | null>(null);

export function GuidedSessionProvider({
  children,
  cursorActive = true,
}: {
  children: React.ReactNode;
  cursorActive?: boolean;
}) {
  const [session, setSession] = useState<GuidedSession>(initial);
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.dataset.photoCursor;
    root.dataset.photoCursor = String(cursorActive && session.photoCursor);
    return () => {
      if (previous === undefined) delete root.dataset.photoCursor;
      else root.dataset.photoCursor = previous;
    };
  }, [session.photoCursor, cursorActive]);
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
