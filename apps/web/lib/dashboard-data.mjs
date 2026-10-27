/** Descriptive selections over the frozen reviewed bundle. Never sums people. */
const uniq = (values) => [...new Set(values)];
const evidenceSources = (e) => e.source_ids ?? [e.source_id];
const yearOf = (date) => date.slice(0, 4);

function indexBundle(bundle) {
  const fail = () => { throw new TypeError("Invalid dashboard bundle references or dimensions"); };
  const arrays = ["activities", "observations", "sources", "categories", "topics", "model_documents", "entities", "entity_mentions", "co_occurrences", "partnerships"];
  if (!bundle || arrays.some((key) => !Array.isArray(bundle[key]))) fail();
  const map = (values) => {
    const result = new Map(values.map((v) => [v.id, v]));
    if (result.size !== values.length || values.some((v) => typeof v.id !== "string" || !v.id)) fail();
    return result;
  };
  const activities = map(bundle.activities), sources = map(bundle.sources), categories = map(bundle.categories), entities = map(bundle.entities);
  const observations = map(bundle.observations);
  map(bundle.topics); map(bundle.partnerships);
  const validSources = (ids) => Array.isArray(ids) && ids.length > 0 && ids.every((id) => sources.has(id));
  const date = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value));
  if (bundle.sources.some((s) => !/^https?:\/\//.test(s.url) || !date(s.date))) fail();
  for (const a of bundle.activities) {
    if (!validSources(a.source_ids) || !date(a.report_date) || !Array.isArray(a.categories) || a.categories.some((id) => !categories.has(id)) || !Array.isArray(a.observation_ids) || a.observation_ids.some((id) => observations.get(id)?.activity_id !== a.id)) fail();
  }
  for (const o of bundle.observations) {
    if (!activities.has(o.activity_id) || !Number.isFinite(o.value) || o.value < 0 || !["exact", "greater-than", "at-least", "approximate"].includes(o.bound) || !["target", "reported-delivery"].includes(o.stage) || !date(o.report_date) || !o.unit || !o.population || !Array.isArray(o.evidence) || !o.evidence.length || o.evidence.some((e) => !validSources(evidenceSources(e)))) fail();
    const activity = activities.get(o.activity_id);
    if (!activity.observation_ids.includes(o.id) || o.evidence.flatMap(evidenceSources).some((id) => !activity.source_ids.includes(id))) fail();
  }
  const docBySource = new Map();
  const docIds = new Set();
  for (const d of bundle.model_documents) {
    if (docIds.has(d.source_id) || !sources.has(d.source_id) || !date(d.publication_date) || !Array.isArray(d.topic_shares) || d.topic_shares.length !== bundle.topics.length || d.topic_shares.some((v) => !Number.isFinite(v) || v < 0)) fail();
    docIds.add(d.source_id);
    const archiveIds = new Set([d.archive_source_id, ...(d.archive_source_aliases ?? [])].map(String));
    const aliases = bundle.sources.filter((s) => s.id === d.source_id || (s.archive_source_ids ?? []).some((id) => archiveIds.has(String(id))) || (s.source_id_aliases ?? []).includes(d.source_id)).map((s) => s.id);
    for (const id of aliases) {
      if (docBySource.has(id) && docBySource.get(id) !== d) fail();
      docBySource.set(id, d);
    }
  }
  for (const t of bundle.topics) if (!validSources(t.representative_source_ids)) fail();
  for (const m of bundle.entity_mentions) if (!entities.has(m.entity_id) || !sources.has(m.source_id)) fail();
  for (const edge of bundle.co_occurrences) if (!validSources(edge.source_ids) || edge.entity_ids.some((id) => !entities.has(id)) || edge.source_ids.some((id) => !docBySource.has(id))) fail();
  for (const p of bundle.partnerships) if (!validSources(evidenceSources(p.evidence)) || p.entity_ids.some((id) => !entities.has(id))) fail();
  return { activities, sources, categories, docBySource };
}

const availableYears = (bundle) => uniq(bundle.activities.map((a) => yearOf(a.report_date)).concat(bundle.model_documents.map((d) => yearOf(d.publication_date)))).sort();
function normalize(bundle, input = {}) {
  const supplied = input && typeof input === "object" ? input : {};
  const choose = (value, values) => values.includes(value) ? value : "all";
  return {
    year: choose(supplied.year, availableYears(bundle)),
    category: choose(supplied.category, bundle.categories.map((c) => c.id)),
    activity: choose(supplied.activity, bundle.activities.map((a) => a.id)),
  };
}

export function normalizeDashboardFilters(bundle, input) {
  indexBundle(bundle);
  return normalize(bundle, input);
}

export function buildDashboardView(bundle, input) {
  const index = indexBundle(bundle);
  const filters = normalize(bundle, input);
  const activities = bundle.activities.filter((a) =>
    (filters.year === "all" || yearOf(a.report_date) === filters.year) &&
    (filters.category === "all" || a.categories.includes(filters.category)) &&
    (filters.activity === "all" || a.id === filters.activity),
  ).sort((a, b) => b.report_date.localeCompare(a.report_date) || a.id.localeCompare(b.id));
  const activityIds = new Set(activities.map((a) => a.id));
  const observations = bundle.observations.filter((o) => activityIds.has(o.activity_id));
  // Follow-up evidence remains cited even when published outside the activity's year.
  const sourceIds = uniq(activities.flatMap((a) => a.source_ids));
  const selectedSources = new Set(sourceIds);
  const selectedDocuments = new Set(sourceIds.map((id) => index.docBySource.get(id)).filter(Boolean));
  const documents = bundle.model_documents.filter((d) => selectedDocuments.has(d) && (filters.year === "all" || yearOf(d.publication_date) === filters.year));
  const documentIds = new Set(documents.map((d) => d.source_id));
  const modelSources = new Set([...index.docBySource].filter(([, d]) => documentIds.has(d.source_id)).map(([id]) => id));
  const modelled = documents.filter((d) => d.topic_shares.some((v) => v > 0));
  const years = availableYears(bundle);
  const entities = bundle.entities.map((e) => ({ ...e, mentions: bundle.entity_mentions.filter((m) => m.entity_id === e.id && modelSources.has(m.source_id)).length })).filter((e) => e.mentions > 0);
  return {
    filters, activities, observations, sourceIds, sources: sourceIds.map((id) => index.sources.get(id)),
    timeline: years.map((year) => ({ year, count: activities.filter((a) => yearOf(a.report_date) === year).length })),
    categories: bundle.categories.map((c) => ({ id: c.id, label: c.label, count: activities.filter((a) => a.categories.includes(c.id)).length })),
    topics: bundle.topics.map((t, i) => ({ id: t.id, label: t.label, terms: t.terms, meanShare: modelled.length ? modelled.reduce((total, d) => total + d.topic_shares[i], 0) / modelled.length : null, modelledDocumentCount: modelled.length, representativeSourceIds: t.representative_source_ids.filter((id) => modelSources.has(id)) })),
    modelDocumentCount: documents.length, modelledDocumentCount: modelled.length,
    canonicalReportYears: years.map((year) => ({ year, count: documents.filter((d) => yearOf(d.publication_date) === year).length })),
    relationships: bundle.partnerships.filter((p) => evidenceSources(p.evidence).some((id) => selectedSources.has(id))),
    entities,
    coOccurrences: bundle.co_occurrences.flatMap((edge) => {
      const ids = edge.source_ids.filter((id) => modelSources.has(id));
      return ids.length ? [{ ...edge, source_ids: ids, supporting_unique_documents: new Set(ids.map((id) => index.docBySource.get(id).source_id)).size }] : [];
    }),
    inventory: { activities: activities.length, reportedFigures: observations.filter((o) => o.stage === "reported-delivery").length, targets: observations.filter((o) => o.stage === "target").length, citations: sourceIds.length },
    years, activityOptions: [...bundle.activities].sort((a, b) => b.report_date.localeCompare(a.report_date) || a.id.localeCompare(b.id)), categoryOptions: bundle.categories,
  };
}

// CSV textual cells are neutralized before quoting; numeric measures remain numeric.
const csvCell = (value) => {
  if (typeof value === "number") return String(value);
  let text = value == null ? "" : Array.isArray(value) ? value.join(" | ") : String(value);
  if (/^[\s\u0000-\u001f]*[=+@-]/u.test(text) || /^[\t\r\n]/u.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
};
const csv = (headers, rows) => [headers.map(csvCell).join(","), ...rows.map((row) => row.map(csvCell).join(","))].join("\r\n") + "\r\n";
const sourceUrls = (view, ids) => ids.map((id) => view.sources.find((s) => s.id === id)?.url ?? "");

export function exportActivitiesCsv(view) {
  return csv(["activity_id", "title_en", "report_date", "event_date", "date_basis", "stage", "categories", "isa_role", "limitations", "observation_ids", "typed_observations_json", "source_ids", "source_urls"], view.activities.map((a) => [a.id, a.title.en, a.report_date, a.event_date, a.date_basis, a.stage, a.categories, a.isa_role, a.limitations, a.observation_ids, JSON.stringify(view.observations.filter((o) => o.activity_id === a.id).map((o) => ({ id: o.id, value: o.value, bound: o.bound, unit: o.unit, population: o.population, stage: o.stage }))), a.source_ids, sourceUrls(view, a.source_ids)]));
}

export function exportObservationsCsv(view) {
  return csv(["observation_id", "activity_id", "value", "bound", "unit", "population", "stage", "report_date", "event_date", "date_basis", "isa_role", "limitations", "source_ids", "source_urls"], view.observations.map((o) => {
    const ids = uniq(o.evidence.flatMap(evidenceSources));
    return [o.id, o.activity_id, o.value, o.bound, o.unit, o.population, o.stage, o.report_date, o.event_date, o.date_basis, o.isa_role, o.limitations, ids, sourceUrls(view, ids)];
  }));
}
