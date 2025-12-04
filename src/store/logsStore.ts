// src/store/logsStore.ts
import { create } from "zustand";

export type LogLevel = "INFO" | "ERROR";

export type LogEntry = {
  timestamp: string;
  level: LogLevel;
  message: string;
  channel: string;
};

type LogsStore = {
  logs: LogEntry[];
  pushLog: (entry: LogEntry) => void;
  clear: () => void;
};

export const useLogsStore = create<LogsStore>((set) => ({
  logs: [],
  pushLog: (entry) =>
    set((state) => ({
      logs: [...state.logs, entry],
    })),
  clear: () => set({ logs: [] }),
}));
