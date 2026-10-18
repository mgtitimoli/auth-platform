import {getErrorFrom} from "@mgtitimoli/utils/hono/response";
import {describe, expect, it} from "vitest";

import {router} from "@/router";
import {createSignUpInput, postJson, signUp} from "@/utils/testing";

import {getCurrentUserSucceededResponseSchema} from "./get-current-user-route";
import {updateUserSucceededResponseSchema} from "./update-user-route";

const otherSignUpInput = createSignUpInput({
  email: "grace@example.com",
  firstName: "Grace",
  lastName: "Hopper"
});

const unknownUserId = "11111111-1111-4111-8111-111111111111";

const updateUser = (userId: string, body: unknown, cookie?: string) =>
  router.request("/users/" + userId, {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      ...(cookie !== undefined && {Cookie: cookie})
    },
    method: "PATCH"
  });

const getCurrentUser = async (cookie: string) => {
  const response = await router.request("/users/me", {
    headers: {Cookie: cookie}
  });

  return getCurrentUserSucceededResponseSchema.parse(await response.json())
    .data;
};

const signUpAdminAndOtherUser = async () => {
  const adminSessionCookie = await signUp();

  const otherSessionCookie = await signUp(otherSignUpInput);

  const otherUser = await getCurrentUser(otherSessionCookie);

  return {adminSessionCookie, otherSessionCookie, otherUser};
};

describe("PATCH /users/:userId", () => {
  it("updates only the given fields", async () => {
    const {adminSessionCookie, otherUser} = await signUpAdminAndOtherUser();

    const response = await updateUser(
      otherUser.id,
      {lastName: "Murray Hopper"},
      adminSessionCookie
    );

    const {data: user} = updateUserSucceededResponseSchema.parse(
      await response.json()
    );

    expect(response.status).toBe(200);
    expect(user).toEqual({
      ...otherUser,
      lastName: "Murray Hopper",
      updatedAt: user.updatedAt
    });
    expect(user.updatedAt > otherUser.updatedAt).toBe(true);
  });

  it("rejects an email that is already registered", async () => {
    const {adminSessionCookie, otherUser} = await signUpAdminAndOtherUser();

    const response = await updateUser(
      otherUser.id,
      {email: createSignUpInput().email},
      adminSessionCookie
    );

    expect(response.status).toBe(409);
    expect(await getErrorFrom(response)).toBe(
      "A user with this email already exists"
    );
  });

  it("deactivates a user, terminating their sessions", async () => {
    const {adminSessionCookie, otherSessionCookie, otherUser} =
      await signUpAdminAndOtherUser();

    const response = await updateUser(
      otherUser.id,
      {status: "inactive"},
      adminSessionCookie
    );

    const otherUserResponse = await router.request("/users/me", {
      headers: {Cookie: otherSessionCookie}
    });

    expect(response.status).toBe(200);
    expect(otherUserResponse.status).toBe(401);
  });

  it("reactivates a user, who can then sign in", async () => {
    const {adminSessionCookie, otherUser} = await signUpAdminAndOtherUser();

    await updateUser(otherUser.id, {status: "inactive"}, adminSessionCookie);

    const response = await updateUser(
      otherUser.id,
      {status: "active"},
      adminSessionCookie
    );

    const {data: user} = updateUserSucceededResponseSchema.parse(
      await response.json()
    );

    const signInResponse = await postJson("/auth/sign-in", {
      email: otherSignUpInput.email,
      password: otherSignUpInput.password
    });

    expect(user.status).toBe("active");
    expect(signInResponse.status).toBe(204);
  });

  it("rejects updating the names of an inactive user", async () => {
    const {adminSessionCookie, otherUser} = await signUpAdminAndOtherUser();

    await updateUser(otherUser.id, {status: "inactive"}, adminSessionCookie);

    const response = await updateUser(
      otherUser.id,
      {firstName: "Amazing Grace"},
      adminSessionCookie
    );

    expect(response.status).toBe(422);
    expect(await getErrorFrom(response)).toBe(
      "The names of an inactive user can't be updated"
    );
  });

  it("rejects reactivating and renaming an inactive user at once", async () => {
    const {adminSessionCookie, otherUser} = await signUpAdminAndOtherUser();

    await updateUser(otherUser.id, {status: "inactive"}, adminSessionCookie);

    const response = await updateUser(
      otherUser.id,
      {firstName: "Amazing Grace", status: "active"},
      adminSessionCookie
    );

    expect(response.status).toBe(422);
  });

  it("rejects deactivating the signed-in user", async () => {
    const adminSessionCookie = await signUp();

    const admin = await getCurrentUser(adminSessionCookie);

    const response = await updateUser(
      admin.id,
      {status: "inactive"},
      adminSessionCookie
    );

    expect(response.status).toBe(409);
    expect(await getErrorFrom(response)).toBe(
      "Users can't deactivate themselves"
    );
  });

  it("responds 404 for an unknown user", async () => {
    const response = await updateUser(
      unknownUserId,
      {firstName: "Nobody"},
      await signUp()
    );

    expect(response.status).toBe(404);
  });

  it("rejects an id that isn't a UUID", async () => {
    const response = await updateUser(
      "not-a-uuid",
      {firstName: "Nobody"},
      await signUp()
    );

    expect(response.status).toBe(400);
  });

  it("rejects an empty update", async () => {
    const {adminSessionCookie, otherUser} = await signUpAdminAndOtherUser();

    const response = await updateUser(otherUser.id, {}, adminSessionCookie);

    expect(response.status).toBe(400);
    expect(await getErrorFrom(response)).toContain(
      "At least one field must be given"
    );
  });

  it("rejects fields that can't be updated", async () => {
    const {adminSessionCookie, otherUser} = await signUpAdminAndOtherUser();

    const response = await updateUser(
      otherUser.id,
      {loginsCounter: 0},
      adminSessionCookie
    );

    expect(response.status).toBe(400);
  });

  it("rejects a request without the session cookie", async () => {
    const response = await updateUser(unknownUserId, {firstName: "Nobody"});

    expect(response.status).toBe(401);
  });
});
