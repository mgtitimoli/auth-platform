import {afterAll, beforeEach} from "vitest";

import {database} from "@/database/database";
import {environmentVariables} from "@/utils/environment/environment-variables";

// Tests delete every row, so they never run against another database
if (new URL(environmentVariables.AUTH_DATABASE_URL).port !== "5433") {
  throw new Error("Tests only run against the test database (port 5433)");
}

// Credentials and sessions are deleted with their users (on delete cascade)
beforeEach(async () => {
  await database.deleteFrom("users").execute();
});

afterAll(async () => {
  await database.destroy();
});
