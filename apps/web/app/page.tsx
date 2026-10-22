import { getContent } from "../lib/content";
import Explorer from "../components/Explorer";
export default async function Page() {
  return <Explorer lang="en" data={await getContent()} />;
}
