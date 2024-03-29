import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttr {
  title: string;
  price: number;
  totalQuantity: number;
  description: string;
  sold?: number;
  userId: string;
}

interface TicketDoc extends TicketAttr, mongoose.Document {
  version: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build: (ticketDoc: TicketAttr) => TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    totalQuantity: {
      type: Number,
      required: true
    },
    sold: {
      type: Number,
      default: 0
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

ticketSchema.statics.build = function (tickerDoc: TicketAttr) {
  return new Ticket(tickerDoc);
};

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

export const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);
