import { Request, Response } from "express";

export const signup = (req: Request, res: Response) => {
  res.jsonp({
    message: "success"
  });
};

export const signin = (req: Request, res: Response) => {
  res.jsonp({
    message: "success"
  });
};

export const signout = (req: Request, res: Response) => {
  res.jsonp({});
};
