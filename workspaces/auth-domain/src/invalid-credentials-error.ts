import {CustomError} from "@mgtitimoli/utils/error";

// The same error for an unknown email and a wrong password, so it doesn't
// reveal which emails are registered
class InvalidCredentialsError extends CustomError {
  constructor() {
    super("Invalid email or password");
  }
}

export {InvalidCredentialsError};
