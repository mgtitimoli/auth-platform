# Auth API Tools Workspace

Typed client for `auth-api`, consumed by the backoffice.

## Platform

The code runs in the browser (and in Node.js): never use Node.js-only APIs.

## Layout

- `src/auth-api-schema.ts` is generated from the API's OpenAPI document: never
  edit it by hand. After an API change, regenerate it with the API running
  (`yarn auth-api-tools:run update-auth-api-schema`) and commit it, so type
  checking, Docker builds and CI never need the API.
- Everything that needs React lives under `src/react/`: React, TanStack Query
  and `openapi-react-query` are optional peers, so the plain client works
  without them.
- Failed requests reject with `AuthApiResponseError` (status and message): keep
  error handling in the client's middleware, so hooks and plain calls fail the
  same way.

## Building

Other workspaces consume `dist`: after a change, rebuild with
`yarn auth-api-tools:run build` (`yarn watch` at the root does it
automatically).
