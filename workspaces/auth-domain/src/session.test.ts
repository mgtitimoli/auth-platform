import {describe, expect, it} from "vitest";

import type {Session} from "./domain-schema";
import * as withSession from "./session";

const session: Session = {
  createdAt: "2026-01-01T00:00:00.000Z",
  id: withSession.createId(),
  userId: "11111111-1111-4111-8111-111111111111"
};

describe("createId", () => {
  it("creates a 192-bit base64url id", () => {
    expect(withSession.createId()).toMatch(/^[\w-]{32}$/);
  });
});

describe("isActive", () => {
  it("is true for a session that hasn't been terminated", () => {
    expect(withSession.isActive(session)).toBe(true);
  });

  it("is false for a terminated session", () => {
    expect(
      withSession.isActive({
        ...session,
        terminationTime: "2026-01-02T00:00:00.000Z"
      })
    ).toBe(false);
  });
});
