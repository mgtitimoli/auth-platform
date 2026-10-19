import type {SignUpInput} from "@mgtitimoli/auth-domain/domain-schema";
import {expect} from "@playwright/test";
import type {Page} from "@playwright/test";

import {openAccountMenu} from "./open-account-menu";

type Names = Pick<SignUpInput, "firstName" | "lastName">;

const expectSignedInAs = async (page: Page, {firstName, lastName}: Names) => {
  await openAccountMenu(page);

  await expect(
    page
      .getByRole("menu", {name: "Account"})
      .getByText(firstName + " " + lastName)
  ).toBeVisible();

  await page.keyboard.press("Escape");
};

export {expectSignedInAs};
