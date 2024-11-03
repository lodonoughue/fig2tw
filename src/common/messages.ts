import { assert, fail } from "@common/assert";

interface Handler {
  (...args: never[]): void;
}

type Subscriptions = Record<string, Handler[] | undefined>;

export type Channel = {
  name: string;
  handler: Handler;
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

function _isMessage(value: unknown): value is [string, ...args: never[]] {
  return Array.isArray(value) && typeof value[0] === "string";
}

function _getHandlers(subscriptions: Subscriptions, name: string): Handler[] {
  return (subscriptions[name] as Handler[]) || [];
}

function _dispatchMessage(
  subscriptions: Subscriptions,
  message: [string, ...args: never[]],
) {
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
    window.onmessage = function (event) {
      const data = event.data.pluginMessage;
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
  }
  fail(
    "Cannot detect current environment because neither figma nor window are",
    "defined.",
  );
}
