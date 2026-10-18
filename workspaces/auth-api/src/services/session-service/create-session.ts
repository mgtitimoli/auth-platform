import * as withSession from "@mgtitimoli/auth-domain/session";
import {startTransactionIfNeeded} from "@mgtitimoli/utils/kysely";

import type {Database} from "@/database/database";
import * as sessionRepository from "@/repositories/session-repository";
import * as userRepository from "@/repositories/user-repository";

type Params = {
  database: Database;
  userId: string;
};

// Every session is a login
const createSession = ({database, userId}: Params) =>
  startTransactionIfNeeded(database, async transaction => {
    const session = await sessionRepository.createSession({
      database: transaction,
      input: {id: withSession.createId(), userId}
    });

    await userRepository.incrementLoginsCounter({
      database: transaction,
      userId
    });

    return session;
  });

export {createSession};
