import type {SignUpInput} from "@mgtitimoli/auth-domain/domain-schema";

import type {Database} from "@/database/database";
import * as userRepository from "@/repositories/user-repository";
import * as userService from "@/services/user-service";

// Public credentials (listed in the README) for signing in to a local database
const adminInputs: SignUpInput[] = [
  {
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    password: "Admin123!"
  }
];

const seedAdminUser = async (database: Database, adminInput: SignUpInput) => {
  const user = await userRepository.getUserByEmail({
    database,
    email: adminInput.email
  });

  if (!user) {
    await userService.createUser({database, input: adminInput});
  }
};

const seed = async (database: Database) => {
  await Promise.all(
    adminInputs.map(adminInput => seedAdminUser(database, adminInput))
  );
};

export {seed};
