import {sql} from "kysely";
import type {Kysely} from "kysely";

const createSetUpdatedAtFunction = (database: Kysely<unknown>) =>
  sql`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $$ language 'plpgsql';
  `.execute(database);

export {createSetUpdatedAtFunction};
