import { Subjects } from "./subject";

export interface PaymentCompletedEvent {
  subject: Subjects.PaymentCompleted;
  data: {};
}
