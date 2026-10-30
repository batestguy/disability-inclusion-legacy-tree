import DashboardWorkspace from "../../components/DashboardWorkspace";
import { getChatData } from "../../lib/chat-data";
export const metadata = { title: "Explore the record" };
export default function ExplorePage() { return <DashboardWorkspace lang="en" {...getChatData()} />; }
