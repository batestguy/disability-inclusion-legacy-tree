export interface DashboardText { en: string; ha?: string | null }
export interface DashboardFilters { year: string; category: string; activity: string }
export interface DashboardActivity {
  id: string; title: DashboardText; description?: DashboardText; report_date: string; event_date: string | null;
  date_basis: string; stage: string; categories: string[]; source_ids: string[]; observation_ids: string[];
  isa_role: string; limitations: string[]; partners: string[]; geography: string[]; achievement_slug?: string | null;
}
export interface DashboardEvidence { source_id?: string; source_ids?: string[]; text: string; kind: string; report_date?: string }
export interface DashboardObservation {
  id: string; activity_id: string; value: number; bound: "exact" | "greater-than" | "at-least" | "approximate";
  unit: string; population: string; stage: "reported-delivery" | "target"; report_date: string; event_date: string | null;
  date_basis: string; isa_role: string; limitations: string[]; evidence: DashboardEvidence[]; partners: string[]; geography: string[];
}
export interface DashboardSource { id: string; title: string; url: string; date: string; publisher: string; type: string; archive_source_ids: number[]; source_id_aliases: string[] }
export interface DashboardCategory { id: string; label: DashboardText }
export interface DashboardRelationship { id: string; entity_ids: string[]; kind: string; evidence: DashboardEvidence; limitations: string }
export interface DashboardCoOccurrence { entity_ids: string[]; source_ids: string[]; kind: string; is_partnership: boolean; supporting_unique_documents: number }
export interface DashboardView {
  filters: DashboardFilters; activities: DashboardActivity[]; observations: DashboardObservation[]; sourceIds: string[]; sources: DashboardSource[];
  timeline: Array<{ year: string; count: number }>; categories: Array<DashboardCategory & { count: number }>;
  topics: Array<{ id: string; label: DashboardText; terms: string[]; meanShare: number | null; modelledDocumentCount: number; representativeSourceIds: string[] }>;
  modelDocumentCount: number; modelledDocumentCount: number; canonicalReportYears: Array<{ year: string; count: number }>;
  relationships: DashboardRelationship[]; entities: Array<{ id: string; label: string; kind: string; mentions: number; aliases: string[] }>;
  coOccurrences: DashboardCoOccurrence[]; inventory: { activities: number; reportedFigures: number; targets: number; citations: number };
  years: string[]; activityOptions: DashboardActivity[]; categoryOptions: DashboardCategory[];
}
export function normalizeDashboardFilters(bundle: unknown, input?: Partial<DashboardFilters> | null): DashboardFilters;
export function buildDashboardView(bundle: unknown, filters?: Partial<DashboardFilters> | null): DashboardView;
export function exportActivitiesCsv(view: DashboardView): string;
export function exportObservationsCsv(view: DashboardView): string;
