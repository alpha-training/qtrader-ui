// src/store/logsStore.ts
import { create } from "zustand";
import type { WSLogEntry } from "../types/wsTypes";

export type LogsState = {
  logs: WSLogEntry[];
  pushLog: (log: WSLogEntry) => void;
  clearLogs: () => void;
};

export const useLogsStore = create<LogsState>((set) => ({
  logs: [],

  pushLog: (log) =>
    set((state) => ({
      logs: [...state.logs, log],
    })),

  clearLogs: () =>
    set(() => ({
      logs: [],
    })),
}));
