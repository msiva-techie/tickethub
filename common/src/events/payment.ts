import { Subjects } from "./subject";

export interface PaymentCompletedEvent {
  subject: Subjects.PaymentCompleted;
  data: {
    paymentId: string;
    orderId: string;
    userId: string;
    ticket: {
      ticketId: string;
      price: number;
    };
    quantity: number;
  };
}
