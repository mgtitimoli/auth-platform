import {describe, expect, it} from "vitest";

import {createId} from "./session";

describe("createId", () => {
  it("creates a 192-bit base64url id", () => {
    expect(createId()).toMatch(/^[\w-]{32}$/);
  });
});
