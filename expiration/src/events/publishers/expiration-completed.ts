import { EventPublisher, ExpirationCompletedEvent, Subjects } from "@sivam96/tickethub-common";

export class ExpirationCompletedPublisher extends EventPublisher<ExpirationCompletedEvent>{
    subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}
