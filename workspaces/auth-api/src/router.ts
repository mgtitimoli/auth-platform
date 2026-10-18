import {swaggerUI} from "@hono/swagger-ui";
import type {RouteDescriptor} from "@mgtitimoli/utils/hono";
import * as withContext from "@mgtitimoli/utils/hono/context";
import {errorHandler} from "@mgtitimoli/utils/hono/error-handler";
import * as healthRoute from "@mgtitimoli/utils/hono/health-route";
import {loggerMiddleware} from "@mgtitimoli/utils/hono/middlewares";
import {Hono} from "hono";
import {requestId} from "hono/request-id";
import {openAPIRouteHandler} from "hono-openapi";

import type {HonoEnv} from "./hono-env";
import {logger} from "./logger";
import {environmentNames} from "./utils/environment/environment-name";
import {environmentVariables} from "./utils/environment/environment-variables";

const isLocalEnvironment =
  environmentVariables.ENVIRONMENT_NAME === environmentNames.local;

const openApiRoutePath = "/openapi";

const swaggerRoutePath = "/swagger";

const noLoggingRouteDescriptors: RouteDescriptor[] = [
  healthRoute.routeDescriptor
];

const router = new Hono<HonoEnv>();

router.use(requestId());

router.use(
  loggerMiddleware({
    isJsonLogger: !isLocalEnvironment,
    logger,
    shouldSkipLogging: c => withContext.matchAny(c, noLoggingRouteDescriptors)
  })
);

router.onError(
  errorHandler((error, logMessage) => {
    if (isLocalEnvironment) {
      console.error(error);
    }

    logger.error(error, logMessage);
  })
);

healthRoute.attachTo(router);

router.get(
  openApiRoutePath,
  openAPIRouteHandler(router, {
    documentation: {
      info: {
        description: "REST API for users and sessions",
        title: "Auth API",
        version: "1.0.0"
      }
    }
  })
);

router.get(swaggerRoutePath, swaggerUI({url: openApiRoutePath}));

export {router};
