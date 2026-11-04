import AboutWorkspace from "../../../../components/AboutWorkspace";
import { getChatData } from "../../../../lib/chat-data";
export const metadata = { title: "Mohammed Abba Isa · Igbo (draft)", description: "Draft Igbo translation of the sourced project.", robots: { index: false, follow: false } };
export default function MethodologyPage() { return <AboutWorkspace lang="ig" methods {...getChatData()} />; }
