import {userSchema} from "@mgtitimoli/auth-domain/domain-schema";
import * as withResponse from "@mgtitimoli/utils/fetch/response";
import {failedResponseSchema} from "@mgtitimoli/utils/hono/response";
import {ensureIsDefined} from "@mgtitimoli/utils/validation";
import {describe, expect, it} from "vitest";
import {z} from "zod";

import {router} from "@/router";
import {sessionCookieName} from "@/utils/session-cookie/session-cookie";

const signUpInput = {
  email: "ada@example.com",
  firstName: "Ada",
  lastName: "Lovelace",
  password: "analytical1!"
};

const getCurrentUserSucceededResponseSchema = z.object({data: userSchema});

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

const getCurrentUser = (cookie?: string) =>
  router.request("/users/me", {
    headers: cookie === undefined ? {} : {Cookie: cookie}
  });

describe("GET /users/me", () => {
  it("responds with the user of the session", async () => {
    const response = await getCurrentUser(await signUp());

    const {data: user} = getCurrentUserSucceededResponseSchema.parse(
      await response.json()
    );

    expect(response.status).toBe(200);
    expect(user).toMatchObject({
      email: signUpInput.email,
      firstName: signUpInput.firstName,
      loginsCounter: 1
    });
  });

  it("rejects a request without the session cookie", async () => {
    const response = await getCurrentUser();

    expect(response.status).toBe(401);
    expect(failedResponseSchema.parse(await response.json())).toEqual({
      error: "Unauthorized"
    });
  });

  it("rejects an unknown session", async () => {
    await signUp();

    const response = await getCurrentUser("session=unknown");

    expect(response.status).toBe(401);
  });
});
