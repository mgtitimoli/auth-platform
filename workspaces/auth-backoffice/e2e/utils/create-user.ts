import type {CreateUserInput} from "@mgtitimoli/auth-domain/domain-schema";
import {expect} from "@playwright/test";
import type {Page} from "@playwright/test";

import {environmentVariables} from "./environment-variables";

const authApiUrl = "http://localhost:" + environmentVariables.AUTH_API_PORT;

// Through the API, with the page's session, since the tests are about other
// screens
const createUser = async (page: Page, input: CreateUserInput) => {
  const response = await page.request.post(authApiUrl + "/users", {
    data: input
  });

  expect(response.ok()).toBe(true);
};

export {createUser};
