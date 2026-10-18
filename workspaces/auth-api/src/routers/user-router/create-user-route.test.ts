import {getErrorFrom} from "@mgtitimoli/utils/hono/response";
import {describe, expect, it} from "vitest";

import {router} from "@/router";
import {createSignUpInput, postJson, signUp} from "@/utils/testing";

import {createUserSucceededResponseSchema} from "./create-user-route";

const createUserInput = {
  email: "grace@example.com",
  firstName: "Grace",
  lastName: "Hopper",
  password: "compiler1!"
};

const createUser = (body: unknown, cookie: string) =>
  postJson("/users", body, cookie);

describe("POST /users", () => {
  it("creates an active user that hasn't signed in yet", async () => {
    const response = await createUser(createUserInput, await signUp());

    const {data: user} = createUserSucceededResponseSchema.parse(
      await response.json()
    );

    expect(response.status).toBe(201);
    expect(user).toMatchObject({
      email: createUserInput.email,
      firstName: createUserInput.firstName,
      lastName: createUserInput.lastName,
      loginsCounter: 0,
      status: "active"
    });
  });

  it("creates a user that can sign in with the given password", async () => {
    await createUser(createUserInput, await signUp());

    const response = await postJson("/auth/sign-in", {
      email: createUserInput.email,
      password: createUserInput.password
    });

    expect(response.status).toBe(204);
  });

  it("keeps the admin signed in", async () => {
    const sessionCookie = await signUp();

    await createUser(createUserInput, sessionCookie);

    const response = await router.request("/users/me", {
      headers: {Cookie: sessionCookie}
    });

    expect(response.status).toBe(200);
  });

  it("rejects an email that is already registered", async () => {
    const response = await createUser(
      {...createUserInput, email: createSignUpInput().email},
      await signUp()
    );

    expect(response.status).toBe(409);
    expect(await getErrorFrom(response)).toBe(
      "A user with this email already exists"
    );
  });

  it("rejects a password that doesn't meet the policy", async () => {
    const response = await createUser(
      {...createUserInput, password: "short"},
      await signUp()
    );

    expect(response.status).toBe(400);
  });

  it("rejects a request without the session cookie", async () => {
    expect((await postJson("/users", createUserInput)).status).toBe(401);
  });
});
