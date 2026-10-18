import {createSetUpdatedAtTrigger} from "@mgtitimoli/utils/kysely";
import {sql} from "kysely";
import type {Kysely} from "kysely";

const up = async (database: Kysely<unknown>): Promise<void> => {
  await database.schema
    .createTable("user_credentials")
    .addColumn("user_id", "uuid", column =>
      column.primaryKey().references("users.id").onDelete("cascade")
    )
    .addColumn("password_hash", "text", column => column.notNull())
    .addColumn("created_at", "timestamp", column =>
      column.notNull().defaultTo(sql`now()`)
    )
    .addColumn("updated_at", "timestamp", column =>
      column.notNull().defaultTo(sql`now()`)
    )
    .execute();

  await createSetUpdatedAtTrigger(database, "user_credentials");
};

const down = async (database: Kysely<unknown>): Promise<void> => {
  await database.schema.dropTable("user_credentials").execute();
};

export {down, up};
