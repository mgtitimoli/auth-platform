import type {SignUpInput} from "@mgtitimoli/auth-domain/domain-schema";

const createSignUpInput = (overrides?: Partial<SignUpInput>): SignUpInput => ({
  email: "ada@example.com",
  firstName: "Ada",
  lastName: "Lovelace",
  password: "analytical1!",
  ...overrides
});

export {createSignUpInput};
