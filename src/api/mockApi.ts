// src/api/mockApi.ts

import type { Process } from "../types/Process";
import type { LogEntry } from "../types/LogEntry";

let mockProcesses: Process[] = [
  { name: "tp1", host: "localhost", port: 5010, status: "up", pid: 3150, mem: "42 MB / 128 MB" },
  { name: "tp2", host: "localhost", port: 5011, status: "down", pid: null, mem: null },
  { name: "rdb1", host: "localhost", port: 5020, status: "up", pid: 3221, mem: "64 MB / 256 MB" },
  { name: "rdb2", host: "localhost", port: 5021, status: "up", pid: 3571, mem: "71 MB / 256 MB" },
  { name: "wdb1", host: "localhost", port: 5030, status: "down", pid: null, mem: null },
  { name: "wdb2", host: "localhost", port: 5031, status: "up", pid: 1361, mem: "58 MB / 256 MB" },
  { name: "hdb1", host: "localhost", port: 5040, status: "up", pid: 3750, mem: "92 MB / 512 MB" },
  { name: "hdb2", host: "localhost", port: 5041, status: "down", pid: null, mem: null },
  { name: "pxfeed", host: "localhost", port: 5050, status: "up", pid: 4540, mem: "37 MB / 128 MB" },
  { name: "oms", host: "localhost", port: 5060, status: "up", pid: 3734, mem: "120 MB / 512 MB" },
];

let mockLogs: LogEntry[] = [
  { timestamp: "09:12:14", level: "INFO",  message: "heartbeat ok", channel: "rdb1" },
  { timestamp: "09:12:14", level: "INFO",  message: "received market snapshot for AAPL", channel: "pxfeed" },
  { timestamp: "09:12:15", level: "INFO",  message: "trade matched: AAPL 100 @ 191.22", channel: "tp1" },
  { timestamp: "09:12:16", level: "ERROR", message: "connection timeout to venue CME", channel: "tp2" },
  { timestamp: "09:12:17", level: "INFO",  message: "writing batch to hdb", channel: "hdb1" },
  { timestamp: "09:12:18", level: "INFO",  message: "order updated: #482913 status=FILLED", channel: "oms" },
  { timestamp: "09:12:19", level: "INFO",  message: "processing 245 tick updates", channel: "pxfeed" },
  { timestamp: "09:12:20", level: "ERROR", message: "wdb2 out of sync with rdb1", channel: "wdb2" },
  { timestamp: "09:12:21", level: "INFO",  message: "risk check passed for order #482913", channel: "risk" },
  { timestamp: "09:12:22", level: "INFO",  message: "audit log write successful", channel: "audit" },
];

function wait(ms = 300) {
  return new Promise((res) => setTimeout(res, ms));
}

export const mockApi = {
  async getProcesses(): Promise<Process[]> {
    await wait();
    return JSON.parse(JSON.stringify(mockProcesses));
  },

  async startProcess(name: string): Promise<boolean> {
    await wait();
    mockProcesses = mockProcesses.map((p) =>
      p.name === name
        ? {
            ...p,
            status: "up",
            pid: 2000 + Math.floor(Math.random() * 4000),
            mem: "64 MB / 128 MB",
          }
        : p
    );
    return true;
  },

  async stopProcess(name: string): Promise<boolean> {
    await wait();
    mockProcesses = mockProcesses.map((p) =>
      p.name === name ? { ...p, status: "down", pid: null, mem: null } : p
    );
    return true;
  },

  async startAll(): Promise<boolean> {
    await wait();
    mockProcesses = mockProcesses.map((p) => ({
      ...p,
      status: "up",
      pid: 2000 + Math.floor(Math.random() * 4000),
      mem: "64 MB / 128 MB",
    }));
    return true;
  },

  async stopAll(): Promise<boolean> {
    await wait();
    mockProcesses = mockProcesses.map((p) => ({
      ...p,
      status: "down",
      pid: null,
      mem: null,
    }));
    return true;
  },

  async getLogs(): Promise<LogEntry[]> {
    await wait();
    return JSON.parse(JSON.stringify(mockLogs));
  },

  async getLogsByChannel(ch: string): Promise<LogEntry[]> {
    await wait();
    if (ch === "All") {
      return JSON.parse(JSON.stringify(mockLogs));
    }
    return mockLogs.filter((l) => l.channel === ch);
  },
};
