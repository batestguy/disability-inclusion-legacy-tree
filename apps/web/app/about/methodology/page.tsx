import AboutWorkspace from "../../../components/AboutWorkspace";
import { getChatData } from "../../../lib/chat-data";
export const metadata = { title: "Methodology", description: "How source reports were collected, prepared and analysed for this project." };
export default function MethodologyPage() { return <AboutWorkspace lang="en" methods {...getChatData()} />; }
