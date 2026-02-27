import type { PatternSlug } from "./PatternSlug";
import type { PatternCategoryId } from "./PatternCategory";

export type NodeKind = "start" | "category" | "question" | "pattern" | "fallback";

export interface DecisionNode {
  readonly id: string;
  readonly kind: NodeKind;
  readonly label: string;
  readonly description?: string;
  readonly patternSlug?: PatternSlug;
  readonly categoryId?: PatternCategoryId;
}
