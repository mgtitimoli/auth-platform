import {createDebugHonoLogger} from "@mgtitimoli/utils/hono/hono-logger";
import {createJsonLogger} from "@mgtitimoli/utils/logging/json-logger";

import {environmentNames} from "@/utils/environment/environment-name";
import {environmentVariables} from "@/utils/environment/environment-variables";

const logger =
  environmentVariables.ENVIRONMENT_NAME === environmentNames.local
    ? createDebugHonoLogger({
        logFilePath: "logs/auth-api.log",
        logLevel: environmentVariables.LOG_LEVEL,
        retainLogs: environmentVariables.LOGS_RETAINED
      })
    : createJsonLogger({logLevel: environmentVariables.LOG_LEVEL});

export {logger};
