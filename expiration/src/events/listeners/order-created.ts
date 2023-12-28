import { JsMsg } from "nats";
import { EventListener, OrderCreatedEvent, Subjects } from "@sivam96/tickethub-common";
import { queueGroupName } from "./queue-group-name";
import { orderExpiredQueue } from "../../queues/order-expired";

export class OrderCreatedListener extends EventListener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    durableName = `${queueGroupName}-durable`;

    onMessage(data: OrderCreatedEvent["data"], msg: JsMsg) {
        const { expiresAt, orderId } = data;
        const delay = new Date(expiresAt).getTime() - new Date().getTime();
        orderExpiredQueue.add({ orderId }, { delay });
        msg.ack();
    }
}
