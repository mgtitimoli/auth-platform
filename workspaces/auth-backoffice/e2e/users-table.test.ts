import {expect, test} from "@playwright/test";

import {createUsers, signUp} from "./utils";

test("the users table shows 6 users per page", async ({page}) => {
  await signUp(page);
  await expect(page).toHaveURL("/users");

  // More than a page, whatever the other tests created
  await createUsers(page, 7);
  await page.reload();

  const rows = page.locator("tbody tr");

  await expect(rows).toHaveCount(6);
  await expect(page.getByText(/^Page 1 of \d+$/)).toBeVisible();

  // The email identifies the row: other cells (logins) change as other tests
  // sign in
  const firstEmailCell = rows.first().getByRole("cell").nth(1);

  const firstEmail = await firstEmailCell.textContent();

  await page.getByRole("button", {name: "Next page"}).click();

  await expect(page.getByText(/^Page 2 of \d+$/)).toBeVisible();
  await expect(firstEmailCell).not.toHaveText(firstEmail ?? "");

  await page.getByRole("button", {name: "Previous page"}).click();

  await expect(page.getByText(/^Page 1 of \d+$/)).toBeVisible();
  await expect(firstEmailCell).toHaveText(firstEmail ?? "");
});
