export interface PresentationText { en: string; ha: string }
export interface PresentationGroup { id: string; label: PresentationText; activityIds: string[]; catalogueCategoryIds: string[]; rationale: string }
export interface PresentationFigure {
  id: string; activityId: string; value: number; bound: "exact" | "greater-than" | "at-least" | "approximate";
  unit: string; label: PresentationText; stage: "target" | "reported-delivery" | "reported-milestone";
  sourceId: string; sourceIds: string[]; limitations: string[]; role: string; groupIds: string[];
  population: string; reportDate: string; kind: "observation" | "milestone"; evidence: Array<{sourceId: string; text: string}>;
}
export interface PresentationConcept { id: string; label: PresentationText; phrase: string; count: number; sourceIds: string[]; excerpts: Array<{sourceId: string; text: string}> }
export interface PresentationCollaboration {
  id: string; activityId: string; title: PresentationText; kind: string; sourceId: string; limitations: string[];
  reportDate: string; excerpt: string; groupIds: string[];
  participants: Array<{id: string; label: string; kind: "person" | "organisation"; role: PresentationText}>;
}
export interface DashboardPresentation {
  groups: PresentationGroup[]; figures: PresentationFigure[]; concepts: PresentationConcept[]; collaborations: PresentationCollaboration[];
  networkGroups: PresentationGroup[];
  networkActivities: Array<{id: string; title: PresentationText; description: PresentationText; role: string; reportDate: string; dateBasis: string; stage: string; sourceIds: string[]; limitations: string[]; groupIds: string[]; collaborationIds: string[]}>;
  haReviewed: false; publicApproved: false; conceptReportCount: number;
}
export function buildDashboardPresentation(bundle: unknown): DashboardPresentation;
