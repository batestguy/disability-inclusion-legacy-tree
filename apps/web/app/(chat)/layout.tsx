import { GuidedSessionProvider } from "../../components/GuidedSession";
import "./chat.css";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuidedSessionProvider>{children}</GuidedSessionProvider>;
}
