import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttr {
  title: string;
  price: number;
  totalQuantity: number;
  sold: number;
  userId: mongoose.Schema.Types.ObjectId;
}

interface TicketDoc extends TicketAttr, mongoose.Document {
  version: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build: (ticketDoc: TicketAttr) => TicketDoc;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  totalQuantity: {
    type: Number,
    required: true
  },
  sold: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

ticketSchema.statics.build = function (tickerDoc: TicketAttr) {
  return new Ticket(tickerDoc);
};

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

export const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);
