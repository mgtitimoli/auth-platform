import type {Context} from "hono";
import {pinoLogger} from "hono-pino";
import type {Logger} from "pino";

import * as withContext from "@/hono/context";

type State = {
  hasLoggerBeenSet: boolean;
};

type Params = {
  isJsonLogger: boolean;
  logger: Logger;
  shouldSkipLogging?: (c: Context) => boolean;
};

type LoggerMiddlewareEnv = {
  Variables: {
    logger: Logger;
  };
};

const formatIp = (ip: string) => ip.replace("::ffff:", "");

const getLogMessage = (c: Context) => {
  const remoteIp = withContext.getRemoteIp(c);

  const httpMethod = c.req.method;

  const httpStatusCode = c.res.status;

  const requestUrl = new URL(c.req.url);

  const pathWithQuery = requestUrl.pathname + requestUrl.search;

  return [
    remoteIp ? formatIp(remoteIp) : "unknown",
    "|",
    httpMethod,
    pathWithQuery,
    httpStatusCode
  ].join(" ");
};

/**
 * This is not ideal, but until we manage to create a custom hono-pino
 * middleware, we need to use this hack while using hono-pino
 *
 * @see https://github.com/maou-shonen/hono-pino/blob/main/src/middleware.ts#L144
 */
const getLogger =
  ({logger, shouldSkipLogging}: Params, state: State) =>
  (c: Context) => {
    if (!state.hasLoggerBeenSet) {
      state.hasLoggerBeenSet = true;

      return logger;
    }

    return shouldSkipLogging?.(c) ? {level: "silent"} : {};
  };

const loggerMiddleware = (params: Params) =>
  pinoLogger({
    http: {
      onReqBindings: c => ({
        req: {
          method: c.req.method,
          url: c.req.url
        }
      }),
      onResLevel: c => (c.error ? "error" : "debug"),
      onResMessage: params.isJsonLogger ? getLogMessage : undefined
    },
    pino: getLogger(params, {hasLoggerBeenSet: false})
  });

export {loggerMiddleware};
export type {LoggerMiddlewareEnv};
