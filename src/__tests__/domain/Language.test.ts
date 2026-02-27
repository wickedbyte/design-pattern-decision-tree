import { describe, it, expect } from "vitest";
import { LANGUAGES, isLanguage } from "@/_lib/domain/Language";

describe("Language", () => {
  it("has exactly 4 languages", () => {
    expect(LANGUAGES).toHaveLength(4);
  });

  it("includes all expected languages", () => {
    expect(LANGUAGES).toContain("typescript");
    expect(LANGUAGES).toContain("python");
    expect(LANGUAGES).toContain("php");
    expect(LANGUAGES).toContain("rust");
  });

  it("isLanguage validates correctly", () => {
    expect(isLanguage("typescript")).toBe(true);
    expect(isLanguage("python")).toBe(true);
    expect(isLanguage("java")).toBe(false);
    expect(isLanguage("")).toBe(false);
  });
});
