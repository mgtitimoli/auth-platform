import {expect, test} from "@playwright/test";

const getBodyBackgroundColor = () =>
  getComputedStyle(document.body).backgroundColor;

test.describe("with a light system theme", () => {
  test.use({colorScheme: "light"});

  test("shows the light theme", async ({page}) => {
    await page.goto("/");

    expect(await page.evaluate(getBodyBackgroundColor)).toBe(
      "rgb(255, 255, 255)"
    );
  });
});

test.describe("with a dark system theme", () => {
  test.use({colorScheme: "dark"});

  test("shows the dark theme", async ({page}) => {
    await page.goto("/");

    expect(await page.evaluate(getBodyBackgroundColor)).toBe("rgb(10, 10, 10)");
  });
});
