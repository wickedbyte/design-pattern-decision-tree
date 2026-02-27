import type { LanguageInfo, Language } from "@/_lib/domain/Language";

export const LANGUAGE_INFO: Record<Language, LanguageInfo> = {
  typescript: {
    id: "typescript",
    displayName: "TypeScript",
    version: "5.5+",
    shikiLang: "typescript",
  },
  python: {
    id: "python",
    displayName: "Python",
    version: "3.12+",
    shikiLang: "python",
  },
  php: {
    id: "php",
    displayName: "PHP",
    version: "8.3+",
    shikiLang: "php",
  },
  rust: {
    id: "rust",
    displayName: "Rust",
    version: "1.75+",
    shikiLang: "rust",
  },
};

export const LANGUAGE_ORDER: readonly Language[] = [
  "typescript",
  "python",
  "php",
  "rust",
];
