import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useResult } from "./use-result";
import { messageFixtures } from "@common/messages.fixtures";
import { act } from "react";

const fixtures = { ...messageFixtures };

describe("useResult", () => {
  it("should return isLoading at first render", () => {
    const broker = fixtures.createMessageBroker();
    broker.subscribe("request", () => {});

    const { result } = renderHook(() => useResult(broker, "result", "request"));

    expect(result.current.result).toBe(null);
    expect(result.current.isLoading).toBe(true);
  });

  it("should return result when it is received", async () => {
    const broker = fixtures.createMessageBroker();
    broker.subscribe("request", () => {});

    const { result } = renderHook(() => useResult(broker, "result", "request"));

    await act(() => broker.post("result", "under-test"));

    expect(result.current.result).toBe("under-test");
    expect(result.current.isLoading).toBe(false);
  });

  it("should send back the request when reload is called", () => {
    const onRequest = vi.fn();
    const broker = fixtures.createMessageBroker();
    broker.subscribe("request", onRequest);

    const { result } = renderHook(() => useResult(broker, "result", "request"));

    act(() => result.current.reload());

    expect(onRequest).toHaveBeenCalledTimes(2);
  });

  it("should unsubscribe when unmounted", () => {
    const broker = fixtures.createMessageBroker();
    broker.subscribe("request", () => {});

    const { rerender, unmount } = renderHook(() =>
      useResult(broker, "result", "request"),
    );

    expect(broker.subscriptions.result).toHaveLength(1);

    rerender();
    expect(broker.subscriptions.result).toHaveLength(1);

    unmount();
    expect(broker.subscriptions.result).toHaveLength(0);
  });
});
