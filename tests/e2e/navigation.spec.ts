import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("home page loads with hero and decision tree", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Find the Right");
    await expect(page.locator("#decision-tree")).toBeVisible();
  });

  test("header links navigate correctly", async ({ page }) => {
    await page.goto("/");

    // Navigate to Patterns via header nav
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Catalog" })
      .click();
    await expect(page).toHaveURL("/patterns");
    await expect(page.locator("h1")).toContainText("Design Pattern Catalog");

    // Navigate to About
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "About" })
      .click();
    await expect(page).toHaveURL("/about");
    await expect(page.locator("h1")).toContainText("About");

    // Navigate Home via site identity
    await page
      .getByRole("link", { name: /Design Pattern Decision Tree|DPDT/ })
      .click();
    await expect(page).toHaveURL("/");
  });

  test("pattern catalog shows all categories", async ({ page }) => {
    await page.goto("/patterns");

    await expect(
      page.getByRole("heading", { name: /Creational/ })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Structural/ })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Behavioral/ })
    ).toBeVisible();
  });

  test("pattern card links to detail page", async ({ page }) => {
    await page.goto("/patterns");

    await page
      .getByRole("link", { name: /Singleton/ })
      .first()
      .click();
    await expect(page).toHaveURL("/patterns/singleton");
    await expect(page.locator("h1")).toContainText("Singleton");
  });

  test("pattern detail has breadcrumbs", async ({ page }) => {
    await page.goto("/patterns/singleton");

    const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByText("Home")).toBeVisible();
    await expect(breadcrumb.getByText("Design Pattern Catalog")).toBeVisible();
  });

  test("404 page shows for unknown routes", async ({ page }) => {
    await page.goto("/nonexistent-page");
    await expect(page.getByText("404")).toBeVisible();
  });
});
