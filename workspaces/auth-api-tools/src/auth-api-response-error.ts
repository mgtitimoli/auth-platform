import {CustomError} from "@mgtitimoli/utils/error";

class AuthApiResponseError extends CustomError {
  readonly status: number;

  constructor(status: number, message?: string) {
    super(message ?? "The Auth API request failed with status " + status);

    this.status = status;
  }
}

export {AuthApiResponseError};
