import { CustomError } from "./CustomError";

export class NotFoundError extends CustomError {
  statuscode = 404;
  message: string;

  constructor(message?: string) {
    let msg = "Not Found";
    if (message) {
      msg = message;
    }
    super(msg);
    this.message = msg;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
