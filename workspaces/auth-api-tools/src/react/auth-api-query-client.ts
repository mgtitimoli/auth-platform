import createQueryClient from "openapi-react-query";

import type {AuthApiClient} from "../auth-api-client";

type AuthApiQueryClient = ReturnType<typeof create>;

const create = (authApiClient: AuthApiClient) =>
  createQueryClient(authApiClient);

export {create};
export type {AuthApiQueryClient};
