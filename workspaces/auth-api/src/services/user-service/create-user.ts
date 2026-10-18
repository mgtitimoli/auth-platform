import type {CreateUserInput} from "@mgtitimoli/auth-domain/domain-schema";
import {startTransactionIfNeeded} from "@mgtitimoli/utils/kysely";
import * as withPassword from "@mgtitimoli/utils/password";

import type {Database} from "@/database/database";
import * as userCredentialRepository from "@/repositories/user-credential-repository";
import * as userRepository from "@/repositories/user-repository";
import {environmentVariables} from "@/utils/environment/environment-variables";

type Params = {
  database: Database;
  input: CreateUserInput;
};

const createUser = async ({database, input}: Params) => {
  const {password, ...userInput} = input;

  // Hashed before any query, so a transaction started here isn't held open
  // while scrypt runs
  const passwordHash = await withPassword.getHash(
    password,
    environmentVariables.PASSWORD_HASH_COST
  );

  return startTransactionIfNeeded(database, async transaction => {
    const user = await userRepository.createUser({
      database: transaction,
      input: userInput
    });

    await userCredentialRepository.createUserCredential({
      database: transaction,
      input: {passwordHash, userId: user.id}
    });

    return user;
  });
};

export {createUser};
