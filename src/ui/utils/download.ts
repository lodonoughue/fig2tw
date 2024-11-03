import { createHiddenElement } from "./dom";

export function downloadFile(filename: string, value: string) {
  const encodedData = encodeURIComponent(value);
  const element = createHiddenElement("a");

  try {
    element.setAttribute("download", filename);
    element.setAttribute(
      "href",
      `data:text/plain;charset=utf-8,${encodedData}`,
    );
    element.click();
  } finally {
    element.remove();
  }
}
