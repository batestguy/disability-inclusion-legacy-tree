import AboutWorkspace from "../../../../components/AboutWorkspace";
import { getChatData } from "../../../../lib/chat-data";
export const metadata = { title: "Mohammed Abba Isa · Yorùbá (draft)", description: "Draft Yorùbá translation of the sourced project.", robots: { index: false, follow: false } };
export default function MethodologyPage() { return <AboutWorkspace lang="yo" methods {...getChatData()} />; }
