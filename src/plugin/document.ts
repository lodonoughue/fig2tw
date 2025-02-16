const DOCUMENT_ID_KEY = "documentId";

export function loadDocumentId(defaultId: string): string {
  const documentId = figma.root.getPluginData(DOCUMENT_ID_KEY);
  if (documentId) {
    return documentId;
  }

  figma.root.setPluginData(DOCUMENT_ID_KEY, defaultId);
  return defaultId;
}
