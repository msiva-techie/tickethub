import { EventPublisher, Subjects, TicketUpdatedEvent } from "@sivam96/tickethub-common";

export class TicketUpdatedEventPublisher extends EventPublisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
