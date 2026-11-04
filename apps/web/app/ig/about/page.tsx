import AboutWorkspace from "../../../components/AboutWorkspace";
import { getChatData } from "../../../lib/chat-data";
import { translate } from "../../../lib/locales.mjs";
export const metadata = { title: translate("ig", "About Mohammed Abba Isa"), robots: { index: false, follow: false } };
export default function AboutPage() { return <AboutWorkspace lang="ig" {...getChatData()} />; }
