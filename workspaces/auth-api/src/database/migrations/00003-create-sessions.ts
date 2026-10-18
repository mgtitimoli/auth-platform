import {sql} from "kysely";
import type {Kysely} from "kysely";

const up = async (database: Kysely<unknown>): Promise<void> => {
  await database.schema
    .createTable("sessions")
    .addColumn("id", "text", column => column.primaryKey())
    .addColumn("user_id", "uuid", column =>
      column.notNull().references("users.id").onDelete("cascade")
    )
    .addColumn("created_at", "timestamp", column =>
      column.notNull().defaultTo(sql`now()`)
    )
    .addColumn("termination_time", "timestamp")
    .execute();

  // Terminating a user's sessions and the delete cascade look sessions up by
  // user
  await database.schema
    .createIndex("sessions_user_id_index")
    .on("sessions")
    .column("user_id")
    .execute();
};

const down = async (database: Kysely<unknown>): Promise<void> => {
  await database.schema.dropTable("sessions").execute();
};

export {down, up};
