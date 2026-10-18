import {mapIfDefined} from "@mgtitimoli/utils/validation";

import type {Database} from "@/database/database";
import {allUserColumnNames} from "@/database/user-column-name";

import {createUserFrom} from "./create-user-from";

type Params = {
  database: Database;
  id: string;
};

const getUser = async ({database, id}: Params) => {
  const selectableUser = await database
    .selectFrom("users")
    .select(allUserColumnNames)
    .where("id", "=", id)
    .executeTakeFirst();

  return mapIfDefined(selectableUser, createUserFrom);
};

export {getUser};
