import {failedResponseSchema} from "@mgtitimoli/utils/hono/response";
import {isMatchingHash} from "@mgtitimoli/utils/password";
import {describe, expect, it} from "vitest";

import {database} from "@/database/database";
import {allSessionColumnNames} from "@/database/session-column-name";
import {allUserColumnNames} from "@/database/user-column-name";
import {router} from "@/router";

const signUpInput = {
  email: "ada@example.com",
  firstName: "Ada",
  lastName: "Lovelace",
  password: "analytical1!"
};

const signUp = (body: unknown) =>
  router.request("/auth/sign-up", {
    body: JSON.stringify(body),
    headers: {"Content-Type": "application/json"},
    method: "POST"
  });

// The session id is only sent in the session cookie
const getSessionFrom = async (response: Response) => {
  const sessionId = /session=([^;]+)/.exec(
    response.headers.get("Set-Cookie") ?? ""
  )?.[1];

  if (!sessionId) {
    throw new Error("The response has no session cookie");
  }

  return database
    .selectFrom("sessions")
    .select(allSessionColumnNames)
    .where("id", "=", sessionId)
    .executeTakeFirstOrThrow();
};

const getUserCount = async () => {
  const {count} = await database
    .selectFrom("users")
    .select(eb => eb.fn.countAll<number>().as("count"))
    .executeTakeFirstOrThrow();

  return Number(count);
};

describe("POST /auth/sign-up", () => {
  it("creates an active user signed in once, with a session", async () => {
    const response = await signUp(signUpInput);

    const session = await getSessionFrom(response);

    expect(response.status).toBe(201);
    expect(await response.text()).toBe("");

    const user = await database
      .selectFrom("users")
      .select(allUserColumnNames)
      .where("id", "=", session.userId)
      .executeTakeFirstOrThrow();

    expect(user).toMatchObject({
      email: signUpInput.email,
      firstName: signUpInput.firstName,
      lastName: signUpInput.lastName,
      loginsCounter: 1,
      status: "active"
    });

    expect(session.terminationTime).toBeNull();
  });

  it("sets the session cookie", async () => {
    const response = await signUp(signUpInput);

    const setCookie = response.headers.get("Set-Cookie");

    expect(setCookie).toMatch(/^session=[\w-]{32};/);
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Lax");
    expect(setCookie).toContain("Path=/");
  });

  it("stores a hash of the password, never the password", async () => {
    const response = await signUp(signUpInput);

    const session = await getSessionFrom(response);

    const {passwordHash} = await database
      .selectFrom("userCredentials")
      .select("passwordHash")
      .where("userId", "=", session.userId)
      .executeTakeFirstOrThrow();

    expect(passwordHash).not.toContain(signUpInput.password);
    expect(await isMatchingHash(signUpInput.password, passwordHash)).toBe(true);
  });

  it("rejects an email that is already registered", async () => {
    await signUp(signUpInput);

    const response = await signUp({...signUpInput, firstName: "Augusta"});

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      error: "A user with this email already exists"
    });
    expect(await getUserCount()).toBe(1);
  });

  it("rejects a password that doesn't meet the policy, listing every rule", async () => {
    const response = await signUp({...signUpInput, password: "short"});

    const {error} = failedResponseSchema.parse(await response.json());

    expect(response.status).toBe(400);
    expect(error).toContain("Password must be at least 8 characters long");
    expect(error).toContain("Password must contain a number");
    expect(error).toContain("Password must contain a special character");
    expect(await getUserCount()).toBe(0);
  });

  it("rejects an input without every field", async () => {
    const response = await signUp({email: signUpInput.email});

    expect(response.status).toBe(400);
    expect(await getUserCount()).toBe(0);
  });
});
