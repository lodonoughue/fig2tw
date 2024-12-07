import { beforeAll, describe, expect, it, vi } from "vitest";
import { createHiddenElement } from "./dom";

describe("createHiddenElement", () => {
  beforeAll(() => {
    const document = {
      createElement: vi.fn(),
      body: { appendChild: vi.fn() },
    };
    vi.stubGlobal("document", document);
    return () => vi.unstubAllGlobals();
  });

  it("should create an element with the given tag name", () => {
    vi.mocked(document.createElement).mockReturnValue({
      style: {},
    } as HTMLElement);

    const element = createHiddenElement("div");

    expect(document.createElement).toHaveBeenCalledWith("div");
    expect(document.body.appendChild).toHaveBeenCalledWith(element);
  });
});
