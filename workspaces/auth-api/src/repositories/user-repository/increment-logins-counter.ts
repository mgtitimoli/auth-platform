import type {Database} from "@/database/database";

type Params = {
  database: Database;
  userId: string;
};

const incrementLoginsCounter = async ({database, userId}: Params) => {
  await database
    .updateTable("users")
    .set(eb => ({loginsCounter: eb("loginsCounter", "+", 1)}))
    .where("id", "=", userId)
    .execute();
};

export {incrementLoginsCounter};
