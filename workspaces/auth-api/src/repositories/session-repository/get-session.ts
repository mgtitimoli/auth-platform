import {mapIfDefined} from "@mgtitimoli/utils/validation";

import type {Database} from "@/database/database";
import {allSessionColumnNames} from "@/database/session-column-name";

import {createSessionFrom} from "./create-session-from";

type Params = {
  database: Database;
  id: string;
};

const getSession = async ({database, id}: Params) => {
  const selectableSession = await database
    .selectFrom("sessions")
    .select(allSessionColumnNames)
    .where("id", "=", id)
    .executeTakeFirst();

  return mapIfDefined(selectableSession, createSessionFrom);
};

export {getSession};
