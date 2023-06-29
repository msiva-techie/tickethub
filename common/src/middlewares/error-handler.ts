import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/CustomError";

export const handleErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  if (err instanceof CustomError) {
    return res.status(err.statuscode).jsonp({
      errors: err.serializeErrors()
    });
  }
  return res.status(400).jsonp({
    errors: [{ message: "Something went wrong!" }]
  });
};
