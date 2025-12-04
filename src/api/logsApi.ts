// src/api/logsApi.ts
import { mockApi } from "./mockApi";

export const logsApi = {
  getAll: () => mockApi.getLogs(),
  getByChannel: (ch: string) => mockApi.getLogsByChannel(ch),
};
