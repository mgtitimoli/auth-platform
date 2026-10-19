import {getErrorFrom} from "@mgtitimoli/utils/hono/response";
import createFetchClient from "openapi-fetch";
import type {Middleware} from "openapi-fetch";

import {AuthApiResponseError} from "./auth-api-response-error";
import type {paths} from "./auth-api-schema";

type AuthApiClient = ReturnType<typeof create>;

// Rejects every failed call, so the status survives openapi-react-query, which
// otherwise throws only the error body
const throwOnFailedResponse: Middleware = {
  onResponse: async ({response}) => {
    if (!response.ok) {
      throw new AuthApiResponseError(
        response.status,
        // A body that isn't JSON (e.g. a proxy's error page) has no message
        await getErrorFrom(response).catch(() => undefined)
      );
    }
  }
};

const create = (baseUrl: string) => {
  const authApiClient = createFetchClient<paths>({
    baseUrl,
    credentials: "include"
  });

  authApiClient.use(throwOnFailedResponse);

  return authApiClient;
};

export {create};
export type {AuthApiClient};
