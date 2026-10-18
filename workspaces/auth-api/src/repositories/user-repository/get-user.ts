import {mapIfDefined} from "@mgtitimoli/utils/validation";

import type {Database} from "@/database/database";
import {allUserColumnNames} from "@/database/user-column-name";

import {createUserFrom} from "./create-user-from";

type Params = {
  database: Database;
  id: string;
  // Locks the row until the transaction ends
  isForUpdate?: boolean;
};

const getUser = async ({database, id, isForUpdate = false}: Params) => {
  const selectableUser = await database
    .selectFrom("users")
    .select(allUserColumnNames)
    .where("id", "=", id)
    .$if(isForUpdate, queryBuilder => queryBuilder.forUpdate())
    .executeTakeFirst();

  return mapIfDefined(selectableUser, createUserFrom);
};

export {getUser};
