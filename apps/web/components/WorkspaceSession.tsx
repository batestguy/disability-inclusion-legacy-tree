"use client";

import { usePathname } from "next/navigation";
import { GuidedSessionProvider } from "./GuidedSession";
import { DashboardSessionProvider } from "./DashboardSession";

export default function WorkspaceSession({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()?.replace(/\/$/, "") || "/";
  const cursorActive = ["/", "/ha", "/chat", "/ha/chat"].includes(pathname);
  return <GuidedSessionProvider cursorActive={cursorActive}><DashboardSessionProvider>{children}</DashboardSessionProvider></GuidedSessionProvider>;
}
