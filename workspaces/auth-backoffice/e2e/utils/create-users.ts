import type {Page} from "@playwright/test";

import {createSignUpInput} from "./create-sign-up-input";
import {createUser} from "./create-user";

const createUsers = async (page: Page, count: number) => {
  for (let index = 0; index < count; index++) {
    await createUser(page, createSignUpInput());
  }
};

export {createUsers};
