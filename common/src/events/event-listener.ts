import { JetStreamClient, JsMsg, consumerOpts, createInbox } from "nats";
import { Subjects } from "./subject";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class EventListener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract durableName: string;
  abstract onMessage(data: T["data"], msg: JsMsg): void;

  constructor(private client: JetStreamClient) { }

  async listen() {
    const options = consumerOpts()
      .deliverAll()
      .ackExplicit()
      .manualAck()
      .ackWait(5000)
      .deliverGroup(this.queueGroupName)
      .durable(this.durableName)
      .deliverTo(createInbox());

    const sub = await this.client.subscribe(this.subject as string, options);
    for await (const m of sub) {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
      const parsedMessage = JSON.parse(m.data.toString());
      this.onMessage(parsedMessage, m);
    }
  }
}
