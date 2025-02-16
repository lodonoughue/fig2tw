import { beforeAll, describe, expect, it, vi } from "vitest";
import { loadDocumentId } from "./document";

beforeAll(() => {
  const root = {
    getPluginData: vi.fn(),
    setPluginData: vi.fn(),
  };
  vi.stubGlobal("figma", { root });
  return () => vi.unstubAllGlobals();
});

describe("loadDocumentId", () => {
  it("should return the default document id if no document id is stored", () => {
    vi.mocked(figma.root.getPluginData).mockReturnValue("");

    const result = loadDocumentId("default-id");
    expect(result).toBe("default-id");
  });

  it("should store the default document id if no document id is stored", () => {
    vi.mocked(figma.root.setPluginData).mockClear();
    vi.mocked(figma.root.getPluginData).mockReturnValue("");

    loadDocumentId("default-id");
    expect(figma.root.setPluginData).toHaveBeenCalledWith(
      "documentId",
      "default-id",
    );
  });

  it("should return the stored document id", () => {
    vi.mocked(figma.root.getPluginData).mockReturnValue("stored-id");

    const result = loadDocumentId("default-id");
    expect(result).toBe("stored-id");
  });
});
