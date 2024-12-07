import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { copyToClipboard } from "./clipboard";
import { createHiddenElement } from "./dom";
import { JSDOM } from "jsdom";

vi.mock("@ui/utils/dom", async importOriginal => {
  const original = await importOriginal<typeof import("@ui/utils/dom")>();
  vi.spyOn(original, "createHiddenElement");
  return original;
});

describe("copyToClipboard (legacy)", () => {
  beforeEach(() => {
    const jsdom = new JSDOM();
    const document = jsdom.window.document;
    document.execCommand = vi.fn().mockReturnValue(true);
    vi.stubGlobal("document", document);
    return () => vi.unstubAllGlobals();
  });

  it("should copy the value to the clipboard", async () => {
    const element = document.createElement("textarea");

    vi.mocked(createHiddenElement).mockReturnValue(element);

    await copyToClipboard("test");

    expect(element.value).toBe("test");
    expect(document.execCommand).toHaveBeenCalledWith("copy");
  });

  it("should throw when execCommand failed", async () => {
    const element = document.createElement("textarea");
    vi.mocked(createHiddenElement).mockReturnValue(element);
    vi.mocked(document.execCommand).mockReturnValue(false);

    expect(() => copyToClipboard("test")).rejects.toThrow();
  });

  it("should focus the previously active element", async () => {
    // Mock the active element
    const previousActiveElement = document.createElement("button");
    vi.spyOn(document, "activeElement", "get").mockReturnValue(
      previousActiveElement,
    );

    vi.mocked(document.execCommand).mockReturnValue(true);

    const element = document.createElement("textarea");
    vi.mocked(createHiddenElement).mockReturnValue(element);

    await copyToClipboard("test");

    expect(document.activeElement).toBe(previousActiveElement);
  });
});

describe("copyToClipboard (navigator)", () => {
  beforeAll(() => {
    vi.stubGlobal("window", { isSecureContext: true });
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn() } });
    return () => vi.unstubAllGlobals();
  });

  it("should copy the value to the clipboard", async () => {
    vi.mocked(navigator.clipboard.writeText).mockResolvedValue();

    copyToClipboard("test");
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test");
  });
});
