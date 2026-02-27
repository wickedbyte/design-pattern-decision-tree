import { describe, it, expect } from "vitest";
import {
  createPatternSlug,
  isPatternSlug,
  PATTERN_SLUGS,
} from "@/_lib/domain/PatternSlug";

describe("PatternSlug", () => {
  it("creates a valid slug", () => {
    const slug = createPatternSlug("singleton");
    expect(slug).toBe("singleton");
  });

  it("throws on invalid slug", () => {
    expect(() => createPatternSlug("not-a-pattern")).toThrow(
      "Invalid pattern slug: not-a-pattern"
    );
  });

  it("validates all known slugs", () => {
    for (const slug of PATTERN_SLUGS) {
      expect(() => createPatternSlug(slug)).not.toThrow();
    }
  });

  it("isPatternSlug returns true for valid slugs", () => {
    expect(isPatternSlug("singleton")).toBe(true);
    expect(isPatternSlug("builder")).toBe(true);
  });

  it("isPatternSlug returns false for invalid slugs", () => {
    expect(isPatternSlug("foo")).toBe(false);
    expect(isPatternSlug("")).toBe(false);
  });

  it("has exactly 17 pattern slugs", () => {
    expect(PATTERN_SLUGS).toHaveLength(17);
  });
});
