import { Streams } from "@sivam96/tickethub-common";
import { connect, ConnectionOptions, JetStreamClient } from "nats";
import { OrderCompletedEventListener } from "./events/listeners/order-completed";
import { OrderCancelledEventListener } from "./events/listeners/order-cancelled";
import { ExpirationCompletedEventListener } from "./events/listeners/expiration-completed";
import { PaymentCompletedEventListener } from "./events/listeners/payment-completed";
import { TicketCreatedEventListener } from "./events/listeners/ticket-created";
import { TicketUpdatedEventListener } from "./events/listeners/ticket-updated";
import { OrderCreatedPublisher } from "./events/publishers/order-created";
import { OrderCancelledPublisher } from "./events/publishers/order-cancelled";
import { PaymentRefundPublisher } from "./events/publishers/payment-refund";
import { OrderCompletedPublisher } from "./events/publishers/order-completed";

const connectToNats = async (connectOptions: ConnectionOptions) => {
    const nc = await connect(connectOptions);
    console.log(`connected to ${nc.getServer()}`);
    const jsm = await nc.jetstreamManager();
    await jsm.streams.add({ name: Streams.Order, subjects: [`${Streams.Order}.*`] });
    return nc.jetstream();
};

const initiateListeners = (natsClient: JetStreamClient) => {
    new OrderCompletedEventListener(natsClient);
    new OrderCancelledEventListener(natsClient);
    new ExpirationCompletedEventListener(natsClient);
    new PaymentCompletedEventListener(natsClient);
    new TicketCreatedEventListener(natsClient);
    new TicketUpdatedEventListener(natsClient);
};

export let orderCreatedPublisher: OrderCreatedPublisher;
export let orderCompletedPublisher: OrderCompletedPublisher;
export let orderCancelledPublisher: OrderCancelledPublisher;

export let paymentRefundPublisher: PaymentRefundPublisher;

const initiatePublishers = (natsClient: JetStreamClient) => {
    orderCreatedPublisher = new OrderCreatedPublisher(natsClient);
    orderCompletedPublisher = new OrderCompletedPublisher(natsClient);
    orderCancelledPublisher = new OrderCancelledPublisher(natsClient);

    paymentRefundPublisher = new PaymentRefundPublisher(natsClient);
};

export const initiateNats = async () => {
    try {
        const natsClient = await connectToNats({
            name: Streams.Order,
            servers: process.env.NATS_URL!.split(",")
        });
        initiateListeners(natsClient);
        initiatePublishers(natsClient);
    } catch (err) {
        throw new Error("Couldnot connect to NATS");
    }
};
