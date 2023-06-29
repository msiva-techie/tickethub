import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PaymentAttr {
  orderId: mongoose.Schema.Types.ObjectId;
  stripeId: string;
}

interface PaymentDoc extends PaymentAttr, mongoose.Document {
  version: number;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build: (orderDoc: PaymentAttr) => PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true
    },
    stripeId: {
      type: String,
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

paymentSchema.statics.build = function (orderDoc: PaymentAttr): PaymentDoc {
  return new Order(orderDoc);
};

paymentSchema.set("versionKey", "version");
paymentSchema.plugin(updateIfCurrentPlugin);

export const Order = mongoose.model<PaymentDoc, PaymentModel>("Payment", paymentSchema);
