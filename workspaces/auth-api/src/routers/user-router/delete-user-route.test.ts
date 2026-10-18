import {getErrorFrom} from "@mgtitimoli/utils/hono/response";
import {describe, expect, it} from "vitest";

import {router} from "@/router";
import {createSignUpInput, postJson, signUp} from "@/utils/testing";

import {getCurrentUserSucceededResponseSchema} from "./get-current-user-route";

const otherSignUpInput = createSignUpInput({
  email: "grace@example.com",
  firstName: "Grace",
  lastName: "Hopper"
});

const unknownUserId = "11111111-1111-4111-8111-111111111111";

const deleteUser = (userId: string, cookie?: string) =>
  router.request("/users/" + userId, {
    headers: cookie === undefined ? {} : {Cookie: cookie},
    method: "DELETE"
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

describe("DELETE /users/:userId", () => {
  it("deletes a user", async () => {
    const {adminSessionCookie, otherUser} = await signUpAdminAndOtherUser();

    const response = await deleteUser(otherUser.id, adminSessionCookie);

    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
  });

  it("signs the deleted user out, and they can't sign in", async () => {
    const {adminSessionCookie, otherSessionCookie, otherUser} =
      await signUpAdminAndOtherUser();

    await deleteUser(otherUser.id, adminSessionCookie);

    const meResponse = await router.request("/users/me", {
      headers: {Cookie: otherSessionCookie}
    });

    const signInResponse = await postJson("/auth/sign-in", {
      email: otherSignUpInput.email,
      password: otherSignUpInput.password
    });

    expect(meResponse.status).toBe(401);
    expect(signInResponse.status).toBe(401);
  });

  it("rejects deleting the signed-in user", async () => {
    const adminSessionCookie = await signUp();

    const admin = await getCurrentUser(adminSessionCookie);

    const response = await deleteUser(admin.id, adminSessionCookie);

    expect(response.status).toBe(409);
    expect(await getErrorFrom(response)).toBe("Users can't delete themselves");
  });

  it("responds 404 for an unknown user", async () => {
    const response = await deleteUser(unknownUserId, await signUp());

    expect(response.status).toBe(404);
  });

  it("rejects an id that isn't a UUID", async () => {
    const response = await deleteUser("not-a-uuid", await signUp());

    expect(response.status).toBe(400);
  });

  it("rejects a request without the session cookie", async () => {
    expect((await deleteUser(unknownUserId)).status).toBe(401);
  });
});
