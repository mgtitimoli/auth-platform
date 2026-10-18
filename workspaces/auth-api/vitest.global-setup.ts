import {promises as fs} from "node:fs";
import path from "node:path";
import {parseEnv} from "node:util";

import {createFrom} from "@mgtitimoli/utils/error";
import {Kysely, PostgresDialect} from "kysely";
import {FileMigrationProvider, Migrator} from "kysely/migration";
import {Pool} from "pg";

const setup = async () => {
  const {AUTH_DATABASE_URL: databaseUrl} = parseEnv(
    await fs.readFile(".env.test", "utf8")
  );

  // Tests delete every row, so they never run against another database
  if (!databaseUrl || new URL(databaseUrl).port !== "5433") {
    throw new Error("Tests only run against the test database (port 5433)");
  }

  const database = new Kysely<unknown>({
    dialect: new PostgresDialect({
      pool: new Pool({connectionString: databaseUrl, max: 1})
    })
  });

  const migrator = new Migrator({
    db: database,
    provider: new FileMigrationProvider({
      fs,
      migrationFolder: path.resolve("src/database/migrations"),
      path
    })
  });

  try {
    const {error} = await migrator.migrateToLatest();

    if (error) {
      throw createFrom(error, "The test database migration failed");
    }
  } finally {
    await database.destroy();
  }
};

export default setup;
