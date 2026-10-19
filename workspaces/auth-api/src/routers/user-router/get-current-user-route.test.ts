import * as withResponse from "@mgtitimoli/utils/fetch/response";
import {getErrorFrom} from "@mgtitimoli/utils/hono/response";
import {describe, expect, it} from "vitest";

import {router} from "@/router";
import {sessionCookieName} from "@/utils/session-cookie/session-cookie";
import {createSignUpInput, signUp} from "@/utils/testing";

import {getCurrentUserSucceededResponseSchema} from "./get-current-user-route";

const signUpInput = createSignUpInput();

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
    expect(await getErrorFrom(response)).toBe("Unauthorized");
    expect(withResponse.getCookie(response, sessionCookieName)).toBeUndefined();
  });

  it("rejects an unknown session, removing its cookie", async () => {
    await signUp();

    const response = await getCurrentUser("session=unknown");

    expect(response.status).toBe(401);
    expect(withResponse.getCookie(response, sessionCookieName)).toBe("");
    expect(response.headers.getSetCookie().join()).toMatch(/Max-Age=0/);
  });
});
