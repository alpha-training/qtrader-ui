// src/hooks/usePrefs.ts
import { useContext } from "react";
import { PreferencesContext } from "../context/PreferencesContext";

export function usePrefs() {
  return useContext(PreferencesContext);
}
