"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// import { connect, consumerOpts, createInbox } from "nats";
const routes_1 = __importDefault(require("./routes"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
// to create a connection to a nats-server:
// (async () => {
//   const nc = await connect({
//     name: "auth",
//     servers: ["nats://nats-0.nats-svc:4222", "nats://nats-1.nats-svc:4222", "nats://nats-2.nats-svc:4222"]
//   });
//   console.log(`connected to ${nc.getServer()}`);
//   const jsm = await nc.jetstreamManager();
//   await jsm.streams.add({ name: "nats-poc", subjects: ["nats-poc.*"] });
//   // await jsm.streams.delete('nats-poc');
//   // create a jetstream client:
//   const js = nc.jetstream();
//   const data = {
//     message: "hello from server1, GM1"
//   };
//   const buffer = Buffer.from(JSON.stringify(data), "utf-8");
//   await js.publish("nats-poc.test", buffer);
//   console.log("message published......");
//   const options = consumerOpts()
//     .deliverAll()
//     .ackExplicit()
//     .manualAck()
//     .ackWait(5000)
//     .deliverGroup("nats-poc")
//     .durable("nats-poc-d")
//     .deliverTo(createInbox());
//   const sub = await js.subscribe("nats-poc.test", options);
//   console.log("messages in server2...........");
//   for await (const m of sub) {
//     console.log("message......");
//     console.log(m.subject);
//     console.log(JSON.parse(m.data.toString()));
//     m.ack();
//   }
// })();
(() => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO URI is not defined");
    }
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY is not defined.........");
    }
    yield mongoose_1.default.connect(process.env.MONGO_URI);
}))();
app.use(routes_1.default);
app.use((req) => {
    console.log("url.............");
    console.log(req.url);
});
app.use("*", (req, res) => {
    res.status(404).jsonp([
        {
            message: "Not Found"
        }
    ]);
});
app.listen(port, () => console.log(`Server running  the port ${port}`));
