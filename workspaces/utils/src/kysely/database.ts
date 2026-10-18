import type {Kysely} from "kysely";

const startTransactionIfNeeded = async <TDatabaseDefinition, TResult>(
  database: Kysely<TDatabaseDefinition>,
  callback: (database: Kysely<TDatabaseDefinition>) => Promise<TResult>
): Promise<TResult> =>
  database.isTransaction
    ? await callback(database)
    : database.transaction().execute(callback);

export {startTransactionIfNeeded};
