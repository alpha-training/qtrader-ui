// src/store/logsStore.ts
import { create } from "zustand";
import type { LogEntry } from "../types/LogEntry";

export type ChannelLogStatus = {
  available: boolean;
  lastError?: string | null;
  updatedAt: number;
};

type LogsState = {
  logs: LogEntry[];
  channelStatus: Record<string, ChannelLogStatus>;

  pushLog: (l: LogEntry) => void;
  pushMany: (batch: LogEntry[]) => void;

  clearLogs: () => void;
  prependLogs: (older: LogEntry[]) => void;
};

function tryParseStatusMessage(msg: string): { available: boolean; error?: string | null } | null {
  try {
    const obj = JSON.parse(msg);
    if (typeof obj?.available === "boolean") {
      return { available: obj.available, error: obj.error ?? null };
    }
    return null;
  } catch {
    return null;
  }
}

export const useLogsStore = create<LogsState>((set) => ({
  logs: [],
  channelStatus: {},

  pushLog: (l) =>
    set((s) => {
      // Special internal event to update per-channel availability
      if (l.type === "log_status") {
        const parsed = tryParseStatusMessage(l.message);
        if (!parsed) return s;

        return {
          ...s,
          channelStatus: {
            ...s.channelStatus,
            [l.channel]: {
              available: parsed.available,
              lastError: parsed.error ?? null,
              updatedAt: Date.now(),
            },
          },
        };
      }

      return { ...s, logs: [...s.logs, l] };
    }),

  pushMany: (batch) =>
    set((s) => {
      if (!batch.length) return s;

      const nextLogs: LogEntry[] = [];
      const nextStatus = { ...s.channelStatus };

      for (const l of batch) {
        if (l.type === "log_status") {
          const parsed = tryParseStatusMessage(l.message);
          if (!parsed) continue;

          nextStatus[l.channel] = {
            available: parsed.available,
            lastError: parsed.error ?? null,
            updatedAt: Date.now(),
          };
        } else {
          nextLogs.push(l);
        }
      }

      return {
        logs: [...s.logs, ...nextLogs],
        channelStatus: nextStatus,
      };
    }),

  clearLogs: () => set({ logs: [] }),

  prependLogs: (older) =>
    set((s) => ({
      logs: [...older, ...s.logs],
    })),
}));
