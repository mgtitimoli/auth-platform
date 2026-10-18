import {CamelCasePlugin, Kysely, PostgresDialect} from "kysely";
import {Pool, types} from "pg";

import {environmentVariables} from "@/utils/environment/environment-variables";

import type {DatabaseDefinition} from "./database-schema";

type Database = Kysely<DatabaseDefinition>;

// pg parses both timestamp types to Date, while the schema declares strings.
// JSON.stringify masks the difference; anything reading the value before
// serialization (z.iso.datetime) gets a non-ISO toString and fails.
const toIsoString = (value: string) => new Date(value).toISOString();

types.setTypeParser(types.builtins.TIMESTAMP, toIsoString);
types.setTypeParser(types.builtins.TIMESTAMPTZ, toIsoString);

const databaseDialect = new PostgresDialect({
  pool: new Pool({
    connectionString: environmentVariables.AUTH_DATABASE_URL,
    max: 10
  })
});

const databasePlugins = [new CamelCasePlugin()];

const database = new Kysely<DatabaseDefinition>({
  dialect: databaseDialect,
  plugins: databasePlugins
});

export {database, databaseDialect, databasePlugins};
export type {Database};
