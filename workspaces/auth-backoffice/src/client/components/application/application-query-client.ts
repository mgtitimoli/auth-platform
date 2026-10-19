import {AuthApiResponseError} from "@mgtitimoli/auth-api-tools/auth-api-response-error";
import * as withHttpStatusCode from "@mgtitimoli/utils/http/http-status-code";
import * as withHttpStatusCodeClass from "@mgtitimoli/utils/http/http-status-code-class";
import {QueryClient} from "@tanstack/react-query";

const {httpStatusCodeClasses} = withHttpStatusCodeClass;

// TanStack's default, which a retry function replaces
const maxRetryCount = 3;

const isAuthApiClientError = (error: Error) =>
  error instanceof AuthApiResponseError &&
  withHttpStatusCode.isHttpStatusCode(error.status) &&
  withHttpStatusCodeClass.getFrom(error.status) ===
    httpStatusCodeClasses.clientError;

// A client error (e.g. 401, 404) fails the same way when retried
const shouldRetryQuery = (failureCount: number, error: Error) =>
  failureCount < maxRetryCount && !isAuthApiClientError(error);

const create = () =>
  new QueryClient({
    defaultOptions: {queries: {retry: shouldRetryQuery}}
  });

export {create};
