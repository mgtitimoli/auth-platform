import {expect, test} from "@playwright/test";

import {getColorScheme} from "./utils";

test.describe("with a light system theme", () => {
  test.use({colorScheme: "light"});

  test("shows the light theme", async ({page}) => {
    await page.goto("/");

    expect(await getColorScheme(page)).toBe("light");
  });
});

test.describe("with a dark system theme", () => {
  test.use({colorScheme: "dark"});

  test("shows the dark theme", async ({page}) => {
    await page.goto("/");

    expect(await getColorScheme(page)).toBe("dark");
  });
});
