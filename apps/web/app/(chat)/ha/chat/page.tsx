import GuidedWorkspace from "../../../../components/GuidedWorkspace";
import { getChatData } from "../../../../lib/chat-data";

export const metadata = {
  title: "Tambayi bayanai — gwajin Hausa",
  robots: { index: false, follow: false },
};
export default function HausaChatPage() {
  return <GuidedWorkspace lang="ha" {...getChatData()} />;
}
