import {describe, expect, it} from "vitest";

import {formatOrdinalNumber} from "@/formatting";

describe("formatOrdinalNumber", () => {
  it("adds the English ordinal suffix", () => {
    expect(
      [1, 2, 3, 4, 11, 12, 13, 21, 22, 23].map(formatOrdinalNumber)
    ).toEqual([
      "1st",
      "2nd",
      "3rd",
      "4th",
      "11th",
      "12th",
      "13th",
      "21st",
      "22nd",
      "23rd"
    ]);
  });
});
