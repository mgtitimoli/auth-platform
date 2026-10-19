import * as withAuthApiQueryClient from "@mgtitimoli/auth-api-tools/react/auth-api-query-client";

import {authApiClient} from "./auth-api-client";

const authApi = withAuthApiQueryClient.create(authApiClient);

export {authApi};
