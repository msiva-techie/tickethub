import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PaymentAttr {
  orderId: mongoose.Schema.Types.ObjectId;
  paymentId: string;
  userId: string;
  refund?: boolean;
}

interface PaymentDoc extends PaymentAttr, mongoose.Document {
  version: number;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build: (paymentDoc: PaymentAttr) => PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    orderId: {
      type: String,
      required: true
    },
    paymentId: {
      type: String,
      required: true
    },
    refund: {
      type: Boolean
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

paymentSchema.statics.build = function (paymentDoc: PaymentAttr): PaymentDoc {
  return new Payment(paymentDoc);
};

paymentSchema.set("versionKey", "version");
paymentSchema.plugin(updateIfCurrentPlugin);

export const Payment = mongoose.model<PaymentDoc, PaymentModel>("Payment", paymentSchema);
