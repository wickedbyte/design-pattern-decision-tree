import type { PatternDefinition } from "@/_lib/domain/Pattern";
import type { PatternSlug } from "@/_lib/domain/PatternSlug";
import type { PatternCategoryId } from "@/_lib/domain/PatternCategory";

import { singleton } from "./singleton";
import { builder } from "./builder";
import { prototype } from "./prototype";
import { abstractFactory } from "./abstract-factory";
import { factoryMethod } from "./factory-method";
import { adapter } from "./adapter";
import { facade } from "./facade";
import { decorator } from "./decorator";
import { proxy } from "./proxy";
import { composite } from "./composite";
import { bridge } from "./bridge";
import { observer } from "./observer";
import { strategy } from "./strategy";
import { state } from "./state";
import { command } from "./command";
import { chainOfResponsibility } from "./chain-of-responsibility";
import { templateMethod } from "./template-method";

const ALL_PATTERNS: readonly PatternDefinition[] = [
  singleton,
  builder,
  prototype,
  abstractFactory,
  factoryMethod,
  adapter,
  facade,
  decorator,
  proxy,
  composite,
  bridge,
  observer,
  strategy,
  state,
  command,
  chainOfResponsibility,
  templateMethod,
];

const PATTERN_MAP = new Map<string, PatternDefinition>(
  ALL_PATTERNS.map((p) => [p.slug, p])
);

export function getAllPatterns(): readonly PatternDefinition[] {
  return ALL_PATTERNS;
}

export function getPatternBySlug(
  slug: PatternSlug | string
): PatternDefinition | undefined {
  return PATTERN_MAP.get(slug);
}

export function getPatternsByCategory(
  category: PatternCategoryId
): readonly PatternDefinition[] {
  return ALL_PATTERNS.filter((p) => p.category === category);
}
