import {describe, expect, it} from "vitest";

import {formatOptional} from "@/formatting";

const formatOptionalAmount = formatOptional("N/A");

describe("formatOptional", () => {
  it("shows the default value for null and undefined", () => {
    expect(formatOptionalAmount(null)).toBe("N/A");
    expect(formatOptionalAmount(undefined)).toBe("N/A");
  });

  it("formats any other value", () => {
    expect(formatOptionalAmount(0)).toBe("0");
    expect(formatOptionalAmount(2, value => value + "x")).toBe("2x");
  });
});
