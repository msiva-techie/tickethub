import { Subjects } from "./subject";

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    orderId: string;
    userId: string;
    expiresAt: string;
    ticket: {
      ticketId: string;
      price: number;
    };
    quantity: number;
    version: number;
  };
}

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;
  data: {
    orderId: string;
    userId: string;
    ticket: {
      ticketId: string;
      price: number;
    };
    quantity: number;
    refund?: boolean;
    version: number;
  };
}

export interface OrderCompletedEvent {
  subject: Subjects.OrderCompleted;
  data: {
    orderId: string;
    userId: string;
    paymentId: string;
    ticketId: string;
    version: number;
  };
}
