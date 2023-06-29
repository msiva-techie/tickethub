import { Subjects } from "./subject";

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {};
}

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;
  data: {};
}
