import {DuplicateEmailError} from "@mgtitimoli/auth-domain/duplicate-email-error";
import {isUniqueViolation} from "@mgtitimoli/utils/kysely";

import type {Database} from "@/database/database";
import type {UpdateableUser} from "@/database/database-schema";
import {allUserColumnNames} from "@/database/user-column-name";
import {userUniqueConstraintNames} from "@/database/user-unique-constraint-name";

import {createUserFrom} from "./create-user-from";

type Params = {
  database: Database;
  id: string;
  input: Pick<UpdateableUser, "email" | "firstName" | "lastName" | "status">;
};

const updateUser = async ({database, id, input}: Params) => {
  try {
    const selectableUser = await database
      .updateTable("users")
      .set(input)
      .where("id", "=", id)
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

export {updateUser};
