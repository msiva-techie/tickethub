import { EventPublisher, OrderCompletedEvent, Subjects } from "@sivam96/tickethub-common";

export class OrderCompletedPublisher extends EventPublisher<OrderCompletedEvent> {
    subject: Subjects.OrderCompleted = Subjects.OrderCompleted;
}
