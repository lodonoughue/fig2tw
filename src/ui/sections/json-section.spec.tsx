import React from "react";
import { messageFixtures } from "@common/messages.fixtures";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { downloadFile } from "@ui/utils/download";
import userEvent from "@testing-library/user-event";
import JsonSection from "./json-section";
import { JsonRequest, JsonResult } from "@common/channels";

vi.mock("@ui/utils/download", async importOriginal => {
  const original = await importOriginal<typeof import("@ui/utils/download")>();
  vi.spyOn(original, "downloadFile");
  return original;
});

const fixtures = { ...messageFixtures };

describe("JsonSection", () => {
  beforeEach(() => {
    vi.mocked(downloadFile)
      .mockClear()
      .mockImplementation(() => {});
  });

  it("should render JSON_RESULT", () => {
    const broker = fixtures.createMessageBroker();
    broker.subscribe<JsonRequest>("JSON_REQUEST", () => {
      broker.post<JsonResult>("JSON_RESULT", "under-test");
    });

    const { getByText } = render(<JsonSection broker={broker} />);

    expect(getByText("under-test")).toBeDefined();
  });

  it("should download a css file when download button is clicked", async () => {
    const user = userEvent.setup();
    const broker = fixtures.createMessageBroker();
    broker.subscribe<JsonRequest>("JSON_REQUEST", () => {
      broker.post<JsonResult>("JSON_RESULT", "under-test");
    });

    const { getByRole } = render(<JsonSection broker={broker} />);

    const downloadButton = getByRole("button", { name: "Download" });
    await user.click(downloadButton);

    expect(vi.mocked(downloadFile)).toHaveBeenCalledWith(
      "fig2tw.json",
      "under-test",
    );
  });

  it("should reload JSON_RESULT when reload button is clicked", async () => {
    const user = userEvent.setup();
    const broker = fixtures.createMessageBroker();
    broker.subscribe<JsonRequest>("JSON_REQUEST", () => {
      broker.post<JsonResult>("JSON_RESULT", "under-test");
    });
    vi.spyOn(broker, "post");

    const { getByRole } = render(<JsonSection broker={broker} />);
    const downloadButton = getByRole("button", { name: "Reload" });

    vi.mocked(broker.post).mockClear();
    await user.click(downloadButton);

    expect(broker.post).toHaveBeenCalledWith("JSON_RESULT", "under-test");
  });
});
