import {describe, expect, it} from "vitest";

import {passwordHashCostSchema} from "./password-hash-cost";

describe("passwordHashCostSchema", () => {
  it("accepts a power of 2", () => {
    expect(passwordHashCostSchema.safeParse(1024).success).toBe(true);
  });

  it("rejects a number that isn't a power of 2", () => {
    expect(passwordHashCostSchema.safeParse(1000).success).toBe(false);
  });
});
