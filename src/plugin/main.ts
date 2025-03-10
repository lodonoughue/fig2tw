import { Config } from "@common/config";
import { createMessageBroker } from "@common/messages";
import {
  CssRequest,
  CssResult,
  DocumentIdRequest,
  DocumentIdResult,
  JsonRequest,
  JsonResult,
  LoadConfigRequest,
  LoadConfigResult,
  SaveConfigRequest,
  TailwindRequest,
  TailwindResult,
} from "@common/types";
import { exportTailwind } from "@plugin/export-tailwind";
import { exportCss } from "@plugin/export-css";
import { exportJson } from "@plugin/export-json";
import { exportScopes } from "@plugin/export-scopes";
import { loadConfig, saveConfig } from "./config";
import { loadDocumentId } from "./document";

const defaultBroker = createMessageBroker();
export function main(broker = defaultBroker) {
  console.clear();

  broker.subscribe<DocumentIdRequest>(
    "DOCUMENT_ID_REQUEST",
    (defaultId: string) => {
      const documentId = loadDocumentId(defaultId);
      broker.post<DocumentIdResult>("DOCUMENT_ID_RESULT", documentId);
    },
  );

  broker.subscribe<TailwindRequest>("TAILWIND_REQUEST", async () => {
    const config = loadConfig();
    const result = await exportTailwind(config);
    broker.post<TailwindResult>("TAILWIND_RESULT", result);
  });

  broker.subscribe<CssRequest>("CSS_REQUEST", async () => {
    const config = loadConfig();
    const result = await exportCss(config);
    broker.post<CssResult>("CSS_RESULT", result);
  });

  broker.subscribe<JsonRequest>("JSON_REQUEST", async () => {
    const config = loadConfig();
    const result = await exportJson(config);
    broker.post<JsonResult>("JSON_RESULT", result);
  });

  broker.subscribe<LoadConfigRequest>("LOAD_CONFIG_REQUEST", async () => {
    const config = loadConfig();
    const scopes = await exportScopes();
    broker.post<LoadConfigResult>("LOAD_CONFIG_RESULT", { config, scopes });
  });

  broker.subscribe<SaveConfigRequest>(
    "SAVE_CONFIG_REQUEST",
    async (config: Config) => {
      const sanitized = saveConfig(config);
      const scopes = await exportScopes();
      broker.post("LOAD_CONFIG_RESULT", { config: sanitized, scopes });
    },
  );

  figma.showUI(__html__, { width: 640, height: 712 });
}
