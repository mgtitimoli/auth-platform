import type {Session} from "@mgtitimoli/auth-domain/domain-schema";
import {SameUserDeleteError} from "@mgtitimoli/auth-domain/same-user-delete-error";

import type {Database} from "@/database/database";
import * as userRepository from "@/repositories/user-repository";

type Params = {
  database: Database;
  session: Session;
  userId: string;
};

const ensureIsValidDelete = (userId: string, session: Session) => {
  const isSessionUser = userId === session.userId;

  if (isSessionUser) {
    throw new SameUserDeleteError();
  }
};

const deleteUser = ({database, session, userId}: Params) => {
  ensureIsValidDelete(userId, session);

  return userRepository.deleteUser({database, id: userId});
};

export {deleteUser};
