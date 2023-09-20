import { EventListener, ExpirationCompletedEvent, OrderStatus, Subjects } from "@sivam96/tickethub-common";
import { JsMsg } from "nats";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class ExpirationCompletedEventListener extends EventListener<ExpirationCompletedEvent> {
    subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
    queueGroupName = queueGroupName;
    durableName = `${queueGroupName}-durable`;

    async onMessage(data: ExpirationCompletedEvent["data"], msg: JsMsg) {
        try {
            const {
                orderId
            } = data;

            const order = await Order.findOne({
                _id: orderId,
            });

            if (!order) {
                throw new Error('Order not found');
            }
            if (order.status === OrderStatus.completed) {
                return msg.ack();
            }
            order.set({
                status: OrderStatus.cancelled
            });
            await order.save();
        } catch (err) {
            console.log(err);
        } finally {
            msg.ack();
        }
    }
}
