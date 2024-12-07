import { beforeAll, describe, expect, it, vi } from "vitest";
import { JSDOM } from "jsdom";
import { createHiddenElement } from "@ui/utils/dom";
import { downloadFile } from "./download";

vi.mock("@ui/utils/dom", async importOriginal => {
  const original = await importOriginal<typeof import("@ui/utils/dom")>();
  vi.spyOn(original, "createHiddenElement");
  return original;
});

const jsdom = new JSDOM();
describe("downloadFile", () => {
  beforeAll(() => {
    vi.stubGlobal("encodeURIComponent", vi.fn());
    return () => vi.unstubAllGlobals();
  });

  it("click on a hidden anchor with download attributes", async () => {
    const element = jsdom.window.document.createElement("a");
    vi.spyOn(element, "setAttribute");
    vi.spyOn(element, "click").mockImplementation(() => {});

    vi.mocked(encodeURIComponent).mockReturnValue("encoded-data");
    vi.mocked(createHiddenElement).mockReturnValue(element);

    downloadFile("file.txt", "test");

    expect(element.setAttribute).toHaveBeenCalledWith("download", "file.txt");
    expect(element.setAttribute).toHaveBeenCalledWith(
      "href",
      "data:text/plain;charset=utf-8,encoded-data",
    );
    expect(element.click).toHaveBeenCalled();
  });
});
