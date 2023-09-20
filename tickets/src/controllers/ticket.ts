import { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { BadRequestError, NotAuthorizedError } from "@sivam96/tickethub-common";
import { ticketCreatedEventPublisher, ticketUpdatedEventPublisher } from "../nats-wrapper";

export const getTicket = async (req: Request, res: Response) => {
  const { ticketId } = req.params;
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new BadRequestError("Ticket not found");
  }
  res.jsonp(ticket);
};

export const getAllTickets = async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});
  res.jsonp(tickets);
};

export const createTicket = async (req: Request, res: Response) => {
  const { title, price, totalQuantity, description, sold = 0 } = req.body;
  const userId = req.currentUser!.id;
  const ticket = Ticket.build({
    title,
    price,
    description,
    totalQuantity,
    sold,
    userId
  });
  await ticket.save();
  ticketCreatedEventPublisher.publish({
    ticketId: ticket.id,
    title,
    price,
    description,
    totalQuantity,
    sold,
    userId,
    version: ticket.version
  });
  res.status(201).jsonp(ticket);
};

export const updateTicket = async (req: Request, res: Response) => {
  const { ticketId } = req.params;
  const { title, price, totalQuantity, description, sold } = req.body;
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new BadRequestError("Ticket not found");
  }
  const ticketUserId = ticket.userId.toString();
  if (ticketUserId !== req.currentUser!.id) {
    throw new NotAuthorizedError("Not authorized to update the ticket");
  }
  ticket.set({
    title: title || ticket.title,
    price: price || ticket.price,
    totalQuantity: totalQuantity || ticket.totalQuantity,
    description: description || ticket.description,
    sold: sold || ticket.sold
  });
  await ticket.save();
  ticketUpdatedEventPublisher.publish({
    ticketId,
    title,
    price,
    description,
    totalQuantity,
    sold,
    userId: ticketUserId,
    version: ticket.version
  });
  res.jsonp(ticket);
};

export const deleteTicket = async (req: Request, res: Response) => {
  const { ticketId } = req.params;
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new BadRequestError("Ticket not found");
  }
  const ticketUserId = ticket.userId.toString();

  if (ticketUserId !== req.currentUser?.id) {
    throw new NotAuthorizedError("Not authorized to delete the ticket");
  }
  await ticket.deleteOne();
  res.status(204).end();
};
