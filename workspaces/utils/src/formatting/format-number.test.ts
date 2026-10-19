import {describe, expect, it} from "vitest";

import {formatNumber} from "@/formatting";
import * as withShowSignOption from "@/formatting/show-sign-option";

const {showSignOptions} = withShowSignOption;

describe("formatNumber", () => {
  it("uses fractionDigits as both the minimum and the maximum", () => {
    expect(formatNumber(1, {fractionDigits: 2})).toBe("1.00");
    expect(formatNumber(1.234, {fractionDigits: 2})).toBe("1.23");
  });

  it("shows only negative signs by default", () => {
    expect(formatNumber(1)).toBe("1");
    expect(formatNumber(-1)).toBe("-1");
  });

  it("shows positive signs too with showSign all", () => {
    expect(formatNumber(1, {showSign: showSignOptions.all})).toBe("+1");
  });
});
