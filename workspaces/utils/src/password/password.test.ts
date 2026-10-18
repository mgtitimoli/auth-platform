import {describe, expect, it} from "vitest";

import {getHash} from "./get-hash";
import {isMatchingHash} from "./is-matching-hash";

describe("password", () => {
  it("matches the password it was hashed from", async () => {
    const passwordHash = await getHash("correct horse");

    expect(await isMatchingHash("correct horse", passwordHash)).toBe(true);
  });

  it("doesn't match a different password", async () => {
    const passwordHash = await getHash("correct horse");

    expect(await isMatchingHash("battery staple", passwordHash)).toBe(false);
  });

  it("salts every hash", async () => {
    const [passwordHash1, passwordHash2] = await Promise.all([
      getHash("correct horse"),
      getHash("correct horse")
    ]);

    expect(passwordHash1).not.toBe(passwordHash2);
  });

  it("doesn't contain the password", async () => {
    expect(await getHash("correct horse")).not.toContain("correct horse");
  });

  it("doesn't match a malformed hash", async () => {
    expect(await isMatchingHash("correct horse", "not-a-hash")).toBe(false);
  });
});
