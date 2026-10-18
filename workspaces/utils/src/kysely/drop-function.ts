import {sql} from "kysely";
import type {Kysely} from "kysely";

const dropFunction = (database: Kysely<unknown>, functionCall: string) =>
  sql`DROP FUNCTION IF EXISTS ${sql.raw(functionCall)};`.execute(database);

export {dropFunction};
