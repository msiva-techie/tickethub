import { CustomError } from "./CustomError";

export class DBConnectError extends CustomError {
  statuscode = 500;
  message: string;

  constructor(message?: string) {
    let msg = "DB connectivity failed!";
    if (message) {
      msg = message;
    }
    super(msg);
    this.message = msg;
    Object.setPrototypeOf(this, DBConnectError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
