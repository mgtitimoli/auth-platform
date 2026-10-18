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
};

type SessionMiddlewareEnv<TSession> = {
  Variables: {
    session: TSession;
  };
};

const sessionMiddleware = <TSession>({
  cookieName,
  getSession
}: Params<TSession>): MiddlewareHandler<SessionMiddlewareEnv<TSession>> =>
  createMiddleware<SessionMiddlewareEnv<TSession>>(async (c, next) => {
    const sessionId = getCookie(c, cookieName);

    const session = sessionId ? await getSession(sessionId, c) : undefined;

    if (!session) {
      throw new HTTPException(401);
    }

    c.set("session", session);

    await next();
  });

export {sessionMiddleware};
export type {SessionMiddlewareEnv};
