import {swaggerUI} from "@hono/swagger-ui";
import type {RouteDescriptor} from "@mgtitimoli/utils/hono";
import * as withContext from "@mgtitimoli/utils/hono/context";
import {errorHandler} from "@mgtitimoli/utils/hono/error-handler";
import * as healthRoute from "@mgtitimoli/utils/hono/health-route";
import {
  loggerMiddleware,
  sessionMiddleware
} from "@mgtitimoli/utils/hono/middlewares";
import {Hono} from "hono";
import {except} from "hono/combine";
import {cors} from "hono/cors";
import {requestId} from "hono/request-id";
import {openAPIRouteHandler} from "hono-openapi";

import {database} from "./database/database";
import type {HonoEnv} from "./hono-env";
import {logger} from "./logger";
import {authRouter} from "./routers/auth-router";
import {userRouter} from "./routers/user-router";
import * as sessionService from "./services/session-service";
import {environmentNames} from "./utils/environment/environment-name";
import {environmentVariables} from "./utils/environment/environment-variables";
import {
  sessionCookieName,
  sessionCookieSecuritySchemes
} from "./utils/session-cookie/session-cookie";

const isLocalEnvironment =
  environmentVariables.ENVIRONMENT_NAME === environmentNames.local;

const openApiRoutePath = "/openapi";

const swaggerRoutePath = "/swagger";

const unauthenticatedRoutePaths = [
  healthRoute.routeDescriptor.path,
  openApiRoutePath,
  swaggerRoutePath,
  "/favicon.ico",
  "/auth/sign-in",
  "/auth/sign-up"
];

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

// Before the session middleware, so preflight requests don't need a session
router.use(
  cors({
    credentials: true,
    origin: environmentVariables.AUTH_BACKOFFICE_URL
  })
);

router.use(async (c, next) => {
  c.set("database", database);

  await next();
});

router.use(
  except(
    unauthenticatedRoutePaths,
    sessionMiddleware({
      cookieName: sessionCookieName,
      getSession: sessionId =>
        sessionService.getActiveSession({database, id: sessionId})
    })
  )
);

healthRoute.attachTo(router);

router.route("/auth", authRouter);

router.route("/users", userRouter);

router.get(
  openApiRoutePath,
  openAPIRouteHandler(router, {
    documentation: {
      components: {securitySchemes: sessionCookieSecuritySchemes},
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
