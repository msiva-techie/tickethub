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
    // console.log('deleting old streams....');
    // await jsm.streams.delete(Streams.Order);
    // console.log('order deleted');
    // await jsm.streams.delete(Streams.Expiration);
    // console.log('expiration deleted');
    // await jsm.streams.delete(Streams.Payment);
    // console.log('payment deleted');
    // await jsm.streams.delete(Streams.Ticket);
    // console.log('ticket deleted');
    // await jsm.streams.delete(Streams.TicketHub);
    // console.log('tickethub deleted');
    // console.log('all deleted......');
    await jsm.streams.add({ name: Streams.Order, subjects: [`${Streams.Order}.*`] });
    return nc.jetstream();
};

const initiateListeners = (natsClient: JetStreamClient) => {
    new OrderCompletedEventListener(natsClient).listen();
    new OrderCancelledEventListener(natsClient).listen();
    new ExpirationCompletedEventListener(natsClient).listen();
    new PaymentCompletedEventListener(natsClient).listen();
    new TicketCreatedEventListener(natsClient).listen();
    new TicketUpdatedEventListener(natsClient).listen();
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
        console.log(err);
        throw new Error("NATS Error....");
    }
};
