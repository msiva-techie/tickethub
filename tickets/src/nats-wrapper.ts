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

const initiatePublishers = async (natsClient: JetStreamClient) => {
    ticketCreatedEventPublisher = new TicketCreatedEventPublisher(natsClient);
    ticketUpdatedEventPublisher = new TicketUpdatedEventPublisher(natsClient);
    // console.log('sterted publisher......');
    // await ticketUpdatedEventPublisher.publish({
    //     ticketId: 'test',
    //     title: 'test',
    //     price: 123,
    //     description: 'test',
    //     totalQuantity: 123,
    //     sold: 123,
    //     userId: 'test',
    //     version: 123
    // });
    // console.log('sterted publisher.....done.');
};

export const initiateNats = async () => {
    try {
        const natsClient = await connectToNats({
            name: Streams.Ticket,
            servers: process.env.NATS_URL!.split(",")
        });
        await initiatePublishers(natsClient);
    } catch (err) {
        console.log(err);
        throw new Error("NATS Error");
    }
};
