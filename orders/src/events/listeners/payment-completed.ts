import { EventListener, PaymentCompletedEvent, Subjects } from "@sivam96/tickethub-common";
import { JsMsg } from "nats";
import mongoose from "mongoose";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { getTicketsSold } from "../../utils/order";
import { orderCancelledPublisher, orderCompletedPublisher } from "../../nats-wrapper";
import { Order } from "../../models/order";

export class PaymentCompletedEventListener extends EventListener<PaymentCompletedEvent> {
    subject: Subjects.PaymentCompleted = Subjects.PaymentCompleted;
    queueGroupName = queueGroupName;
    durableName = `${queueGroupName}-durable`;

    async onMessage(data: PaymentCompletedEvent["data"], msg: JsMsg) {
        const session = await mongoose.startSession({
            causalConsistency: true
        });
        const errMessageForNoStock = "Required quantity of tickets not available";
        const {
            paymentId,
            orderId,
            userId
        } = data;
        let order;
        try {
            order = await Order.findById(orderId);
            if (!order) {
                throw new Error(`Order not found ${orderId}`);
            }
            session.startTransaction();
            const ticket = await Ticket.findById(order.ticket.id);
            if (!ticket) {
                throw new Error(`Ticket not found ${order.ticket.id}`);
            }
            const sold = await getTicketsSold(order.ticket.id);
            const availableQuantity = ticket.totalQuantity - sold;
            if (availableQuantity < order.quantity) {
                throw new Error(errMessageForNoStock);
            }
            await session.commitTransaction();
            orderCompletedPublisher.publish({
                version: order.version,
                orderId,
                userId,
                ticketId: order.ticket.id,
                paymentId,
            });
        } catch (err) {
            console.log(err);
            await session.abortTransaction();
            if (err instanceof Error && err.message === errMessageForNoStock) {
                if (order) {
                    orderCancelledPublisher.publish({
                        version: order?.version,
                        orderId,
                        userId,
                        ticket: {
                            ticketId: order.ticket.id,
                            price: order.ticket.price
                        },
                        quantity: order.quantity,
                        refund: true
                    });
                }
            }
        } finally {
            msg.ack();
        }
    }
}
