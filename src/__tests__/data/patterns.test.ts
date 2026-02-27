import { describe, it, expect } from "vitest";
import { getAllPatterns, getPatternBySlug, getPatternsByCategory } from "@/_lib/data/patterns";
import { PATTERN_SLUGS } from "@/_lib/domain/PatternSlug";
import { LANGUAGES } from "@/_lib/domain/Language";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

describe("Pattern Registry", () => {
  const patterns = getAllPatterns();

  it("has exactly 17 patterns", () => {
    expect(patterns).toHaveLength(17);
  });

  it("every PATTERN_SLUGS entry has a corresponding pattern", () => {
    for (const slug of PATTERN_SLUGS) {
      expect(getPatternBySlug(slug)).toBeDefined();
    }
  });

  it("every pattern has a unique slug", () => {
    const slugs = patterns.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every pattern has a non-empty name and summary", () => {
    for (const p of patterns) {
      expect(p.name.length).toBeGreaterThan(0);
      expect(p.summary.length).toBeGreaterThan(0);
    }
  });

  it("every pattern has intent, problem, and solution", () => {
    for (const p of patterns) {
      expect(p.intent.length).toBeGreaterThan(0);
      expect(p.problem.length).toBeGreaterThan(0);
      expect(p.solution.length).toBeGreaterThan(0);
    }
  });

  it("every pattern has at least one participant", () => {
    for (const p of patterns) {
      expect(p.participants.length).toBeGreaterThan(0);
    }
  });

  it("every pattern has advantages and disadvantages", () => {
    for (const p of patterns) {
      expect(p.consequences.advantages.length).toBeGreaterThan(0);
      expect(p.consequences.disadvantages.length).toBeGreaterThan(0);
    }
  });

  it("every relatedPatterns reference points to an existing pattern", () => {
    for (const p of patterns) {
      for (const related of p.relatedPatterns) {
        expect(
          getPatternBySlug(related),
          `Pattern '${p.slug}' references unknown pattern '${related}'`
        ).toBeDefined();
      }
    }
  });

  it("every pattern covers all 4 languages (code example or anti-pattern notice)", () => {
    for (const p of patterns) {
      for (const lang of LANGUAGES) {
        const hasExample = p.codeExamples.some((e) => e.language === lang);
        const hasNotice = p.antiPatternNotices.some((n) => n.language === lang);
        expect(
          hasExample || hasNotice,
          `Pattern '${p.slug}' missing coverage for language '${lang}'`
        ).toBe(true);
      }
    }
  });

  it("every code example has non-empty code and description", () => {
    for (const p of patterns) {
      for (const ex of p.codeExamples) {
        expect(ex.code.length).toBeGreaterThan(0);
        expect(ex.description.length).toBeGreaterThan(0);
        expect(ex.filename.length).toBeGreaterThan(0);
      }
    }
  });

  it("groups patterns by category correctly", () => {
    const creational = getPatternsByCategory(createCategoryId("creational"));
    const structural = getPatternsByCategory(createCategoryId("structural"));
    const behavioral = getPatternsByCategory(createCategoryId("behavioral"));

    expect(creational).toHaveLength(5);
    expect(structural).toHaveLength(6);
    expect(behavioral).toHaveLength(6);
  });

  it("every pattern has a decisionTreeQuestion", () => {
    for (const p of patterns) {
      expect(p.decisionTreeQuestion.length).toBeGreaterThan(0);
    }
  });
});
