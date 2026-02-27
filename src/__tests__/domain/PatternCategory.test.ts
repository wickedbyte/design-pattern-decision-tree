import { describe, it, expect } from "vitest";
import {
  createCategoryId,
  getCategoryInfo,
  getAllCategories,
  CATEGORIES,
} from "@/_lib/domain/PatternCategory";

describe("PatternCategory", () => {
  it("creates valid category IDs", () => {
    for (const cat of CATEGORIES) {
      expect(createCategoryId(cat)).toBe(cat);
    }
  });

  it("throws on invalid category", () => {
    expect(() => createCategoryId("invalid")).toThrow("Invalid category");
  });

  it("returns category info", () => {
    const info = getCategoryInfo(createCategoryId("creational"));
    expect(info.name).toBe("Creational");
    expect(info.description).toBeTruthy();
    expect(info.emoji).toBeTruthy();
  });

  it("returns all 3 categories", () => {
    expect(getAllCategories()).toHaveLength(3);
  });

  it("each category has complete info", () => {
    for (const cat of getAllCategories()) {
      expect(cat.id).toBeTruthy();
      expect(cat.name).toBeTruthy();
      expect(cat.description).toBeTruthy();
      expect(cat.emoji).toBeTruthy();
    }
  });
});
