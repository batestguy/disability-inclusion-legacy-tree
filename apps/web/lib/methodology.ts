import type { Lang } from "./content";

const bi = (en: string, ha: string): Record<Lang, string> => ({ en, ha });

// Account of implemented methods, checked against collection/analysis scripts,
// PHASE2_FINDINGS.md and the current phrase-count extraction. No new analysis.
export const methodology = [
  {
    title: bi("Collecting the source archive", "Tattara tushen rahotanni"),
    text: bi(
      "We collected public posts and pages from the Office of the SSA (OSSAP-SNEO) website, ossaposneo.org, through its WordPress REST API. Python requests handled paginated downloads, retries and delays; the collector checked robots.txt and the API totals for missing or duplicate records. The saved archive contained 639 posts and seven pages. We preserved raw responses, source URLs, publication timestamps, retrieval times and SHA-256 hashes so extracted text could be traced back to its source.",
      "Mun tattara rubuce-rubuce da shafukan jama’a daga shafin Ofishin SSA (OSSAP-SNEO), ossaposneo.org, ta WordPress REST API. Python requests ya gudanar da sauke bayanai kashi-kashi, sake gwadawa da jinkiri; shirin ya duba robots.txt da jimillar API don gano bayanan da suka ɓace ko maimaitu. Kundin ya ƙunshi rubuce-rubuce 639 da shafuka bakwai. Mun adana amsoshin asali, adireshin tushe, lokutan wallafawa da tattarawa, da hash na SHA-256 don bin sawun rubutu zuwa tushensa.",
    ),
  },
  {
    title: bi("Turning HTML into usable text", "Mayar da HTML zuwa rubutu"),
    text: bi(
      "Beautiful Soup extracted readable text from the HTML. Scripts, styles and noscript content were removed while paragraph context, headings, list items and captions were retained. The original extracted text stayed intact; a separate analysis copy removed checked bylines, repeated background lines, English stop words and variants of the subject’s name and title. Exact full-text hashes identified duplicate documents; an alias map preserved their original source IDs. Similar titles alone were not grounds for merging reports or activities.",
      "Beautiful Soup ya fitar da rubutun da ake iya karantawa daga HTML. An cire script, style da noscript, tare da kiyaye mahallin sakin layi, kanun labarai, jerin abubuwa da bayanan hoto. Mun bar rubutun da aka fitar na asali; a kwafin nazari dabam an cire layukan marubuci da aka duba, bayanan baya masu maimaituwa, kalmomin Turanci na gama-gari da nau’o’in suna da muƙamin wanda shafin ya shafa. Hash na cikakken rubutu ya gano kwafe iri ɗaya; taswirar sunaye ta kiyaye lambobin tushe. Kamanceceniyar take kaɗai ba ta sa mun haɗa rahotanni ko ayyuka ba.",
    ),
  },
  {
    title: bi("Selecting and checking the records", "Zaɓe da duba bayanai"),
    text: bi(
      "We selected reports documenting Isa’s or his office’s involvement and reconciled reports about the same activity. The current analysis subset has 31 source records representing 30 distinct texts; it is not the full archive or a complete career account. Regular expressions flagged passages containing numbers for source-context checks. Those flags were leads, not accepted facts. Curated records retain the quoted evidence, unit, numerical bound, programme stage, date basis and attributed role. Targets remain separate from reported delivery, unresolved claims remain held, and overlapping programme figures are not added into a unique-person total. These checks do not independently confirm delivery.",
      "Mun zaɓi rahotannin da suka nuna sa hannun Isa ko ofishinsa, sannan muka daidaita rahotanni game da aiki ɗaya. Zaɓaɓɓen rukunin nazarin yanzu yana da bayanan tushe 31 masu wakiltar rubutu daban-daban 30; ba duk kundin ba ne ko cikakken tarihin aiki. Regular expressions sun nuna sakin layin da ke da lambobi domin a duba su a mahallinsu. Waɗannan alamu ne na abin dubawa, ba tabbatattun hujjoji ba. Bayanan da aka tsara suna kiyaye shaidar rubutu, ma’auni, iyakar lamba, matakin shiri, tushen kwanan wata da rawar da aka danganta. Manufofi sun bambanta da abin da rahoto ya ce an yi; ikirarin da ba a warware ba suna jiran dubawa. Ba a haɗa lambobin shirye-shirye masu yiwuwar maimaita mutane zuwa jimillar mutane mabambanta ba. Wannan dubawa ba ta tabbatar da aiwatarwa daga wata majiya mai zaman kanta ba.",
    ),
  },
  {
    title: bi("Discovering themes with NLP and machine learning", "Gano jigogi da NLP da koyon na’ura"),
    text: bi(
      "We used scikit-learn’s TfidfVectorizer to represent English words and two-word phrases as weighted numerical features. TF-IDF gives more weight to terms that distinguish documents than to terms appearing throughout the corpus. Non-negative Matrix Factorization (NMF), an unsupervised machine-learning method, then identified eight recurring textual topics. NumPy and SciPy supported the numerical calculations. We inspected strong terms and representative source texts to interpret the topics. Model topics are exploratory text patterns; they are not impact scores, truth probabilities or automatic proof of programme eligibility. Hausa labels are draft translations: no Hausa corpus analysis was performed.",
      "Mun yi amfani da TfidfVectorizer na scikit-learn don wakiltar kalmomin Turanci da jimlolin kalmomi biyu a matsayin lambobi masu nauyi. TF-IDF yana ƙara nauyin kalmomin da ke bambanta rubuce-rubuce fiye da waɗanda suka yawaita ko’ina. Daga nan Non-negative Matrix Factorization (NMF), hanyar koyon na’ura ba tare da rukunonin horo da aka riga aka ba ta ba, ta gano jigogin rubutu guda takwas. NumPy da SciPy sun tallafa wa lissafi. Mun duba fitattun kalmomi da rubutun tushe masu wakilci domin fassara jigogin. Jigogin tsarin rubutu ne na bincike; ba ma’aunin tasiri, yiwuwar gaskiya ko hujjar cancantar shiri ta atomatik ba ne. Sunayen Hausa fassarar daftari ne: ba a yi nazarin kundin rubutun Hausa ba.",
    ),
  },
  {
    title: bi("Separating categories from the word cloud", "Bambanta rukunoni da girgijen kalmomi"),
    text: bi(
      "Contribution areas were assigned through source-context curation, separately from NMF. An activity may belong to several areas, so category totals overlap. The visible cloud has two modes. In Contribution areas, label size reflects classified activity counts. Concepts in reports matches a defined list of phrases, ignoring letter case and normalising whitespace; each phrase counts once per distinct selected report, even if repeated many times. Clicking a label reveals its supporting records. Cloud size reflects frequency in the selected material, not importance, impact or a transcript of the pictured speech.",
      "An sanya fannonin gudummawa ta duba mahallin tushe, dabam da NMF. Aiki na iya shiga fannoni da yawa, don haka jimillar rukunoni na iya maimaituwa. Girgijen da ake gani yana da hanyoyi biyu. Fannonin gudummawa yana sa girman suna bisa yawan ayyukan da aka ware. Ra’ayoyi a rahotanni yana neman jerin jimlolin da aka ayyana, ba tare da bambanta manya da ƙananan haruffa ba, tare da daidaita tazara; ana ƙirga jimla sau ɗaya a kowane rahoto daban ko da ta maimaitu. Danna suna yana nuna bayanan da suka tallafa masa. Girman kalma yana nuna yawan bayyana a zaɓaɓɓun bayanai, ba muhimmanci, tasiri ko rubutun jawabin hoton ba.",
    ),
  },
  {
    title: bi("Building the connections and guided chat", "Gina alaƙoƙi da tattaunawa mai jagora"),
    text: bi(
      "People and organisations were matched using a curated name-and-alias catalogue. Mentioning two entities in one report does not establish a partnership; displayed relationships retain the source’s stated role and distinguish reported collaboration, cooperation intentions and an MOU signing. The chatbot follows a programmed question tree with source-linked answers and English/Hausa templates. It does not call a live language model or generate new factual claims. Next.js and React present the saved data; filtering selects existing records and model outputs rather than retraining NMF in the browser.",
      "An daidaita mutane da ƙungiyoyi ta kundin sunaye da wasu sunayensu da aka tsara. Ambaton ɓangarori biyu a rahoto ɗaya ba ya tabbatar da haɗin gwiwa; alaƙoƙin da aka nuna suna kiyaye rawar da tushe ya bayyana kuma suna bambanta haɗin gwiwar da aka ruwaito, niyyar yin aiki tare da sanya hannu kan MOU. Chatbot yana bin bishiyar tambayoyi da aka tsara, da amsoshi masu haɗin tushe da samfuran Turanci/Hausa. Ba ya kiran tsarin harshe mai aiki kai tsaye ko ƙirƙirar sabbin ikirarin gaskiya. Next.js da React suna nuna bayanan da aka adana; tacewa tana zaɓar bayanai da sakamakon nazari da ke akwai, ba sake horar da NMF a burauza ba.",
    ),
  },
  {
    title: bi("Reproducibility and limits", "Maimaita nazari da iyakokinsa"),
    text: bi(
      "We saved preprocessing settings, vocabulary, source aliases, software versions and hashed model outputs. Repeated fits reproduced the recorded model hash in the pinned local environment. Automated checks cover source integrity, calculations and application behaviour; browser checks include accessibility and responsive layouts. The archive is office-reported material, the selected sample is incomplete, near-duplicate wording can remain, and editorial review is unfinished. The work describes documented reporting and does not estimate causal effects. Hausa remains visibly draft, and image reuse permission and public-release approval remain pending.",
      "Mun adana saitunan shirya rubutu, ƙamus, alaƙar lambobin tushe, nau’o’in manhajoji da hash na sakamakon nazari. Sake gudanar da nazari a muhallin kwamfuta da aka ƙayyade ya samar da hash ɗin da aka rubuta. Gwaje-gwaje na atomatik sun duba amincin tushe, lissafi da aikin manhaja; gwajin burauza ya haɗa da samun dama da yadda shafi yake dacewa da girman allo. Kundin rahotannin ofishi ne, zaɓaɓɓen samfurin bai cika ba, rubutu kusan iri ɗaya na iya kasancewa, kuma dubawar edita ba ta ƙare ba. Aikin yana bayyana rahotannin da aka rubuta, ba ƙiyasta tasirin sanadi ba. Hausa tana nan a matsayin daftari a fili; izinin sake amfani da hotuna da amincewar fitowa ga jama’a suna jiran kammalawa.",
    ),
  },
];

export const modelSettings = [
  ["Features", "TF-IDF; unigrams + bigrams; min_df=3; max_df=0.85; sublinear_tf=True"],
  ["Model", "NMF; 8 components; nndsvda; coordinate descent; random_state=42"],
  ["Convergence", "max_iter=600; tol=0.0001; selected fit: 839 features, 117 iterations"],
];
