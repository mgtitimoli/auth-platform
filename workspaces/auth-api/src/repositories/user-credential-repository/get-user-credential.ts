import {mapIfDefined} from "@mgtitimoli/utils/validation";

import type {Database} from "@/database/database";
import {allUserCredentialColumnNames} from "@/database/user-credential-column-name";

import {createUserCredentialFrom} from "./create-user-credential-from";

type Params = {
  database: Database;
  userId: string;
};

const getUserCredential = async ({database, userId}: Params) => {
  const selectableUserCredential = await database
    .selectFrom("userCredentials")
    .select(allUserCredentialColumnNames)
    .where("userId", "=", userId)
    .executeTakeFirst();

  return mapIfDefined(selectableUserCredential, createUserCredentialFrom);
};

export {getUserCredential};
