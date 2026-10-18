import {userSchema} from "@mgtitimoli/auth-domain/domain-schema";
import {ensureIsDefined} from "@mgtitimoli/utils/validation";
import {describe, expect, it} from "vitest";
import {z} from "zod";

import {router} from "@/router";
import {createSignUpInput, signUp} from "@/utils/testing";

const getUsersSucceededResponseSchema = z.object({
  data: z.array(userSchema),
  pagination: z.object({
    limit: z.number(),
    offset: z.number(),
    total: z.number()
  })
});

const userCount = 8;

const getEmail = (index: number) => "user" + index + "@example.com";

// Returns the session of the last one
const signUpUsers = async () => {
  const indexes = Array.from({length: userCount}, (_, index) => index);

  const sessionCookies = await indexes.reduce<Promise<string[]>>(
    async (previousSessionCookies, index) => [
      ...(await previousSessionCookies),
      await signUp(createSignUpInput({email: getEmail(index)}))
    ],
    Promise.resolve([])
  );

  return ensureIsDefined(sessionCookies.at(-1), "No user was signed up");
};

const getUsers = (cookie: string, query = "") =>
  router.request("/users" + query, {headers: {Cookie: cookie}});

describe("GET /users", () => {
  it("responds with the first 6 users by default, and the total", async () => {
    const response = await getUsers(await signUpUsers());

    const {data, pagination} = getUsersSucceededResponseSchema.parse(
      await response.json()
    );

    expect(response.status).toBe(200);
    expect(data.map(user => user.email)).toEqual(
      [0, 1, 2, 3, 4, 5].map(getEmail)
    );
    expect(pagination).toEqual({limit: 6, offset: 0, total: userCount});
  });

  it("responds with the page of the given limit and offset", async () => {
    const response = await getUsers(await signUpUsers(), "?limit=6&offset=6");

    const {data, pagination} = getUsersSucceededResponseSchema.parse(
      await response.json()
    );

    expect(data.map(user => user.email)).toEqual([6, 7].map(getEmail));
    expect(pagination).toEqual({limit: 6, offset: 6, total: userCount});
  });

  it("responds with an empty page past the last user", async () => {
    const response = await getUsers(await signUpUsers(), "?offset=100");

    const {data, pagination} = getUsersSucceededResponseSchema.parse(
      await response.json()
    );

    expect(data).toEqual([]);
    expect(pagination.total).toBe(userCount);
  });

  it("rejects a limit above 100", async () => {
    expect((await getUsers(await signUp(), "?limit=101")).status).toBe(400);
  });

  it("rejects a limit that isn't a number", async () => {
    expect((await getUsers(await signUp(), "?limit=six")).status).toBe(400);
  });

  it("rejects a request without the session cookie", async () => {
    expect((await router.request("/users")).status).toBe(401);
  });
});
