import {Hono} from "hono";
import {HTTPException} from "hono/http-exception";
import {describe, expect, it} from "vitest";

import {errorHandler} from "@/hono/error-handler";

const createRouterThrowing = (error: Error) => {
  const router = new Hono();

  router.onError(errorHandler(() => undefined));

  router.get("/", () => {
    throw error;
  });

  return router;
};

describe("errorHandler", () => {
  it("sends an HTTP exception as JSON", async () => {
    const router = createRouterThrowing(new HTTPException(401));

    const response = await router.request("/");

    expect(response.status).toBe(401);
    expect(response.headers.get("content-type")).toMatch(/^application\/json/);
    expect(await response.json()).toEqual({error: "Unauthorized"});
  });

  it("keeps the headers of an HTTP exception's response", async () => {
    const res = new Response(null, {
      headers: {"WWW-Authenticate": "Cookie"}
    });

    const router = createRouterThrowing(new HTTPException(401, {res}));

    const response = await router.request("/");

    expect(response.headers.get("www-authenticate")).toBe("Cookie");
    expect(response.headers.get("content-type")).toMatch(/^application\/json/);
  });
});
