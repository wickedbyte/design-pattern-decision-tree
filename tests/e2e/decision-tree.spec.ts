import { test, expect } from "@playwright/test";

test.describe("Decision Wizard", () => {
  test("wizard renders the start question on homepage", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("What is your main pain point?")).toBeVisible({
      timeout: 10000,
    });
  });

  test("clicking a category advances to first question", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("What is your main pain point?")).toBeVisible({
      timeout: 10000,
    });

    // Click Object Creation category
    await page.getByRole("button", { name: /Object Creation/ }).click();

    // Should see the first creational question
    await expect(
      page.getByText("Need exactly one shared instance?")
    ).toBeVisible({ timeout: 5000 });
  });

  test("answering Yes reaches a pattern result", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("What is your main pain point?")).toBeVisible({
      timeout: 10000,
    });

    await page.getByRole("button", { name: /Object Creation/ }).click();
    await expect(
      page.getByText("Need exactly one shared instance?")
    ).toBeVisible({ timeout: 5000 });

    // Click Yes
    await page.getByRole("button", { name: /Yes/ }).click();

    // Should see the Singleton result
    await expect(page.getByText("We recommend")).toBeVisible({ timeout: 5000 });
    await expect(
      page.getByRole("heading", { name: "Singleton" })
    ).toBeVisible();
  });

  test("breadcrumb trail appears during navigation", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("What is your main pain point?")).toBeVisible({
      timeout: 10000,
    });

    await page.getByRole("button", { name: /Object Creation/ }).click();

    // Breadcrumb should show
    await expect(
      page.getByRole("navigation", { name: "Decision path" })
    ).toBeVisible();
  });

  test("breadcrumb click navigates back", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("What is your main pain point?")).toBeVisible({
      timeout: 10000,
    });

    // Go: Start -> Object Creation -> first question -> Yes
    await page.getByRole("button", { name: /Object Creation/ }).click();
    await page.getByRole("button", { name: /Yes/ }).click();

    // Should be at result
    await expect(page.getByText("We recommend")).toBeVisible({ timeout: 5000 });

    // Start over should reset
    await page.getByRole("button", { name: "Start Over" }).click();

    await expect(page.getByText("What is your main pain point?")).toBeVisible({
      timeout: 5000,
    });
  });

  test("back button returns to previous step", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("What is your main pain point?")).toBeVisible({
      timeout: 10000,
    });

    await page.getByRole("button", { name: /Object Creation/ }).click();
    await expect(
      page.getByText("Need exactly one shared instance?")
    ).toBeVisible({ timeout: 5000 });

    // Click Back
    await page.getByRole("button", { name: "Back" }).click();

    // Should be at category selection again
    await expect(page.getByText("What is your main pain point?")).toBeVisible({
      timeout: 5000,
    });
  });

  test("URL stays clean during wizard navigation", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("What is your main pain point?")).toBeVisible({
      timeout: 10000,
    });

    await page.getByRole("button", { name: /Object Creation/ }).click();
    await page.getByRole("button", { name: /Yes/ }).click();

    // URL should NOT have a hash or query params
    const url = page.url();
    expect(url).not.toContain("#");
    expect(url).not.toContain("?");
  });
});

test.describe("Decision Tree Graph", () => {
  test("graph page renders React Flow", async ({ page }) => {
    await page.goto("/tree");

    await expect(
      page.getByRole("heading", { name: "Decision Tree Graph" })
    ).toBeVisible();

    // React Flow canvas should be present
    await expect(page.locator(".react-flow")).toBeVisible({ timeout: 10000 });
  });

  test("search filters nodes on graph page", async ({ page }) => {
    await page.goto("/tree");

    await expect(page.locator(".react-flow")).toBeVisible({ timeout: 10000 });

    const searchInput = page.getByRole("search").getByRole("textbox");
    await searchInput.fill("Singleton");

    await expect(page.getByRole("search").getByText(/1 match/)).toBeVisible({
      timeout: 5000,
    });
  });

  test("inspector opens on node click", async ({ page }) => {
    await page.goto("/tree");

    await expect(page.locator(".react-flow")).toBeVisible({ timeout: 10000 });

    await page.locator(".react-flow__node").first().click();

    await expect(
      page.getByRole("complementary", { name: "Node details" })
    ).toBeVisible({ timeout: 5000 });
  });

  test("inspector closes on Escape", async ({ page }) => {
    await page.goto("/tree");

    await expect(page.locator(".react-flow")).toBeVisible({ timeout: 10000 });

    await page.locator(".react-flow__node").first().click();

    await expect(
      page.getByRole("complementary", { name: "Node details" })
    ).toBeVisible({ timeout: 5000 });

    await page.keyboard.press("Escape");

    await expect(
      page.getByRole("complementary", { name: "Node details" })
    ).not.toBeVisible({ timeout: 5000 });
  });
});
