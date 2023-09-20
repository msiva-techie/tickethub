import { EventPublisher, OrderCreatedEvent, Subjects } from "@sivam96/tickethub-common";

export class OrderCreatedPublisher extends EventPublisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
