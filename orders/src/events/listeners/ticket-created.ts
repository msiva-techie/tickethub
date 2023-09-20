import { EventListener, TicketCreatedEvent, Subjects } from "@sivam96/tickethub-common";
import { JsMsg } from "nats";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketCreatedEventListener extends EventListener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName;
    durableName = `${queueGroupName}-durable`;

    async onMessage(data: TicketCreatedEvent["data"], msg: JsMsg) {
        const {
            ticketId,
            title,
            price,
            description,
            totalQuantity
        } = data;
        const ticket = Ticket.build({
            id: ticketId,
            title,
            price,
            description,
            totalQuantity
        });
        await ticket.save();
        msg.ack();
    }
}
