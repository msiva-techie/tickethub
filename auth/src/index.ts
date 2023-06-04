import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connect, consumerOpts, createInbox } from "nats";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// to create a connection to a nats-server:
(async () => {
  const nc = await connect({
    name: "auth",
    servers: ["nats://nats-0.nats-svc:4222", "nats://nats-1.nats-svc:4222", "nats://nats-2.nats-svc:4222"]
  });
  console.log(`connected to ${nc.getServer()}`);
  const jsm = await nc.jetstreamManager();
  await jsm.streams.add({ name: "nats-poc", subjects: ["nats-poc.*"] });
  // await jsm.streams.delete('nats-poc');
  // create a jetstream client:
  const js = nc.jetstream();
  const data = {
    message: "hello from server1, GM1"
  };
  const buffer = Buffer.from(JSON.stringify(data), "utf-8");
  await js.publish("nats-poc.test", buffer);
  console.log("message published......");
  const options = consumerOpts()
    .deliverAll()
    .ackExplicit()
    .manualAck()
    .ackWait(5000)
    .deliverGroup("nats-poc")
    .durable("nats-poc-d")
    .deliverTo(createInbox());

  const sub = await js.subscribe("nats-poc.test", options);
  console.log("messages in server2...........");
  for await (const m of sub) {
    console.log("message......");
    console.log(m.subject);
    console.log(JSON.parse(m.data.toString()));
    m.ack();
  }
})();

app.get("/", (req: Request, res: Response) =>
  res.jsonp({
    message: "success"
  })
);

app.get("/abc", (req: Request, res: Response) =>
  res.jsonp({
    message: "abc"
  })
);

app.listen(port, () => console.log(`Server running  the port ${port}`));
