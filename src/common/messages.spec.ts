import {
  afterAll,
  assert,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  Mock,
  vi,
} from "vitest";
import { createMessageBroker, Message, PluginEventData } from "./messages";

interface Fixture {
  readonly globalProperty: string;
  readonly mock: unknown;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  get onMessage(): Function | undefined;
  get postMessage(): Mock;

  clear(): void;
  expectedPostMessage(message: Message): unknown[];
  receiveMessage(message: Message): void;
}

class FigmaFixture implements Fixture {
  readonly globalProperty = "figma";
  readonly mock = {
    ui: {
      onmessage: undefined as ((message: Message) => void) | undefined,
      postMessage: vi.fn(),
    },
  };

  get onMessage() {
    return this.mock.ui.onmessage;
  }

  get postMessage() {
    return this.mock.ui.postMessage;
  }

  expectedPostMessage(message: Message) {
    return [message];
  }

  receiveMessage(message: Message) {
    const onMessage = this.onMessage;
    assert(
      onMessage != null,
      "Message broker must be created before using receiveMessage().",
    );
    const [data] = this.expectedPostMessage(message);
    onMessage(data);
  }

  clear() {
    this.mock.ui.onmessage = undefined;
    this.mock.ui.postMessage.mockClear();
  }
}

class UiFixture implements Fixture {
  readonly globalProperty = "window";
  readonly mock = {
    onmessage: undefined as
      | ((event: MessageEvent<PluginEventData>) => void)
      | undefined,
    parent: {
      postMessage: vi.fn(),
    },
  };

  get onMessage() {
    return this.mock.onmessage;
  }

  get postMessage() {
    return this.mock.parent.postMessage;
  }

  expectedPostMessage(message: Message) {
    return [{ pluginMessage: message }, "*"];
  }

  receiveMessage(message: Message) {
    const onMessage = this.onMessage;
    assert(
      onMessage != null,
      "Message broker must be created before using receiveMessage().",
    );
    const [data] = this.expectedPostMessage(message);
    onMessage({ data } as MessageEvent);
  }

  clear() {
    this.mock.onmessage = undefined;
    this.mock.parent.postMessage.mockClear();
  }
}

describe.each([
  { type: "plugin", fixture: new FigmaFixture() },
  { type: "ui", fixture: new UiFixture() },
])("createMessageBroker ($type)", ({ fixture }) => {
  beforeAll(() => {
    vi.stubGlobal(fixture.globalProperty, fixture.mock);
  });

  beforeEach(() => {
    fixture.clear();
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("should register a message handler when created", () => {
    createMessageBroker();
    expect(fixture.onMessage).toEqual(expect.any(Function));
  });

  it("should dispatch message to all subscribers", () => {
    const payload = { foo: "bar" };
    const firstSub = vi.fn();
    const secondSub = vi.fn();

    const broker = createMessageBroker();
    broker.subscribe("SUB", firstSub);
    broker.subscribe("SUB", secondSub);
    fixture.receiveMessage(["SUB", payload]);

    expect(firstSub).toHaveBeenCalledWith(payload);
    expect(secondSub).toHaveBeenCalledWith(payload);
  });

  it("should not dispatch message to subscribers of other channel", () => {
    const fooSubscriber = vi.fn();
    const barSubscriber = vi.fn();

    const broker = createMessageBroker();
    broker.subscribe("FOO", fooSubscriber);
    broker.subscribe("BAR", barSubscriber);
    fixture.receiveMessage(["FOO"]);

    expect(fooSubscriber).toHaveBeenCalled();
    expect(barSubscriber).not.toHaveBeenCalled();
  });

  it("should not dispatch message to unsubscribed subscribers", () => {
    const subscribed = vi.fn();
    const unsubscribed = vi.fn();

    const broker = createMessageBroker();
    broker.subscribe("SUB", subscribed);
    const unsubscribe = broker.subscribe("SUB", unsubscribed);

    unsubscribe();
    fixture.receiveMessage(["SUB"]);

    expect(subscribed).toHaveBeenCalled();
    expect(unsubscribed).not.toHaveBeenCalled();
  });

  it("should post message", () => {
    const channel = "SUB";
    const payload = { foo: "bar" };
    const expectedData = fixture.expectedPostMessage([channel, payload]);

    const broker = createMessageBroker();
    broker.post(channel, payload);

    expect(fixture.postMessage).toHaveBeenCalledWith(...expectedData);
  });
});

describe("createMessageBroker (undefined)", () => {
  it("should throw when neither figma or window are defined", () => {
    expect(() => createMessageBroker()).toThrow(
      "Cannot detect current environment",
    );
  });
});
