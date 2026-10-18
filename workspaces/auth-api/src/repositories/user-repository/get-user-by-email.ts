import {mapIfDefined} from "@mgtitimoli/utils/validation";

import type {Database} from "@/database/database";
import {allUserColumnNames} from "@/database/user-column-name";

import {createUserFrom} from "./create-user-from";

type Params = {
  database: Database;
  email: string;
};

const getUserByEmail = async ({database, email}: Params) => {
  const selectableUser = await database
    .selectFrom("users")
    .select(allUserColumnNames)
    .where("email", "=", email)
    .executeTakeFirst();

  return mapIfDefined(selectableUser, createUserFrom);
};

export {getUserByEmail};
