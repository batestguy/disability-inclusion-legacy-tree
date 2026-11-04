import { getContent } from "../../../../lib/content";
import Permanent from "../../../../components/Permanent";
export async function generateStaticParams() {
  return (await getContent()).achievements.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = (await getContent()).achievements.find((a) => a.slug === slug)!;
  return {
    title: a.title.yo,
    description: a.description.yo,
    alternates: {
      languages: {
        en: `/achievements/${slug}/`,
        ha: `/ha/achievements/${slug}/`,
        yo: `/yo/achievements/${slug}/`,
        ig: `/ig/achievements/${slug}/`,
      },
    },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <Permanent slug={slug} lang="yo" data={await getContent()} />;
}
