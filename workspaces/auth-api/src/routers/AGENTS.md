# Routers

HTTP routes. Each router exposes the endpoints of a resource (`/users`) or a
group of actions (`/auth`).

## Directory Structure

```
{name}-router/
├── {name}-router.ts            # Composes the routes into a router
├── {action}-route.ts           # One file per route
├── {action}-route.test.ts      # Its tests
└── index.ts                    # Exports the router
```

Routers are mounted in `src/router.ts` (`router.route("/auth", authRouter)`).

## Route File Pattern

Every route file has these sections, in order:

### 1. Imports

```ts
import {signUpInputSchema} from "@mgtitimoli/auth-domain/domain-schema";
import {failedResponseSchema} from "@mgtitimoli/utils/hono/response";
import type {TypeResponseFrom} from "@mgtitimoli/utils/hono/response-definition";
import * as withRouteDefinition from "@mgtitimoli/utils/hono/route-definition";
import type {AnyRouteDefinition} from "@mgtitimoli/utils/hono/route-definition";
import {validate} from "@mgtitimoli/utils/hono/validate";
import type {Hono} from "hono";

import type {HonoEnv} from "@/hono-env";
import * as authService from "@/services/auth-service";
import * as withSessionCookie from "@/utils/session-cookie/session-cookie";
```

### 2. Response Type

```ts
type Response = TypeResponseFrom<(typeof routeDefinition)["responses"]>;
```

Types come right after the imports (the conventions' imports → types →
implementation → exports); a type alias can reference `typeof routeDefinition`
declared below it.

### 3. Schemas

Request and response schemas live in `@mgtitimoli/auth-domain/domain-schema`.
Route-specific ones (path parameters, a response shape used only here) are
declared in the route file, with `.meta({ref})` when they appear in OpenAPI.

The success response schema is a const (`getUsersSucceededResponseSchema`),
used by `routeDefinition` and exported next to `attachTo`, so the route's tests
parse responses with the exact schema the route documents. Tests read error
bodies with `getErrorFrom` from `@mgtitimoli/utils/hono/response`.

### 4. Route Definition (OpenAPI)

```ts
const routeDefinition = {
  description: "…",
  operationId: "signUp",
  requestBody: {
    content: {"application/json": {schema: signUpInputSchema}},
    required: true
  },
  responses: {
    201: {description: "User created and signed in: the session id is in the session cookie"},
    400: {content: {"application/json": {schema: failedResponseSchema}}},
    409: {content: {"application/json": {schema: failedResponseSchema}}}
  },
  summary: "Sign up",
  tags: ["Auth"]
} satisfies AnyRouteDefinition;
```

Keep response keys in ascending numeric order. A response without a body has
only a `description` (and the handler returns `c.body(null, status)`).

### 5. Handler

```ts
const attachTo = (router: Hono<HonoEnv>) =>
  router.post(
    "/sign-up",
    withRouteDefinition.describe(routeDefinition),
    validate("json", signUpInputSchema),
    async (c): Promise<Response> => {
      const input = c.req.valid("json");

      const database = c.get("database");

      try {
        const session = await authService.signUp({database, input});

        withSessionCookie.set(c, session.id);

        return c.body(null, 201);
      } catch (error) {
        if (error instanceof DuplicateEmailError) {
          return c.json({error: error.message}, 409);
        }

        throw error;
      }
    }
  );

export {attachTo};
```

Routes with a response body export their success schema too
(`export {attachTo, createUserSucceededResponseSchema};`).

## Router Composition

```ts
import * as withRoute from "@mgtitimoli/utils/hono/route";
import {Hono} from "hono";

import type {HonoEnv} from "@/hono-env";

import * as signUpRoute from "./sign-up-route";

const authRoutes = [signUpRoute];

const authRouter = withRoute.attachAllTo(authRoutes, new Hono<HonoEnv>());

export {authRouter};
```

## Rules

- **Routes only call services**, never repositories. A service without logic
  re-exports the repository function's module.
- **Domain errors** are mapped with `try/catch` + `instanceof` to their status
  and `{error: error.message}`; anything else is rethrown to the `errorHandler`
  (500).
- **"Not found" is not an error**: services return `undefined`, and the route
  responds 404.
- **Updates use `PATCH`** with partial inputs.
- **Session ids only travel in the `HttpOnly` session cookie**
  (`withSessionCookie.set`), never in a response body, and never in logs.

## Validation

```ts
validate("param", paramsSchema)   // URL path parameters
validate("json", inputSchema)     // Request body
validate("query", querySchema)    // Query string

const {userId} = c.req.valid("param");
const input = c.req.valid("json");
const {limit, offset} = c.req.valid("query");
```

A failed validation responds 400 with every issue in `error`.

## Response Patterns

```ts
return c.json({data: user}, 200);                              // Success
return c.json({data: user}, 201);                              // Created
return c.body(null, 204);                                      // No content
return c.json({error: "User not found"}, 404);                 // Not found
return c.json({data: users, pagination: {limit, offset, total}}, 200);  // Paginated
```

Response schema helpers (`@mgtitimoli/utils/hono/response`):

- `createSucceededResponseSchema(schema, "RefName")`: `{data: T}`
- `createPaginatedResponseSchema(schema, "RefName")`: `{data: T[], pagination}`
- `failedResponseSchema`: `{error: string}`
