import type {ErrorHandler} from "hono";
import {HTTPException} from "hono/http-exception";
import type {HTTPResponseError} from "hono/types";

import * as withHttpStatusCode from "@/http/http-status-code";

import * as withContext from "./context";
import {createFailedResponseFrom} from "./response";

type OnError = (
  error: Error | HTTPResponseError,
  logMessage: string
) => unknown;

const {httpStatusCodes} = withHttpStatusCode;

const getLogMessage = (error: Error | HTTPResponseError) =>
  error instanceof HTTPException
    ? error.message || "HTTPException: " + error.status
    : error.message || "Error";

const errorHandler =
  (onError: OnError): ErrorHandler =>
  (error, c) => {
    onError(error, getLogMessage(error));

    if (!(error instanceof HTTPException)) {
      return withContext.jsonWithError(c, httpStatusCodes.internalServerError);
    }

    const response = error.getResponse();

    const headers = Object.fromEntries(response.headers.entries());

    const httpStatusCode = withHttpStatusCode.getFrom(error.status);

    const data = error.message
      ? {error: error.message}
      : createFailedResponseFrom(httpStatusCode);

    return c.json(data, error.status, headers);
  };

export {errorHandler};
