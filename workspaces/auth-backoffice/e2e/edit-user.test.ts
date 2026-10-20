import {expect, test} from "@playwright/test";
import type {Locator, Page} from "@playwright/test";

import {createSignUpInput, createUser, findUserRow, signUp} from "./utils";

const openEditUserDialog = async (page: Page, row: Locator) => {
  await row.getByRole("button", {name: /^Actions for /}).click();
  await page.getByRole("menuitem", {name: "Edit"}).click();

  return page.getByRole("dialog", {name: "Edit user"});
};

test.beforeEach(async ({page}) => {
  await signUp(page);
  await expect(page).toHaveURL("/users");
});

test("editing a user's name updates their row", async ({page}) => {
  const input = createSignUpInput({firstName: "Grace", lastName: "Hopper"});

  await createUser(page, input);
  await page.reload();

  const dialog = await openEditUserDialog(
    page,
    await findUserRow(page, input.email)
  );

  await expect(dialog.getByRole("button", {name: "Save"})).toBeDisabled();

  await dialog.getByLabel("First name").fill("Ada");
  await dialog.getByRole("button", {name: "Save"}).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByText("Ada Hopper was updated")).toBeVisible();
  await expect(await findUserRow(page, input.email)).toContainText(
    "Ada Hopper"
  );
});

test("an inactive user's names can't be changed", async ({page}) => {
  const input = createSignUpInput();

  await createUser(page, input);
  await page.reload();

  let dialog = await openEditUserDialog(
    page,
    await findUserRow(page, input.email)
  );

  await dialog.getByRole("combobox", {name: "Status"}).click();
  await page.getByRole("option", {name: "Inactive"}).click();
  await dialog.getByRole("button", {name: "Save"}).click();
  await expect(dialog).toBeHidden();

  dialog = await openEditUserDialog(page, await findUserRow(page, input.email));

  await expect(dialog.getByLabel("First name")).toBeDisabled();
  await expect(
    dialog.getByText("Activate the user to change their name").first()
  ).toBeVisible();
});

test("the signed-in user can't change their own status", async ({page}) => {
  const input = createSignUpInput();

  await page.context().clearCookies();
  await signUp(page, input);
  await expect(page).toHaveURL("/users");

  const dialog = await openEditUserDialog(
    page,
    await findUserRow(page, input.email)
  );

  await expect(dialog.getByRole("combobox", {name: "Status"})).toBeDisabled();
  await expect(dialog.getByText("You can't deactivate yourself")).toBeVisible();
});
