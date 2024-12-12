import { messageFixtures } from "@common/messages.fixtures";
import { exportCss } from "@plugin/export-css";
import { exportJson } from "@plugin/export-json";
import { exportScopes } from "@plugin/export-scopes";
import { exportTailwind } from "@plugin/export-tailwind";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { main } from "./main";

vi.mock("@plugin/export-tailwind", async importOriginal => {
  const original =
    await importOriginal<typeof import("@plugin/export-tailwind")>();
  vi.spyOn(original, "exportTailwind");
  return original;
});

vi.mock("@plugin/export-css", async importOriginal => {
  const original = await importOriginal<typeof import("@plugin/export-css")>();
  vi.spyOn(original, "exportCss");
  return original;
});

vi.mock("@plugin/export-json", async importOriginal => {
  const original = await importOriginal<typeof import("@plugin/export-json")>();
  vi.spyOn(original, "exportJson");
  return original;
});

vi.mock("@plugin/export-scopes", async importOriginal => {
  const original =
    await importOriginal<typeof import("@plugin/export-scopes")>();
  vi.spyOn(original, "exportScopes");
  return original;
});

const fixtures = { ...messageFixtures };

describe("main", () => {
  beforeAll(() => {
    vi.stubGlobal("figma", { showUI: vi.fn() });
    vi.stubGlobal("__html__", {});
  });

  beforeEach(() => {
    vi.mocked(exportTailwind).mockClear().mockResolvedValue("Tailwind result");
    vi.mocked(exportCss).mockClear().mockResolvedValue("CSS result");
    vi.mocked(exportJson).mockClear().mockResolvedValue("JSON result");
    vi.mocked(exportScopes)
      .mockClear()
      .mockResolvedValue([
        "all-strings",
        "all-numbers",
        "all-colors",
        "all-booleans",
      ]);
  });

  it.each([
    { request: "CSS_REQUEST", result: "CSS_RESULT", expected: "CSS result" },
    { request: "JSON_REQUEST", result: "JSON_RESULT", expected: "JSON result" },
    {
      request: "TAILWIND_REQUEST",
      result: "TAILWIND_RESULT",
      expected: "Tailwind result",
    },
    {
      request: "SCOPE_REQUEST",
      result: "SCOPE_RESULT",
      expected: ["all-strings", "all-numbers", "all-colors", "all-booleans"],
    },
  ])(
    "should post $result when $request is received",
    async ({ request, result, expected }) => {
      const broker = fixtures.createMessageBroker();
      const onResult = vi.fn();

      broker.subscribe(result, onResult);

      main(broker);

      await broker.post(request);

      expect(onResult).toHaveBeenCalledWith(expected);
    },
  );
});
