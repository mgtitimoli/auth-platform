import {describe, expect, it} from "vitest";

import * as withPassword from "@/password";

describe("password", () => {
  it("matches the password it was hashed from", async () => {
    const passwordHash = await withPassword.getHash("correct horse");

    expect(
      await withPassword.isMatchingHash("correct horse", passwordHash)
    ).toBe(true);
  });

  it("doesn't match a different password", async () => {
    const passwordHash = await withPassword.getHash("correct horse");

    expect(
      await withPassword.isMatchingHash("battery staple", passwordHash)
    ).toBe(false);
  });

  it("salts every hash", async () => {
    const [passwordHash1, passwordHash2] = await Promise.all([
      withPassword.getHash("correct horse"),
      withPassword.getHash("correct horse")
    ]);

    expect(passwordHash1).not.toBe(passwordHash2);
  });

  it("doesn't contain the password", async () => {
    expect(await withPassword.getHash("correct horse")).not.toContain(
      "correct horse"
    );
  });

  it("hashes with the given cost, still matching", async () => {
    const passwordHash = await withPassword.getHash("correct horse", 2 ** 10);

    expect(passwordHash).toMatch(/^scrypt\$1024\$/);
    expect(
      await withPassword.isMatchingHash("correct horse", passwordHash)
    ).toBe(true);
  });

  it("doesn't match a malformed hash", async () => {
    expect(
      await withPassword.isMatchingHash("correct horse", "not-a-hash")
    ).toBe(false);
  });
});
