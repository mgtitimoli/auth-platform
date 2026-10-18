import type {SignInInput} from "@mgtitimoli/auth-domain/domain-schema";
import {InactiveUserError} from "@mgtitimoli/auth-domain/inactive-user-error";
import {InvalidCredentialsError} from "@mgtitimoli/auth-domain/invalid-credentials-error";
import * as withUser from "@mgtitimoli/auth-domain/user";
import {isMatchingHash} from "@mgtitimoli/utils/password";

import type {Database} from "@/database/database";
import * as userCredentialRepository from "@/repositories/user-credential-repository";
import * as userRepository from "@/repositories/user-repository";
import * as sessionService from "@/services/session-service";

type Params = {
  database: Database;
  input: SignInInput;
};

const isMatchingPassword = async (
  database: Database,
  userId: string,
  password: string
) => {
  const userCredential = await userCredentialRepository.getUserCredential({
    database,
    userId
  });

  if (!userCredential) {
    return false;
  }

  return isMatchingHash(password, userCredential.passwordHash);
};

const signIn = async ({database, input}: Params) => {
  const user = await userRepository.getUserByEmail({
    database,
    email: input.email
  });

  if (!user || !(await isMatchingPassword(database, user.id, input.password))) {
    throw new InvalidCredentialsError();
  }

  // Checked after the password, so the status isn't revealed without it
  if (!withUser.isActive(user)) {
    throw new InactiveUserError();
  }

  return sessionService.createSession({database, userId: user.id});
};

export {signIn};
