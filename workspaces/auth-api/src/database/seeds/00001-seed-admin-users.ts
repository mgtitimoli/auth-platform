import {startTransactionIfNeeded} from "@mgtitimoli/utils/kysely";
import * as withPassword from "@mgtitimoli/utils/password";

import type {Database} from "@/database/database";

type AdminUserSeed = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

// Public credentials (listed in the README) for signing in to a local database
const adminUserSeeds: AdminUserSeed[] = [
  {
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    password: "Admin123!"
  }
];

const isExistingUser = async (database: Database, email: string) => {
  const user = await database
    .selectFrom("users")
    .select("id")
    .where("email", "=", email)
    .executeTakeFirst();

  return user !== undefined;
};

const seedAdminUser = async (
  database: Database,
  {password, ...userValues}: AdminUserSeed
) => {
  if (await isExistingUser(database, userValues.email)) {
    return;
  }

  const passwordHash = await withPassword.getHash(password);

  await startTransactionIfNeeded(database, async transaction => {
    const {id: userId} = await transaction
      .insertInto("users")
      .values(userValues)
      .returning("id")
      .executeTakeFirstOrThrow();

    await transaction
      .insertInto("userCredentials")
      .values({passwordHash, userId})
      .execute();
  });
};

const seed = async (database: Database) => {
  await Promise.all(
    adminUserSeeds.map(adminUserSeed => seedAdminUser(database, adminUserSeed))
  );
};

export {seed};
