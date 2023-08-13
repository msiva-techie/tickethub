import { Subjects } from "./subject";

export interface ExpirationCompletedEvent {
  subject: Subjects.ExpirationCompleted;
  data: {
    orderId: string;
  };
}
