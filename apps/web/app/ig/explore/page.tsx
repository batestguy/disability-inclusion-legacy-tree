import DashboardWorkspace from "../../../components/DashboardWorkspace";
import { getChatData } from "../../../lib/chat-data";
export const metadata = { title: "Mohammed Abba Isa · Igbo (draft)", description: "Draft Igbo translation of the sourced project.", robots: { index: false, follow: false } };
export default function ExplorePage() { return <DashboardWorkspace lang="ig" {...getChatData()} />; }
