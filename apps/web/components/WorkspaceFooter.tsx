import { translate, localeHome } from "../lib/locales.mjs";
import Link from "next/link";
import TranslationDraft from "./TranslationDraft";
import type { Lang } from "../lib/content";
export default function WorkspaceFooter({ lang }: { lang: Lang }) {
  const say = (en: string, ha: string) => translate(lang, en, ha);
  return <footer className="dashboard-footer">
    <div><strong>MOHAMMED ABBA ISA</strong><p>{say("Access to opportunity. A place for everyone.", "Samun dama. Wuri ga kowa.")}</p></div>
    <div className="footer-records">
      <Link className="footer-methodology" href={`${localeHome(lang)}about/methodology/`} prefetch={false}>{say("Methodology", "Hanyar bincike")} <span aria-hidden="true">↗</span></Link>
      <details><summary>{say("About these records", "Game da bayanan nan")}</summary><p>{say("A selected record, not a complete career account. Programme figures may overlap and must not be added into a unique-person total. Reports describe contributions and intentions; they do not establish causal impact.", "Zaɓaɓɓun bayanai ne, ba cikakken tarihin aiki ba. Mutanen shirye-shirye na iya maimaituwa; ba za a haɗa su a matsayin jimillar mutane mabambanta ba. Rahotanni suna bayyana gudummawa da manufofi, ba tasirin sanadi ba.")}</p></details>
      <TranslationDraft lang={lang} />
    </div>
  </footer>;
}
