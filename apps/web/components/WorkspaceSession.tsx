"use client";

import { usePathname } from "next/navigation";
import { GuidedSessionProvider } from "./GuidedSession";
import { DashboardSessionProvider } from "./DashboardSession";

export default function WorkspaceSession({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()?.replace(/\/$/, "") || "/";
  const page = pathname.replace(/^\/(ha|yo|ig)(?=\/|$)/, "") || "/";
  const cursorActive = ["/", "/chat", "/explore", "/about", "/about/methodology"].includes(page);
  return <GuidedSessionProvider cursorActive={cursorActive}><DashboardSessionProvider>{children}</DashboardSessionProvider></GuidedSessionProvider>;
}
