import type { Brand } from "@/_lib/utils/brand";

export type PatternCategoryId = Brand<string, "PatternCategoryId">;

export const CATEGORIES = ["creational", "structural", "behavioral"] as const;

type CategoryKey = (typeof CATEGORIES)[number];

export interface CategoryInfo {
  readonly id: PatternCategoryId;
  readonly name: string;
  readonly description: string;
  readonly icon: string;
}

const CATEGORY_INFO: Record<CategoryKey, CategoryInfo> = {
  creational: {
    id: "creational" as PatternCategoryId,
    name: "Creational",
    description: "Creation logic is getting complex or scattered",
    icon: "cubes",
  },
  structural: {
    id: "structural" as PatternCategoryId,
    name: "Structural",
    description: "Fighting component boundaries or external dependencies",
    icon: "puzzle-piece",
  },
  behavioral: {
    id: "behavioral" as PatternCategoryId,
    name: "Behavioral",
    description: "Behavior keeps changing, conditionals keep growing",
    icon: "bolt",
  },
};

export function createCategoryId(value: string): PatternCategoryId {
  if (!(CATEGORIES as readonly string[]).includes(value)) {
    throw new Error(`Invalid category: ${value}`);
  }
  return value as PatternCategoryId;
}

export function getCategoryInfo(id: PatternCategoryId): CategoryInfo {
  return CATEGORY_INFO[id as CategoryKey];
}

export function getAllCategories(): readonly CategoryInfo[] {
  return CATEGORIES.map((key) => CATEGORY_INFO[key]);
}
