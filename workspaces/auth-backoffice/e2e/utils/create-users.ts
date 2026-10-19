import type {CreateUserInput} from "@mgtitimoli/auth-domain/domain-schema";
import {expect} from "@playwright/test";
import type {Page} from "@playwright/test";

import {createSignUpInput} from "./create-sign-up-input";

const authApiUrl = process.env["NEXT_PUBLIC_AUTH_API_URL"];

// Through the API, with the page's session, since only the count matters
const createUsers = async (page: Page, count: number) => {
  if (authApiUrl === undefined) {
    throw new Error("NEXT_PUBLIC_AUTH_API_URL is not set");
  }

  const inputs: CreateUserInput[] = Array.from({length: count}, () =>
    createSignUpInput()
  );

  for (const input of inputs) {
    const response = await page.request.post(authApiUrl + "/users", {
      data: input
    });

    expect(response.ok()).toBe(true);
  }
};

export {createUsers};
