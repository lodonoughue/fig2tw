import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { createMessageBroker } from "./messages";

const figmaMock = {
  ui: {
    onmessage: undefined,
    postMessage: vi.fn(),
  },
};

const windowMock = {
  onmessage: undefined,
  postMessage: vi.fn(),
};

describe.each([
  {
    type: "plugin",
    globalProperty: "figma",
    globalMock: figmaMock,
    functions: figmaMock.ui,
  },
  {
    type: "ui",
    globalProperty: "window",
    globalMock: windowMock,
    functions: windowMock,
  },
])(
  "createMessageBroker ($type)",
  ({ globalProperty, globalMock, functions }) => {
    beforeAll(() => {
      vi.stubGlobal(globalProperty, globalMock);
    });

    beforeEach(() => {
      functions.onmessage = undefined;
      vi.mocked(functions.postMessage).mockClear();
    });

    afterAll(() => {
      vi.unstubAllGlobals();
    });

    it("should register a message handler when created", () => {
      createMessageBroker();
      expect(functions.onmessage).toEqual(expect.any(Function));
    });
  },
);
