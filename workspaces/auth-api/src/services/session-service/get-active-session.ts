import * as withSession from "@mgtitimoli/auth-domain/session";

import type {Database} from "@/database/database";
import * as sessionRepository from "@/repositories/session-repository";

type Params = {
  database: Database;
  id: string;
};

const getActiveSession = async ({database, id}: Params) => {
  const session = await sessionRepository.getSession({database, id});

  return session && withSession.isActive(session) ? session : undefined;
};

export {getActiveSession};
