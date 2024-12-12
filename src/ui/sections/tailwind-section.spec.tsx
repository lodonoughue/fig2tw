import React from "react";
import { messageFixtures } from "@common/messages.fixtures";
import { render } from "@testing-library/react";
import { useResult } from "@ui/hooks/use-result";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConfigProvider } from "@ui/contexts/config";
import { downloadFile } from "@ui/utils/download";
import userEvent from "@testing-library/user-event";
import TailwindSection from "./tailwind-section";

vi.mock("@ui/hooks/use-result", async importOriginal => {
  const original =
    await importOriginal<typeof import("@ui/hooks/use-result")>();
  vi.spyOn(original, "useResult");
  return original;
});

vi.mock("@ui/utils/download", async importOriginal => {
  const original = await importOriginal<typeof import("@ui/utils/download")>();
  vi.spyOn(original, "downloadFile");
  return original;
});

const fixtures = { ...messageFixtures };

describe("TailwindSection", () => {
  beforeEach(() => {
    vi.mocked(useResult).mockClear();
    vi.mocked(downloadFile)
      .mockClear()
      .mockImplementation(() => {});
  });

  it("should render TAILWIND_RESULT", () => {
    const broker = fixtures.createMessageBroker();

    vi.mocked(useResult).mockReturnValue({
      result: "under-test",
      isLoading: false,
      reload: vi.fn(),
    });

    const { getByText } = render(<TailwindSection broker={broker} />, {
      wrapper: ConfigProvider,
    });

    expect(getByText("under-test")).toBeDefined();
    expect(useResult).toHaveBeenCalledWith(
      broker,
      "TAILWIND_RESULT",
      "TAILWIND_REQUEST",
      expect.anything(),
    );
  });

  it("should download a css file when download button is clicked", async () => {
    const user = userEvent.setup();
    const broker = fixtures.createMessageBroker();

    vi.mocked(useResult).mockReturnValue({
      result: "under-test",
      isLoading: false,
      reload: vi.fn(),
    });

    const { getByRole } = render(<TailwindSection broker={broker} />, {
      wrapper: ConfigProvider,
    });

    const downloadButton = getByRole("button", { name: "Download" });
    await user.click(downloadButton);

    expect(vi.mocked(downloadFile)).toHaveBeenCalledWith(
      "tailwind.fig2tw.ts",
      "under-test",
    );
  });

  it("should reload TAILWIND_RESULT when reload button is clicked", async () => {
    const user = userEvent.setup();
    const broker = fixtures.createMessageBroker();
    const reload = vi.fn();

    vi.mocked(useResult).mockReturnValue({
      result: "under-test",
      isLoading: false,
      reload,
    });

    const { getByRole } = render(<TailwindSection broker={broker} />, {
      wrapper: ConfigProvider,
    });

    const downloadButton = getByRole("button", { name: "Reload" });
    await user.click(downloadButton);

    expect(reload).toHaveBeenCalled();
  });
});
