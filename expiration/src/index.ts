import { initiateNats } from "./nats-wrapper";

(async () => {
    if (!process.env.NATS_URL) {
        throw new Error("NATS URL is not defined........");
    }
    if (!process.env.REDIS_HOST) {
        throw new Error("REDIS HOST is not defined.......");
    }
    await initiateNats();
})();
