import type { Brand } from "@/_lib/utils/brand";

export type PatternSlug = Brand<string, "PatternSlug">;

export const PATTERN_SLUGS = [
  "singleton",
  "builder",
  "prototype",
  "abstract-factory",
  "factory-method",
  "adapter",
  "facade",
  "decorator",
  "proxy",
  "composite",
  "bridge",
  "observer",
  "strategy",
  "state",
  "command",
  "chain-of-responsibility",
  "template-method",
] as const;

export function createPatternSlug(value: string): PatternSlug {
  if (!(PATTERN_SLUGS as readonly string[]).includes(value)) {
    throw new Error(`Invalid pattern slug: ${value}`);
  }
  return value as PatternSlug;
}

export function isPatternSlug(value: string): value is PatternSlug {
  return (PATTERN_SLUGS as readonly string[]).includes(value);
}
