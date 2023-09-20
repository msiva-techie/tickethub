import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@sivam96/tickethub-common";
import { TicketDoc } from "./ticket";

interface OrderAttr {
    status?: OrderStatus;
    userId: string;
    ticket: TicketDoc;
    quantity: number;
    totalPrice: number;
    expiresAt: Date;
}

interface OrderDoc extends OrderAttr, mongoose.Document {
    version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build: (orderDoc: OrderAttr) => OrderDoc;
}

const orderSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.created
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket"
        },
        quantity: {
            type: Number,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        },
        expiresAt: {
            type: mongoose.Schema.Types.Date,
            required: true
        }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret.id;
            }
        }
    }
);

orderSchema.statics.build = function (orderDoc: OrderAttr): OrderDoc {
    return new Order(orderDoc);
};

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

export const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);
