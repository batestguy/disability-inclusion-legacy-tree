"use client";

import { GuidedSessionProvider } from "./GuidedSession";
import { DashboardSessionProvider } from "./DashboardSession";

export default function WorkspaceSession({ children }: { children: React.ReactNode }) {
  return <GuidedSessionProvider><DashboardSessionProvider>{children}</DashboardSessionProvider></GuidedSessionProvider>;
}
