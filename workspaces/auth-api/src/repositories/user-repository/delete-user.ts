import type {Database} from "@/database/database";

type Params = {
  database: Database;
  id: string;
};

// Its credential and sessions are deleted with it (on delete cascade)
const deleteUser = async ({database, id}: Params) => {
  const {numDeletedRows} = await database
    .deleteFrom("users")
    .where("id", "=", id)
    .executeTakeFirstOrThrow();

  return numDeletedRows > 0;
};

export {deleteUser};
