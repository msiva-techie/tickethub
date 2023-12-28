import Queue from "bull";
import { expirationCompletedPublisher } from "../nats-wrapper";

interface Payload {
    orderId: string;
}

const queueName = "order.expired";

export const orderExpiredQueue = new Queue<Payload>(queueName, {
    redis: {
        host: process.env.REDIS_HOST!,
        port: parseInt(process.env.REDIS_PORT!),
        password: process.env.REDIS_PASSWORD!
    }
});

orderExpiredQueue.process((job) => {
    const { orderId } = job.data;
    expirationCompletedPublisher.publish({ orderId });
});
