import { Streams } from "./streams";

const orderStream = Streams.Order;
const paymentStream = Streams.Payment;
const ticketStream = Streams.ticket;
const expiration = Streams.expiration;

export enum Subjects {
  OrderCreated = `${orderStream}.created`,
  OrderCancelled = `${orderStream}.cancelled`,

  PaymentCompleted = `${paymentStream}.completed`,

  ExpirationCompleted = `${expiration}.completed`,

  TicketCreated = `${ticketStream}.created`,
  TicketUpdated = `${ticketStream}.updated`
}
