"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { answerQuestion } from "../lib/chat-engine.mjs";

export type ChatAnswer = ReturnType<typeof answerQuestion>;
export type ChatTurn = { id: number; question: string; answer: ChatAnswer };
type Session = {
  draft: string;
  turns: ChatTurn[];
  context: ChatAnswer["context"];
  reportYear: string;
  evidenceTurn: number | null;
};
const initialSession: Session = {
  draft: "",
  turns: [],
  context: {},
  reportYear: "",
  evidenceTurn: null,
};
const SessionContext = createContext<{
  session: Session;
  setSession: Dispatch<SetStateAction<Session>>;
} | null>(null);

export function ChatSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session>(initialSession);
  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useChatSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error("Chat requires a shared session layout");
  return session;
}
