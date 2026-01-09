import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { ThemeProvider } from "./context/ThemeContext";
import { PreferencesProvider } from "./context/PreferencesContext";
import { ProcessProvider } from "./context/ProcessContext";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ThemeProvider>
      <PreferencesProvider>
        <ProcessProvider>
          <App />
        </ProcessProvider>
      </PreferencesProvider>
    </ThemeProvider>
  </StrictMode>
);
