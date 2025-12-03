import React, { createContext, useContext, useState, useEffect } from "react";
import type { Prefs } from "../types/PrefsTypes";

const defaultPrefs: Prefs = {
  confirmStart: false,
  confirmStop: false,
  confirmStartAll: false,
  confirmStopAll: false,
};

type PrefsContextType = {
  prefs: Prefs;
  setPrefs: (newPrefs: Partial<Prefs>) => void;
};

const PrefsContext = createContext<PrefsContextType>({
  prefs: defaultPrefs,
  setPrefs: () => {},
});

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefsState] = useState<Prefs>(() => {
    try {
      const saved = localStorage.getItem("qt_prefs");
      return saved ? JSON.parse(saved) : defaultPrefs;
    } catch {
      return defaultPrefs;
    }
  });

  const setPrefs = (newPrefs: Partial<Prefs>) => {
    setPrefsState(prev => {
      const updated = { ...prev, ...newPrefs };
      localStorage.setItem("qt_prefs", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <PrefsContext.Provider value={{ prefs, setPrefs }}>
      {children}
    </PrefsContext.Provider>
  );
}

export const usePrefs = () => useContext(PrefsContext);
