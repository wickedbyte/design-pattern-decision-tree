import { test, expect } from "@playwright/test";

test.describe("Pattern Detail Page", () => {
  test("renders all pattern sections", async ({ page }) => {
    await page.goto("/patterns/observer");

    await expect(page.locator("h1")).toContainText("Observer");
    await expect(page.getByRole("heading", { name: "Intent" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Problem" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Solution" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Participants" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Advantages", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Disadvantages", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Real-World Analogy" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Use Cases" })
    ).toBeVisible();
  });

  test("code example tabs switch between languages", async ({ page }) => {
    await page.goto("/patterns/strategy");

    // Default tab should be TypeScript
    await expect(page.getByRole("tab", { name: "TypeScript" })).toHaveAttribute(
      "aria-selected",
      "true"
    );

    // Switch to Python
    await page.getByRole("tab", { name: "Python" }).click();
    await expect(page.getByRole("tab", { name: "Python" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.getByRole("tab", { name: "TypeScript" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  test("related patterns section has links", async ({ page }) => {
    await page.goto("/patterns/singleton");

    const related = page.getByText("Related Patterns");
    await expect(related).toBeVisible();
  });

  test("each pattern page has correct metadata", async ({ page }) => {
    await page.goto("/patterns/builder");
    await expect(page).toHaveTitle(/Builder/);
  });
});
