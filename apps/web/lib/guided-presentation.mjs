/** Short reading surfaces over immutable evidence nodes. Hausa wording remains draft. */
const bi = (en, ha) => ({ en, ha });
const original = (id, text) => ({ id, label: bi(text, text), originalLanguage: "en" });
const contexts = {
  "beyond-disability-coordination-2024": bi("Projected nationwide opportunities, not delivered jobs.", "Damar aikin yi da aka tsara a ƙasa; ba ayyukan da aka riga aka samar ba."),
  "borno-employment-2024": bi("Office-reported Borno State placements after engagement; not jobs created by Isa alone. Retention unverified.", "Ofishin ya ruwaito samun aikin yi a Borno bayan tattaunawa; ba Isa shi kaɗai ya samar ba. Ba a tabbatar da ci gaba da aikin ba."),
  "inclusive-business-skills": bi("PWD training and startup support: one cohort, not two totals. Later income and jobs unmeasured.", "Horo da tallafin fara sana'a ga masu nakasa: rukuni ɗaya ne. Ba a auna kuɗin shiga ko aikin yi daga baya ba."),
  "nigwed-skills-2024": bi("Office-reported NigWED training for women with disabilities; training and support are one cohort. Jobs and income unmeasured.", "Ofishin ya ruwaito horon NigWED ga mata masu nakasa; horo da tallafi rukuni ɗaya ne. Ba a auna aikin yi ko kuɗin shiga ba."),
  "ramadan-food-2024": bi("Office-reported food distribution for PWD recipients with the foundation. Recipient overlap is unknown.", "Ofishin ya ruwaito rabon abinci ga masu nakasa tare da gidauniyar. Ba a san maimaituwar masu karɓa ba."),
  "karu-food-cash-2024": bi("Karu recipients and targeted households are different measures. Do not add them; cash total and overlap are unknown.", "Masu karɓa a Karu da gidajen da aka tsara tallafa wa ma'aunai ne daban. Kada a haɗa su; ba a san jimillar kuɗi ko maimaituwar mutane ba."),
  "northeast-food-support-target-2024": bi("Planned Northeast expansion; delivery is not established. Overlap with Karu is unknown.", "Shirin faɗaɗawa zuwa Arewa maso Gabas; ba a tabbatar da bayar da tallafi ba. Ba a san maimaituwa da Karu ba."),
  "ayubson-event-2025": bi("Office collaboration with Ayubson: participation and gifts, not jobs or measured income. Isa was represented.", "Haɗin gwiwar ofishi da Ayubson: halarta da kyaututtuka, ba aikin yi ko kuɗin shiga da aka auna ba. An wakilci Isa."),
  "fha-stalls-2025": bi("The bank handed over stall-allotment documents; the office participated. Income gains and grant values unmeasured.", "Bankin ya miƙa takardun rabon rumfuna; ofishin ya halarta. Ba a auna ƙarin kuɗin shiga ko darajar tallafin ba."),
  "startup-support-march-2024": bi("Office-reported startup support with partners. Packages, cash total and overlap are unknown; no later income measured.", "Ofishin ya ruwaito tallafin fara sana'a tare da abokan hulɗa. Ba a san kunshin tallafi, jimillar kuɗi ko maimaituwar mutane ba; ba a auna kuɗin shiga daga baya ba."),
};

