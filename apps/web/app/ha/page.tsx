import { getContent } from "../../lib/content";
import Explorer from "../../components/Explorer";
export const metadata = {
  title: "Gadon Aiki",
  description:
    "Tarihin ayyukan Mohammed Abba Isa. Fassarar Hausa na jiran bita.",
};
export default async function Page() {
  return <Explorer lang="ha" data={await getContent()} />;
}
