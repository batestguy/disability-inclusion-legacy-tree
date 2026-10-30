import DashboardWorkspace from "../../../components/DashboardWorkspace";
import { getChatData } from "../../../lib/chat-data";
export const metadata = { title: "Bincika bayanan — Hausa na gwaji" };
export default function ExplorePage() { return <DashboardWorkspace lang="ha" {...getChatData()} />; }
