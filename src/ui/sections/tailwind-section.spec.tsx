import React from "react";
import { messageFixtures } from "@common/messages.fixtures";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { downloadFile } from "@ui/utils/download";
import userEvent from "@testing-library/user-event";
import TailwindSection from "./tailwind-section";
import { TailwindRequest, TailwindResult } from "@common/channels";

vi.mock("@ui/utils/download", async importOriginal => {
  const original = await importOriginal<typeof import("@ui/utils/download")>();
  vi.spyOn(original, "downloadFile");
  return original;
});

const fixtures = { ...messageFixtures };

describe("TailwindSection", () => {
  beforeEach(() => {
    vi.mocked(downloadFile)
      .mockClear()
      .mockImplementation(() => {});
  });

  it("should render TAILWIND_RESULT", () => {
    const broker = fixtures.createMessageBroker();
    broker.subscribe<TailwindRequest>("TAILWIND_REQUEST", () => {
      broker.post<TailwindResult>("TAILWIND_RESULT", "under-test");
    });

    const { getByText } = render(<TailwindSection broker={broker} />);

    expect(getByText("under-test")).toBeDefined();
  });

  it("should download a css file when download button is clicked", async () => {
    const user = userEvent.setup();
    const broker = fixtures.createMessageBroker();
    broker.subscribe<TailwindRequest>("TAILWIND_REQUEST", () => {
      broker.post<TailwindResult>("TAILWIND_RESULT", "under-test");
    });

    const { getByRole } = render(<TailwindSection broker={broker} />);

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
    broker.subscribe<TailwindRequest>("TAILWIND_REQUEST", () => {
      broker.post<TailwindResult>("TAILWIND_RESULT", "under-test");
    });
    vi.spyOn(broker, "post");

    const { getByRole } = render(<TailwindSection broker={broker} />);
    const downloadButton = getByRole("button", { name: "Reload" });

    vi.mocked(broker.post).mockClear();
    await user.click(downloadButton);

    expect(broker.post).toHaveBeenCalledWith("TAILWIND_RESULT", "under-test");
  });
});
