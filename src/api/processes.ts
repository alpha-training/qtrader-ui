// src/api/processes.ts
import type { Process } from "../types/Process";

const API = "http://localhost:3000/api";

async function safeFetch(url: string, options?: RequestInit) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error("Bad response");
    return await res.json();
  } catch (err) {
    console.warn("⚠ API offline → using local mock data");
    return null; // <- IMPORTANT: never throw
  }
}

// ---------------------------------------------------------------------------
// Mock data used when backend is offline
// ---------------------------------------------------------------------------
const mockProcesses: Process[] = [
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

// ---------------------------------------------------------------------------
// API FUNCTIONS
// ---------------------------------------------------------------------------
export async function fetchProcesses(): Promise<Process[]> {
  const data = await safeFetch(`${API}/processes`);
  return data ?? mockProcesses;
}

export async function startProcessAPI(name: string): Promise<void> {
  await safeFetch(`${API}/processes/${name}/start`, { method: "POST" });
}

export async function stopProcessAPI(name: string): Promise<void> {
  await safeFetch(`${API}/processes/${name}/stop`, { method: "POST" });
}

export async function startAllAPI(): Promise<void> {
  await safeFetch(`${API}/processes/start-all`, { method: "POST" });
}

export async function stopAllAPI(): Promise<void> {
  await safeFetch(`${API}/processes/stop-all`, { method: "POST" });
}
