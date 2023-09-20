import { EventListener, PaymentRefundEvent, Subjects } from "@sivam96/tickethub-common";
import { JsMsg } from "nats";
import { queueGroupName } from "./queue-group-name";
import { Payment } from "../../models/payment";
import { refund } from "../../utils/payment";

export class PaymentRefundEventListener extends EventListener<PaymentRefundEvent> {
    subject: Subjects.PaymentRefund = Subjects.PaymentRefund;
    queueGroupName = queueGroupName;
    durableName = `${queueGroupName}-durable`;

    async onMessage(data: PaymentRefundEvent["data"], msg: JsMsg) {
        try {
            const {
                orderId
            } = data;
            const payment = await Payment.findOne({
                orderId
            });
            if (!payment) {
                throw new Error('Payment not found');
            }
            if (payment.refund) {
                throw new Error('Payment already refunded');
            }
            await refund(payment.id);
            payment.set({ refund: true });
            await payment.save();
        } catch (err) {
            console.log(err);
        } finally {
            msg.ack();
        }
    }
}
