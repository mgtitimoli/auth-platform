import {describe, expect, it} from "vitest";

import * as withOpaqueToken from "./opaque-token";

describe("create", () => {
  it("creates a base64url token encoding the given number of bytes", () => {
    const opaqueToken = withOpaqueToken.create(24);

    expect(opaqueToken).toMatch(/^[\w-]{32}$/);
  });

  it("creates a different token every time", () => {
    expect(withOpaqueToken.create(16)).not.toBe(withOpaqueToken.create(16));
  });

  it("rejects fewer than 16 bytes", () => {
    expect(() => withOpaqueToken.create(15)).toThrow(RangeError);
  });
});
