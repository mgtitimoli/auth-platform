import {describe, expect, it} from "vitest";

import {hasEntries} from "@/object";

describe("hasEntries", () => {
  it("is true for an object with entries", () => {
    expect(hasEntries({k0: undefined})).toBe(true);
  });

  it("is false for an object without entries", () => {
    expect(hasEntries({})).toBe(false);
  });
});
