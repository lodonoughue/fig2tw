import React from "react";
import { messageFixtures } from "@common/messages.fixtures";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CssSection from "./css-section";
import { configProviderFixtures } from "@ui/contexts/config";
import { downloadFile } from "@ui/utils/download";
import userEvent from "@testing-library/user-event";
import { CssRequest, CssResult } from "@common/channels";

vi.mock("@ui/utils/download", async importOriginal => {
  const original = await importOriginal<typeof import("@ui/utils/download")>();
  vi.spyOn(original, "downloadFile");
  return original;
});

const fixtures = { ...messageFixtures, ...configProviderFixtures };

describe("CssSection", () => {
  beforeEach(() => {
    vi.mocked(downloadFile)
      .mockClear()
      .mockImplementation(() => {});
  });

  it("should render CSS_RESULT", () => {
    const broker = fixtures.createMessageBroker();
    broker.subscribe<CssRequest>("CSS_REQUEST", () => {
      broker.post<CssResult>("CSS_RESULT", "under-test");
    });

    const { getByText } = render(<CssSection broker={broker} />);

    expect(getByText("under-test")).toBeDefined();
  });

  it("should download a css file when download button is clicked", async () => {
    const user = userEvent.setup();
    const broker = fixtures.createMessageBroker();
    broker.subscribe<CssRequest>("CSS_REQUEST", () => {
      broker.post<CssResult>("CSS_RESULT", "under-test");
    });

    const { getByRole } = render(<CssSection broker={broker} />);

    const downloadButton = getByRole("button", { name: "Download" });
    await user.click(downloadButton);

    expect(vi.mocked(downloadFile)).toHaveBeenCalledWith(
      "fig2tw.css",
      "under-test",
    );
  });

  it("should reload CSS_RESULT when reload button is clicked", async () => {
    const user = userEvent.setup();
    const broker = fixtures.createMessageBroker();
    broker.subscribe<CssRequest>("CSS_REQUEST", () => {
      broker.post<CssResult>("CSS_RESULT", "under-test");
    });
    vi.spyOn(broker, "post");

    const { getByRole } = render(<CssSection broker={broker} />);
    const downloadButton = getByRole("button", { name: "Reload" });

    vi.mocked(broker.post).mockClear();
    await user.click(downloadButton);

    expect(broker.post).toHaveBeenCalledWith("CSS_RESULT", "under-test");
  });
});
