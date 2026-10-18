import type {Context} from "hono";
import {setCookie} from "hono/cookie";
import type {CookieOptions} from "hono/utils/cookie";

import {environmentVariables} from "@/utils/environment/environment-variables";

const name = "session";

const options: CookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "Lax",
  secure: environmentVariables.SESSION_COOKIE_SECURE,
  ...(environmentVariables.SESSION_COOKIE_DOMAIN !== undefined && {
    domain: environmentVariables.SESSION_COOKIE_DOMAIN
  })
};

const set = (c: Context, sessionId: string) =>
  setCookie(c, name, sessionId, options);

export {name, set};
