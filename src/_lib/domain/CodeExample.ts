import type { Language } from "./Language";

export interface CodeExample {
  readonly language: Language;
  readonly code: string;
  readonly description: string;
  readonly filename: string;
}

export interface LanguageAntiPatternNotice {
  readonly language: Language;
  readonly reason: string;
  readonly alternatives?: string;
}
