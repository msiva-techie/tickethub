import { Request, Response } from "express";
import { BadRequestError, NotAuthorizedError } from "@sivam96/tickethub-common";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { getTicketsSold } from "../utils/order";
import { orderCreatedPublisher } from "../nats-wrapper";

export const createOrder = async (req: Request, res: Response) => {
    const { ticketId, quantity } = req.body;
    const userId = req.currentUser!.id;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new BadRequestError("Ticket not found");
    }
    const availabeTickets = ticket.totalQuantity - (ticket.sold || 0);
    if (quantity > availabeTickets) {
        throw new BadRequestError(`Mentioned quantity not available. Available tickets: ${availabeTickets}`);
    }
    const totalPrice = ticket.price * quantity;
    const order = Order.build({
        userId,
        ticket,
        quantity,
        totalPrice,
        expiresAt
    });
    await order.save();
    orderCreatedPublisher.publish({
        orderId: order.id,
        userId,
        expiresAt,
        ticket: {
            ticketId: ticket.id,
            price: ticket.price
        },
        quantity,
        version: order.version
    });
    res.jsonp(order);
};

export const deleteOrder = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
        throw new BadRequestError("Order not found");
    }
    const orderUserId = order.userId.toString();

    if (orderUserId !== req.currentUser!.id) {
        throw new NotAuthorizedError("Not authorized to delete the order");
    }
    await order.deleteOne();
    res.status(204).end();
};

export const getOrder = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
        throw new BadRequestError("Order not found");
    }
    const orderUserId = order.userId.toString();

    if (orderUserId !== req.currentUser!.id) {
        throw new NotAuthorizedError("Not authorized to get the order");
    }
    res.jsonp(order);
};

export const getAllOrdersOfUser = async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const orders = await Order.find({
        userId
    });
    res.jsonp(orders);
};

export const getAllOrders = async (req: Request, res: Response) => {
    const orders = await Order.find();
    res.jsonp(orders);
};

export const getTicketsSoldFromOrders = async (req: Request, res: Response) => {
    const { ticketId } = req.params;
    const soldTickets = await getTicketsSold(ticketId);
    res.jsonp({
        ticketId,
        soldTickets
    });
};
