import { Request, Response } from "express";
import { User } from "../models/user";
import { compare } from "../utils/password";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { BadRequestError } from "@sivam96/tickethub-common";

export const signup = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.jsonp(errors);
  }
  const { firstname, lastname, email, password, confirmPassword } = req.body;
  const existingUser = await User.findOne({
    email
  });
  if (existingUser) {
    throw new BadRequestError("User already exists");
  }
  if (password !== confirmPassword) {
    throw new BadRequestError("Password doesn't match");
  }
  const user = User.build({
    firstname,
    lastname,
    email,
    password
  });
  await user.save();
  res.jsonp({
    message: "Signed up successfully!"
  });
};

export const signin = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.jsonp(errors);
  }
  const { email, password } = req.body;
  const existingUser = await User.findOne({
    email
  });
  if (!existingUser) {
    throw new BadRequestError("Invalid credentials");
  }
  if (!compare(existingUser.password, password)) {
    throw new BadRequestError("Invalid credentials");
  }
  const accessToken = jwt.sign(
    {
      id: existingUser.id,
      email
    },
    process.env.JWT_KEY!
  );
  res.cookie("accessToken", accessToken);
  res.jsonp({
    message: "Signed in successfully!"
  });
};

export const signout = (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.jsonp({
    message: "Signed out successfully!"
  });
};
