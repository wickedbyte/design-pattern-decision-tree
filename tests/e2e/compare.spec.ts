import { test, expect } from "@playwright/test";

test.describe("Compare View", () => {
  test("navigates to compare page from catalog", async ({ page }) => {
    await page.goto("/patterns");

    await page.getByRole("link", { name: "Compare Patterns" }).click();
    await expect(page).toHaveURL(/\/patterns\/compare/);
    await expect(
      page.getByRole("heading", { name: "Compare Patterns" })
    ).toBeVisible();
  });

  test("selects two patterns and renders comparison", async ({ page }) => {
    await page.goto("/patterns/compare");

    // Select Pattern A
    const selects = page.locator("select");
    await selects.nth(0).selectOption("singleton");
    await expect(page).toHaveURL(/a=singleton/);

    // Select Pattern B
    await selects.nth(1).selectOption("builder");
    await expect(page).toHaveURL(/b=builder/);

    // Both pattern names should appear in comparison
    await expect(
      page.getByRole("heading", { name: "Singleton" })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Builder" })).toBeVisible();
  });

  test("swap button exchanges patterns", async ({ page }) => {
    await page.goto("/patterns/compare?a=singleton&b=builder");

    await page.getByRole("button", { name: "Swap patterns" }).click();

    // URL should have swapped
    await expect(page).toHaveURL(/a=builder/);
    await expect(page).toHaveURL(/b=singleton/);
  });

  test("direct URL loads correct patterns", async ({ page }) => {
    await page.goto("/patterns/compare?a=observer&b=strategy");

    await expect(page.getByRole("heading", { name: "Observer" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Strategy" })).toBeVisible();
  });

  test("compare icon on pattern card links correctly", async ({ page }) => {
    await page.goto("/patterns");

    // Hover over the first pattern card to reveal compare icon
    const firstCard = page.locator("[class*='group']").first();
    await firstCard.hover();

    const compareLink = firstCard.getByLabel(/Compare/);
    const href = await compareLink.getAttribute("href");
    expect(href).toMatch(/\/patterns\/compare\?a=/);
  });
});
