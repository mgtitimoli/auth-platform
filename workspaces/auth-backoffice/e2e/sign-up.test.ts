import {expect, test} from "@playwright/test";

import {createSignUpInput, expectSignedInAs, signUp} from "./utils";

test("signing up signs the user in and lands on the users page", async ({
  page
}) => {
  const input = createSignUpInput();

  await signUp(page, input);

  await expect(page).toHaveURL("/users");
  await expectSignedInAs(page, input);
});

test("mismatched passwords block the sign-up", async ({page}) => {
  await signUp(page, createSignUpInput(), "Another-s3cret");

  await expect(page.getByText("Passwords don't match")).toBeVisible();
  await expect(page).toHaveURL("/sign-up");
});

test("an email that already exists is reported on the email field", async ({
  browser
}) => {
  const input = createSignUpInput();

  // Each sign-up in its own context, so the first session doesn't affect the second
  const firstContext = await browser.newContext();

  const secondContext = await browser.newContext();

  const firstPage = await firstContext.newPage();

  const secondPage = await secondContext.newPage();

  await signUp(firstPage, input);
  await expect(firstPage).toHaveURL("/users");

  await signUp(secondPage, input);

  await expect(
    secondPage.getByText("A user with this email already exists")
  ).toBeVisible();
  await expect(secondPage).toHaveURL("/sign-up");

  await firstContext.close();
  await secondContext.close();
});
