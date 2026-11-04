import yo from "../../../content/locales/yo.json" with { type: "json" };
import ig from "../../../content/locales/ig.json" with { type: "json" };

/** Draft UI translations. Source excerpts and proper names retain their original text. */
export const languages = [
  { code: "en", label: "English" },
  { code: "ha", label: "Hausa" },
  { code: "yo", label: "Yorùbá" },
  { code: "ig", label: "Igbo" },
];
export const localeHome = (lang) => lang === "en" ? "/" : `/${lang}/`;
const dictionaries = { yo, ig };

/** Unknown wording remains English; never silently substitutes a different language. */
export function translate(lang, en, ha = en) {
  if (lang === "ha") return ha;
  if (lang === "en") return en;
  const dictionary = dictionaries[lang];
  if (!dictionary || typeof en !== "string") return en;
  if (Object.hasOwn(dictionary, en)) return dictionary[en];
  return translatePattern(lang, en);
}

function translatePattern(lang, en) {
  const t = (text) => translate(lang, text);
  let match;
  if ((match = /^(Reported delivery|Target — planned): (More than |At least |About )?([\d,.]+) (people|households|job opportunities)$/.exec(en)))
    return `${t(match[1])}: ${t(match[2] ?? "")}${match[3]} ${t(match[4])}`;
  if ((match = /^Reports in (\d{4})$/.exec(en))) return lang === "yo" ? `Ìròyìn ní ${match[1]}` : `Akụkọ n'afọ ${match[1]}`;
  if ((match = /^(\d{4}-\d{2}-\d{2}) · (.+)$/.exec(en)) && t(match[2]) !== match[2]) return `${match[1]} · ${t(match[2])}`;
  if ((match = /^Report date: (\d{4}-\d{2}-\d{2})\. (.+)\.$/.exec(en)) && t(match[2]) !== match[2]) return `${t("Report date:")} ${match[1]}. ${t(match[2])}.`;
  if ((match = /^(\d+) distinct canonical model reports; (\d+) activity records by canonical activity report date\. These are different units\. Publication year is not an event date\. The latest year is partial\.$/.exec(en)))
    return lang === "yo" ? `Ìròyìn àwòṣe ọ̀tọ̀ ${match[1]}; àkọsílẹ̀ iṣẹ́ ${match[2]} nípasẹ̀ ọjọ́ ìròyìn iṣẹ́ àkọ́kọ́. Ẹyọ ìwọ̀n ọ̀tọ̀ ni wọ́n. Ọdún ìtẹ̀jáde kì í ṣe ọjọ́ ìṣẹ̀lẹ̀. Ọdún tó ṣẹ̀ṣẹ̀ dé kò pé.` : `Akụkọ ụdị dị iche ${match[1]}; ndekọ ọrụ ${match[2]} site n'ụbọchị akụkọ ọrụ ntọala. Ihe atụ ndị a dị iche. Afọ mbipụta abụghị ụbọchị emume. Afọ kacha ọhụrụ ezughị ezu.`;
  if ((match = /^(\d+) reviewed dictionary entities; (\d+) article co-occurrence edges; (\d+) separately evidenced relationship records\. A shared article is not proof of partnership\.$/.exec(en)))
    return lang === "yo" ? `Orúkọ tí a ṣàyẹ̀wò ${match[1]}; ìjápọ̀ ìfarahàn nínú àpilẹ̀kọ kan náà ${match[2]}; àkọsílẹ̀ ìbáṣepọ̀ pẹ̀lú ẹ̀rí ọ̀tọ̀ ${match[3]}. Àpilẹ̀kọ kan náà kì í ṣe ẹ̀rí àjọṣepọ̀.` : `Aha enyochara ${match[1]}; njikọ aha pụtara n'otu akụkọ ${match[2]}; ndekọ mmekọrịta nwere ihe akaebe dị iche ${match[3]}. Ịpụta n'otu akụkọ abụghị ihe akaebe mmekọrịta.`;
  if ((match = /^Saved TF-IDF\/NMF topic\. Terms: (.+)\. These patterns do not establish delivery, impact or women-only eligibility\.$/.exec(en)))
    return lang === "yo" ? `Àkòrí TF-IDF/NMF tí a fipamọ́. Ọ̀rọ̀ orísun Gẹ̀ẹ́sì: ${match[1]}. Àpẹẹrẹ wọ̀nyí kò fi ìpèsè, ipa tàbí ẹ̀tọ́ fún obìnrin nìkan múlẹ̀.` : `Isiokwu TF-IDF/NMF echekwara. Okwu isi mmalite Bekee: ${match[1]}. Usoro ndị a anaghị egosi nnyefe, mmetụta ma ọ bụ ikike naanị ụmụnwaanyị.`;
  if ((match = /^Appears in (\d+) of (\d+) reports$/.exec(en))) return lang === "yo" ? `Ó hàn nínú ìròyìn ${match[1]} nínú ${match[2]}` : `Ọ pụtara n'akụkọ ${match[1]} n'ime ${match[2]}`;
  if ((match = /^Covers (\d+) recorded activities$/.exec(en))) return lang === "yo" ? `Ó ní iṣẹ́ tí a kọ sílẹ̀ ${match[1]}` : `Ọ na-ekpuchi ọrụ e dekọrọ ${match[1]}`;
  if ((match = /^(\d+) of (\d+) selected reports$/.exec(en))) return lang === "yo" ? `${match[1]} nínú ìròyìn tí a yàn ${match[2]}` : `${match[1]} n'ime akụkọ ahọpụtara ${match[2]}`;
  if ((match = /^(\d+) classified activity records$/.exec(en))) return lang === "yo" ? `Àkọsílẹ̀ iṣẹ́ tí a pín sí ẹ̀ka ${match[1]}` : `Ndekọ ọrụ e kewara ${match[1]}`;
  if ((match = /^(\d+) sourced figures shown$/.exec(en))) return lang === "yo" ? `Nọ́ńbà pẹ̀lú orísun ${match[1]} tí a fi hàn` : `Ọnụọgụ nwere isi mmalite ${match[1]} e gosiri`;
  if ((match = /^View all (\d+) activities$/.exec(en))) return lang === "yo" ? `Wo gbogbo iṣẹ́ ${match[1]}` : `Lee ọrụ ${match[1]} niile`;
  if ((match = /^Browse activities \((\d+)\)$/.exec(en))) return lang === "yo" ? `Ṣàwárí àwọn iṣẹ́ (${match[1]})` : `Nyochaa ọrụ (${match[1]})`;
  if ((match = /^Show all (\d+) relationships$/.exec(en))) return lang === "yo" ? `Fi gbogbo ìbáṣepọ̀ ${match[1]} hàn` : `Gosi mmekọrịta ${match[1]} niile`;
  return en;
}

export function localizeText(value) {
  return { ...value, en: value.en, ha: value.ha, yo: translate("yo", value.en), ig: translate("ig", value.en) };
}

/** Returns a new tree; immutable source bundles and their approval flags stay intact. */
export function localizeData(value) {
  if (Array.isArray(value)) return value.map(localizeData);
  if (!value || typeof value !== "object") return value;
  const result = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localizeData(item)]));
  return typeof value.en === "string" && typeof value.ha === "string" ? localizeText(result) : result;
}
