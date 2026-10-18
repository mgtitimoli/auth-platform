import {
  createSetUpdatedAtFunction,
  createSetUpdatedAtTrigger,
  dropSetUpdatedAtFunction
} from "@mgtitimoli/utils/kysely";
import {sql} from "kysely";
import type {Kysely} from "kysely";

const up = async (database: Kysely<unknown>): Promise<void> => {
  await createSetUpdatedAtFunction(database);

  await database.schema
    .createType("user_status")
    .asEnum(["active", "inactive"])
    .execute();

  await database.schema
    .createTable("users")
    .addColumn("id", "uuid", column =>
      column.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("email", "text", column => column.notNull())
    .addColumn("first_name", "text", column => column.notNull())
    .addColumn("last_name", "text", column => column.notNull())
    .addColumn("status", sql`user_status`, column =>
      column.notNull().defaultTo("active")
    )
    .addColumn("logins_counter", "integer", column =>
      column.notNull().defaultTo(0)
    )
    .addColumn("created_at", "timestamp", column =>
      column.notNull().defaultTo(sql`now()`)
    )
    .addColumn("updated_at", "timestamp", column =>
      column.notNull().defaultTo(sql`now()`)
    )
    .addUniqueConstraint("users_email_unique", ["email"])
    .execute();

  await createSetUpdatedAtTrigger(database, "users");
};

const down = async (database: Kysely<unknown>): Promise<void> => {
  await database.schema.dropTable("users").execute();

  await database.schema.dropType("user_status").execute();

  await dropSetUpdatedAtFunction(database);
};

export {down, up};
