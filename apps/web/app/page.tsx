import { getChatData } from "../lib/chat-data";
import DashboardWorkspace from "../components/DashboardWorkspace";
export default function Page() {
  return <DashboardWorkspace lang="en" {...getChatData()} />;
}
