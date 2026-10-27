import { getChatData } from "../../lib/chat-data";
import DashboardWorkspace from "../../components/DashboardWorkspace";
export const metadata = {
  title: "Ayyuka a cikin lambobi",
  description:
    "Tarihin ayyukan Mohammed Abba Isa. Fassarar Hausa na jiran bita.",
};
export default function Page() {
  return <DashboardWorkspace lang="ha" {...getChatData()} />;
}
