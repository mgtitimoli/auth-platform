import {describe, expect, it} from "vitest";

import {
  createUserInputSchema,
  passwordSchema,
  signInInputSchema,
  signUpInputSchema
} from "./domain-schema";

const getIssueMessages = (password: string) =>
  passwordSchema.safeParse(password).error?.issues.map(issue => issue.message);

describe("passwordSchema", () => {
  it("accepts a password with a letter, a number and a special character", () => {
    expect(passwordSchema.safeParse("abcdef1!").success).toBe(true);
  });

  it("rejects a password shorter than 8 characters", () => {
    expect(getIssueMessages("abc1!")).toContain(
      "Password must be at least 8 characters long"
    );
  });

  it("rejects a password longer than 128 characters", () => {
    expect(getIssueMessages("a1!" + "x".repeat(126))).toContain(
      "Password must be at most 128 characters long"
    );
  });

  it("rejects a password without a letter", () => {
    expect(getIssueMessages("12345678!")).toContain(
      "Password must contain a letter"
    );
  });

  it("rejects a password without a number", () => {
    expect(getIssueMessages("abcdefgh!")).toContain(
      "Password must contain a number"
    );
  });

  it("rejects a password without a special character", () => {
    expect(getIssueMessages("abcdefg1")).toContain(
      "Password must contain a special character"
    );
  });

  it("reports every unmet rule at once", () => {
    expect(getIssueMessages("abc")).toEqual([
      "Password must be at least 8 characters long",
      "Password must contain a number",
      "Password must contain a special character"
    ]);
  });
});

describe("signUpInputSchema", () => {
  const signUpInput = {
    email: "ada@example.com",
    firstName: "Ada",
    lastName: "Lovelace",
    password: "abcdef1!"
  };

  it("accepts a valid input", () => {
    expect(signUpInputSchema.parse(signUpInput)).toEqual(signUpInput);
  });

  it("trims the names", () => {
    expect(
      signUpInputSchema.parse({...signUpInput, firstName: "  Ada  "}).firstName
    ).toBe("Ada");
  });

  it("rejects an invalid email", () => {
    expect(
      signUpInputSchema.safeParse({...signUpInput, email: "ada"}).success
    ).toBe(false);
  });

  it("rejects blank names", () => {
    expect(
      signUpInputSchema.safeParse({...signUpInput, lastName: "   "}).success
    ).toBe(false);
  });
});

describe("signInInputSchema", () => {
  it("accepts any non-empty password, without checking the policy", () => {
    expect(
      signInInputSchema.safeParse({email: "ada@example.com", password: "a"})
        .success
    ).toBe(true);
  });

  it("rejects an empty password", () => {
    expect(
      signInInputSchema.safeParse({email: "ada@example.com", password: ""})
        .success
    ).toBe(false);
  });
});

describe("createUserInputSchema", () => {
  it("rejects a password that doesn't meet the policy", () => {
    expect(
      createUserInputSchema.safeParse({
        email: "grace@example.com",
        firstName: "Grace",
        lastName: "Hopper",
        password: "short"
      }).success
    ).toBe(false);
  });
});
