// src/api/mockApi.ts
import type { Process } from "../types/Process";
import type { LogEntry } from "../types/LogEntry";

let mockProcesses: Process[] = [
  { name: "tp1", host: "localhost", port: 5010, status: "down", pid: null, mem: null },
  { name: "rdb", host: "localhost", port: 5012, status: "down", pid: null, mem: null },
  { name: "wdb", host: "localhost", port: 5013, status: "down", pid: null, mem: null },
  { name: "hdb1", host: "localhost", port: 5013, status: "up", pid: 3516, mem: "64 kB / 128 kB" },
];

let mockLogs: LogEntry[] = [
  { timestamp: "09:12:14", level: "INFO", message: "heartbeat ok", channel: "rdb1" },
  { timestamp: "09:12:15", level: "INFO", message: "trade matched", channel: "tp1" },
  { timestamp: "09:12:16", level: "ERROR", message: "disconnect detected", channel: "tp2" },
];

function wait(ms = 300) {
  return new Promise((res) => setTimeout(res, ms));
}

export const mockApi = {
  async getProcesses() {
    await wait();
    return JSON.parse(JSON.stringify(mockProcesses));
  },

  async startProcess(name: string) {
    await wait();
    mockProcesses = mockProcesses.map((p) =>
      p.name === name
        ? { ...p, status: "up", pid: Math.floor(Math.random() * 5000) }
        : p
    );
    return true;
  },

  async stopProcess(name: string) {
    await wait();
    mockProcesses = mockProcesses.map((p) =>
      p.name === name ? { ...p, status: "down", pid: null } : p
    );
    return true;
  },

  async startAll() {
    await wait();
    mockProcesses = mockProcesses.map((p) => ({
      ...p,
      status: "up",
      pid: Math.floor(Math.random() * 5000),
    }));
    return true;
  },

  async stopAll() {
    await wait();
    mockProcesses = mockProcesses.map((p) => ({
      ...p,
      status: "down",
      pid: null,
    }));
    return true;
  },

  async getLogs() {
    await wait();
    return JSON.parse(JSON.stringify(mockLogs));
  },

  async getLogsByChannel(ch: string) {
    await wait();
    return mockLogs.filter((l) => l.channel === ch);
  },
};
