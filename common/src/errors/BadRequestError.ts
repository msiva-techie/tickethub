import { CustomError } from "./CustomError";

export class BadRequestError extends CustomError {
  statuscode = 500;
  message: string;

  constructor(message?: string) {
    let msg = "Bad Request";
    if (message) {
      msg = message;
    }
    super(msg);
    this.message = msg;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
