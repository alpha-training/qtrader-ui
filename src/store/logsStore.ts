// src/store/logsStore.ts
import { create } from "zustand";
import type { LogEntry } from "../types/LogEntry";

type LogsState = {
  logs: LogEntry[];

  pushLog: (l: LogEntry) => void;
  pushMany: (batch: LogEntry[]) => void;

  clearLogs: () => void;
  prependLogs: (older: LogEntry[]) => void;
};

export const useLogsStore = create<LogsState>((set) => ({
  logs: [],

  pushLog: (l) =>
    set((s) => ({
      logs: [...s.logs, l],
    })),

  // ⭐ NEW: Efficient batch add for log buffering
  pushMany: (batch) =>
    set((s) => ({
      logs: [...s.logs, ...batch],
    })),

  clearLogs: () => set({ logs: [] }),

  prependLogs: (older) =>
    set((s) => ({
      logs: [...older, ...s.logs],
    })),
}));
