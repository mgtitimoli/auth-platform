import type {Database} from "@/database/database";

type Params = {
  database: Database;
};

const countUsers = async ({database}: Params) => {
  const {count} = await database
    .selectFrom("users")
    .select(eb => eb.fn.countAll<string>().as("count"))
    .executeTakeFirstOrThrow();

  // pg returns bigint counts as strings
  return Number(count);
};

export {countUsers};
