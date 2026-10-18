import * as withResponse from "@mgtitimoli/utils/fetch/response";
import {ensureIsDefined} from "@mgtitimoli/utils/validation";
import {describe, expect, it} from "vitest";

import {database} from "@/database/database";
import {router} from "@/router";
import {sessionCookieName} from "@/utils/session-cookie/session-cookie";

const signUpInput = {
  email: "ada@example.com",
  firstName: "Ada",
  lastName: "Lovelace",
  password: "analytical1!"
};

// The Cookie header that sends the response's session back
const getSessionCookieFrom = (response: Response) => {
  const sessionId = ensureIsDefined(
    withResponse.getCookie(response, sessionCookieName),
    "The response has no session cookie"
  );

  return sessionCookieName + "=" + sessionId;
};

const signUp = async () =>
  getSessionCookieFrom(
    await router.request("/auth/sign-up", {
      body: JSON.stringify(signUpInput),
      headers: {"Content-Type": "application/json"},
      method: "POST"
    })
  );

const signOut = (cookie: string) =>
  router.request("/auth/sign-out", {headers: {Cookie: cookie}, method: "POST"});

describe("POST /auth/sign-out", () => {
  it("terminates the session and removes the cookie", async () => {
    const sessionCookie = await signUp();

    const response = await signOut(sessionCookie);

    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
    expect(response.headers.get("Set-Cookie")).toMatch(/^session=;.*Max-Age=0/);

    const {terminationTime} = await database
      .selectFrom("sessions")
      .select("terminationTime")
      .where("id", "=", sessionCookie.replace(sessionCookieName + "=", ""))
      .executeTakeFirstOrThrow();

    expect(terminationTime).not.toBeNull();
  });

  it("makes the session unusable", async () => {
    const sessionCookie = await signUp();

    await signOut(sessionCookie);

    const response = await router.request("/users/me", {
      headers: {Cookie: sessionCookie}
    });

    expect(response.status).toBe(401);
  });

  it("rejects a session that is already terminated", async () => {
    const sessionCookie = await signUp();

    await signOut(sessionCookie);

    expect((await signOut(sessionCookie)).status).toBe(401);
  });
});
