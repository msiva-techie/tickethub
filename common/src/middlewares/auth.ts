import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { NotAuthorizedError } from "../errors/NotAuthorizedError";

interface User {
  id: string;
  email: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return next();
  }
  try {
    req.currentUser = jwt.verify(accessToken, process.env.JWT_KEY!) as User;
  } catch (err) {}
  next();
};

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }
  next();
};
