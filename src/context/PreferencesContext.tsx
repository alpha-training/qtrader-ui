// src/context/PreferencesContext.tsx
import { createContext, useState } from "react";

export type PrefsContextType = {
  confirmStart: boolean;
  confirmStop: boolean;
  confirmStartAll: boolean;
  confirmStopAll: boolean;

  setPrefs: (p: Partial<PrefsContextType>) => void;
};

export const PreferencesContext = createContext<PrefsContextType>({
  confirmStart: false,
  confirmStop: false,
  confirmStartAll: false,
  confirmStopAll: false,
  setPrefs: () => {},
});

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefsState] = useState<PrefsContextType>({
    confirmStart: false,
    confirmStop: false,
    confirmStartAll: false,
    confirmStopAll: false,
    setPrefs: () => {},
  });

  function setPrefs(update: Partial<PrefsContextType>) {
    setPrefsState((p) => ({ ...p, ...update, setPrefs }));
  }

  return (
    <PreferencesContext.Provider value={{ ...prefs, setPrefs }}>
      {children}
    </PreferencesContext.Provider>
  );
}
