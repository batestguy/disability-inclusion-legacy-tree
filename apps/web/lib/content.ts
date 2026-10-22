import seed from "../../../content/records.json";
export type Lang = "en" | "ha";
export type Bilingual = { en: string; ha: string };
export type Source = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  type: string;
  date: string;
  accessed: string;
};
export type Achievement = {
  slug: string;
  branch: string;
  date: string;
  status: string;
  title: Bilingual;
  description: Bilingual;
  role: Bilingual;
  evidenceLimits: Bilingual;
  sources: string[];
  reviewed: boolean;
  haReviewed: boolean;
};
export type Timeline = {
  date: Bilingual;
  title: Bilingual;
  description: Bilingual;
  sources: string[];
  haReviewed?: boolean;
};
export type Settings = {
  creator: { name?: string; bio?: Bilingual; url?: string };
  correctionEmail: string;
  portrait: null | {
    url: string;
    alt: Bilingual;
    credit: string;
    permission: string;
    rightsStatus: string;
  };
  haReviewed: boolean;
  revealReady: boolean;
};
export type Collection = {
  achievements: Achievement[];
  sources: Source[];
  timeline: Timeline[];
  settings: Settings;
};
export const branches = [
  {
    id: "policy",
    en: "Policy Advocacy",
    ha: "Shawarar Manufofi",
    note: "Rights into practice",
  },
  {
    id: "economic",
    en: "Economic Empowerment",
    ha: "Karfafa Tattalin Arziki",
    note: "Opportunity to thrive",
  },
  {
    id: "digital",
    en: "Digital Inclusion",
    ha: "Shigar Kowa a Dijital",
    note: "A connected future",
  },
  {
    id: "assistive",
    en: "Assistive Tech",
    ha: "Fasahar Taimako",
    note: "Tools for independence",
  },
];
export const home = (lang: Lang) => (lang === "en" ? "/" : "/ha/");
export const recordUrl = (lang: Lang, slug: string) =>
  `${home(lang)}achievements/${slug}/`;
export const t = (lang: Lang, en: string, ha: string) =>
  lang === "en" ? en : ha;
export async function getContent(): Promise<Collection> {
  const project = process.env.SANITY_PROJECT_ID,
    dataset = process.env.SANITY_DATASET;
  if (!project && !dataset) {
    validateContent(seed as Collection);
    return seed as Collection;
  }
  if (!project || !dataset || !/^[a-z0-9-]+$/.test(project + dataset))
    throw new Error(
      "Both valid public Sanity project and dataset are required",
    );
  const query = `{"achievements": *[_type == "achievement" && reviewed == true && !(_id in path("drafts.**"))]{"slug":slug.current,title,description,role,evidenceLimits,date,branch,status,reviewed,haReviewed,"sources":sources[]._ref},"sources": *[_type == "source" && reviewed == true && !(_id in path("drafts.**"))]{"id":_id,title,url,publisher,type,date,accessed},"timeline": *[_type == "timelineEvent" && reviewed == true && !(_id in path("drafts.**"))] | order(sortOrder asc){date,"title":label,"description":detail,haReviewed,"sources":sources[]._ref},"settings": *[_type == "siteSettings" && reviewed == true && !(_id in path("drafts.**"))] | order(_id asc)[0]{creator,correctionEmail,haReviewed,"portrait":portrait{alt,credit,permission,rightsStatus,"url":asset->url}}}`;
  const response = await fetch(
    `https://${project}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`,
    { cache: "force-cache" },
  );
  if (!response.ok)
    throw new Error(
      `Sanity request failed: ${response.status}; refusing a partial deployment`,
    );
  const { result } = await response.json();
  if (
    !result.settings ||
    !result.achievements?.length ||
    !result.sources?.length
  )
    throw new Error("Sanity contains no reviewed collection");
  const data: Collection = {
    ...result,
    settings: { ...seed.settings, ...result.settings },
  };
  for (const a of data.achievements)
    if (
      !a.slug ||
      !a.title?.en ||
      !a.description?.en ||
      !a.sources?.length ||
      a.sources.some((id) => !data.sources.some((s) => s.id === id))
    )
      throw new Error("Invalid or unsourced CMS achievement");
  validateContent(data);
  data.settings.revealReady = process.env.RELEASE_MODE === "public";
  if (
    process.env.RELEASE_MODE === "public" &&
    (!data.settings.haReviewed ||
      data.achievements.some((a) => !a.haReviewed) ||
      !["permission", "licensed", "public-domain"].includes(
        data.settings.portrait?.rightsStatus || "",
      ) ||
      !data.settings.correctionEmail)
  )
    throw new Error("Public release gates not met");
  return data;
}

export function validateContent(data: Collection) {
  const fields = ["title", "description", "role", "evidenceLimits"] as const;
  const slugs = new Set<string>();
  for (const source of data.sources) {
    if (
      new URL(source.url).protocol !== "https:" ||
      !source.publisher ||
      !["independent", "official", "office"].includes(source.type)
    )
      throw new Error("Invalid source");
  }
  for (const milestone of data.timeline) {
    if (
      !milestone.date?.en ||
      !milestone.date?.ha ||
      !milestone.title?.en ||
      !milestone.title?.ha ||
      !milestone.description?.en ||
      !milestone.description?.ha ||
      !milestone.sources?.length ||
      milestone.sources.some((id) => !data.sources.some((s) => s.id === id))
    )
      throw new Error("Invalid timeline evidence");
  }
  for (const a of data.achievements) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(a.date) ||
      !["advocacy", "announced", "reported", "completed", "measured"].includes(
        a.status,
      ) ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.slug) ||
      slugs.has(a.slug) ||
      !branches.some((b) => b.id === a.branch) ||
      !a.sources.length
    )
      throw new Error("Invalid achievement");
    slugs.add(a.slug);
    for (const f of fields)
      if (!a[f]?.en || !a[f]?.ha)
        throw new Error("Both languages required for preview");
    for (const id of a.sources)
      if (!data.sources.some((s) => s.id === id))
        throw new Error("Missing source");
  }
  if (
    process.env.RELEASE_MODE === "public" &&
    (!data.settings.haReviewed ||
      data.achievements.some((a) => !a.haReviewed) ||
      data.timeline.some((m) => !m.haReviewed) ||
      !["permission", "licensed", "public-domain"].includes(
        data.settings.portrait?.rightsStatus || "",
      ) ||
      !data.settings.portrait?.permission ||
      !data.settings.portrait?.credit ||
      !data.settings.portrait?.alt?.en ||
      !data.settings.portrait?.alt?.ha ||
      !data.settings.portrait?.url ||
      !data.settings.correctionEmail)
  )
    throw new Error(
      "Public reveal blocked: portrait rights, Hausa review and corrections contact required",
    );
}
