import {sql} from "kysely";
import type {Kysely} from "kysely";

const createBeforeUpdateTrigger = (
  database: Kysely<unknown>,
  tableName: string,
  triggerName: string,
  functionCall: string
) =>
  sql`
      CREATE TRIGGER ${sql.raw(triggerName)}
      BEFORE UPDATE ON ${sql.raw(tableName)}
      FOR EACH ROW EXECUTE FUNCTION ${sql.raw(functionCall)};
    `.execute(database);

export {createBeforeUpdateTrigger};
