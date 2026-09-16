import React from "react";
import { render, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AnalyticsProvider, useAnalytics } from "./analytics";
import { messageFixtures } from "@common/messages.fixtures";
import { DocumentIdRequest, DocumentIdResult } from "@common/types";
import mixpanel from "mixpanel-figma";

const { mockMixpanel } = vi.hoisted(() => {
  const mockMixpanel = {
    init: vi.fn(),
    identify: vi.fn(),
    track: vi.fn(),
  };
  mockMixpanel.init.mockImplementation(() => mockMixpanel);
  return { mockMixpanel };
});

vi.mock("mixpanel-figma", () => ({ default: mockMixpanel }));

const fixtures = { ...messageFixtures };

beforeEach(() => {
  vi.mocked(mixpanel.init)
    .mockClear()
    .mockImplementation(() => mixpanel);

  vi.mocked(mixpanel.identify)
    .mockClear()
    .mockImplementation(() => {});

  vi.mocked(mixpanel.track)
    .mockClear()
    .mockImplementation(() => {});
});

describe("AnalyticsProvider", () => {
  it("should not render children until document id is set", () => {
    const broker = fixtures.createMessageBroker();
    broker.subscribe<DocumentIdRequest>("DOCUMENT_ID_REQUEST", () => {
      // do not post DOCUMENT_ID_RESULT
    });

    const { queryByText } = render(
      <AnalyticsProvider broker={broker} section="<mocked>">
        under-test
      </AnalyticsProvider>,
    );

    expect(queryByText("under-test")).toBeNull();
  });

  it("should render children when document id is set", () => {
    const broker = fixtures.createMessageBroker();
    broker.subscribe<DocumentIdRequest>("DOCUMENT_ID_REQUEST", () => {
      broker.post<DocumentIdResult>("DOCUMENT_ID_RESULT", "mocked-document-id");
    });

    const { queryByText } = render(
      <AnalyticsProvider broker={broker} section="<mocked>">
        under-test
      </AnalyticsProvider>,
    );

    expect(queryByText("under-test")).not.toBeNull();
  });

  it("should initialize mixpanel when document id is set", () => {
    const broker = fixtures.createMessageBroker();
    broker.subscribe<DocumentIdRequest>("DOCUMENT_ID_REQUEST", () => {
      broker.post<DocumentIdResult>("DOCUMENT_ID_RESULT", "mocked-document-id");
    });

    render(<AnalyticsProvider broker={broker} section="<mocked>" />);

    expect(mixpanel.init).toHaveBeenCalledTimes(1);
    expect(mixpanel.identify).toHaveBeenCalledWith("mocked-document-id");
  });
});

describe("useAnalytics", () => {
  it("should throw if used outside of AnalyticsProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useAnalytics())).toThrow(
      "useAnalytics must be used within a AnalyticsProvider",
    );
  });

  it("should track event with mixpanel", () => {
    const broker = fixtures.createMessageBroker();
    broker.subscribe<DocumentIdRequest>("DOCUMENT_ID_REQUEST", () => {
      broker.post<DocumentIdResult>("DOCUMENT_ID_RESULT", "mocked-document-id");
    });

    const { result } = renderHook(() => useAnalytics(), {
      wrapper: props => (
        <AnalyticsProvider
          broker={broker}
          section="mocked-section"
          {...props}
        />
      ),
    });

    result.current.track("mocked-event");

    expect(mixpanel.track).toHaveBeenCalledWith(
      "mocked-event",
      expect.anything(),
    );
  });

  it("should always track current section name", () => {
    const broker = fixtures.createMessageBroker();
    broker.subscribe<DocumentIdRequest>("DOCUMENT_ID_REQUEST", () => {
      broker.post<DocumentIdResult>("DOCUMENT_ID_RESULT", "mocked-document-id");
    });

    const { result } = renderHook(() => useAnalytics(), {
      wrapper: props => (
        <AnalyticsProvider
          broker={broker}
          section="mocked-section"
          {...props}
        />
      ),
    });

    result.current.track("mocked-event");

    expect(mixpanel.track).toHaveBeenCalledWith("mocked-event", {
      "Section Name": "mocked-section",
    });
  });

  it("should track current section name with custom properties", () => {
    const broker = fixtures.createMessageBroker();
    broker.subscribe<DocumentIdRequest>("DOCUMENT_ID_REQUEST", () => {
      broker.post<DocumentIdResult>("DOCUMENT_ID_RESULT", "mocked-document-id");
    });

    const { result } = renderHook(() => useAnalytics(), {
      wrapper: props => (
        <AnalyticsProvider
          broker={broker}
          section="mocked-section"
          {...props}
        />
      ),
    });

    result.current.track("mocked-event", { Foo: "Bar" });

    expect(mixpanel.track).toHaveBeenCalledWith("mocked-event", {
      "Section Name": "mocked-section",
      Foo: "Bar",
    });
  });
});
