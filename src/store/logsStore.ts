// src/store/logsStore.ts
import { create } from "zustand";
import type { LogEntry } from "../types/LogEntry";

type LogsStore = {
  logs: LogEntry[];
  pushLog: (entry: LogEntry) => void;
  clearLogs: () => void;
  setLogs: (entries: LogEntry[]) => void;
};

export const useLogsStore = create<LogsStore>((set) => ({
  logs: [],

  pushLog: (entry) =>
    set((state) => ({
      logs: [...state.logs, entry],
    })),

  clearLogs: () => set({ logs: [] }),

  setLogs: (entries) => set({ logs: entries }),
}));

export type { LogEntry };
