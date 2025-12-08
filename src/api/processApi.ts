// src/api/processApi.ts
import { mockApi } from "./mockApi";
import type { Process } from "../types/Process";

export const processApi = {
  getAll: (): Promise<Process[]> => mockApi.getProcesses(),
  start: (name: string) => mockApi.startProcess(name),
  stop: (name: string) => mockApi.stopProcess(name),
  startAll: () => mockApi.startAll(),
  stopAll: () => mockApi.stopAll(),
};
