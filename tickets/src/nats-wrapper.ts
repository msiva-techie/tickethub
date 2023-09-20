import { Streams } from "@sivam96/tickethub-common";
import { connect, ConnectionOptions, JetStreamClient } from "nats";
import { TicketCreatedEventPublisher } from "./events/publishers/ticket-created";
import { TicketUpdatedEventPublisher } from "./events/publishers/ticket-updated";

const connectToNats = async (connectOptions: ConnectionOptions) => {
    const nc = await connect(connectOptions);
    console.log(`connected to ${nc.getServer()}`);
    const jsm = await nc.jetstreamManager();
    await jsm.streams.add({ name: Streams.Ticket, subjects: [`${Streams.Ticket}.*`] });
    return nc.jetstream();
};

export let ticketCreatedEventPublisher: TicketCreatedEventPublisher;
export let ticketUpdatedEventPublisher: TicketUpdatedEventPublisher;

const initiatePublishers = (natsClient: JetStreamClient) => {
    ticketCreatedEventPublisher = new TicketCreatedEventPublisher(natsClient);
    ticketUpdatedEventPublisher = new TicketUpdatedEventPublisher(natsClient);
};

export const initiateNats = async () => {
    try {
        const natsClient = await connectToNats({
            name: Streams.Order,
            servers: process.env.NATS_URL!.split(",")
        });
        initiatePublishers(natsClient);
    } catch (err) {
        throw new Error("Couldnot connect to NATS");
    }
};
