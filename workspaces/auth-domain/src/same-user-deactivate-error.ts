import {CustomError} from "@mgtitimoli/utils/error";

class SameUserDeactivateError extends CustomError {
  constructor() {
    super("Users can't deactivate themselves");
  }
}

export {SameUserDeactivateError};
