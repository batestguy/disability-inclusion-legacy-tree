/** A finite, local question tree over the reviewed bundle. No language inference. */
const bi = (en, ha) => ({ en, ha });
const unique = (values) => [...new Set(values)];
const refs = (evidence) => unique(evidence.flatMap((e) => e.source_ids ?? [e.source_id]));
const evidenceItems = (evidence) => evidence.flatMap((e) =>
  (e.source_ids ?? [e.source_id]).map((sourceId) => ({
    sourceId, text: e.text, kind: e.kind, reportDate: e.report_date,
    role: e.isa_role, limitations: e.limitations, dateBasis: e.date_basis,
  })),
);
const restart = () => ({ id: "restart", target: "start", label: bi("Explore another question", "Bincika wata tambaya") });
const option = (target, label, description) => ({ id: target, target, label, ...(description ? { description } : {}) });
const isText = (value) => typeof value === "string" && value.length > 0;
const isBi = (value) => value && isText(value.en) && isText(value.ha);
const isDate = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value));
// Draft navigation labels only; original source evidence is never translated here.
const draftActivityTitles = {
  "adapted-vehicle-presentation-2026": "Gabatar da abin hawa da aka daidaita domin sauƙin amfani",
  "african-disability-protocol-reaction-2023": "Bayanin goyon bayan amincewa da yarjejeniyar haƙƙin masu nakasa",
  "ayubson-event-2025": "Shirin tallafi tare da Ayubson Life Foundation",
  "beyond-disability-coordination-2024": "Shirya Beyond Disability da manufar damar aikin yi",
  "borno-employment-2024": "Ayyukan yi a Borno da aka ruwaito",
  "digital-employment-roundtable-2025": "Tattaunawa kan fasaha da damar aikin yi",
  "disability-readiness-toolkit-2025": "Ƙaddamar da kayan jagorar shigar masu nakasa",
  "fha-stalls-2025": "Takardun rabon rumfuna daga FHA Mortgage Bank",
  "health-ministry-inclusion-meeting-2023": "Taron shigar masu nakasa cikin harkokin lafiya",
  "house-disability-committee-visit-2023": "Ziyara ga shugaban kwamitin masu nakasa na Majalisar Wakilai",
  "karu-food-cash-2024": "Tallafin abinci da kuɗi a Karu",
  "leex-inspirational-award-2023": "Karramawar LEEX da aka ruwaito",
  "ncpwd-introductory-visit-2023": "Ziyarar gabatarwa ga shugabannin NCPWD",
  "nigwed-skills-2024": "Horon sana'a ga mata masu nakasa",
  "northeast-food-support-target-2024": "Manufar tallafin abinci a Arewa maso Gabas",
  "office-agenda-briefing-2023": "Bayani ga jama'a kan manufofin sabon ofishi",
  "para-soccer-unity-cup-2025": "Ƙaddamar da gasar ƙwallon ƙafa ta masu nakasa",
  "paravolley-election-2026": "Zaɓen shugaban ƙungiyar wasan ƙwallon raga ta masu nakasa",
  "paravolley-southwest-meeting-2026": "Taron wasan ƙwallon raga na masu nakasa a Kudu maso Yamma",
  "ramadan-food-2024": "Tallafin abinci na Ramadan",
  "red-cross-collaboration-2025": "Haɗin gwiwar agajin gaggawa da Red Cross",
  "rehabilitation-centres-plan-2025": "Sanarwar shirin cibiyoyin gyaran lafiya",
  "school-blind-support-2025": "Tallafi ga makarantar makafi ta FCT",
  "ssa-appointment-2023": "Naɗin babban mataimaki na musamman kan harkokin nakasa",
  "startup-support-march-2024": "Tallafin fara sana'a da kayan POS",
  "state-inclusion-report-unveiling-2025": "Ƙaddamar da rahoton shigar masu nakasa",
  "supreme-court-congratulation-2023": "Saƙon siyasa na taya Shugaba Tinubu murna",
  "veterans-mou-2024": "Yarjejeniyar tallafin tsofaffin sojoji da aka ruwaito",
};
const activityTitle = (a) => bi(
  // This target shares the Karu article headline; label its own activity scope.
  a.id === "northeast-food-support-target-2024" ? "Planned Northeast food-support expansion" : a.title.en,
  a.title.ha ?? draftActivityTitles[a.id] ?? `Bayanin aiki: ${a.title.en} (Turanci na asali)`,
);
const activityStages = {
  advocacy: bi("Advocacy", "Kiran a ɗauki mataki"),
  reported: bi("Reported account", "Bayanin da aka ruwaito"),
  announced: bi("Announced initiative", "Shirin da aka sanar"),
  "reported-activity": bi("Reported activity", "Aikin da aka ruwaito"),
  "reported-delivery": bi("Reported support delivered", "Tallafin da aka ruwaito an bayar"),
  target: bi("Planned target", "Manufar shiri"),
  "stated-agenda": bi("Stated plans", "Tsare-tsaren da aka bayyana"),
  "reported-award": bi("Reported award", "Karramawar da aka ruwaito"),
  "reported-appointment": bi("Reported appointment", "Naɗin da aka ruwaito"),
};
// Draft qualitative summaries bound to the corresponding activity's role and limits.
// Numerical observations remain in the data-derived measure nodes, never copied here.
const draftActivitySummaries = {
  "adapted-vehicle-presentation-2026": bi(
    "The office reports Isa's participation in an adapted-vehicle demonstration and symbolic handover with automotive firms. Nationwide distribution and e-hailing participation remain proposals.",
    "Ofishin ya ruwaito halartar Isa wajen nuna abin hawa da aka daidaita domin sauƙin amfani da miƙa shi a matsayin alama tare da kamfanonin motoci. Rabawa a faɗin ƙasa da shiga aikin tasi ta manhaja tsare-tsare ne har yanzu."),
  "african-disability-protocol-reaction-2023": bi(
    "Isa welcomed the President's ratification of the disability protocol and called for representation. The President ratified the instrument; this account does not establish that Isa caused ratification.",
    "Isa ya yaba wa amincewar Shugaban Ƙasa da yarjejeniyar haƙƙin masu nakasa, ya kuma nemi wakilcinsu. Shugaban Ƙasa ne ya amince da yarjejeniyar; rahoton bai tabbatar cewa Isa ne ya sa aka amince da ita ba."),
  "ayubson-event-2025": bi(
    "The office reports collaborating with Ayubson Life Foundation on a celebration programme with participation and gifts. Isa was represented by the media and communications director; income gains and jobs were not measured.",
    "Ofishin ya ruwaito haɗin gwiwa da Ayubson Life Foundation a shirin biki wanda ya ƙunshi halarta da kyaututtuka. Daraktan yaɗa labarai da sadarwa ya wakilci Isa; ba a auna ƙarin kuɗin shiga ko ayyukan yi ba."),
  "beyond-disability-coordination-2024": bi(
    "The office reported coordinator documentation and orientation for Beyond Disability. Its projected job opportunities are a programme target; coordinator appointments do not establish delivered jobs.",
    "Ofishin ya ruwaito shirya takardu da wayar da kan masu daidaita shirin Beyond Disability. Damar aikin yi da aka tsara manufa ce ta shirin; naɗin masu daidaitawa bai tabbatar da samar da ayyukan yi ba."),
  "borno-employment-2024": bi(
    "The office's anniversary account reports Borno State employment placements following engagement with the governor. Employment records and retention were not independently verified, and the account does not attribute sole job creation to Isa.",
    "Rahoton zagayowar shekarar ofishin ya bayyana samun aikin yi a Jihar Borno bayan tattaunawa da gwamna. Ba a tabbatar da takardun aikin ko ci gaba da aikin ta hanya mai zaman kanta ba; rahoton bai ce Isa shi kaɗai ya samar da ayyukan ba."),
  "digital-employment-roundtable-2025": bi(
    "Lanre Oloyede represented the office at a technology and employment-inclusion roundtable and advocated practical inclusion. Attendance and advocacy do not establish a delivered training programme or jobs.",
    "Lanre Oloyede ya wakilci ofishin a tattaunawar fasaha da damar aikin yi, ya kuma nemi a aiwatar da shigar kowa cikin harkoki. Halarta da wannan kira ba su tabbatar da gudanar da horo ko samar da ayyukan yi ba."),
  "disability-readiness-toolkit-2025": bi(
    "The office participated through Lanre Oloyede in unveiling a disability-readiness and workforce toolkit. Deaf-in-Tech and DataLead Africa produced it; unveiling does not establish Isa's authorship, workforce uptake or jobs delivered.",
    "Ofishin ya shiga ƙaddamar da kayan jagorar shigar masu nakasa cikin harkokin aiki ta hannun Lanre Oloyede. Deaf-in-Tech da DataLead Africa ne suka samar da kayan; ƙaddamarwa ba ta nufin Isa ne ya ƙirƙire su ko an tabbatar da amfani da su da samar da ayyukan yi ba."),
  "fha-stalls-2025": bi(
    "FHA Mortgage Bank handed over stall-allotment documents and branded umbrellas to PWD beneficiaries. The office participated and promoted inclusion; later income gains and the value of the allotments were not measured.",
    "FHA Mortgage Bank ya miƙa takardun rabon rumfuna da laimomi masu tambari ga masu nakasa da suka amfana. Ofishin ya halarta ya kuma goyi bayan shigar kowa; ba a auna ƙarin kuɗin shiga daga baya ko darajar rabon rumfunan ba."),
  "health-ministry-inclusion-meeting-2023": bi(
    "A courtesy meeting discussed inclusive healthcare and awareness among health workers, with a stated intention to cooperate. This record does not establish clinics opened, patients treated, staff trained or a signed agreement.",
    "A ziyarar gaisuwa an tattauna shigar masu nakasa cikin kula da lafiya da wayar da kan ma'aikatan lafiya, tare da bayyana niyyar haɗin gwiwa. Wannan bai tabbatar da buɗe asibitoci, jinyar marasa lafiya, horar da ma'aikata ko sanya hannu kan yarjejeniya ba."),
  "house-disability-committee-visit-2023": bi(
    "Isa visited the House disability committee chair and discussed legislative cooperation and inclusive budgeting. Duplicate reports describe the same visit; future cooperation and a proposed reception do not establish delivered support.",
    "Isa ya ziyarci shugaban kwamitin masu nakasa na Majalisar Wakilai, inda suka tattauna haɗin gwiwar dokoki da kasafin kuɗi mai la'akari da kowa. Rahotannin da suka maimaitu sun shafi ziyara ɗaya; niyyar haɗin gwiwa da liyafar da aka tsara ba hujjar bayar da tallafi ba ne."),
  "karu-food-cash-2024": bi(
    "The office reports leading a Karu launch where PWD recipients received rice and cash support. The delivered-person figure and the separate household target describe different measures; the cash total and recipient overlap are unknown.",
    "Ofishin ya ruwaito jagorantar ƙaddamarwa a Karu inda masu nakasa suka samu shinkafa da tallafin kuɗi. Lambar mutanen da aka ce sun karɓa da manufar gidajen da za a tallafa wa ma'aunai ne daban; ba a san jimillar kuɗi ko maimaituwar masu karɓa ba."),
  "leex-inspirational-award-2023": bi(
    "Office coverage first announced the LEEX ceremony and later reported Isa's Inspirational Leader recognition. These concern the same award, not separate awards; the exact presentation date and organiser corroboration remain unverified.",
    "Rahoton ofishin ya fara sanar da bikin LEEX, daga baya kuma ya ruwaito karrama Isa a matsayin jagora abin koyi. Wannan karramawa ɗaya ce; ba a tabbatar da ainihin ranar miƙa ta ko samun tabbaci daga masu shirya bikin ba."),
  "ncpwd-introductory-visit-2023": bi(
    "The office reports an introductory courtesy visit to NCPWD leadership and discussion of institutional cooperation. A meeting and statements of support do not establish a signed partnership or services delivered.",
    "Ofishin ya ruwaito ziyarar gabatarwa da gaisuwa ga shugabannin NCPWD da tattauna haɗin gwiwar hukumomi. Taro da kalaman goyon baya ba su tabbatar da sanya hannu kan haɗin gwiwa ko bayar da hidimomi ba."),
  "nigwed-skills-2024": bi(
    "The office reports collaborating with NigWED on reusable sanitary-pad production training for women with disabilities. Training and support concern the same cohort; completion records, employment and later income were not verified.",
    "Ofishin ya ruwaito haɗin gwiwa da NigWED wajen horar da mata masu nakasa kan ƙera kayan tsaftar haila da ake sake amfani da su. Horo da tallafi sun shafi rukuni ɗaya; ba a tabbatar da bayanan kammala horo, aikin yi ko kuɗin shiga daga baya ba."),
  "northeast-food-support-target-2024": bi(
    "The office announced intended expansion of food support into the Northeast. This is a target rather than established Northeast delivery; overlap with the Karu initiative is unknown.",
    "Ofishin ya sanar da niyyar faɗaɗa tallafin abinci zuwa Arewa maso Gabas. Wannan manufa ce, ba tabbacin bayar da tallafi a yankin ba; ba a san ko masu amfana za su maimaita na shirin Karu ba."),
  "office-agenda-briefing-2023": bi(
    "Isa outlined intended assessment, policy, employment and inclusion work at a press briefing. These commitments are an agenda; completed assessments, changed legislation, implemented quotas and jobs are not established by the briefing.",
    "Isa ya bayyana tsare-tsaren tantance hali, manufofi, aikin yi da shigar kowa a taron manema labarai. Waɗannan alkawura tsare-tsare ne; taron bai tabbatar da kammala tantancewa, sauya dokoki, aiwatar da kason dama ko samar da ayyukan yi ba."),
  "para-soccer-unity-cup-2025": bi(
    "Isa launched the Tinubu-Shettima Para-Soccer Unity Cup and advocated inclusion. Misbau Lawal organised the tournament; the record does not establish athlete income gains or nationwide sporting inclusion.",
    "Isa ya ƙaddamar da gasar Tinubu-Shettima Para-Soccer Unity Cup tare da neman a shigar da masu nakasa cikin harkoki. Misbau Lawal ne ya shirya gasar; rahoton bai tabbatar da ƙarin kuɗin shiga ga 'yan wasa ko shigar da su wasanni a faɗin ƙasa ba."),
  "paravolley-election-2026": bi(
    "The office reports Isa's election as President of the Para Volley Federation of Nigeria. A leadership election does not by itself establish benefits or sporting outcomes for athletes.",
    "Ofishin ya ruwaito zaɓen Isa a matsayin shugaban Para Volley Federation of Nigeria. Zaɓen shugaba shi kaɗai bai tabbatar da amfanin da 'yan wasa suka samu ko sakamakon wasanni ba."),
  "paravolley-southwest-meeting-2026": bi(
    "The office reports a South-West para-volleyball stakeholders meeting addressing disputes and future sporting plans. Technical Director Christian Agoawuike represented Isa; the report is not evidence of delivered future Paralympic outcomes.",
    "Ofishin ya ruwaito taron masu ruwa da tsaki na wasan ƙwallon raga ta masu nakasa a Kudu maso Yamma kan warware saɓani da tsare-tsaren wasanni. Daraktan fasaha Christian Agoawuike ya wakilci Isa; rahoton ba hujjar cimma sakamakon Paralympics na gaba ba ne."),
  "ramadan-food-2024": bi(
    "The office reports organising Ramadan food-palliative distribution with Queen Adenike Tejuosho Foundation. The recipient overlap, precise delivery location, cash value and measured welfare change are not established.",
    "Ofishin ya ruwaito shirya rabon tallafin abinci na Ramadan tare da Queen Adenike Tejuosho Foundation. Ba a tabbatar da maimaituwar masu karɓa, takamaiman wurin rabawa, darajar kuɗi ko sauyin walwala da aka auna ba."),
  "red-cross-collaboration-2025": bi(
    "A courtesy visit included reported cooperation with the Nigerian Red Cross Society on disability-inclusive emergency response. Proposed programmes are not delivered services; the Red Cross's wider capacity is not a beneficiary total attributable to Isa.",
    "Ziyarar gaisuwa ta haɗa da haɗin gwiwar da aka ruwaito da Nigerian Red Cross Society kan agajin gaggawa mai la'akari da masu nakasa. Shirye-shiryen da aka tsara ba hidimomin da aka riga aka bayar ba ne; ƙarfin aikin Red Cross gaba ɗaya ba adadin waɗanda Isa ya taimaka wa ba ne."),
  "rehabilitation-centres-plan-2025": bi(
    "The office announced cooperation on a rehabilitation-centre initiative at the situation-assessment stage. This records planning, not centres opened or patients treated.",
    "Ofishin ya sanar da haɗin gwiwa kan shirin cibiyoyin gyaran lafiya da ke matakin tantance halin da ake ciki. Wannan shiri ne; bai tabbatar da buɗe cibiyoyi ko jinyar marasa lafiya ba."),
  "school-blind-support-2025": bi(
    "The office reports food and financial assistance for the FCT School of the Blind with SMEDAN. No cash total or recipient count is established; requested assistive aids were needs raised, not devices shown to have been delivered.",
    "Ofishin ya ruwaito tallafin abinci da kuɗi ga makarantar makafi ta FCT tare da SMEDAN. Ba a tabbatar da jimillar kuɗi ko adadin masu karɓa ba; kayan taimako da aka nema buƙatu ne da aka bayyana, ba kayan da aka tabbatar an bayar ba."),
  "ssa-appointment-2023": bi(
    "President Tinubu appointed Isa as Senior Special Assistant on Disability Matters. Later congratulatory coverage supports the same appointment; it does not establish an additional appointment or delivered services.",
    "Shugaba Tinubu ya naɗa Isa babban mataimaki na musamman kan harkokin nakasa. Rahoton taya murna na baya ya shafi naɗin nan ɗaya; bai nuna wani ƙarin naɗi ko hidimomin da aka bayar ba."),
  "startup-support-march-2024": bi(
    "The office reports startup support, including POS equipment and kits, with partner organisations. The direct source identifies women with disabilities; package details, the cash total, later income and overlap with other programmes remain unestablished.",
    "Ofishin ya ruwaito tallafin fara sana'a, ciki har da kayan POS da kayan aiki, tare da ƙungiyoyin abokan hulɗa. Majiyar kai tsaye ta bayyana mata masu nakasa; ba a tabbatar da cikakken kayan kowace mace, jimillar kuɗi, kuɗin shiga daga baya ko maimaituwa da sauran shirye-shirye ba."),
  "state-inclusion-report-unveiling-2025": bi(
    "Isa unveiled and commented on a disability-inclusion report produced by Project Enable Africa. The report's findings are contextual evidence, not service coverage delivered by Isa; its title year differs from this unveiling report's publication year.",
    "Isa ya ƙaddamar da rahoton shigar masu nakasa wanda Project Enable Africa ta samar, ya kuma yi tsokaci a kai. Sakamakon rahoton bayanin mahalli ne, ba hidimomin da Isa ya bayar ba; shekarar da ke taken rahoton ta bambanta da shekarar wallafa labarin ƙaddamarwar."),
  "supreme-court-congratulation-2023": bi(
    "Before his presidential appointment, Isa issued a congratulatory political statement after Tinubu's Supreme Court victory in his Northeast APC PWD and stakeholder-forum roles. This is political engagement, not disability service delivery or a measure of beneficiary opinion.",
    "Kafin naɗinsa a fadar shugaban ƙasa, Isa ya bayar da saƙon siyasa na taya Tinubu murna bayan hukuncin Kotun Ƙoli, a matsayinsa na jagora a harkokin APC na masu nakasa na Arewa maso Gabas da dandalin masu ruwa da tsaki. Wannan harkar siyasa ce, ba bayar da hidimar nakasa ko ma'aunin ra'ayin masu amfana ba."),
  "veterans-mou-2024": bi(
    "The office reports signing a cooperation framework with African Unconquered Foundation to support wounded veterans. The signing is office-reported; proposed employment, rehabilitation and welfare services are not measured delivery.",
    "Ofishin ya ruwaito sanya hannu kan tsarin haɗin gwiwa da African Unconquered Foundation domin tallafa wa tsofaffin sojojin da suka ji rauni. Ofishin ne ya ruwaito sanya hannun; ayyukan yi, gyaran lafiya da tallafin walwala da aka tsara ba tallafin da aka auna an bayar ba ne."),
};

