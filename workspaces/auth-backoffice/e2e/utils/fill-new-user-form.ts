import type {NewUserInput} from "@mgtitimoli/auth-domain/domain-schema";
import type {Locator, Page} from "@playwright/test";

const fillNewUserForm = async (
  scope: Locator | Page,
  input: NewUserInput,
  passwordConfirmation = input.password
) => {
  await scope.getByLabel("First name").fill(input.firstName);
  await scope.getByLabel("Last name").fill(input.lastName);
  await scope.getByLabel("Email").fill(input.email);
  await scope.getByLabel("Password", {exact: true}).fill(input.password);
  await scope.getByLabel("Confirm password").fill(passwordConfirmation);
};

export {fillNewUserForm};
