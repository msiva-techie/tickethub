import { Subjects } from "./subject";

export interface PaymentCompletedEvent {
  subject: Subjects.PaymentCompleted;
  data: {
    paymentId: string;
    orderId: string;
    userId: string;
    totalPrice: number;
  };
}

export interface PaymentRefundEvent {
  subject: Subjects.PaymentRefund;
  data: {
    orderId: string;
    userId: string;
  };
}
