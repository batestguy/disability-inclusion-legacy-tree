/** Local presentation supplement. The frozen v1 evidence bundle is never edited. */
import catalogue from "../../../content/dashboard/presentation.json" with { type: "json" };
import { buildDashboardView } from "./dashboard-data.mjs";
import { getActivityPresentation } from "./guided-flow.mjs";
const uniq = (values) => [...new Set(values)];
const copy = (value) => structuredClone(value);
const fail = () => { throw new TypeError("Invalid dashboard presentation evidence or references"); };
const text = (v) => v && typeof v.en === "string" && !!v.en.trim() && typeof v.ha === "string" && !!v.ha.trim();
const ids = (values) => Array.isArray(values) && values.every((v) => typeof v === "string" && v) && uniq(values).length === values.length;
const evidenceIds = (e) => e.source_ids ?? [e.source_id];

export function buildDashboardPresentation(bundle) {
  // Reuse the evidence validator, including stage/bound/reference constraints.
  buildDashboardView(bundle);
  const activities = new Map(bundle.activities.map((a) => [a.id, a]));
  const sources = new Map(bundle.sources.map((s) => [s.id, s]));
  const entities = new Map(bundle.entities.map((e) => [e.id, e]));
  const categories = new Set(bundle.categories.map((c) => c.id));
  const aliases = new Map();
  const canonical = new Map();
  for (const d of bundle.model_documents) {
    const archives = new Set([d.archive_source_id, ...(d.archive_source_aliases ?? [])].map(String));
    for (const s of bundle.sources) {
      if (s.id === d.source_id || (s.archive_source_ids ?? []).some((id) => archives.has(String(id))) || (s.source_id_aliases ?? []).includes(d.source_id)) {
        if (canonical.has(s.id) && canonical.get(s.id) !== d.source_id) fail();
        canonical.set(s.id, d.source_id);
      }
    }
  }
  for (const o of bundle.observations) for (const id of [o.id, ...(o.observation_id_aliases ?? [])]) {
    if (aliases.has(id) && aliases.get(id) !== o.id) fail();
    aliases.set(id, o.id);
  }
  if (catalogue.publicApproved !== false || catalogue.haReviewed !== false) fail();
  if (!ids(catalogue.groups.map((g) => g.id))) fail();
  const groups = catalogue.groups.map((g) => {
    if (!text(g.label) || !ids(g.catalogueCategoryIds) || !ids(g.additionalActivityIds) || g.catalogueCategoryIds.some((id) => !categories.has(id)) || g.additionalActivityIds.some((id) => !activities.has(id))) fail();
    return { id: g.id, label: copy(g.label), catalogueCategoryIds: [...g.catalogueCategoryIds], rationale: g.rationale,
      activityIds: bundle.activities.filter((a) => g.id === "all" || a.categories.some((id) => g.catalogueCategoryIds.includes(id)) || g.additionalActivityIds.includes(a.id)).map((a) => a.id) };
  });
  const groupIdsFor = (activityId) => groups.filter((g) => g.activityIds.includes(activityId)).map((g) => g.id);
  const figures = bundle.observations.map((o) => {
    const label = catalogue.figureLabels[o.activity_id];
    const sourceIds = uniq(o.evidence.flatMap(evidenceIds));
    if (!text(label) || !sourceIds.length || sourceIds.some((id) => !sources.has(id))) fail();
    return { id: o.id, activityId: o.activity_id, value: o.value, bound: o.bound, unit: o.unit, label: copy(label), stage: o.stage,
      sourceId: sourceIds[0], sourceIds, limitations: [...o.limitations], role: o.isa_role, groupIds: groupIdsFor(o.activity_id), population: o.population,
      reportDate: o.report_date, kind: "observation", evidence: o.evidence.flatMap((e) => evidenceIds(e).map((sourceId) => ({ sourceId, text: e.text }))) };
  });
  for (const m of catalogue.milestones) {
    const activity = activities.get(m.activityId);
    if (!m.id.startsWith("supplemental:") || aliases.has(m.id) || !activity || !activity.source_ids.includes(m.sourceId) || !sources.has(m.sourceId) || !text(m.label) || m.value !== 1 || m.bound !== "exact" || m.stage !== "reported-milestone" || !["vehicle", "toolkit"].includes(m.unit) || m.publicApproved !== false || !m.role || !m.limitations.length || m.evidence.some((e) => e.sourceId !== m.sourceId || !e.text)) fail();
    figures.push({ id: m.id, activityId: m.activityId, value: m.value, bound: m.bound, unit: m.unit, label: copy(m.label), stage: m.stage,
      sourceId: m.sourceId, sourceIds: [m.sourceId], limitations: [...m.limitations], role: m.role, groupIds: groupIdsFor(m.activityId), population: m.population,
      reportDate: m.reportDate, kind: "milestone", evidence: copy(m.evidence) });
  }
  if (!ids(figures.map((f) => f.id))) fail();
  if (!ids(catalogue.memberships.map((m) => m.id)) || catalogue.memberships.length !== bundle.partnerships.length) fail();
  const collaborations = bundle.partnerships.map((p) => {
    const m = catalogue.memberships.find((item) => item.id === p.id);
    const activity = activities.get(m?.activityId);
    const sourceIds = evidenceIds(p.evidence);
    if (!m || !activity || !text(m.title) || !["reported-programme-collaboration", "stated-cooperation", "signed-mou-reported"].includes(p.kind) || !ids(p.entity_ids) || !ids(Object.keys(m.roles)) || Object.keys(m.roles).length !== p.entity_ids.length || p.entity_ids.some((id) => !text(m.roles[id])) || sourceIds.some((id) => !activity.source_ids.includes(id))) fail();
    const participants = p.entity_ids.map((id) => {
      const entity = entities.get(id);
      if (!entity || !["person", "organisation"].includes(entity.kind)) fail();
      return { id, label: entity.label, kind: entity.kind, role: copy(m.roles[id]) };
    });
    return { id: p.id, activityId: activity.id, title: copy(m.title), kind: p.kind,
      sourceId: sourceIds[0], limitations: [p.limitations], reportDate: p.evidence.report_date, excerpt: p.evidence.text,
      participants, groupIds: groupIdsFor(activity.id) };
  });
  if (catalogue.conceptExtraction.reportCount !== bundle.model_documents.length || !ids(catalogue.concepts.map((c) => c.id))) fail();
  const concepts = catalogue.concepts.map((c) => {
    if (!text(c.label) || !Number.isInteger(c.count) || c.count < 1 || c.count !== c.sourceIds.length || !ids(c.sourceIds) || c.excerpts.length !== c.count || c.excerpts.some((e, i) => e.sourceId !== c.sourceIds[i] || canonical.get(e.sourceId) !== e.sourceId || !e.text.toLowerCase().includes(c.phrase))) fail();
    return copy(c);
  });
  const networkGroups = groups.filter((group) => group.id !== "all").map(copy);
  const uncovered = bundle.activities.filter((a) => !networkGroups.some((g) => g.activityIds.includes(a.id))).map((a) => a.id);
  if (uncovered.length) networkGroups.push({ id: "other", label: { en: "More activities", ha: "Ƙarin ayyuka" }, activityIds: uncovered, catalogueCategoryIds: [], rationale: "Records outside the five figure groups, including sport, honours and political engagement; no impact inferred." });
  const networkActivities = bundle.activities.map((a) => ({
    id: a.id, ...getActivityPresentation(a), role: a.isa_role,
    reportDate: a.report_date, dateBasis: a.date_basis, stage: a.stage, sourceIds: [...a.source_ids],
    limitations: [...a.limitations], groupIds: networkGroups.filter((g) => g.activityIds.includes(a.id)).map((g) => g.id),
    collaborationIds: collaborations.filter((c) => c.activityId === a.id).map((c) => c.id),
  }));
  return { groups, figures, concepts, collaborations, networkGroups, networkActivities, haReviewed: false, publicApproved: false, conceptReportCount: bundle.model_documents.length };
}
