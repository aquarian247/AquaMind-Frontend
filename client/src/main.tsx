import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setDevToken } from "./api";

// Set up development token if in dev mode
if (import.meta.env.DEV) {
  setDevToken().catch(console.error);
}

createRoot(document.getElementById("root")!).render(<App />);
