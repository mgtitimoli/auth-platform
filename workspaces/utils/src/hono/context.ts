import {getConnInfo} from "@hono/node-server/conninfo";
import type {Context} from "hono";
import {matchedRoutes} from "hono/route";

import type {ErrorHttpStatusCode} from "@/http/http-status-code";
import {isObject} from "@/validation/is-object";

import {createFailedResponseFrom} from "./response";
import type {RouteDescriptor} from "./types";

const jsonWithError = <TErrorHttpStatusCode extends ErrorHttpStatusCode>(
  c: Context,
  errorHttpStatusCode: TErrorHttpStatusCode
) => c.json(createFailedResponseFrom(errorHttpStatusCode), errorHttpStatusCode);

const matchAny = (c: Context, routeDescriptors: RouteDescriptor[]) => {
  const matchedRoute = matchedRoutes(c).at(-1);

  if (!matchedRoute) {
    return false;
  }

  return routeDescriptors.some(
    routeMatch =>
      matchedRoute.path === routeMatch.path &&
      c.req.method === routeMatch.method
  );
};

// The request only has a Node.js connection when served by @hono/node-server
// (not in requests made with app.request, as tests do)
const getRemoteAddress = (c: Context) =>
  isObject(c.env) && "incoming" in c.env
    ? getConnInfo(c).remote.address
    : undefined;

const getForwardedFor = (c: Context) =>
  c.req.header("x-forwarded-for")?.split(",")[0];

const getRemoteIp = (c: Context) => getForwardedFor(c) ?? getRemoteAddress(c);

export {getRemoteIp, jsonWithError, matchAny};
