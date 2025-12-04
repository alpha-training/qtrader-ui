// src/store/logsStore.ts
import { create } from "zustand";
import type { LogEntry } from "../types/LogEntry";

type LogsStore = {
  logs: LogEntry[];
  addLog: (entry: LogEntry) => void;
  clearLogs: () => void;
};

export const useLogsStore = create<LogsStore>((set) => ({
  logs: [],

  addLog: (entry) =>
    set((state) => ({
      logs: [...state.logs, entry],
    })),

  clearLogs: () => set({ logs: [] }),
}));
