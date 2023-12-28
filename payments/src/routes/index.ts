import express from "express";
import { checkSchema } from "express-validator";
import { validateRequest, isAuthenticated } from "@sivam96/tickethub-common";
import { doPayment, getAllPayments, getAllPaymentsOfUser, getPayment } from "../controllers/payment";

const router = express.Router();

router.get("/user/all",
    isAuthenticated,
    getAllPaymentsOfUser
);

router.get("/:paymentId",
    checkSchema({
        paymentId: {
            errorMessage: "Please provide paymentId",
            notEmpty: true,
            trim: true
        }
    }),
    validateRequest,
    isAuthenticated,
    getPayment
);

router.get("/all", isAuthenticated, getAllPayments);

router.post("/",
    checkSchema({
        orderId: {
            errorMessage: "Please provide orderId",
            notEmpty: true,
            trim: true
        },
        token: {
            errorMessage: "Please provide token",
            notEmpty: true,
            trim: true
        }
    }),
    validateRequest,
    isAuthenticated,
    doPayment
);

export default router;
