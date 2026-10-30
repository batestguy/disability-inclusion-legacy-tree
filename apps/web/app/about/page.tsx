import AboutWorkspace from "../../components/AboutWorkspace";
import { getChatData } from "../../lib/chat-data";
export const metadata = { title: "About this project" };
export default function AboutPage() { return <AboutWorkspace lang="en" {...getChatData()} />; }
