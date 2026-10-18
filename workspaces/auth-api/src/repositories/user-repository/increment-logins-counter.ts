import type {Database} from "@/database/database";
import {allUserColumnNames} from "@/database/user-column-name";

import {createUserFrom} from "./create-user-from";

type Params = {
  database: Database;
  userId: string;
};

const incrementLoginsCounter = async ({database, userId}: Params) => {
  const selectableUser = await database
    .updateTable("users")
    .set(eb => ({loginsCounter: eb("loginsCounter", "+", 1)}))
    .where("id", "=", userId)
    .returning(allUserColumnNames)
    .executeTakeFirstOrThrow();

  return createUserFrom(selectableUser);
};

export {incrementLoginsCounter};