function validateBundle(b) {
  const fail = () => { throw new TypeError("Invalid guided-flow bundle"); };
  if (!b || typeof b !== "object" || !isText(b.dataset_version) || !isDate(b.dataset_date)) fail();
  for (const key of ["activities", "observations", "sources", "categories", "topics", "entities", "entity_mentions", "co_occurrences", "partnerships", "model_documents"]) {
    if (!Array.isArray(b[key]) || !b[key].length) fail();
  }
  const maps = {};
  for (const key of ["activities", "observations", "sources", "categories", "topics", "entities", "partnerships"]) {
    if (b[key].some((r) => !r || !isText(r.id))) fail();
    maps[key] = new Map(b[key].map((r) => [r.id, r]));
    if (maps[key].size !== b[key].length) fail();
  }
  const sourceList = (ids) => Array.isArray(ids) && ids.length > 0 && ids.every((id) => maps.sources.has(id));
  const ev = (items) => Array.isArray(items) && items.length > 0 && items.every((e) => e && isText(e.text) && ["exact-source-excerpt", "reviewed-ledger-paraphrase"].includes(e.kind) && sourceList(e.source_ids ?? [e.source_id]) && isDate(e.report_date));
  for (const s of b.sources) {
    try { if (!/^https?:$/.test(new URL(s.url).protocol)) fail(); } catch { fail(); }
    if (!isText(s.title) || !isText(s.publisher) || !isDate(s.date)) fail();
  }
  for (const a of b.activities) {
    if (!isText(a.title?.en) || (a.description && !isBi(a.description)) || !isDate(a.report_date) || !isText(a.stage) || !isText(a.date_basis) || !isText(a.isa_role) || !Array.isArray(a.limitations) || !a.limitations.every(isText) || !sourceList(a.source_ids) || (!Array.isArray(a.evidence) || (a.evidence.length > 0 && !ev(a.evidence))) || !Array.isArray(a.categories) || !a.categories.every((id) => maps.categories.has(id)) || !Array.isArray(a.observation_ids) || !a.observation_ids.every((id) => maps.observations.get(id)?.activity_id === a.id)) fail();
    if (!activityStages[a.stage] || !isBi(a.description ?? draftActivitySummaries[a.id])) fail();
  }
  for (const o of b.observations) {
    if (!maps.activities.has(o.activity_id) || !maps.activities.get(o.activity_id).observation_ids.includes(o.id) || !Number.isFinite(o.value) || o.value < 0 || !["exact", "greater-than", "at-least", "approximate"].includes(o.bound) || !["target", "reported-delivery"].includes(o.stage) || !isText(o.population) || !isText(o.unit) || !isText(o.isa_role) || !isText(o.date_basis) || !isDate(o.report_date) || !Array.isArray(o.limitations) || !o.limitations.every(isText) || !Array.isArray(o.partners) || !Array.isArray(o.geography) || !ev(o.evidence)) fail();
  }
  for (const c of [...b.categories, ...b.topics]) if (!isBi(c.label)) fail();
  for (const t of b.topics) if (!sourceList(t.representative_source_ids) || !Array.isArray(t.terms) || !t.terms.every(isText)) fail();
  for (const e of b.entities) if (!isText(e.label) || !isText(e.kind)) fail();
  const entityList = (ids) => Array.isArray(ids) && ids.length > 0 && ids.every((id) => maps.entities.has(id));
  for (const p of b.partnerships) if (!entityList(p.entity_ids) || !ev([p.evidence]) || !isText(p.limitations) || !["reported-programme-collaboration", "stated-cooperation", "signed-mou-reported"].includes(p.kind)) fail();
  for (const m of b.entity_mentions) if (!maps.entities.has(m.entity_id) || !maps.sources.has(m.source_id)) fail();
  for (const e of b.co_occurrences) if (!entityList(e.entity_ids) || !sourceList(e.source_ids) || e.is_partnership !== false) fail();
  const seenDocs = new Set();
  for (const d of b.model_documents) {
    if (!maps.sources.has(d.source_id) || !isDate(d.publication_date) || seenDocs.has(d.source_id) || !Array.isArray(d.archive_source_aliases) || !Array.isArray(d.categories) || !d.categories.every((id) => maps.categories.has(id))) fail();
    seenDocs.add(d.source_id);
  }
  if (!b.explanations || !["scope", "figures", "dates", "categories", "topics", "connections", "language"].every((key) => isBi(b.explanations[key])) || !b.method?.model || b.method.model.n_components !== b.topics.length) fail();
  return maps;
}

