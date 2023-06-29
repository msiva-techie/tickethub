import { CustomError } from "./CustomError";

export class NotAuthorizedError extends CustomError {
  statuscode = 401;
  message: string;

  constructor(message?: string) {
    let msg = "Not Authorized";
    if (message) {
      msg = message;
    }
    super(msg);
    this.message = msg;
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
