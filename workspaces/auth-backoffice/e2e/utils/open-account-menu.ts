import type {Page} from "@playwright/test";

const openAccountMenu = async (page: Page) => {
  await page.getByRole("button", {name: "Account"}).click();
};

export {openAccountMenu};
