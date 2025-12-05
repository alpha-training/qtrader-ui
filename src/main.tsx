// src/main.tsx (or wherever you render <App />)
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { ThemeProvider } from "./context/ThemeContext";
import { PreferencesProvider } from "./context/PreferencesContext";
import { ProcessProvider } from "./context/ProcessContext";
import { LogProvider } from "./context/LogContext";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ThemeProvider>
      <PreferencesProvider>
        <ProcessProvider>
          <LogProvider>
            <App />
          </LogProvider>
        </ProcessProvider>
      </PreferencesProvider>
    </ThemeProvider>
  </StrictMode>
);
