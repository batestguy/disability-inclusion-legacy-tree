import type { FlowNode, FlowText, FlowEvidence } from "./guided-flow.mjs";
export interface ConciseItem { id: string; label: FlowText; meta?: FlowText; originalLanguage?: "en" }
export interface ConciseAnswer { title: FlowText; paragraphs: FlowText[]; items: ConciseItem[] }
export function getConciseAnswer(node: FlowNode): ConciseAnswer;
/** Zero-based page, clamped to the available range. Empty input has one empty page. */
export function paginate<T>(items: T[], page: number, size?: number): { items: T[]; page: number; pageCount: number };
/** Lossless word-boundary segments; an indivisible word may exceed max. */
export function splitText(text: string, max?: number): string[];
export function getSourceEvidence(bundle: unknown, node: FlowNode, sourceId: string): FlowEvidence[];
