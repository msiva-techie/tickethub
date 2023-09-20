import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@sivam96/tickethub-common";

interface OrderAttr {
  id: string;
  status?: OrderStatus;
  userId: string;
  totalPrice: number;
}

interface OrderDoc extends OrderAttr, mongoose.Document {
  id: string;
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
    totalPrice: {
      type: Number,
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
