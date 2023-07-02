import express from "express";
import { checkSchema } from "express-validator";
import { validateRequest, isAuthenticated, BadRequestError } from "@sivam96/tickethub-common";

import { createTicket, deleteTicket, getAllTickets, getTicket, updateTicket } from "../controllers/ticket";

const router = express.Router();

router.get("/all", getAllTickets);
router.get(
  "/:ticketId",
  checkSchema({
    ticketId: {
      errorMessage: "Please provide ticketId",
      notEmpty: true,
      trim: true
    }
  }),
  getTicket
);
router.post(
  "/ticket",
  checkSchema({
    title: {
      errorMessage: "Please provide title",
      notEmpty: true,
      trim: true
    },
    price: {
      errorMessage: "Please provide price",
      isNumeric: true,
      custom: {
        options: (value) => {
          if (value === 0) {
            throw new BadRequestError("Price should be greater than 0");
          }
          return true;
        }
      }
    },
    totalQuantity: {
      errorMessage: "Please provide total quantity",
      isNumeric: true
    },
    sold: {
      isNumeric: true,
      optional: true
    }
  }),
  validateRequest,
  (req: any, res: any, next: any) => {
    console.log(JSON.stringify(req.signedCookies));
    console.log(JSON.stringify(req.cookies));
    next();
  },
  isAuthenticated,
  createTicket
);
router.put(
  "/ticket/:ticketId",
  checkSchema({
    ticketId: {
      errorMessage: "Please provide ticketId",
      notEmpty: true,
      trim: true
    }
  }),
  validateRequest,
  isAuthenticated,
  updateTicket
);
router.delete(
  "/ticket/:ticketId",
  checkSchema({
    ticketId: {
      errorMessage: "Please provide ticketId",
      notEmpty: true,
      trim: true
    }
  }),
  validateRequest,
  isAuthenticated,
  deleteTicket
);

export default router;
