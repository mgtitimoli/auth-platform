import {CustomError} from "@mgtitimoli/utils/error";

class SameUserDeleteError extends CustomError {
  constructor() {
    super("Users can't delete themselves");
  }
}

export {SameUserDeleteError};
