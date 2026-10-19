import type {Context, MiddlewareHandler} from "hono";
import {getCookie} from "hono/cookie";
import {createMiddleware} from "hono/factory";
import {HTTPException} from "hono/http-exception";

type GetSession<TSession> = (
  sessionId: string,
  c: Context
) => Promise<TSession | undefined>;

type Params<TSession> = {
  cookieName: string;
  getSession: GetSession<TSession>;
  // A cookie was sent, but no active session matches it
  onInvalidCookie?: (c: Context) => unknown;
};

type SessionMiddlewareEnv<TSession> = {
  Variables: {
    session: TSession;
  };
};

const sessionMiddleware = <TSession>({
  cookieName,
  getSession,
  onInvalidCookie
}: Params<TSession>): MiddlewareHandler<SessionMiddlewareEnv<TSession>> =>
  createMiddleware<SessionMiddlewareEnv<TSession>>(async (c, next) => {
    const sessionId = getCookie(c, cookieName);

    if (!sessionId) {
      throw new HTTPException(401);
    }

    const session = await getSession(sessionId, c);

    if (!session) {
      await onInvalidCookie?.(c);

      throw new HTTPException(401);
    }

    c.set("session", session);

    await next();
  });

export {sessionMiddleware};
export type {SessionMiddlewareEnv};
