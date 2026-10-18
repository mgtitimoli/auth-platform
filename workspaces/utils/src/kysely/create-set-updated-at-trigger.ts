import type {Kysely} from "kysely";

import {createBeforeUpdateTrigger} from "./create-before-update-trigger";

const createSetUpdatedAtTrigger = (
  database: Kysely<unknown>,
  tableName: string
) =>
  createBeforeUpdateTrigger(
    database,
    tableName,
    `update_${tableName}_updated_at`,
    `set_updated_at()`
  );

export {createSetUpdatedAtTrigger};
