import { EventListener, OrderCreatedEvent, Subjects } from "@sivam96/tickethub-common";
import { JsMsg } from "nats";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCreatedEventListener extends EventListener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    durableName = `${queueGroupName}-durable`;

    async onMessage(data: OrderCreatedEvent["data"], msg: JsMsg) {
        const {
            orderId,
            userId,
            ticket: {
                price
            },
            quantity
        } = data;
        const order = Order.build({
            id: orderId,
            totalPrice: price * quantity,
            userId
        });
        await order.save();
        msg.ack();
    }
}
