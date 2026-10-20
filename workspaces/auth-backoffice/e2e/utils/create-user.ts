import type {CreateUserInput} from "@mgtitimoli/auth-domain/domain-schema";
import {expect} from "@playwright/test";
import type {Page} from "@playwright/test";

const authApiUrl = process.env["NEXT_PUBLIC_AUTH_API_URL"];

// Through the API, with the page's session, since the tests are about other
// screens
const createUser = async (page: Page, input: CreateUserInput) => {
  if (authApiUrl === undefined) {
    throw new Error("NEXT_PUBLIC_AUTH_API_URL is not set");
  }

  const response = await page.request.post(authApiUrl + "/users", {
    data: input
  });

  expect(response.ok()).toBe(true);
};

export {createUser};
