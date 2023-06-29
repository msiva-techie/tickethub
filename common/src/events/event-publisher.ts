import { JetStreamClient } from "nats";
import { Subjects } from "./subject";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class EventPublisher<T extends Event> {
  abstract subject: T["subject"];

  constructor(private client: JetStreamClient) {}

  async publish(data: T["data"]) {
    const buffer = Buffer.from(JSON.stringify(data), "utf-8");
    console.log("Publishing event to the subject ", this.subject);
    return this.client.publish(this.subject, buffer);
  }
}
