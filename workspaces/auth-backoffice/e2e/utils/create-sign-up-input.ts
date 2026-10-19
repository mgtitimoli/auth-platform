import type {SignUpInput} from "@mgtitimoli/auth-domain/domain-schema";

// Unique, because the e2e tests share one database (unlike auth-api's, which
// is emptied before each test)
const createEmail = () => "e2e-" + crypto.randomUUID() + "@example.com";

const createSignUpInput = (overrides?: Partial<SignUpInput>): SignUpInput => ({
  email: createEmail(),
  firstName: "Ada",
  lastName: "Lovelace",
  password: "Sup3r-secret",
  ...overrides
});

export {createSignUpInput};
