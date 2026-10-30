import { getChatData } from "../lib/chat-data";
import HomeWorkspace from "../components/HomeWorkspace";
export default function Page() {
  return <HomeWorkspace lang="en" {...getChatData()} />;
}
