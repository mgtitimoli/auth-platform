import type {Database} from "@/database/database";

type Params = {
  database: Database;
  userId: string;
};

const terminateUserSessions = async ({database, userId}: Params) => {
  await database
    .updateTable("sessions")
    .set({terminationTime: new Date().toISOString()})
    .where("userId", "=", userId)
    .where("terminationTime", "is", null)
    .execute();
};

export {terminateUserSessions};
