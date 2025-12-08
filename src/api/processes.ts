// src/api/processes.ts
import { apiGet, apiPost } from "./client";
import type { Process } from "../types/Process";

export async function fetchProcesses(): Promise<Process[]> {
  try {
    return await apiGet("/processes");
  } catch {
    return mockProcesses;
  }
}

export async function startProcessAPI(name: string) {
  try {
    return await apiPost(`/processes/${name}/start`);
  } catch {
    console.warn("Mock start:", name);
    return { success: true };
  }
}

export async function stopProcessAPI(name: string) {
  try {
    return await apiPost(`/processes/${name}/stop`);
  } catch {
    console.warn("Mock stop:", name);
    return { success: true };
  }
}

export async function startAllAPI() {
  try {
    return await apiPost("/processes/start-all");
  } catch {
    console.warn("Mock start-all");
    return { success: true };
  }
}

export async function stopAllAPI() {
  try {
    return await apiPost("/processes/stop-all");
  } catch {
    console.warn("Mock stop-all");
    return { success: true };
  }
}

export const mockProcesses: Process[] = [
  { name: "tp1", host: "localhost", port: 5010, status: "up" },
  { name: "tp2", host: "localhost", port: 5011, status: "down" },
  { name: "rdb1", host: "localhost", port: 5020, status: "up" },
  { name: "rdb2", host: "localhost", port: 5021, status: "up" },
  { name: "wdb1", host: "localhost", port: 5030, status: "down" },
  { name: "wdb2", host: "localhost", port: 5031, status: "up" },
  { name: "hdb1", host: "localhost", port: 5040, status: "up" },
  { name: "hdb2", host: "localhost", port: 5041, status: "down" },
  { name: "pxfeed", host: "localhost", port: 5050, status: "up" },
  { name: "oms", host: "localhost", port: 5060, status: "up" },
];
