import { Config } from "@common/config";
import { createMessageBroker } from "@common/messages";
import {
  CssRequest,
  CssResult,
  JsonRequest,
  JsonResult,
  ScopeRequest,
  ScopeResult,
  TailwindRequest,
  TailwindResult,
} from "@common/types";
import { exportTailwind } from "@plugin/export-tailwind";
import { exportCss } from "@plugin/export-css";
import { exportJson } from "@plugin/export-json";
import { exportScopes } from "@plugin/export-scopes";

export function main(broker = createMessageBroker()) {
  console.clear();

  broker.subscribe<TailwindRequest>(
    "TAILWIND_REQUEST",
    async (config: Config) => {
      const result = await exportTailwind(config);
      broker.post<TailwindResult>("TAILWIND_RESULT", result);
    },
  );

  broker.subscribe<CssRequest>("CSS_REQUEST", async (config: Config) => {
    const result = await exportCss(config);
    broker.post<CssResult>("CSS_RESULT", result);
  });

  broker.subscribe<JsonRequest>("JSON_REQUEST", async (config: Config) => {
    const result = await exportJson(config);
    broker.post<JsonResult>("JSON_RESULT", result);
  });

  broker.subscribe<ScopeRequest>("SCOPE_REQUEST", async () => {
    const result = await exportScopes();
    broker.post<ScopeResult>("SCOPE_RESULT", result);
  });

  figma.showUI(__html__, { width: 640, height: 712 });
}
