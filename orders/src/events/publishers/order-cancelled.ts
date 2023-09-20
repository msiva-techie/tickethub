import { EventPublisher, OrderCancelledEvent, Subjects } from "@sivam96/tickethub-common";

export class OrderCancelledPublisher extends EventPublisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
