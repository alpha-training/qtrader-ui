// src/main.tsx (or wherever you render <App />)
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { ThemeProvider } from "./context/ThemeContext";
import { PrefsProvider } from "./context/PreferencesContext";
import { ProcessProvider } from "./context/ProcessContext";
import { LogProvider } from "./context/LogContext";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ThemeProvider>
      <PrefsProvider>
        <ProcessProvider>
          <LogProvider>
            <App />
          </LogProvider>
        </ProcessProvider>
      </PrefsProvider>
    </ThemeProvider>
  </StrictMode>
);
