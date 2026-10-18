import type {Database} from "@/database/database";
import {allUserColumnNames} from "@/database/user-column-name";

import {createUserFrom} from "./create-user-from";

type Params = {
  database: Database;
  limit: number;
  offset: number;
};

const getUsers = async ({database, limit, offset}: Params) => {
  const selectableUsers = await database
    .selectFrom("users")
    .select(allUserColumnNames)
    // id breaks ties between users created at the same time, so pages don't
    // overlap
    .orderBy("createdAt")
    .orderBy("id")
    .limit(limit)
    .offset(offset)
    .execute();

  return selectableUsers.map(createUserFrom);
};

export {getUsers};
