export type ChatLanguage = "en" | "ha";
export type Programme = "smedan" | "nigwed" | "startup" | "borno" | "beyond";
export type ChatKind =
  | "none"
  | "count"
  | "list"
  | "measurement"
  | "report-year"
  | "summary"
  | "lookup"
  | "catalogue"
  | "explanation";
export interface ChatContext {
  programme?: Programme;
  reportYear?: number;
  intent?: "count" | "list" | "measurement" | "report-year" | "summary";
}
export interface ChatPlan {
  operation: Exclude<ChatKind, "none">;
  dateBasis: "reportDate";
  programme?: Programme;
  reportYear?: number;
  term?: string;
  catalogue?: string;
}
export interface ChatClaim {
  metric: string;
  value: number;
  bound: string;
  unit: string;
  population: string;
  stage: string;
  dateBasis: "reportDate";
  reportYear?: number | null;
  reportDate?: string;
  evidenceDateBasis?: string;
  attribution: string;
  activityIds: string[];
  observationIds: string[];
  sourceIds: string[];
  limitations?: string[];
}
export interface ChatSource {
  id: string;
  title: string;
  url: string;
  publisher: string;
  date: string;
}
export interface ChatItem {
  id: string;
  label: { en: string; ha?: string };
  reportDate?: string;
  kind?: string;
  limitations?: string;
  sourceIds?: string[];
  evidence?: string;
}
export interface ChatChoice {
  question: string;
  label: { en: string; ha: string };
}
export interface ChatAnswer {
  status: "answered" | "clarification" | "unsupported" | "error";
  kind: ChatKind;
  reason: string;
  context: ChatContext;
  plan: ChatPlan | null;
  claims: ChatClaim[];
  sourceIds: string[];
  activityIds: string[];
  observationIds: string[];
  sources: ChatSource[];
  items: ChatItem[];
  choices: ChatChoice[];
  snapshot: { version: string; date: string; status: string };
}
export interface RenderedAnswer {
  heading: string;
  text: string;
  detail: string;
  draft: boolean;
  items: (ChatItem & { text: string; untranslated: boolean })[];
}
export interface ChatManifest {
  bundle_sha256?: string;
  dataset_version?: string;
}
export function answerQuestion(
  bundle: unknown,
  question: string,
  context?: ChatContext,
): ChatAnswer;
export function renderAnswer(
  answer: ChatAnswer,
  lang?: ChatLanguage,
): RenderedAnswer;
export function validateAnswer(bundle: unknown, answer: ChatAnswer): boolean;
export function suggestedQuestions(
  lang?: ChatLanguage,
  context?: ChatContext,
): { label: string; question: string }[];
export function createReceipt(
  answer: ChatAnswer,
  manifest?: ChatManifest,
): {
  operationVersion: string;
  datasetVersion: string;
  datasetDate: string;
  bundleSha256: string | null;
  manifestVersionMatches: boolean;
  status: ChatAnswer["status"];
  plan: ChatPlan | null;
  activityIds: string[];
  observationIds: string[];
  sourceIds: string[];
  claims: ChatClaim[];
  limitations: string;
};
