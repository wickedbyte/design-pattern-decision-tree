import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  test("skip-to-content link exists", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.getByText("Skip to content");
    await expect(skipLink).toBeAttached();
  });

  test("main landmark exists", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("header navigation has aria-label", async ({ page }) => {
    await page.goto("/");
    // Desktop nav
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await expect(nav).toBeAttached();
  });

  test("theme toggle has accessible label", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", {
      name: /Switch to (light|dark) mode/,
    });
    await expect(toggle).toBeVisible();
  });

  test("pattern detail breadcrumb has navigation landmark", async ({
    page,
  }) => {
    await page.goto("/patterns/adapter");
    const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(breadcrumb).toBeVisible();
  });

  test("code tabs are keyboard navigable", async ({ page }) => {
    await page.goto("/patterns/singleton");

    // Find a tab
    const tsTab = page.getByRole("tab", { name: "TypeScript" });
    await expect(tsTab).toBeVisible();

    // Focus and use arrow key
    await tsTab.focus();
    await page.keyboard.press("ArrowRight");

    const pythonTab = page.getByRole("tab", { name: "Python" });
    await expect(pythonTab).toHaveAttribute("aria-selected", "true");
  });
});
