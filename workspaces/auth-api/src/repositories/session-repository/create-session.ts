import type {Database} from "@/database/database";
import type {InsertableSession} from "@/database/database-schema";
import {allSessionColumnNames} from "@/database/session-column-name";

import {createSessionFrom} from "./create-session-from";

type Params = {
  database: Database;
  input: Pick<InsertableSession, "id" | "userId">;
};

const createSession = async ({database, input}: Params) => {
  const selectableSession = await database
    .insertInto("sessions")
    .values(input)
    .returning(allSessionColumnNames)
    .executeTakeFirstOrThrow();

  return createSessionFrom(selectableSession);
};

export {createSession};
