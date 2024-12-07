import { assert, fail } from "@common/assert";

interface Handler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any[]): void;
}

type Subscriptions = Record<string, Handler[] | undefined>;

export type Channel = {
  name: string;
  handler: Handler;
};

export type Message = [string, ...args: Parameters<Handler>];
export type PluginEventData = {
  pluginMessage: unknown;
};

function _subscribe<T extends Channel>(
  subscriptions: Subscriptions,
  name: T["name"],
  handler: T["handler"],
) {
  const handlers = _getHandlers(subscriptions, name);
  subscriptions[name] = [...handlers, handler];
}

function _unsubscribe<T extends Channel>(
  subscriptions: Subscriptions,
  name: T["name"],
  handler: T["handler"],
) {
  const handlers = _getHandlers(subscriptions, name);
  subscriptions[name] = handlers.filter(h => h !== handler);
}

function _isMessage(value: unknown): value is Message {
  return Array.isArray(value) && typeof value[0] === "string";
}

function _isPluginEventData(value: unknown): value is PluginEventData {
  return value != null && typeof value === "object" && "pluginMessage" in value;
}

function _getHandlers(subscriptions: Subscriptions, name: string): Handler[] {
  return (subscriptions[name] as Handler[]) || [];
}

function _dispatchMessage(subscriptions: Subscriptions, message: Message) {
  const [name, ...args] = message;
  const handlers = _getHandlers(subscriptions, name);
  assert(handlers.length > 0, `No handlers found for message "${name}"`);
  handlers.forEach(handler => handler(...args));
}

export interface MessageBroker {
  subscribe<C extends Channel>(
    name: C["name"],
    handler: C["handler"],
  ): () => void;
  post<C extends Channel>(
    name: C["name"],
    ...args: Parameters<C["handler"]>
  ): void;
}

class PluginMessageBroker implements MessageBroker {
  constructor(private readonly subscriptions: Subscriptions = {}) {
    figma.ui.onmessage = function (data: unknown) {
      assert(_isMessage(data), `Plugin received a malformed message: ${data}`);
      _dispatchMessage(subscriptions, data);
    };
  }

  subscribe<C extends Channel>(name: C["name"], handler: C["handler"]) {
    _subscribe(this.subscriptions, name, handler);
    return () => _unsubscribe(this.subscriptions, name, handler);
  }

  post<C extends Channel>(name: C["name"], ...args: Parameters<C["handler"]>) {
    figma.ui.postMessage([name, ...args]);
  }
}

class UiMessageBroker implements MessageBroker {
  constructor(private readonly subscriptions: Subscriptions = {}) {
    window.onmessage = function (event: MessageEvent<unknown>) {
      const eventData = event.data;
      assert(_isPluginEventData(eventData), "UI received a malformed event");
      const data = eventData.pluginMessage;
      assert(_isMessage(data), `UI received a malformed message: ${data}`);
      _dispatchMessage(subscriptions, data);
    };
  }

  subscribe<C extends Channel>(name: C["name"], handler: C["handler"]) {
    _subscribe(this.subscriptions, name, handler);
    return () => _unsubscribe(this.subscriptions, name, handler);
  }

  post<C extends Channel>(
    name: C["name"],
    ...args: Parameters<C["handler"]>
  ): void {
    window.parent.postMessage({ pluginMessage: [name, ...args] }, "*");
  }
}

export function createMessageBroker(): MessageBroker {
  if (typeof figma !== "undefined") {
    return new PluginMessageBroker();
  }

  if (typeof window !== "undefined") {
    return new UiMessageBroker();

    // This is unreachable because of the `isSupportedByJson` check. It is kept
    // here in case the supported types change.
    /* v8 ignore next 4 */
  }

  fail("Cannot detect current environment for message broker.");
}
