import * as withAuthApiClient from "@mgtitimoli/auth-api-tools/auth-api-client";

import {environmentVariables} from "@/client/utils/environment/environment-variables";

const authApiClient = withAuthApiClient.create(
  environmentVariables.AUTH_API_URL
);

export {authApiClient};
