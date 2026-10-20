# @mgtitimoli/auth-domain

Domain schemas ([zod](https://zod.dev)), types, utilities and errors shared by
[auth-api](../auth-api) and the backoffice. It runs both in Node.js and in the
browser.

## Contents

- [Usage](#usage)
- [Modules](#modules)
- [Scripts](#scripts)

## Usage

Import each module through its subpath:

```ts
import {signUpInputSchema} from "@mgtitimoli/auth-domain/domain-schema";
import type {User} from "@mgtitimoli/auth-domain/domain-schema";
import {DuplicateEmailError} from "@mgtitimoli/auth-domain/duplicate-email-error";
import * as withSession from "@mgtitimoli/auth-domain/session";
```

## Modules

- [domain-schema](./src/domain-schema.ts): every schema and its inferred type
- [duplicate-email-error](./src/duplicate-email-error.ts)
- [inactive-user-error](./src/inactive-user-error.ts)
- [inactive-user-name-update-error](./src/inactive-user-name-update-error.ts)
- [invalid-credentials-error](./src/invalid-credentials-error.ts)
- [opaque-token](./src/opaque-token.ts)
- [same-user-deactivate-error](./src/same-user-deactivate-error.ts)
- [same-user-delete-error](./src/same-user-delete-error.ts)
- [session](./src/session.ts)
- [user](./src/user.ts)
- [user-status](./src/user-status.ts)

## Scripts

| Script | Description |
|---|---|
| `build` | Builds the workspace into `dist` |
| `watch` | Rebuilds the workspace on every change |
| `clean` | Removes `dist` |
| `test` | Runs the tests |
| `lint` | Lints the workspace |
| `check-types:all` | Type-checks the workspace |
| `check-types:files` | Type-checks the given files |
