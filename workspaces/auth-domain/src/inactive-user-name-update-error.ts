import {CustomError} from "@mgtitimoli/utils/error";

class InactiveUserNameUpdateError extends CustomError {
  constructor() {
    super("The names of an inactive user can't be updated");
  }
}

export {InactiveUserNameUpdateError};
