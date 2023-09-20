import { Request, Response } from "express";
import { BadRequestError, NotAuthorizedError } from "@sivam96/tickethub-common";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { paymentCompletedPublisher } from "../nats-wrapper";

export const doPayment = async (req: Request, res: Response) => {
  const { orderId, token } = req.body;
  const userId = req.currentUser!.id;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new BadRequestError("Order not found");
  }
  if (order.userId !== userId) {
    throw new NotAuthorizedError("Not authorized to pay for the order");
  }
  // TODO: payment logic
  const payment = await Payment.build({
    paymentId: '',
    orderId,
    userId
  });
  await payment.save();
  paymentCompletedPublisher.publish({
    paymentId: '',
    orderId,
    userId,
    totalPrice: order.totalPrice
  });
  res.jsonp();
};

export const getPayment = async (req: Request, res: Response) => {
  const { paymentId } = req.params;
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new BadRequestError("Payment not found");
  }
  const userId = payment.userId.toString();
  if (userId !== req.currentUser!.id) {
    throw new NotAuthorizedError("Not authorized to get the order");
  }
  res.jsonp(payment);
};

export const getAllPaymentsOfUser = async (req: Request, res: Response) => {
  const userId = req.currentUser!.id;
  const payments = await Payment.find({
    userId
  });
  res.jsonp(payments);
};

export const getAllPayments = async (req: Request, res: Response) => {
  const payments = await Payment.find({});
  res.jsonp(payments);
};
