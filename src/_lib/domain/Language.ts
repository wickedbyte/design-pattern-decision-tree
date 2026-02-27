export const LANGUAGES = ["typescript", "python", "php", "rust"] as const;

export type Language = (typeof LANGUAGES)[number];

export interface LanguageInfo {
  readonly id: Language;
  readonly displayName: string;
  readonly version: string;
  readonly shikiLang: string;
}

export function isLanguage(value: string): value is Language {
  return (LANGUAGES as readonly string[]).includes(value);
}
