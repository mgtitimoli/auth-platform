import {sql} from "kysely";
import type {Kysely} from "kysely";

import {getUniqueConstraintName} from "./get-unique-constraint-name";

type Params<TDatabaseSchema> = {
  columns: string[];
  database: Kysely<TDatabaseSchema>;
  tableName: string;
};

const dropUniqueConstraint = <TDatabaseSchema>({
  columns,
  database,
  tableName
}: Params<TDatabaseSchema>) => {
  const constraintName = getUniqueConstraintName(tableName, columns);

  return sql`
    ALTER TABLE ${sql.raw(tableName)}
    DROP CONSTRAINT IF EXISTS ${sql.raw(constraintName)}
  `.execute(database);
};

export {dropUniqueConstraint};
