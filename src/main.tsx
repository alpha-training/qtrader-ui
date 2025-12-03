import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { ThemeProvider } from "./context/ThemeContext";
import { PrefsProvider } from "./context/PreferencesContext";
import { ProcessProvider } from "./context/ProcessContext";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <PrefsProvider>
        <ProcessProvider>
          <App />
        </ProcessProvider>
      </PrefsProvider>
    </ThemeProvider>
  </StrictMode>
);

