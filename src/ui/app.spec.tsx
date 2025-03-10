import { messageFixtures } from "@common/messages.fixtures";
import {
  CssRequest,
  CssResult,
  DocumentIdRequest,
  DocumentIdResult,
  JsonRequest,
  JsonResult,
  LoadConfigRequest,
  TailwindRequest,
  TailwindResult,
} from "@common/types";
import { describe, expect, it, vi } from "vitest";
import App from "./app";
import { render } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";

const fixtures = { ...messageFixtures };

vi.mock("mixpanel-figma", async importOriginal => {
  const original = await importOriginal<typeof import("mixpanel-figma")>();
  vi.spyOn(original, "init").mockImplementation(() => original);
  vi.spyOn(original, "identify").mockImplementation(() => {});
  vi.spyOn(original, "track").mockImplementation(() => {});
  return { default: original };
});

describe("App", () => {
  it.each([
    { tab: "Tailwind", defaultTab: "CSS", expectedResult: "Tailwind result" },
    { tab: "CSS", defaultTab: "JSON", expectedResult: "CSS result" },
    { tab: "JSON", defaultTab: "Tailwind", expectedResult: "JSON result" },
  ] as const)(
    "should navigate to $tab tab",
    async ({ tab, defaultTab, expectedResult }) => {
      const user = userEvent.setup();
      const broker = fixtures.createMessageBroker();

      broker.subscribe<LoadConfigRequest>("LOAD_CONFIG_REQUEST", () => {});

      broker.subscribe<DocumentIdRequest>("DOCUMENT_ID_REQUEST", () => {
        broker.post<DocumentIdResult>("DOCUMENT_ID_RESULT", "User ID result");
      });

      broker.subscribe<TailwindRequest>("TAILWIND_REQUEST", () => {
        broker.post<TailwindResult>("TAILWIND_RESULT", "Tailwind result");
      });

      broker.subscribe<CssRequest>("CSS_REQUEST", () => {
        broker.post<CssResult>("CSS_RESULT", "CSS result");
      });

      broker.subscribe<JsonRequest>("JSON_REQUEST", () => {
        broker.post<JsonResult>("JSON_RESULT", "JSON result");
      });

      const { getByRole, getByText } = render(
        <App broker={broker} defaultTab={defaultTab} />,
      );

      const tabButton = getByRole("tab", { name: tab });

      await user.click(tabButton);

      expect(getByText(expectedResult)).toBeDefined();
    },
  );
});
