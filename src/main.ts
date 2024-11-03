import {
  TailwindRequest,
  CssRequest,
  JsonRequest,
  TailwindResult,
  CssResult,
  JsonResult,
  ScopeRequest,
  ScopeResult,
} from "@common/types";
import { createMessageBroker } from "@common/messages";
import { exportCss } from "@plugin/export-css";
import { exportJson } from "@plugin/export-json";
import { exportTailwind } from "@plugin/export-tailwind";
import { Config } from "@common/config";
import { exportScopes } from "@plugin/export-scopes";

(function main() {
  console.clear();
  const broker = createMessageBroker();

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
})();
