import { EventPublisher, PaymentRefundEvent, Subjects } from "@sivam96/tickethub-common";

export class PaymentRefundPublisher extends EventPublisher<PaymentRefundEvent> {
    subject: Subjects.PaymentRefund = Subjects.PaymentRefund;
}
