import {failedResponseSchema} from "@mgtitimoli/utils/hono/response";
import {beforeEach, describe, expect, it} from "vitest";

import {database} from "@/database/database";
import {allSessionColumnNames} from "@/database/session-column-name";
import {
  createSignUpInput,
  getSessionIdFrom,
  postJson,
  signUp
} from "@/utils/testing";

const signUpInput = createSignUpInput();

const signInInput = {
  email: signUpInput.email,
  password: signUpInput.password
};

const signIn = (body: unknown) => postJson("/auth/sign-in", body);

const getSessionFrom = (response: Response) =>
  database
    .selectFrom("sessions")
    .select(allSessionColumnNames)
    .where("id", "=", getSessionIdFrom(response))
    .executeTakeFirstOrThrow();

const getLoginsCounter = async (userId: string) => {
  const {loginsCounter} = await database
    .selectFrom("users")
    .select("loginsCounter")
    .where("id", "=", userId)
    .executeTakeFirstOrThrow();

  return loginsCounter;
};

const expectInvalidCredentials = async (response: Response) => {
  expect(response.status).toBe(401);
  expect(failedResponseSchema.parse(await response.json())).toEqual({
    error: "Invalid email or password"
  });
  expect(response.headers.get("Set-Cookie")).toBeNull();
};

describe("POST /auth/sign-in", () => {
  beforeEach(async () => {
    await signUp(signUpInput);
  });

  it("creates a session, sent only in the cookie, and increments the logins counter", async () => {
    const response = await signIn(signInInput);

    const session = await getSessionFrom(response);

    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
    expect(await getLoginsCounter(session.userId)).toBe(2);
  });

  it("creates a new session every time", async () => {
    const session1 = await getSessionFrom(await signIn(signInInput));

    const session2 = await getSessionFrom(await signIn(signInInput));

    expect(session1.id).not.toBe(session2.id);
    expect(await getLoginsCounter(session2.userId)).toBe(3);
  });

  it("rejects an unknown email", async () => {
    await expectInvalidCredentials(
      await signIn({...signInInput, email: "grace@example.com"})
    );
  });

  it("rejects a wrong password with the same error as an unknown email", async () => {
    await expectInvalidCredentials(
      await signIn({...signInInput, password: "wrong-password1!"})
    );
  });

  it("rejects an inactive user with the right password", async () => {
    await database
      .updateTable("users")
      .set({status: "inactive"})
      .where("email", "=", signUpInput.email)
      .execute();

    const response = await signIn(signInInput);

    expect(response.status).toBe(403);
    expect(failedResponseSchema.parse(await response.json())).toEqual({
      error: "The user is inactive"
    });
  });

  it("doesn't reveal that a user is inactive without the right password", async () => {
    await database
      .updateTable("users")
      .set({status: "inactive"})
      .where("email", "=", signUpInput.email)
      .execute();

    await expectInvalidCredentials(
      await signIn({...signInInput, password: "wrong-password1!"})
    );
  });

  it("doesn't check the password policy", async () => {
    await expectInvalidCredentials(
      await signIn({...signInInput, password: "a"})
    );
  });
});
