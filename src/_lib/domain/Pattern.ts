import type { PatternSlug } from "./PatternSlug";
import type { PatternCategoryId } from "./PatternCategory";
import type { CodeExample, LanguageAntiPatternNotice } from "./CodeExample";

export interface PatternDefinition {
  readonly slug: PatternSlug;
  readonly name: string;
  readonly category: PatternCategoryId;
  readonly icon: string;
  readonly summary: string;
  readonly intent: string;
  readonly problem: string;
  readonly solution: string;
  readonly participants: readonly string[];
  readonly consequences: {
    readonly advantages: readonly string[];
    readonly disadvantages: readonly string[];
  };
  readonly realWorldAnalogy: string;
  readonly useCases: readonly string[];
  readonly relatedPatterns: readonly PatternSlug[];
  readonly decisionTreeQuestion: string;
  readonly codeExamples: readonly CodeExample[];
  readonly antiPatternNotices: readonly LanguageAntiPatternNotice[];
}
