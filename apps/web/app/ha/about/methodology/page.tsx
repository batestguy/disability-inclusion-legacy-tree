import AboutWorkspace from "../../../../components/AboutWorkspace";
import { getChatData } from "../../../../lib/chat-data";
export const metadata = { title: "Hanyar bincike — Hausa na gwaji" };
export default function MethodologyPage() { return <AboutWorkspace lang="ha" methods {...getChatData()} />; }
