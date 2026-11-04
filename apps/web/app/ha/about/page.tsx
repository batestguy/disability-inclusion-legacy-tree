import AboutWorkspace from "../../../components/AboutWorkspace";
import { getChatData } from "../../../lib/chat-data";
export const metadata = { title: "Game da Mohammed Abba Isa — Hausa na gwaji" };
export default function AboutPage() { return <AboutWorkspace lang="ha" {...getChatData()} />; }
