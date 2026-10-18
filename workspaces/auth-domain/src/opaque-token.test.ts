import {describe, expect, it} from "vitest";

import {create} from "./opaque-token";

describe("create", () => {
  it("creates a base64url token encoding the given number of bytes", () => {
    const opaqueToken = create(24);

    expect(opaqueToken).toMatch(/^[\w-]{32}$/);
  });

  it("creates a different token every time", () => {
    expect(create(16)).not.toBe(create(16));
  });

  it("rejects fewer than 16 bytes", () => {
    expect(() => create(15)).toThrow(RangeError);
  });
});
