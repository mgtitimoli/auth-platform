import {describe, expect, it} from "vitest";

import type {User} from "./domain-schema";
import {isActive} from "./user";

const user: User = {
  createdAt: "2026-01-01T00:00:00.000Z",
  email: "ada@example.com",
  firstName: "Ada",
  id: "11111111-1111-4111-8111-111111111111",
  lastName: "Lovelace",
  loginsCounter: 0,
  status: "active",
  updatedAt: "2026-01-01T00:00:00.000Z"
};

describe("isActive", () => {
  it("is true for an active user", () => {
    expect(isActive(user)).toBe(true);
  });

  it("is false for an inactive user", () => {
    expect(isActive({...user, status: "inactive"})).toBe(false);
  });
});
