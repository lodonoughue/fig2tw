/* v8 ignore start */
// Coverage is not calculated in fixtures, because it's only meant to help
// with the tests. It should  never be used in production code.

import {
  Channel,
  dispatchMessage,
  MessageBroker,
  subscribe,
  Subscriptions,
  unsubscribe,
} from "./messages";

class TestMessageBroker implements MessageBroker {
  readonly subscriptions: Subscriptions = {};

  subscribe<C extends Channel>(name: C["name"], handler: C["handler"]) {
    subscribe(this.subscriptions, name, handler);
    return () => unsubscribe(this.subscriptions, name, handler);
  }

  post<C extends Channel>(name: C["name"], ...args: Parameters<C["handler"]>) {
    return dispatchMessage(this.subscriptions, [name, ...args]);
  }
}

function createMessageBroker(): TestMessageBroker {
  return new TestMessageBroker();
}

export const messageFixtures = { createMessageBroker };
