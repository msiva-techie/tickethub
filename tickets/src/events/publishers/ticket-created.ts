import { EventPublisher, Subjects, TicketCreatedEvent } from "@sivam96/tickethub-common";

export class TicketCreatedEventPublisher extends EventPublisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
