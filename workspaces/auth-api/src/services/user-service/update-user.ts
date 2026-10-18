import type {
  Session,
  UpdateUserInput,
  User
} from "@mgtitimoli/auth-domain/domain-schema";
import {InactiveUserNameUpdateError} from "@mgtitimoli/auth-domain/inactive-user-name-update-error";
import {SameUserDeactivateError} from "@mgtitimoli/auth-domain/same-user-deactivate-error";
import * as withUser from "@mgtitimoli/auth-domain/user";
import {userStatuses} from "@mgtitimoli/auth-domain/user-status";
import {startTransactionIfNeeded} from "@mgtitimoli/utils/kysely";

import type {Database} from "@/database/database";
import * as sessionRepository from "@/repositories/session-repository";
import * as userRepository from "@/repositories/user-repository";

type Params = {
  database: Database;
  input: UpdateUserInput;
  session: Session;
  userId: string;
};

// The stored status decides, so reactivating and renaming at once fails
const ensureIsValidNameUpdate = (user: User, input: UpdateUserInput) => {
  const isNameUpdate =
    input.firstName !== undefined || input.lastName !== undefined;

  if (!withUser.isActive(user) && isNameUpdate) {
    throw new InactiveUserNameUpdateError();
  }
};

const ensureIsValidDeactivation = (
  user: User,
  isDeactivation: boolean,
  session: Session
) => {
  const isSessionUser = user.id === session.userId;

  if (isDeactivation && isSessionUser) {
    throw new SameUserDeactivateError();
  }
};

const updateUser = ({database, input, session, userId}: Params) =>
  startTransactionIfNeeded(database, async transaction => {
    const user = await userRepository.getUser({
      database: transaction,
      id: userId,
      isForUpdate: true
    });

    if (!user) {
      return undefined;
    }

    const isDeactivation =
      withUser.isActive(user) && input.status === userStatuses.inactive;

    ensureIsValidNameUpdate(user, input);

    ensureIsValidDeactivation(user, isDeactivation, session);

    const updatedUser = await userRepository.updateUser({
      database: transaction,
      id: userId,
      input
    });

    if (isDeactivation) {
      await sessionRepository.terminateUserSessions({
        database: transaction,
        userId
      });
    }

    return updatedUser;
  });

export {updateUser};
