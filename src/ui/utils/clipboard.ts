import { createHiddenElement } from "./dom";

export async function copyToClipboard(value: string) {
  if (
    window.isSecureContext &&
    typeof navigator?.clipboard?.writeText === "function"
  ) {
    return await navigator.clipboard.writeText(value);
  }

  return await unsecuredCopyToClipboard(value);
}

async function unsecuredCopyToClipboard(value: string) {
  const activeElement = document.activeElement;
  const textArea = createHiddenElement("textarea");

  try {
    textArea.value = value;
    textArea.focus();
    textArea.select();

    if (document.execCommand("copy")) {
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  } finally {
    textArea.remove();
    if (
      activeElement != null &&
      "focus" in activeElement &&
      typeof activeElement.focus === "function"
    ) {
      activeElement.focus();
    }
  }
}
