import { Subjects } from "./subject";
export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {};
}

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated;
  data: {};
}
