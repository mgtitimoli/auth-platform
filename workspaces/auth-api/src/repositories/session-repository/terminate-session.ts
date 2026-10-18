import type {Database} from "@/database/database";

type Params = {
  database: Database;
  id: string;
};

const terminateSession = async ({database, id}: Params) => {
  await database
    .updateTable("sessions")
    .set({terminationTime: new Date().toISOString()})
    .where("id", "=", id)
    .where("terminationTime", "is", null)
    .execute();
};

export {terminateSession};
