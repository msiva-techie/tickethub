import { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { BadRequestError, NotAuthorizedError } from "@sivam96/tickethub-common";
import mongoose from "mongoose";

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
  const { title, price, totalQuantity, sold = 0 } = req.body;
  const ticket = Ticket.build({
    title,
    price,
    totalQuantity,
    sold,
    userId: req.currentUser?.id as unknown as mongoose.Schema.Types.ObjectId
  });
  await ticket.save();
  res.status(201).jsonp(ticket);
};

export const updateTicket = async (req: Request, res: Response) => {
  const { ticketId } = req.params;
  const { title, price, totalQuantity, sold } = req.body;
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new BadRequestError("Ticket not found");
  }
  const ticketUserId = ticket.userId.toString();
  if (ticketUserId !== req.currentUser?.id) {
    throw new NotAuthorizedError("Not authorized to update the ticket");
  }
  ticket.set({
    title: title || ticket.title,
    price: price || ticket.price,
    totalQuantity: totalQuantity || ticket.totalQuantity,
    sold: sold || ticket.sold
  });
  await ticket.save();
  res.jsonp(ticket);
};

export const deleteTicket = async (req: Request, res: Response) => {
  const { ticketId } = req.params;
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new BadRequestError("Ticket not found");
  }
  const ticketUserId = ticket.userId.toString();
  console.log({
    ticketUserId,
    id: req.currentUser?.id
  });
  if (ticketUserId !== req.currentUser?.id) {
    throw new NotAuthorizedError("Not authorized to delete the ticket");
  }
  await ticket.deleteOne();
  res.status(204).end();
};
