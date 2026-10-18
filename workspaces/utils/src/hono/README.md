# hono

## Types

### RouteDescriptor

#### Description

Type that represents a route by its HTTP method and path.

#### Example

```ts
import type {RouteDescriptor} from "@mgtitimoli/utils/hono";

const routeDescriptor: RouteDescriptor = {method: "GET", path: "/health"};
```

### LoggerMiddlewareEnv

#### Description

Type that represents the Hono environment set by [loggerMiddleware](#loggermiddleware) (the `logger` variable).

#### Example

```ts
import type {LoggerMiddlewareEnv} from "@mgtitimoli/utils/hono/middlewares";

type HonoEnv = LoggerMiddlewareEnv & {Variables: {requestId: string}};
```

### SessionMiddlewareEnv

#### Description

Type that represents the Hono environment set by [sessionMiddleware](#sessionmiddleware) (the `session` variable).

#### Example

```ts
import type {SessionMiddlewareEnv} from "@mgtitimoli/utils/hono/middlewares";

type HonoEnv = SessionMiddlewareEnv<Session>;
```

## Functions

### createDebugHonoLogger

#### Description

Function that creates a [pino](https://getpino.io) logger with readable output for local development, also writing to a file when `logFilePath` is given (`retainLogs` appends to it instead of overwriting it).

#### Example

```ts
import {createDebugHonoLogger} from "@mgtitimoli/utils/hono/hono-logger";

const logger = createDebugHonoLogger({
  logFilePath: "logs/app.log",
  logLevel: "debug"
});
```

### errorHandler

#### Description

Function that creates a Hono error handler: it calls `onError` with the error and a log message, and responds with the status of `HTTPException` errors, or with a 500 for any other error.

#### Example

```ts
import {errorHandler} from "@mgtitimoli/utils/hono/error-handler";

router.onError(
  errorHandler((error, logMessage) => logger.error(error, logMessage))
);
```

### loggerMiddleware

#### Description

Function that creates a middleware that sets the given logger in the context and logs every request. `isJsonLogger` uses a one-line message suited to JSON logs, and `shouldSkipLogging` excludes requests from being logged.

#### Example

```ts
import {loggerMiddleware} from "@mgtitimoli/utils/hono/middlewares";

router.use(loggerMiddleware({isJsonLogger: false, logger}));
```

### sessionMiddleware

#### Description

Function that creates a middleware that reads the session id from the given cookie, loads the session with the given `getSession`, and sets it in the context (`c.get("session")`). It responds 401 when there's no cookie or `getSession` returns nothing.

#### Example

```ts
import {sessionMiddleware} from "@mgtitimoli/utils/hono/middlewares";

router.use(
  sessionMiddleware({
    cookieName: "session",
    getSession: sessionId => sessionRepository.getActiveSession(sessionId)
  })
);
```

### validate

#### Description

Function that creates a middleware that validates the given request target
(`json`, `query`, `param`, …) with the given schema, responding 400 with every
issue in the message when validation fails. It also documents the schema in
the OpenAPI spec.

#### Example

```ts
import {validate} from "@mgtitimoli/utils/hono/validate";

router.post("/", validate("json", signUpInputSchema), async c => {
  const input = c.req.valid("json");

  // ...
});
```

## Modules

- [context](./context.ts)
- [cursor](./cursor)
- [health-route](./health-route.ts)
- [query](./query.ts)
- [request-body-definition](./request-body-definition.ts)
- [response](./response.ts)
- [response-definition](./response-definition.ts)
- [route](./route.ts)
- [route-definition](./route-definition.ts)
- [server](./server.ts)
