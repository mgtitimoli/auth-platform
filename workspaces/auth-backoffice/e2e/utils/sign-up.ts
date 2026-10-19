import type {Page} from "@playwright/test";

type SignUpInput = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirmation: string;
};

// Unique per call, so tests never depend on each other's users
const createEmail = () => "e2e-" + crypto.randomUUID() + "@example.com";

const createSignUpInput = (): SignUpInput => ({
  email: createEmail(),
  firstName: "Ada",
  lastName: "Lovelace",
  password: "Sup3r-secret",
  passwordConfirmation: "Sup3r-secret"
});

const signUp = async (page: Page, input: SignUpInput) => {
  await page.goto("/sign-up");

  await page.getByLabel("First name").fill(input.firstName);
  await page.getByLabel("Last name").fill(input.lastName);
  await page.getByLabel("Email").fill(input.email);
  await page.getByLabel("Password", {exact: true}).fill(input.password);
  await page.getByLabel("Confirm password").fill(input.passwordConfirmation);

  await page.getByRole("button", {name: "Sign up"}).click();
};

export {createSignUpInput, signUp};
export type {SignUpInput};
