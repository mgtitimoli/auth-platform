import {CustomError} from "@mgtitimoli/utils/error";

class DuplicateEmailError extends CustomError {
  constructor() {
    super("A user with this email already exists");
  }
}

export {DuplicateEmailError};
