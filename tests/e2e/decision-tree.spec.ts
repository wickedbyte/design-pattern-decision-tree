import { test, expect } from "@playwright/test";

test.describe("Decision Tree", () => {
  test("desktop tree renders on large viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");

    // Scroll to decision tree section
    await page.locator("#decision-tree").scrollIntoViewIfNeeded();

    // React Flow canvas should be present
    await expect(page.locator(".react-flow")).toBeVisible({ timeout: 10000 });
  });

  test("mobile wizard renders on small viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    await page.locator("#decision-tree").scrollIntoViewIfNeeded();

    // Should see the start question
    await expect(
      page.getByText("What is your main pain point?")
    ).toBeVisible({ timeout: 10000 });
  });
});