export function getConciseAnswer(node) {
  const result = { title: node.id === "start" ? node.question : node.title, paragraphs: [], items: [] };
  if (node.id === "women") {
    result.paragraphs = [bi("Separate women-focused cohorts. Do not add as unique people; income and employment outcomes are unmeasured.", "Rukunonin mata ne daban. Kada a haɗa su a matsayin mutane mabambanta; ba a auna kuɗin shiga ko aikin yi ba.")];
    result.items = node.items.map((item) => ({ ...item, label:
      item.id === "nigwed-skills-2024:trainees" ? bi("NigWED", "NigWED") :
      item.id === "startup-support-march-2024:recipients" ? bi("Startup support", "Tallafin fara sana’a") : item.label,
    }));
  } else if (node.id.startsWith("activity:")) {
    result.paragraphs = node.paragraphs.slice(0, 1);
  } else if (node.id.startsWith("measure:")) {
    result.paragraphs = [node.paragraphs[0], contexts[node.activityIds[0]] ?? bi("Office-reported figure; outcomes and attribution require the source details.", "Lambar da ofishi ya ruwaito; duba majiyar domin sakamako da rawar da aka ruwaito.")];
  } else if (node.id.startsWith("relationship:")) {
    result.paragraphs = node.paragraphs.slice(0, 1);
    result.items = (node.evidence ?? []).flatMap((e, index) => [
      original(`attribution:${index}`, e.text),
      ...(e.limitations ? [original(`limitations:${index}`, e.limitations)] : []),
    ]);
  } else if (node.id.startsWith("topic:")) {
    result.paragraphs = [bi("Modelled text theme, not proof of delivery, impact or women-only eligibility.", "Jigon rubutu daga samfurin; ba hujjar bayar da tallafi, tasiri ko cancantar mata kaɗai ba.")];
  } else if (["connections", "relationships"].includes(node.id) || node.id.startsWith("entity:")) {
    result.paragraphs = [bi("Shared reporting does not establish a partnership. Cooperation needs separate evidence.", "Rahoto ɗaya ba ya tabbatar da haɗin gwiwa. Haɗin gwiwa na buƙatar hujja dabam.")];
  } else if (node.id === "scope") {
    result.paragraphs = [bi("Selected office reports, not independent confirmation or complete career coverage. No reliable unique-person total, cash total or causal impact is established.", "Zaɓaɓɓun rahotannin ofishi ne; ba tabbaci mai zaman kansa ko cikakken tarihin ayyuka ba. Ba a tabbatar da jimillar mutane mabambanta, jimillar kuɗi ko tasiri na sanadi ba.")];
  } else if (node.id.startsWith("year:")) {
    result.paragraphs = node.paragraphs.slice(0, 1);
  }
  return structuredClone(result);
}

export function paginate(items, page, size = 3) {
  if (!Array.isArray(items) || !Number.isInteger(size) || size < 1) throw new TypeError("Invalid pagination input");
  const pageCount = Math.max(1, Math.ceil(items.length / size));
  const requested = Number.isFinite(page) ? Math.trunc(page) : 0;
  const current = Math.min(pageCount - 1, Math.max(0, requested));
  return { items: items.slice(current * size, (current + 1) * size), page: current, pageCount };
}

/** Preserve every character; a word longer than max remains an intact segment. */
export function splitText(text, max = 400) {
  if (typeof text !== "string" || !Number.isInteger(max) || max < 1) throw new TypeError("Invalid text segmentation input");
  if (!text.length) return [];
  const tokens = text.match(/\s+|\S+/gu);
  const segments = [];
  let current = "";
  for (const token of tokens) {
    if (current && current.length + token.length > max) { segments.push(current); current = ""; }
    current += token;
  }
  if (current) segments.push(current);
  return segments;
}

/** Resolve stored evidence for a selected report without treating shared reporting as a new claim. */
export function getSourceEvidence(bundle, node, sourceId) {
  if (!node.sourceIds.includes(sourceId)) return [];
  const direct = (node.evidence ?? []).filter((evidence) => evidence.sourceId === sourceId);
  if (direct.length) return structuredClone(direct);
  const activityIds = new Set([...node.activityIds, ...node.claims.flatMap((claim) => claim.activityIds)]);
  const observationIds = new Set(node.claims.flatMap((claim) => claim.observationIds));
  const scoped = [
    ...bundle.observations.filter((observation) => observationIds.has(observation.id) || activityIds.has(observation.activity_id)),
    ...bundle.activities.filter((activity) => activityIds.has(activity.id)),
  ];
  const fromRecords = (records) => records.flatMap((record) => record.evidence ?? [])
    .filter((evidence) => (evidence.source_ids ?? [evidence.source_id]).includes(sourceId));
  let candidates = fromRecords(scoped);
  if (!candidates.length) candidates = fromRecords([...bundle.observations, ...bundle.activities]);
  const unique = new Map();
  for (const evidence of candidates) {
    const entry = { sourceId, text: evidence.text, kind: evidence.kind, reportDate: evidence.report_date,
      role: evidence.isa_role, limitations: evidence.limitations, dateBasis: evidence.date_basis };
    unique.set(JSON.stringify(entry), entry);
  }
  return structuredClone([...unique.values()]);
}
