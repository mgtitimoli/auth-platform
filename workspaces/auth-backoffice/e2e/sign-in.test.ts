import {expect, test} from "@playwright/test";
import type {Browser, Page} from "@playwright/test";

import {createSignUpInput, signUp} from "./utils";
import type {SignUpInput} from "./utils";

// In its own context, so the page signing in starts without a session
const signUpInNewContext = async (browser: Browser, input: SignUpInput) => {
  const context = await browser.newContext();

  const page = await context.newPage();

  await signUp(page, input);
  await expect(page).toHaveURL("/users");

  await context.close();
};

const signIn = async (page: Page, email: string, password: string) => {
  await page.goto("/sign-in");

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);

  await page.getByRole("button", {name: "Sign in"}).click();
};

test("signing in lands on the users page, greeting the user", async ({
  browser,
  page
}) => {
  const input = createSignUpInput();

  await signUpInNewContext(browser, input);

  await signIn(page, input.email, input.password);

  await expect(page).toHaveURL("/users");
  await expect(
    page.getByRole("heading", {name: "Hello " + input.firstName})
  ).toBeVisible();
});

test("wrong credentials are reported on the form", async ({browser, page}) => {
  const input = createSignUpInput();

  await signUpInNewContext(browser, input);

  await signIn(page, input.email, "Wr0ng-secret");

  await expect(page.getByText("Invalid email or password")).toBeVisible();
  await expect(page).toHaveURL("/sign-in");
});

test("the sign-up and sign-in pages link to each other", async ({page}) => {
  await page.goto("/sign-up");

  await page.getByRole("link", {name: "Sign in"}).click();
  await expect(page).toHaveURL("/sign-in");

  await page.getByRole("link", {name: "Sign up"}).click();
  await expect(page).toHaveURL("/sign-up");
});
