import { MessageBroker } from "@common/messages";

export interface PropsWithClassName {
  className?: string;
}

export interface SectionProps extends PropsWithClassName {
  broker: MessageBroker;
}
