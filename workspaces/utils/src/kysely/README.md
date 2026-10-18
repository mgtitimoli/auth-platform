# kysely

Utilities for [Kysely](https://kysely.dev) with PostgreSQL.

## Types

### ColumnNameFrom

#### Description

Type that represents the column names of the table an `ExpressionBuilder` is
bound to.

#### Example

```ts
import type {ExpressionBuilder} from "kysely";

import type {ColumnNameFrom} from "@mgtitimoli/utils/kysely";

type UserColumnName = ColumnNameFrom<ExpressionBuilder<Database, "users">>;
```

## Functions

### addUniqueConstraint

#### Description

Function that adds a unique constraint named `<table>_<columns>_unique` to an
existing table (for migrations).

#### Example

```ts
import {addUniqueConstraint} from "@mgtitimoli/utils/kysely";

await addUniqueConstraint({columns: ["email"], database, tableName: "users"});
```

### createSetUpdatedAtFunction

#### Description

Function that creates the `set_updated_at()` trigger function, which sets
`updated_at` to the current time (for migrations).

#### Example

```ts
import {createSetUpdatedAtFunction} from "@mgtitimoli/utils/kysely";

await createSetUpdatedAtFunction(database);
```

### createSetUpdatedAtTrigger

#### Description

Function that creates a trigger that calls `set_updated_at()` before every
update of the given table (for migrations).

#### Example

```ts
import {createSetUpdatedAtTrigger} from "@mgtitimoli/utils/kysely";

await createSetUpdatedAtTrigger(database, "users");
```

### dropSetUpdatedAtFunction

#### Description

Function that drops the `set_updated_at()` trigger function (for migrations).

#### Example

```ts
import {dropSetUpdatedAtFunction} from "@mgtitimoli/utils/kysely";

await dropSetUpdatedAtFunction(database);
```

### dropUniqueConstraint

#### Description

Function that drops the unique constraint added by
[addUniqueConstraint](#adduniqueconstraint) (for migrations).

#### Example

```ts
import {dropUniqueConstraint} from "@mgtitimoli/utils/kysely";

await dropUniqueConstraint({columns: ["email"], database, tableName: "users"});
```

### escapeLikePattern

#### Description

Function that escapes the `LIKE` / `ILIKE` wildcards in the given value, so it
is matched literally.

#### Example

```ts
import {escapeLikePattern} from "@mgtitimoli/utils/kysely";

query.where("name", "ilike", `%${escapeLikePattern(search)}%`);
```

### hasJsonKeys

#### Description

Function that returns an expression that is true if the given `jsonb` column
has any of the given keys.

#### Example

```ts
import {hasJsonKeys} from "@mgtitimoli/utils/kysely";

query.where(eb => hasJsonKeys({column: "settings", eb, keys: ["theme"]}));
```

### isUniqueViolation

#### Description

Function that returns a boolean indicating if the given error is a PostgreSQL
unique violation of the given constraint.

#### Example

```ts
import {isUniqueViolation} from "@mgtitimoli/utils/kysely";

try {
  await database.insertInto("users").values(values).execute();
} catch (error) {
  if (isUniqueViolation(error, "users_email_unique")) {
    throw new DuplicateEmailError();
  }

  throw error;
}
```

### startTransactionIfNeeded

#### Description

Function that runs the given callback in a transaction: the current one if the
given database is already a transaction, or a new one otherwise. So functions
that need a transaction can be composed into a single one.

#### Example

```ts
import {startTransactionIfNeeded} from "@mgtitimoli/utils/kysely";

const createUser = ({database, input}: Params) =>
  startTransactionIfNeeded(database, async transaction => {
    // every query here uses transaction
  });
```

### updateJson

#### Description

Function that returns an update for the given `jsonb` column that merges the
given data and removes the given keys.

#### Example

```ts
import {updateJson} from "@mgtitimoli/utils/kysely";

query.set(eb => updateJson({column: "settings", dataToMerge: {theme: "dark"}, eb}));
```

## Modules

- [json-updates](./json-updates.ts)
- [sort-direction](./sort-direction.ts)
