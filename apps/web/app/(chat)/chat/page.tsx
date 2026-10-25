import GuidedWorkspace from "../../../components/GuidedWorkspace";
import { getChatData } from "../../../lib/chat-data";

export const metadata = {
  title: "Ask the records — standalone preview",
  robots: { index: false, follow: false },
};
export default function ChatPage() {
  return <GuidedWorkspace lang="en" {...getChatData()} />;
}
