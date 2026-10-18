import type {Context} from "hono";
import {deleteCookie, setCookie} from "hono/cookie";
import type {CookieOptions} from "hono/utils/cookie";

import {environmentVariables} from "@/utils/environment/environment-variables";

const sessionCookieName = "session";

const options: CookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "Lax",
  secure: environmentVariables.SESSION_COOKIE_SECURE,
  ...(environmentVariables.SESSION_COOKIE_DOMAIN !== undefined && {
    domain: environmentVariables.SESSION_COOKIE_DOMAIN
  })
};

const securitySchemeName = "sessionCookie";

const sessionCookieSecuritySchemes = {
  [securitySchemeName]: {in: "cookie", name: sessionCookieName, type: "apiKey"}
} as const;

// The OpenAPI security requirement of the routes that need the session
const sessionCookieSecurity = [{[securitySchemeName]: []}];

const set = (c: Context, sessionId: string) =>
  setCookie(c, sessionCookieName, sessionId, options);

// Browsers only remove a cookie set with the same path and domain
const remove = (c: Context) => deleteCookie(c, sessionCookieName, options);

export {
  remove,
  sessionCookieName,
  sessionCookieSecurity,
  sessionCookieSecuritySchemes,
  set
};
