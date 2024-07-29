import { EventHandler } from "@create-figma-plugin/utilities";

export interface GenerateJsonHandler extends EventHandler {
  name: "GENERATE_JSON";
  handler: (count: number) => void;
}

export interface DownloadFileHandler extends EventHandler {
  name: "DOWNLOAD_FILE";
  handler: (file: string) => void;
}
