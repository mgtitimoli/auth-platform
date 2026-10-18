import {DuplicateEmailError} from "@mgtitimoli/auth-domain/duplicate-email-error";
import {isUniqueViolation} from "@mgtitimoli/utils/kysely";

import type {Database} from "@/database/database";
import type {InsertableUser} from "@/database/database-schema";
import {allUserColumnNames} from "@/database/user-column-name";
import {userUniqueConstraintNames} from "@/database/user-unique-constraint-name";

import {createUserFrom} from "./create-user-from";

type Params = {
  database: Database;
  input: Pick<InsertableUser, "email" | "firstName" | "lastName">;
};

// The unique constraint is what rejects a duplicate email, so two concurrent
// inserts can't both pass a check made before them
const createUser = async ({database, input}: Params) => {
  try {
    const selectableUser = await database
      .insertInto("users")
      .values(input)
      .returning(allUserColumnNames)
      .executeTakeFirstOrThrow();

    return createUserFrom(selectableUser);
  } catch (error) {
    if (isUniqueViolation(error, userUniqueConstraintNames.email)) {
      throw new DuplicateEmailError();
    }

    throw error;
  }
};

export {createUser};
