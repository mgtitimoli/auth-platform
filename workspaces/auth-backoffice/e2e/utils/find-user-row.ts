import {expect} from "@playwright/test";
import type {Page} from "@playwright/test";

const pageStatusPattern = /^Page (\d+) of \d+$/;

// The users are ordered by creation, and the tests share the database, so a
// user can be on any page: this pages forward until their row shows
const findUserRow = async (page: Page, email: string) => {
  const row = page.getByRole("row").filter({hasText: email});

  const pageStatus = page.getByText(pageStatusPattern);

  await expect(pageStatus).toBeVisible();

  while (!(await row.isVisible())) {
    const pageNumber = Number(
      pageStatusPattern.exec((await pageStatus.textContent()) ?? "")?.[1]
    );

    await page.getByRole("button", {name: "Next"}).click();

    await expect(
      page.getByText(new RegExp("^Page " + (pageNumber + 1) + " of \\d+$"))
    ).toBeVisible();

    // The label changes at once, but the rows only once the page has loaded
    await expect(page.getByRole("table")).not.toHaveAttribute(
      "aria-busy",
      "true"
    );
  }

  return row;
};

export {findUserRow};
