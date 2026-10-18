import {CustomError} from "@mgtitimoli/utils/error";

class InactiveUserError extends CustomError {
  constructor() {
    super("The user is inactive");
  }
}

export {InactiveUserError};
