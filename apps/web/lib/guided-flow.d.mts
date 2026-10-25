export interface FlowText { en: string; ha: string }
export interface FlowOption { id: string; target: string; label: FlowText; description?: FlowText }
export interface FlowClaim {
  metric: string;
  value: number;
  bound: "exact" | "greater-than" | "at-least" | "approximate";
  unit: string;
  population: string;
  stage: "target" | "reported-delivery" | "dataset-description";
  dateBasis: "reportDate";
  reportDate: string;
  reportYear: number;
  evidenceDateBasis: string;
  attribution: string;
  activityIds: string[];
  observationIds: string[];
  sourceIds: string[];
  limitations: string[];
  partners: string[];
  geography: string[];
  eventDate: string | null;
}
export interface FlowEvidence {
  sourceId: string;
  text: string;
  kind: "exact-source-excerpt" | "reviewed-ledger-paraphrase";
  reportDate?: string;
  role?: string;
  limitations?: string;
  dateBasis?: string;
}
export interface FlowItem {
  id: string;
  label: FlowText;
  meta?: FlowText;
  sourceIds?: string[];
  originalLanguage?: "en";
}
export interface FlowNode {
  id: string;
  title: FlowText;
  question: FlowText;
  paragraphs: FlowText[];
  items: FlowItem[];
  options: FlowOption[];
  sourceIds: string[];
  activityIds: string[];
  claims: FlowClaim[];
  evidence?: FlowEvidence[];
  record?: { reportDate: string; dateBasis: string; stage: string; role: string; limitations: string[] };
  /** An answer/evidence endpoint; contextual follow-up choices may remain available. */
  terminal: boolean;
  haReviewed: false;
}
export function getFlowNode(bundle: unknown, nodeId?: string): FlowNode;
