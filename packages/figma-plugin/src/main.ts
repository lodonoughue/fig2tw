import { emit, once, showUI } from "@create-figma-plugin/utilities";
import { DownloadFileHandler, GenerateJsonHandler } from "./types.js";

export default function () {
  console.clear();

  once<GenerateJsonHandler>("GENERATE_JSON", async function (count: number) {
    const json = await generateJson();
    emit<DownloadFileHandler>("DOWNLOAD_FILE", json);
  });

  showUI({ width: 512, height: 880 });
}

async function generateJson() {
  return "{}";
}
