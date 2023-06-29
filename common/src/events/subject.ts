import { Streams } from "./streams";

const orderStream = Streams.Order;
const paymentStream = Streams.Payment;
const ticketStream = Streams.ticket;
const expirationStream = Streams.expiration;

const orderCreated = `${orderStream}.created`;
const orderCancelled = `${orderStream}.cancelled`;

const paymentCompleted = `${paymentStream}.completed`;

const expirationCompleted = `${expirationStream}.completed`;

const ticketCreated = `${ticketStream}.created`;
const ticketCancelled = `${ticketStream}.updated`;

export enum Subjects {
  OrderCreated = orderCreated,
  OrderCancelled = orderCancelled,

  PaymentCompleted = paymentCompleted,

  ExpirationCompleted = expirationCompleted,

  TicketCreated = ticketCreated,
  TicketUpdated = ticketCancelled
}
