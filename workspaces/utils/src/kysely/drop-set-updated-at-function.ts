import type {Kysely} from "kysely";

import {dropFunction} from "./drop-function";

const dropSetUpdatedAtFunction = (database: Kysely<unknown>) =>
  dropFunction(database, "set_updated_at()");

export {dropSetUpdatedAtFunction};
