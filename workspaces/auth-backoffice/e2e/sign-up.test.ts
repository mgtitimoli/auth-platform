import {expect, test} from "@playwright/test";
import type {Page} from "@playwright/test";

type SignUpInput = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirmation: string;
};

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

test("signing up lands on the users page, greeting the user", async ({
  page
}) => {
  const input = createSignUpInput();

  await signUp(page, input);

  await expect(page).toHaveURL("/users");
  await expect(
    page.getByRole("heading", {name: "Hello " + input.firstName})
  ).toBeVisible();
});

test("mismatched passwords block the sign-up", async ({page}) => {
  await signUp(page, {
    ...createSignUpInput(),
    passwordConfirmation: "Another-s3cret"
  });

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
