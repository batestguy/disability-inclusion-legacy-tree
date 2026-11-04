export type Locale = "en" | "ha" | "yo" | "ig";
export declare const languages: readonly { code: Locale; label: string }[];
export function localeHome(lang: Locale): string;
export function translate(lang: Locale, en: string, ha?: string): string;
export function localizeText<T extends { en: string; ha: string }>(value: T): T & { yo: string; ig: string };
export type DeepLocalized<T> = T extends readonly (infer U)[] ? DeepLocalized<U>[] : T extends object ? { [K in keyof T]: DeepLocalized<T[K]> } & (T extends { en: string; ha: string } ? { yo: string; ig: string } : unknown) : T;
export function localizeData<T>(value: T): DeepLocalized<T>;
