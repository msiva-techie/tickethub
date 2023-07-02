import express, { Express } from "express";
import "express-async-errors";
import dotenv from "dotenv";
// import { connect, consumerOpts, createInbox } from "nats";
import router from "./routes";
import mongoose from "mongoose";
import morgan from "morgan";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import { NotFoundError, DBConnectError, handleErrors, getCurrentUser } from "@sivam96/tickethub-common";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

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

(async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO URI is not defined");
  }

  if (!process.env.COOKIE_KEY) {
    throw new Error("COOKIE_KEY is not defined.......");
  }

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is not defined.......");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongodb connected........");
  } catch (err) {
    throw new DBConnectError();
  }

  app.use(morgan("dev"));
  app.use(json());
  app.use(cookieParser(process.env.COOKIE_KEY));
  app.use(methodOverride());

  app.use(getCurrentUser);
  app.use(router);
  app.all("*", () => {
    throw new NotFoundError();
  });

  app.use(handleErrors);

  app.listen(port, () => console.log(`Ticket Server running in the port ${port}`));
})();
