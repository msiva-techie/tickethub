import express from "express";
import { signin, signout, signup } from "../controllers/user";
import { checkSchema } from "express-validator";
import { validateRequest, isAuthenticated } from "@sivam96/tickethub-common";

const router = express.Router();

router.get(
  "/",
  (req, res) => {
    res.jsonp({ message: "hello123" });
  }
);

router.post(
  "/signin",
  checkSchema({
    email: {
      errorMessage: "Please provide email",
      isEmail: true,
      notEmpty: true,
      trim: true
    },
    password: {
      errorMessage: "Please provide password",
      notEmpty: true,
      trim: true
    }
  }),
  validateRequest,
  signin
);

router.post(
  "/signup",
  checkSchema({
    firstname: {
      errorMessage: "Please provide firstname",
      notEmpty: true,
      trim: true
    },
    lastname: {
      errorMessage: "Please provide lastname",
      notEmpty: true,
      trim: true
    },
    email: {
      errorMessage: "Please provide email",
      notEmpty: true,
      isEmail: true,
      trim: true
    },
    password: {
      errorMessage: "Please provide password with length of min 6",
      notEmpty: true,
      trim: true,
      isLength: {
        options: {
          min: 6
        }
      }
    },
    confirmPassword: {
      notEmpty: true,
      trim: true,
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error("Password don't match");
          }
          return true;
        }
      }
    }
  }),
  validateRequest,
  signup
);

router.post("/signout", isAuthenticated, signout);

export default router;
