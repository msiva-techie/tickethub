import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttr {
  status: OrderStatus;
  userId: mongoose.Schema.Types.ObjectId;
  totalPrice: number;
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
      default: OrderStatus.OrderCreated
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
