import type { Lang } from "../lib/content";

/** Status stays independent of translation dictionaries and release flags. */
export default function TranslationDraft({ lang }: { lang: Lang }) {
  if (lang === "en") return null;
  const message = {
    ha: "Hausa · Fassarar gwaji",
    yo: "Yorùbá · Ìtumọ̀ àkọ́kọ́",
    ig: "Igbo · Ntụgharị asụsụ nke mbido",
  }[lang];
  return <p className="translation-draft" lang={lang} data-translation-status="draft">{message} <span lang="en">· Translation draft</span></p>;
}
