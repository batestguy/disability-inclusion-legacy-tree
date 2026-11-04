import GuidedWorkspace from "../../../../components/GuidedWorkspace";
import { getChatData } from "../../../../lib/chat-data";

export const metadata = { title: "Mohammed Abba Isa · Yorùbá (draft)", description: "Draft Yorùbá translation of the sourced project.", robots: { index: false, follow: false } };
export default function ChatPage() {
  return <GuidedWorkspace lang="yo" {...getChatData()} />;
}
