import { ValidationError } from "express-validator";
import { CustomError } from "./CustomError";

export class ValidationRequestError extends CustomError {
  statuscode = 500;
  message = "Invalid request parameters";

  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");
    Object.setPrototypeOf(this, ValidationRequestError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error: any) => ({
      message: error.msg,
      field: error.path
    }));
  }
}
