// src/store/logsStore.ts
import { create } from "zustand";
import type { LogEntry } from "../types/LogEntry";

type LogsState = {
  logs: LogEntry[];
  pushLog: (l: LogEntry) => void;
  clearLogs: () => void;
};

export const useLogsStore = create<LogsState>((set) => ({
  logs: [],
  pushLog: (l) => set((s) => ({ logs: [...s.logs, l] })),
  clearLogs: () => set({ logs: [] }),
}));
