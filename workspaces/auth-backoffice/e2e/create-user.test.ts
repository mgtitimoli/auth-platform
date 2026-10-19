import {expect, test} from "@playwright/test";
import type {Page} from "@playwright/test";

import {createSignUpInput, fillNewUserForm, signUp} from "./utils";

const openCreateUserDialog = async (page: Page) => {
  await page.getByRole("button", {name: "Create user"}).click();

  return page.getByRole("dialog", {name: "Create user"});
};

test("creating a user closes the dialog and confirms it", async ({page}) => {
  await signUp(page);
  await expect(page).toHaveURL("/users");

  const dialog = await openCreateUserDialog(page);

  await expect(dialog.getByLabel("First name")).toBeFocused();

  await fillNewUserForm(
    dialog,
    createSignUpInput({firstName: "Grace", lastName: "Hopper"})
  );
  await dialog.getByRole("button", {name: "Create user"}).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByText("Grace Hopper was created")).toBeVisible();
});

test("an email that already exists is reported on the email field", async ({
  page
}) => {
  const input = createSignUpInput();

  await signUp(page, input);
  await expect(page).toHaveURL("/users");

  const dialog = await openCreateUserDialog(page);

  // The signed-in user's own email already exists
  await fillNewUserForm(dialog, createSignUpInput({email: input.email}));
  await dialog.getByRole("button", {name: "Create user"}).click();

  await expect(
    dialog.getByText("A user with this email already exists")
  ).toBeVisible();
  await expect(dialog).toBeVisible();
});
