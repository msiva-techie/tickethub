import { EventListener, OrderCancelledEvent, OrderStatus, Subjects } from "@sivam96/tickethub-common";
import { JsMsg } from "nats";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";
import { paymentRefundPublisher } from "../../nats-wrapper";

export class OrderCancelledEventListener extends EventListener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
    durableName = `${queueGroupName}-durable`;

    async onMessage(data: OrderCancelledEvent["data"], msg: JsMsg) {
        try {
            const {
                orderId,
                userId,
                ticket: {
                    ticketId,
                    price
                },
                quantity,
                version,
                refund
            } = data;

            const order = await Order.findOne({
                _id: orderId,
                version: version - 1
            });

            if (!order) {
                throw new Error('Order not found');
            }
            order.set({
                status: OrderStatus.cancelled
            });
            await order.save();
            if (refund) {
                paymentRefundPublisher.publish({
                    orderId,
                    userId
                });
            }
        } catch (err) {
            console.log(err);
        } finally {
            msg.ack();
        }
    }
}
