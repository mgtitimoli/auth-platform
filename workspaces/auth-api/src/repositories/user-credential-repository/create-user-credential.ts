import type {Database} from "@/database/database";
import type {InsertableUserCredential} from "@/database/database-schema";
import {allUserCredentialColumnNames} from "@/database/user-credential-column-name";

import {createUserCredentialFrom} from "./create-user-credential-from";

type Params = {
  database: Database;
  input: InsertableUserCredential;
};

const createUserCredential = async ({database, input}: Params) => {
  const selectableUserCredential = await database
    .insertInto("userCredentials")
    .values(input)
    .returning(allUserCredentialColumnNames)
    .executeTakeFirstOrThrow();

  return createUserCredentialFrom(selectableUserCredential);
};

export {createUserCredential};
