import type {SignUpInput} from "@mgtitimoli/auth-domain/domain-schema";
import type {Page} from "@playwright/test";

import {createSignUpInput} from "./create-sign-up-input";
import {fillNewUserForm} from "./fill-new-user-form";

const signUp = async (
  page: Page,
  input: SignUpInput = createSignUpInput(),
  passwordConfirmation = input.password
) => {
  await page.goto("/sign-up");

  await fillNewUserForm(page, input, passwordConfirmation);

  await page.getByRole("button", {name: "Sign up"}).click();
};

export {signUp};
