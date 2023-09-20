import { EventPublisher, PaymentCompletedEvent, Subjects } from "@sivam96/tickethub-common";

export class PaymentCompletedPublisher extends EventPublisher<PaymentCompletedEvent> {
    subject: Subjects.PaymentCompleted = Subjects.PaymentCompleted;
}
