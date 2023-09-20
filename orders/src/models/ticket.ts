import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttr {
    id: string;
    title: string;
    price: number;
    description: string;
    totalQuantity: number;
    sold?: number;
}

export interface TicketDoc extends TicketAttr, mongoose.Document {
    id: string;
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
        required: true
    }
});

ticketSchema.statics.build = function (tickerDoc: TicketAttr) {
    return new Ticket(tickerDoc);
};

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

export const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);
