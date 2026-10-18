import type {SignUpInput} from "@mgtitimoli/auth-domain/domain-schema";
import {startTransactionIfNeeded} from "@mgtitimoli/utils/kysely";

import type {Database} from "@/database/database";
import * as sessionService from "@/services/session-service";
import * as userService from "@/services/user-service";

type Params = {
  database: Database;
  input: SignUpInput;
};

const signUp = ({database, input}: Params) =>
  startTransactionIfNeeded(database, async transaction => {
    const user = await userService.createUser({
      database: transaction,
      input
    });

    return sessionService.createSession({
      database: transaction,
      userId: user.id
    });
  });

export {signUp};
