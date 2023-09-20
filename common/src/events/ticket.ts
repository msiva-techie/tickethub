import { Subjects } from "./subject";

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    ticketId: string;
    title: string;
    price: number;
    description: string;
    totalQuantity: number;
    sold: number;
    userId: string;
    version: number;
  };
}

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated;
  data: {
    ticketId: string;
    title: string;
    price: number;
    description: string;
    totalQuantity: number;
    sold: number;
    userId: string;
    version: number;
  };
}
