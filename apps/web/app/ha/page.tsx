import { getChatData } from "../../lib/chat-data";
import HomeWorkspace from "../../components/HomeWorkspace";
export const metadata = {
  title: "Ayyuka a cikin lambobi",
  description:
    "Tarihin ayyukan Mohammed Abba Isa. Fassarar Hausa na jiran bita.",
};
export default function Page() {
  return <HomeWorkspace lang="ha" {...getChatData()} />;
}
