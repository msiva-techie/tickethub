import { EventListener, TicketUpdatedEvent, Subjects } from "@sivam96/tickethub-common";
import { JsMsg } from "nats";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedEventListener extends EventListener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;
    durableName = `${queueGroupName}-durable`;

    async onMessage(data: TicketUpdatedEvent["data"], msg: JsMsg) {
        try {
            const {
                ticketId,
                title,
                price,
                description,
                totalQuantity,
                sold,
                version
            } = data;
            const ticket = await Ticket.findOne({
                _id: ticketId,
                version: version - 1
            });
            if (!ticket) {
                throw new Error(`Ticket not found ${ticketId}`);
            }
            ticket.set({
                title,
                price,
                description,
                totalQuantity,
                sold
            });
            await ticket.save();
        } catch (err) {
            console.log(err);
        } finally {
            msg.ack();
        }
    }
}
