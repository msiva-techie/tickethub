import mongoose from "mongoose";
import { Order } from "../models/order";
import { OrderStatus } from "@sivam96/tickethub-common";

interface orders {
    _id: string;
    sold: number;
}

export const getTicketsSold = async (ticketId: string) => {
    const orders: orders[] = await Order.aggregate([
        {
            $match: {
                ticket: new mongoose.Schema.Types.ObjectId(ticketId),
                status: {
                    $ne: OrderStatus.cancelled
                }
            }
        },
        {
            $group: {
                _id: "$ticket",
                sold: {
                    $sum: "$quantity"
                }
            }
        }
    ]);
    return orders[0]?.sold || 0;
};