function observationClaim(o, evidence = o.evidence, population = o.population) {
  return {
    metric: o.id.split(":").at(-1), value: o.value, bound: o.bound,
    unit: o.unit, population, stage: o.stage, dateBasis: "reportDate",
    reportDate: o.report_date, reportYear: Number(o.report_date.slice(0, 4)),
    evidenceDateBasis: o.date_basis, attribution: o.isa_role,
    activityIds: [o.activity_id], observationIds: [o.id], sourceIds: refs(evidence),
    limitations: [...o.limitations], partners: [...o.partners], geography: [...o.geography],
    eventDate: o.event_date,
  };
}

/** Throws TypeError for malformed data and RangeError for an unknown node. */
export function getFlowNode(bundle, nodeId = "start") {
  const maps = validateBundle(bundle);
  if (typeof nodeId !== "string") throw new RangeError("Unknown guided-flow node");
  const b = bundle;
  const nodes = new Map();
  const add = (id, title, question, extra = {}) => {
    const node = { id, title, question, paragraphs: [], items: [], options: [], sourceIds: [], activityIds: [], claims: [], terminal: false, haReviewed: false, ...extra };
    if (node.terminal) node.options = [...node.options, restart()];
    nodes.set(id, node);
    return node;
  };
  const explain = (key) => bi(b.explanations[key].en, b.explanations[key].ha);
  const activityOption = (a) => option(`activity:${a.id}`, activityTitle(a), bi(`${a.report_date} · ${activityStages[a.stage].en}`, `${a.report_date} · ${activityStages[a.stage].ha}`));
  const sourceEvidence = (a) => evidenceItems(a.evidence.length ? a.evidence : b.observations.filter((o) => o.activity_id === a.id).flatMap((o) => o.evidence));
  const record = (a) => ({ reportDate: a.report_date, dateBasis: a.date_basis, stage: a.stage, role: a.isa_role, limitations: [...a.limitations] });
  const sourceItem = (id) => ({ id, label: bi(maps.sources.get(id).title, maps.sources.get(id).title), sourceIds: [id], originalLanguage: "en" });
  // A shared citation is a useful reading route, never a claim of partnership.
  const relatedActivityOptions = (sourceIds) => b.activities
    .filter((a) => a.source_ids.some((id) => sourceIds.includes(id)))
    .slice(0, 3).map((a) => ({ ...activityOption(a), description: bi(
      "Activity in a cited report; shared reporting does not establish a partnership",
      "Aiki a rahoton da aka ambata; rahoto ɗaya ba ya tabbatar da haɗin gwiwa",
    ) }));
  const claimCount = (metric, value, unit, population, sourceIds, activityIds = [], reportYear) => ({
    metric, value, bound: "exact", unit, population, stage: "dataset-description", dateBasis: "reportDate",
    reportDate: b.dataset_date, reportYear: reportYear ?? Number(b.dataset_date.slice(0, 4)), evidenceDateBasis: "Selected dataset snapshot; publication year for report filters.",
    attribution: "Derived from the selected reviewed bundle; not an independent impact audit.", activityIds, observationIds: [], sourceIds,
    limitations: ["Selected coverage only. Counts do not establish unique beneficiaries or lifetime impact."], partners: [], geography: [], eventDate: null,
  });
  const stages = {
    "reported-delivery": bi("Reported delivery", "Tallafin da rahoto ya bayyana"),
    target: bi("Target — planned", "Manufa — shiri"),
  };
  const bounds = { exact: bi("", ""), "greater-than": bi("More than ", "Fiye da "), "at-least": bi("At least ", "Aƙalla "), approximate: bi("About ", "Kusan ") };
  const units = { people: bi("people", "mutane"), households: bi("households", "gidaje"), "job opportunities": bi("job opportunities", "damar ayyukan yi") };
  const measureLabel = (o) => bi(
    `${stages[o.stage].en}: ${bounds[o.bound].en}${o.value.toLocaleString("en-NG")} ${o.unit}`,
    `${stages[o.stage].ha}: ${bounds[o.bound].ha}${o.value.toLocaleString("en-NG")} ${units[o.unit]?.ha ?? o.unit}`,
  );

  add("start", bi("Explore the record", "Bincika bayanan ayyuka"), bi("What would you like to explore?", "Me kake son bincikawa?"), {
    paragraphs: [bi("Choose a question to follow the checked records, figures and sources. Hausa wording is a draft for owner review.", "Zaɓi tambaya domin duba bayanai, lambobi da majiyoyi. Kalmomin Hausa na gwaji ne domin bitar mai aikin."), explain("scope")],
    options: [
      option("women", bi("Support for women with disabilities", "Tallafi ga mata masu nakasa")),
      option("programmes", bi("Programmes and reported figures", "Shirye-shirye da lambobin rahoto")),
      option("timeline", bi("Explore by report year", "Bincika ta shekarar rahoto")),
      option("themes", bi("Themes and categories", "Jigogi da rukunoni")),
      option("connections", bi("People, organisations and connections", "Mutane, ƙungiyoyi da alaƙa")),
      option("scope", bi("Evidence and coverage limits", "Hujjoji da iyakokin bayanai")),
    ],
  });
  const womenObservations = b.observations.flatMap((o) => {
    const evidence = o.evidence.filter((e) => /women with disabilities/i.test(e.population ?? ""));
    return evidence.length ? [{ o, evidence }] : [];
  });
  add("women", bi("Support for women with disabilities", "Tallafi ga mata masu nakasa"), bi("What do the women-focused reports establish?", "Me rahotannin tallafin mata suka bayyana?"), {
    paragraphs: [bi("The source contexts identify these separate women-focused cohorts. Each figure belongs to its own activity; repeat reports are additional evidence, not additional recipients. Do not add the cohorts as unique people. Income and employment outcomes are unmeasured.", "Bayanan majiyoyi sun bayyana waɗannan rukunonin mata daban-daban. Kowace lamba ta shafi nata aiki; maimaita rahoto ba ƙarin mutane ba ne. Ba za a haɗa su a matsayin mutane mabambanta ba. Ba a auna sakamakon kuɗin shiga ko aikin yi ba."), explain("figures")],
    claims: womenObservations.map(({ o, evidence }) => ({ ...observationClaim(o, evidence, evidence[0].population), attribution: evidence[0].isa_role ?? o.isa_role, partners: [...(evidence[0].partners ?? o.partners)] })),
    sourceIds: unique(womenObservations.flatMap(({ evidence }) => refs(evidence))),
    activityIds: womenObservations.map(({ o }) => o.activity_id),
    items: womenObservations.map(({ o }) => ({ id: o.id, label: activityTitle(maps.activities.get(o.activity_id)), meta: measureLabel(o), sourceIds: refs(o.evidence) })),
    options: womenObservations.map(({ o }) => activityOption(maps.activities.get(o.activity_id))),
  });
  add("programmes", bi("Programmes and figures", "Shirye-shirye da lambobi"), bi("Which recorded activity would you like to examine?", "Wane aiki kake son dubawa?"), {
    paragraphs: [explain("figures")], options: b.observations.map((o) => option(`measure:${o.id}`, measureLabel(o), activityTitle(maps.activities.get(o.activity_id)))),
  });
  const years = unique(b.activities.map((a) => a.report_date.slice(0, 4)).concat(b.model_documents.map((d) => d.publication_date.slice(0, 4)))).sort();
  add("timeline", bi("Report timeline", "Jadawalin rahotanni"), bi("Which publication year?", "Wace shekarar wallafa rahoto?"), {
    paragraphs: [explain("dates"), explain("scope")], options: years.map((year) => option(`year:${year}`, bi(year, year))),
  });
  for (const year of years) {
    const activities = b.activities.filter((a) => a.report_date.startsWith(year));
    const docs = b.model_documents.filter((d) => d.publication_date.startsWith(year));
    const sourceIds = unique(docs.map((d) => d.source_id).concat(activities.flatMap((a) => a.source_ids)));
    add(`year:${year}`, bi(`Reports in ${year}`, `Rahotanni a ${year}`), bi("Which activity would you like to open?", "Wane aiki kake son buɗewa?"), {
      paragraphs: [bi(`${docs.length} distinct canonical model reports; ${activities.length} activity records by canonical activity report date. These are different units. Publication year is not an event date. The latest year is partial.`, `Rahotannin samfurin da ba su maimaitu ba: ${docs.length}; bayanan ayyuka ta ranar rahoto: ${activities.length}. Waɗannan ma'aunai ne daban. Shekarar wallafa ba ranar taron ba ce. Shekarar ƙarshe ba ta cika ba.`)],
      sourceIds, activityIds: activities.map((a) => a.id),
      claims: [claimCount("canonical-reports-by-publication-year", docs.length, "reports", "Distinct canonical model reports", docs.map((d) => d.source_id), [], Number(year)), claimCount("activity-records-by-report-year", activities.length, "activities", "Activity records by canonical report date", unique(activities.flatMap((a) => a.source_ids)), activities.map((a) => a.id), Number(year))],
      options: activities.map(activityOption),
    });
  }
  for (const a of b.activities) {
    const observations = b.observations.filter((o) => o.activity_id === a.id);
    add(`activity:${a.id}`, activityTitle(a), bi("What would you like to check about this record?", "Me kake son dubawa game da wannan bayani?"), {
      paragraphs: [a.description ?? draftActivitySummaries[a.id], bi(`Report date: ${a.report_date}. ${activityStages[a.stage].en}.`, `Ranar rahoto: ${a.report_date}. ${activityStages[a.stage].ha}.`), bi("The original English evidence below preserves the recorded role, date qualifications and limitations.", "Hujjar Turanci ta asali a ƙasa tana kiyaye rawar da aka ruwaito, sharuddan rana da iyakoki.")],
      sourceIds: [...a.source_ids], activityIds: [a.id], evidence: sourceEvidence(a), record: record(a),
      options: [...observations.map((o) => option(`measure:${o.id}`, measureLabel(o))), option(`evidence:${a.id}`, bi("Read evidence and sources", "Karanta hujjoji da majiyoyi"))],
    });
    add(`evidence:${a.id}`, activityTitle(a), bi("What does the original record say?", "Me bayanin asali ya ce?"), {
      terminal: true, paragraphs: [explain("scope"), explain("dates")], sourceIds: [...a.source_ids], activityIds: [a.id], evidence: sourceEvidence(a), record: record(a), items: a.source_ids.map(sourceItem),
      options: observations.map((o) => option(`measure:${o.id}`, measureLabel(o))),
    });
  }
  for (const o of b.observations) add(`measure:${o.id}`, activityTitle(maps.activities.get(o.activity_id)), bi("What figure is supported, and with what limits?", "Wace lamba aka ruwaito, da waɗanne iyakoki?"), {
    terminal: true, paragraphs: [measureLabel(o), explain("figures"), bi("Read the original English population, attribution and limitations with this figure; they are part of the claim.", "Karanta bayanin mutanen da lambar ta shafa, rawar da aka ruwaito da iyakoki a Turanci na asali; suna cikin bayanin lambar.")],
    claims: [observationClaim(o)], sourceIds: refs(o.evidence), activityIds: [o.activity_id], evidence: evidenceItems(o.evidence),
    options: [
      option(`activity:${o.activity_id}`, bi("What was reported for this activity?", "Me aka ruwaito game da wannan aiki?")),
      ...b.observations.filter((other) => other.activity_id === o.activity_id && other.id !== o.id)
        .map((other) => option(`measure:${other.id}`, measureLabel(other), bi("A separate measure from the same activity", "Wata ma'auni dabam daga wannan aiki"))),
      option(`evidence:${o.activity_id}`, bi("Read this activity's evidence and sources", "Karanta hujjoji da majiyoyin wannan aiki")),
    ],
  });
  add("themes", bi("Themes and categories", "Jigogi da rukunoni"), bi("Choose a way to explore the texts", "Zaɓi hanyar bincika rubutun"), {
    paragraphs: [explain("topics"), explain("categories"), explain("language")],
    options: [option("categories", bi("Reviewed categories", "Rukunonin da aka bincika")), ...b.topics.map((t) => option(`topic:${t.id}`, t.label))],
  });
  add("categories", bi("Reviewed categories", "Rukunonin da aka bincika"), bi("Which category?", "Wane rukuni?"), { paragraphs: [explain("categories")], options: b.categories.map((c) => option(`category:${c.id}`, c.label)) });
  for (const c of b.categories) {
    const activities = b.activities.filter((a) => a.categories.includes(c.id));
    add(`category:${c.id}`, c.label, bi("Which activity?", "Wane aiki?"), { paragraphs: [explain("categories")], sourceIds: unique(activities.flatMap((a) => a.source_ids)), activityIds: activities.map((a) => a.id), options: activities.map(activityOption) });
  }
  for (const t of b.topics) add(`topic:${t.id}`, t.label, bi("What does this model theme describe?", "Me wannan jigon samfurin yake bayyanawa?"), {
    terminal: true, paragraphs: [explain("topics"), explain("language"), bi(`Saved TF-IDF/NMF topic. Terms: ${t.terms.join(", ")}. These patterns do not establish delivery, impact or women-only eligibility.`, `Jigon TF-IDF/NMF da aka adana. Kalmomi: ${t.terms.join(", ")}. Waɗannan ba hujjar bayar da tallafi, tasiri ko cancantar mata kaɗai ba ne.`)],
    sourceIds: [...t.representative_source_ids], items: t.representative_source_ids.map(sourceItem),
    options: relatedActivityOptions(t.representative_source_ids),
  });
  add("connections", bi("Connections in the records", "Alaƙa a cikin bayanai"), bi("Which kind of connection?", "Wace irin alaƙa?"), {
    paragraphs: [explain("connections"), bi(`${b.entities.length} reviewed dictionary entities; ${b.co_occurrences.length} article co-occurrence edges; ${b.partnerships.length} separately evidenced relationship records. A shared article is not proof of partnership.`, `Sunayen ƙamus da aka bincika: ${b.entities.length}; alaƙar bayyana a labari ɗaya: ${b.co_occurrences.length}; bayanan alaƙa masu hujja dabam: ${b.partnerships.length}. Bayyana a labari ɗaya ba hujjar haɗin gwiwa ba ce.`)],
    options: [option("relationships", bi("Cooperation and signing evidence", "Hujjar haɗin gwiwa da sanya hannu")), option("entities", bi("People, organisations and places", "Mutane, ƙungiyoyi da wurare"))],
    sourceIds: unique(b.co_occurrences.flatMap((e) => e.source_ids).concat(b.partnerships.flatMap((p) => refs([p.evidence])))),
    claims: [
      claimCount("dictionary-entities", b.entities.length, "entities", "Reviewed dictionary of people, organisations and places", unique(b.entity_mentions.map((m) => m.source_id))),
      claimCount("article-co-occurrence-edges", b.co_occurrences.length, "edges", "Pairs of dictionary names appearing in canonical articles; not partnerships", unique(b.co_occurrences.flatMap((e) => e.source_ids))),
      claimCount("evidenced-relationships", b.partnerships.length, "relationships", "Separately evidenced relationship records", unique(b.partnerships.flatMap((p) => refs([p.evidence])))),
    ],
  });
  const relationshipLabel = (p) => bi(p.entity_ids.map((id) => maps.entities.get(id).label).join(" / "), p.entity_ids.map((id) => maps.entities.get(id).label).join(" / "));
  const kinds = {
    "reported-programme-collaboration": bi("Reported programme collaboration", "Haɗin gwiwar shiri da aka ruwaito"),
    "stated-cooperation": bi("Stated cooperation intention", "An bayyana niyyar haɗin gwiwa"),
    "signed-mou-reported": bi("Reported MOU signing", "An ruwaito sanya hannu kan MOU"),
  };
  add("relationships", bi("Evidence of cooperation", "Hujjar haɗin gwiwa"), bi("Which relationship record?", "Wane bayanin alaƙa?"), {
    paragraphs: [explain("connections")], options: b.partnerships.map((p) => option(`relationship:${p.id}`, relationshipLabel(p), kinds[p.kind])),
    sourceIds: unique(b.partnerships.flatMap((p) => refs([p.evidence]))),
    claims: Object.keys(kinds).map((kind) => {
      const selected = b.partnerships.filter((p) => p.kind === kind);
      return claimCount(kind, selected.length, "relationships", kinds[kind].en, unique(selected.flatMap((p) => refs([p.evidence]))));
    }),
  });
  for (const p of b.partnerships) add(`relationship:${p.id}`, relationshipLabel(p), bi("What is evidenced?", "Wace hujja ake da ita?"), { terminal: true, paragraphs: [kinds[p.kind], explain("connections")], evidence: evidenceItems([{ ...p.evidence, limitations: p.limitations }]), sourceIds: refs([p.evidence]), options: relatedActivityOptions(refs([p.evidence])) });
  add("entities", bi("Entity dictionary", "Ƙamus na sunaye"), bi("Choose a recorded name", "Zaɓi suna daga bayanai"), { paragraphs: [bi("A reviewed name dictionary, not exhaustive automatic entity recognition. Names remain in their original form.", "Ƙamus na sunaye da aka bincika ne; ba cikakken gano sunaye ta atomatik ba. Sunaye suna nan yadda suke.")], options: b.entities.map((e) => option(`entity:${e.id}`, bi(e.label, e.label), bi(e.kind, e.kind))) });
  for (const e of b.entities) {
    const mentions = b.entity_mentions.filter((m) => m.entity_id === e.id);
    const edges = b.co_occurrences.filter((edge) => edge.entity_ids.includes(e.id));
    const sourceIds = unique(mentions.map((m) => m.source_id).concat(edges.flatMap((edge) => edge.source_ids)));
    add(`entity:${e.id}`, bi(e.label, e.label), bi("Where is this name mentioned?", "A ina aka ambaci wannan suna?"), { terminal: true, paragraphs: [explain("connections")], sourceIds, items: sourceIds.map(sourceItem), options: relatedActivityOptions(sourceIds) });
  }
  const allSources = b.sources.map((s) => s.id);
  add("scope", bi("Evidence and coverage", "Hujjoji da iyakokin bayanai"), bi("What can this dataset establish?", "Me wannan kundin bayanai zai iya tabbatarwa?"), {
    terminal: true, paragraphs: [explain("scope"), explain("figures"), explain("dates"), explain("language"), bi("Office reports are attributed accounts, not independent confirmation. No reliable total of unique beneficiaries, complete career coverage, cash total or causal impact is established. Hausa wording remains draft for owner review.", "Rahotannin ofishi bayanai ne da aka danganta ga majiyoyi; ba tabbaci mai zaman kansa ba. Ba a tabbatar da jimillar mutane mabambanta, cikakken tarihin ayyuka, jimillar kuɗi ko tasiri na sanadi ba. Kalmomin Hausa na gwaji ne domin bitar mai aikin.")],
    sourceIds: allSources, claims: [claimCount("reviewed-activity-records", b.activities.length, "activities", "Activity records in the selected bundle", allSources, b.activities.map((a) => a.id)), claimCount("numerical-observations", b.observations.length, "observations", "Typed delivery and target observations; not beneficiaries", unique(b.observations.flatMap((o) => refs(o.evidence))))],
  });
  const node = nodes.get(nodeId);
  if (!node) throw new RangeError("Unknown guided-flow node");
  // Never return source references that cannot be resolved by the UI.
  for (const n of nodes.values()) {
    if (!n.options.length || n.options.some((o) => !nodes.has(o.target)) || n.sourceIds.some((id) => !maps.sources.has(id))) throw new TypeError("Invalid guided-flow graph");
  }
  return structuredClone(node);
}
