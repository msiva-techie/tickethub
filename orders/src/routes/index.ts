import express from "express";
import {
    createOrder,
    deleteOrder,
    getAllOrders,
    getAllOrdersOfUser,
    getOrder,
    getTicketsSoldFromOrders
} from "../controllers/order";
import { checkSchema } from "express-validator";
import { validateRequest, isAuthenticated } from "@sivam96/tickethub-common";

const router = express.Router();

router.get("/user/all", isAuthenticated, getAllOrdersOfUser);

router.get(
    "/:orderId",
    checkSchema({
        orderId: {
            errorMessage: "Please provide orderId",
            notEmpty: true,
            trim: true
        }
    }),
    validateRequest,
    isAuthenticated,
    getOrder
);

router.get("/all", isAuthenticated, getAllOrders);

router.post(
    "/",
    checkSchema({
        ticketId: {
            errorMessage: "Please provide ticketId",
            notEmpty: true,
            trim: true
        },
        quantity: {
            errorMessage: "Please provide quantity",
            notEmpty: true,
            isNumeric: true
        }
    }),
    validateRequest,
    isAuthenticated,
    createOrder
);

router.get(
    "ticket/sold/:ticketId",
    checkSchema({
        ticketId: {
            errorMessage: "Please provide ticketId",
            notEmpty: true,
            trim: true
        }
    }),
    validateRequest,
    isAuthenticated,
    getTicketsSoldFromOrders
);

router.delete(
    "/:orderId",
    checkSchema({
        orderId: {
            errorMessage: "Please provide orderId",
            notEmpty: true,
            trim: true
        }
    }),
    validateRequest,
    isAuthenticated,
    deleteOrder
);

export default router;
