import {sql} from "kysely";
import type {Kysely} from "kysely";

import {getUniqueConstraintName} from "./get-unique-constraint-name";

type Params<TDatabaseSchema> = {
  columns: string[];
  database: Kysely<TDatabaseSchema>;
  nullsNotDistinct?: boolean;
  tableName: string;
};

const addUniqueConstraint = <TDatabaseSchema>({
  columns,
  database,
  nullsNotDistinct,
  tableName
}: Params<TDatabaseSchema>) => {
  const constraintName = getUniqueConstraintName(tableName, columns);

  const columnList = columns.join(", ");

  const nullsClause = nullsNotDistinct ? "NULLS NOT DISTINCT" : "";

  return sql`
    ALTER TABLE ${sql.raw(tableName)}
    ADD CONSTRAINT ${sql.raw(constraintName)}
    UNIQUE ${sql.raw(nullsClause)} (${sql.raw(columnList)})
  `.execute(database);
};

export {addUniqueConstraint};
