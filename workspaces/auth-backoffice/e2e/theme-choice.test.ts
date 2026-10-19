import {expect, test} from "@playwright/test";
import type {Page} from "@playwright/test";

import {
  addStaleSessionCookie,
  createSignUpInput,
  getColorScheme,
  openAccountMenu,
  signUp
} from "./utils";

const chooseTheme = async (page: Page, name: string) => {
  await openAccountMenu(page);

  await page.getByRole("menuitemradio", {name}).click();

  // Choosing a theme keeps the menu open
  await page.keyboard.press("Escape");
};

// A light OS, so choosing Dark is visible
test.use({colorScheme: "light"});

test.beforeEach(async ({page}) => {
  await signUp(page, createSignUpInput());
  await expect(page).toHaveURL("/users");
});

test("choosing a theme in the account menu applies it", async ({page}) => {
  await chooseTheme(page, "Dark");

  expect(await getColorScheme(page)).toBe("dark");
});

test("logging out goes back to the system theme", async ({page}) => {
  await chooseTheme(page, "Dark");

  await openAccountMenu(page);
  await page.getByRole("menuitem", {name: "Log out"}).click();
  await expect(page).toHaveURL("/sign-in");

  expect(await getColorScheme(page)).toBe("light");
});

test("an ended session goes back to the system theme", async ({
  context,
  page
}) => {
  await chooseTheme(page, "Dark");

  await addStaleSessionCookie(context);
  await page.reload();
  await expect(page).toHaveURL("/sign-in");

  expect(await getColorScheme(page)).toBe("light");
});
