// src/api/logsApi.ts
import { mockApi } from "./mockApi";
import type { LogEntry } from "../types/LogEntry";

export const logsApi = {
  getAll: (): Promise<LogEntry[]> => mockApi.getLogs(),
  getByChannel: (ch: string): Promise<LogEntry[]> =>
    mockApi.getLogsByChannel(ch),
};
