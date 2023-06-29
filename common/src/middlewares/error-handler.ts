import { Request, Response } from "express";
import { CustomError } from "../errors/CustomError";

export const handleErrors = (err: Error, req: Request, res: Response) => {
  if (err instanceof CustomError) {
    return res.status(err.statuscode).jsonp({
      errors: err.serializeErrors()
    });
  }
  console.log(err);
  return res.status(400).jsonp({
    errors: [{ message: "Something went wrong!" }]
  });
};
