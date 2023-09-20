import { Streams } from "@sivam96/tickethub-common";
import { connect, ConnectionOptions, JetStreamClient } from "nats";
import { PaymentCompletedPublisher } from "./events/publishers/payment-completed";
import { OrderCancelledEventListener } from "./events/listeners/order-cancelled";
import { OrderCreatedEventListener } from "./events/listeners/order-created";

const connectToNats = async (connectOptions: ConnectionOptions) => {
    const nc = await connect(connectOptions);
    console.log(`connected to ${nc.getServer()}`);
    const jsm = await nc.jetstreamManager();
    await jsm.streams.add({ name: Streams.Payment, subjects: [`${Streams.Payment}.*`] });
    return nc.jetstream();
};

const initiateListeners = (natsClient: JetStreamClient) => {
    new OrderCreatedEventListener(natsClient);
    new OrderCancelledEventListener(natsClient);
};

export let paymentCompletedPublisher: PaymentCompletedPublisher;

const initiatePublishers = (natsClient: JetStreamClient) => {
    paymentCompletedPublisher = new PaymentCompletedPublisher(natsClient);
};

export const initiateNats = async () => {
    try {
        const natsClient = await connectToNats({
            name: Streams.Payment,
            servers: process.env.NATS_URL!.split(",")
        });
        initiateListeners(natsClient);
        initiatePublishers(natsClient);
    } catch (err) {
        throw new Error("Couldnot connect to NATS");
    }
};
