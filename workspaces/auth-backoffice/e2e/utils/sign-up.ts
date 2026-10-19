import type {SignUpInput} from "@mgtitimoli/auth-domain/domain-schema";
import type {Page} from "@playwright/test";

import {createSignUpInput} from "./create-sign-up-input";

const signUp = async (
  page: Page,
  input: SignUpInput = createSignUpInput(),
  passwordConfirmation = input.password
) => {
  await page.goto("/sign-up");

  await page.getByLabel("First name").fill(input.firstName);
  await page.getByLabel("Last name").fill(input.lastName);
  await page.getByLabel("Email").fill(input.email);
  await page.getByLabel("Password", {exact: true}).fill(input.password);
  await page.getByLabel("Confirm password").fill(passwordConfirmation);

  await page.getByRole("button", {name: "Sign up"}).click();
};

export {signUp};
