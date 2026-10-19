import {expect, test} from "@playwright/test";

import {addStaleSessionCookie, createSignUpInput, signUp} from "./utils";

test.describe("without a session", () => {
  test("/ goes to sign-up", async ({page}) => {
    await page.goto("/");

    await expect(page).toHaveURL("/sign-up");
  });

  test("a private page goes to sign-in", async ({page}) => {
    await page.goto("/users");

    await expect(page).toHaveURL("/sign-in");
  });
});

test.describe("with a session", () => {
  test("/ and the auth pages go to the users page", async ({page}) => {
    await signUp(page, createSignUpInput());
    await expect(page).toHaveURL("/users");

    for (const path of ["/", "/sign-in", "/sign-up"]) {
      await page.goto(path);

      await expect(page).toHaveURL("/users");
    }
  });
});

test.describe("with a stale session", () => {
  test("a private page goes to sign-in, removing the cookie", async ({
    context,
    page
  }) => {
    await addStaleSessionCookie(context);

    await page.goto("/users");

    await expect(page).toHaveURL("/sign-in");

    const cookies = await context.cookies();

    expect(cookies.some(cookie => cookie.name === "session")).toBe(false);
  });
});
