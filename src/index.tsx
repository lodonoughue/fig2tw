/* v8 ignore start */
// Coverage is not calculated for this file because it is the entry point of the
// UI application

import React from "react";
import { createRoot } from "react-dom/client";
import App from "@ui/app";

const root = createRoot(document.getElementById("app")!);
root.render(<App />);
