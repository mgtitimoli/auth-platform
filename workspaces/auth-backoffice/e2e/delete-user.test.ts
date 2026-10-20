import {expect, test} from "@playwright/test";
import type {Locator, Page} from "@playwright/test";

import {createSignUpInput, createUser, findUserRow, signUp} from "./utils";

const openRowActions = async (page: Page, row: Locator) => {
  await row.getByRole("button", {name: /^Actions for /}).click();

  return page.getByRole("menu");
};

test.beforeEach(async ({page}) => {
  await signUp(page);
  await expect(page).toHaveURL("/users");
});

test("deleting a user asks first, then removes them", async ({page}) => {
  const input = createSignUpInput({firstName: "Grace", lastName: "Hopper"});

  await createUser(page, input);
  await page.reload();

  const menu = await openRowActions(page, await findUserRow(page, input.email));

  await menu.getByRole("menuitem", {name: "Delete"}).click();

  const dialog = page.getByRole("alertdialog", {name: "Delete user?"});

  await expect(dialog).toContainText(input.email);

  await dialog.getByRole("button", {name: "Delete"}).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByText("Grace Hopper was deleted")).toBeVisible();
  await expect(
    page.getByRole("row").filter({hasText: input.email})
  ).toHaveCount(0);
});

test("cancelling keeps the user", async ({page}) => {
  const input = createSignUpInput();

  await createUser(page, input);
  await page.reload();

  const row = await findUserRow(page, input.email);

  const menu = await openRowActions(page, row);

  await menu.getByRole("menuitem", {name: "Delete"}).click();

  const dialog = page.getByRole("alertdialog", {name: "Delete user?"});

  await dialog.getByRole("button", {name: "Cancel"}).click();

  await expect(dialog).toBeHidden();
  await expect(row).toBeVisible();
});

test("the signed-in user can't delete themselves", async ({page}) => {
  const input = createSignUpInput();

  await page.context().clearCookies();
  await signUp(page, input);
  await expect(page).toHaveURL("/users");

  const menu = await openRowActions(page, await findUserRow(page, input.email));

  await expect(menu.getByRole("menuitem", {name: "Delete"})).toBeDisabled();
});
