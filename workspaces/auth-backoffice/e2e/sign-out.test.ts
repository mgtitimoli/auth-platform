import {expect, test} from "@playwright/test";

import {createSignUpInput, openAccountMenu, signUp} from "./utils";

test("logging out ends the session and goes to sign-in", async ({page}) => {
  await signUp(page, createSignUpInput());
  await expect(page).toHaveURL("/users");

  await openAccountMenu(page);

  await page.getByRole("menuitem", {name: "Log out"}).click();

  await expect(page).toHaveURL("/sign-in");

  await page.goto("/users");

  await expect(page).toHaveURL("/sign-in");
});
