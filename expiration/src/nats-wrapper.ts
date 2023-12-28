import { Streams } from "@sivam96/tickethub-common";
import { connect, ConnectionOptions, JetStreamClient } from "nats";
import { OrderCreatedListener } from "./events/listeners/order-created";
import { ExpirationCompletedPublisher } from "./events/publishers/expiration-completed";

const connectToNats = async (connectOptions: ConnectionOptions) => {
    const nc = await connect(connectOptions);
    console.log(`connected to ${nc.getServer()}`);
    const jsm = await nc.jetstreamManager();
    await jsm.streams.add({ name: Streams.Expiration, subjects: [`${Streams.Expiration}.*`] });
    return nc.jetstream();
};

const initiateListeners = (natsClient: JetStreamClient) => {
    new OrderCreatedListener(natsClient).listen();
};

export let expirationCompletedPublisher: ExpirationCompletedPublisher;

const initiatePublishers = (natsClient: JetStreamClient) => {
    expirationCompletedPublisher = new ExpirationCompletedPublisher(natsClient);
};

export const initiateNats = async () => {
    try {
        const natsClient = await connectToNats({
            name: Streams.Expiration,
            servers: process.env.NATS_URL!.split(",")
        });
        initiateListeners(natsClient);
        initiatePublishers(natsClient);
    } catch (err) {
        console.log(err);
        throw new Error("NATS Error");
    }
};
