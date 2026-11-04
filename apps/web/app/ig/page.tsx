import { getChatData } from "../../lib/chat-data";
import HomeWorkspace from "../../components/HomeWorkspace";
export const metadata = { title: "Mohammed Abba Isa · Igbo (draft)", description: "Draft Igbo translation of the sourced project.", robots: { index: false, follow: false } };
export default function Page() {
  return <HomeWorkspace lang="ig" {...getChatData()} />;
}
