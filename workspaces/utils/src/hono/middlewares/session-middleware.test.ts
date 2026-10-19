import {Hono} from "hono";
import {describe, expect, it, vi} from "vitest";

import {errorHandler} from "@/hono/error-handler";
import {sessionMiddleware} from "@/hono/middlewares";

const activeSessionId = "active";

const createRouter = (onInvalidCookie: () => unknown) => {
  const router = new Hono();

  router.onError(errorHandler(() => undefined));

  router.use(
    sessionMiddleware({
      cookieName: "session",
      getSession: sessionId =>
        Promise.resolve(
          sessionId === activeSessionId ? {id: sessionId} : undefined
        ),
      onInvalidCookie
    })
  );

  router.get("/", c => c.body(null, 204));

  return router;
};

const requestWith = (router: Hono, cookie?: string) =>
  router.request("/", {
    headers: cookie === undefined ? {} : {Cookie: cookie}
  });

describe("sessionMiddleware", () => {
  it("lets a request with an active session through", async () => {
    const onInvalidCookie = vi.fn();

    const response = await requestWith(
      createRouter(onInvalidCookie),
      "session=" + activeSessionId
    );

    expect(response.status).toBe(204);
    expect(onInvalidCookie).not.toHaveBeenCalled();
  });

  it("rejects a request without the cookie", async () => {
    const onInvalidCookie = vi.fn();

    const response = await requestWith(createRouter(onInvalidCookie));

    expect(response.status).toBe(401);
    expect(onInvalidCookie).not.toHaveBeenCalled();
  });

  it("calls onInvalidCookie before rejecting an unknown session", async () => {
    const onInvalidCookie = vi.fn();

    const response = await requestWith(
      createRouter(onInvalidCookie),
      "session=unknown"
    );

    expect(response.status).toBe(401);
    expect(onInvalidCookie).toHaveBeenCalledOnce();
  });
});
