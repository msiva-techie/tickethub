import { EventListener, OrderCompletedEvent, OrderStatus, Subjects } from "@sivam96/tickethub-common";
import { JsMsg } from "nats";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";
import { orderCancelledPublisher } from "../../nats-wrapper";

export class OrderCompletedEventListener extends EventListener<OrderCompletedEvent> {
    subject: Subjects.OrderCompleted = Subjects.OrderCompleted;
    queueGroupName = queueGroupName;
    durableName = `${queueGroupName}-durable`;

    async onMessage(data: OrderCompletedEvent["data"], msg: JsMsg) {
        try {
            const {
                orderId,
                version,
                userId,
            } = data;

            const order = await Order.findOne({
                _id: orderId,
                version: version - 1
            });

            if (!order) {
                throw new Error('Order not found');
            }

            const {
                ticket: {
                    _id: ticketId,
                    price
                },
                quantity,
            } = order;

            if (order.status === OrderStatus.cancelled) {
                orderCancelledPublisher.publish({
                    version: order?.version,
                    orderId,
                    userId,
                    ticket: {
                        ticketId,
                        price
                    },
                    quantity,
                    refund: true
                });
            }
            order.set({
                status: OrderStatus.completed
            });
            await order.save();
        } catch (err) {
            console.log(err);
        } finally {
            msg.ack();
        }
    }
}
