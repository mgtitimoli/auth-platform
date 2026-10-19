# @mgtitimoli/auth-api-tools

Typed client for [auth-api](../auth-api): its OpenAPI types, a fetch client
([openapi-fetch](https://openapi-ts.dev/openapi-fetch/)) and React Query hooks
([openapi-react-query](https://openapi-ts.dev/openapi-react-query/)).

## Installation

The React hooks need these peer dependencies (the plain client doesn't):

- `@tanstack/react-query`
- `openapi-react-query`
- `react`

## Integration

1. Create the client with the API's URL. It sends the session cookie with every
   request (`credentials: "include"`):

   ```ts
   import * as withAuthApiClient from "@mgtitimoli/auth-api-tools/auth-api-client";

   const authApiClient = withAuthApiClient.create("http://localhost:8080");
   ```

2. For React, create the query client from it, inside a `QueryClientProvider`:

   ```ts
   import * as withAuthApiQueryClient from "@mgtitimoli/auth-api-tools/react/auth-api-query-client";

   const authApi = withAuthApiQueryClient.create(authApiClient);

   const signUp = authApi.useMutation("post", "/auth/sign-up");
   ```

## Errors

Every failed request (any non-2xx status) rejects with an `AuthApiResponseError`,
carrying the response's `status` and the API's error message as its `message`:

```ts
import {AuthApiResponseError} from "@mgtitimoli/auth-api-tools/auth-api-response-error";

if (error instanceof AuthApiResponseError && error.status === 409) {
  …
}
```

## Updating the types

`src/auth-api-schema.ts` is generated from the API's OpenAPI document and
committed. After changing the API, start it (`yarn watch` at the root) and run:

```sh
yarn auth-api-tools:run update-auth-api-schema
```

## Modules

- [auth-api-client](./src/auth-api-client.ts)
- [auth-api-response-error](./src/auth-api-response-error.ts)
- [auth-api-schema](./src/auth-api-schema.ts) (generated)
- [react/auth-api-query-client](./src/react/auth-api-query-client.ts)

## Scripts

| Script | Description |
|---|---|
| `build` | Builds the package into `dist` |
| `watch` | Rebuilds it on every change |
| `update-auth-api-schema` | Regenerates the types from the running API |
| `lint` | Lints the workspace |
| `check-types:all` | Type-checks the workspace |
| `check-types:files` | Type-checks the given files |
