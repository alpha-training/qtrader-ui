// src/api/processes.ts
import { apiGet, apiPost } from "./client";
import type { Process } from "../types/Process";

/**
 * Backend /state returns: { result: BackendProcRow[] }
 */
type BackendProcRow = {
  name: string;
  proc?: string;
  port: number;
  status: string; // "up" | "down" (and maybe others)
  goal?: string;
  pid?: number | null;
  used?: number | null;
  heap?: number | null;
  lastheartbeat?: string;
  attempts?: number | null;
  laststart?: string;
};

function normalizeStatus(s: string): Process["status"] {
  return s === "up" ? "up" : "down";
}

function formatBytes(n: number): string {
  const abs = Math.abs(n);
  if (abs < 1024) return `${n} B`;
  const kb = n / 1024;
  if (Math.abs(kb) < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (Math.abs(mb) < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

function toProcess(row: BackendProcRow): Process {
  // Some backends return null/empty strings in fields; keep it safe.
  const usedStr = row.used != null ? formatBytes(row.used) : null;

  // If your Process type also has heap (you have mem/heap column),
  // we can store it too without breaking anything (TS will catch if Process has no "heap").
  const heapStr = row.heap != null ? formatBytes(row.heap) : null;

  return {
    name: row.name,
    host: "localhost",
    port: row.port,
    status: normalizeStatus(row.status),
    pid: row.pid ?? null,

    // Your Process.mem is string|null
    mem: usedStr,

    heap: heapStr,
  } as Process;
}

function looksLikeCors(err: unknown) {
  const msg = String((err as any)?.message ?? err);
  // Browser CORS failures typically show as TypeError: Failed to fetch
  return msg.includes("Failed to fetch") || msg.includes("NetworkError");
}

export async function fetchProcesses(): Promise<Process[]> {
  try {
    const data = await apiGet("/state");
    const rows = (data?.result ?? []) as BackendProcRow[];
    return rows.map(toProcess);
  } catch (err) {
    if (looksLikeCors(err)) {
      console.warn(
        "⚠️ fetchProcesses failed (likely CORS). Fix: use Vite dev proxy so frontend calls /api/state via same origin.",
        err
      );
    } else {
      console.warn("⚠️ fetchProcesses failed, using mock", err);
    }
    return mockProcesses;
  }
}

export async function startProcessAPI(name: string) {
  try {
    return await apiPost(`/start/${name}`);
  } catch (err) {
    console.warn("Mock start:", name, err);
    return { success: true };
  }
}

export async function stopProcessAPI(name: string) {
  try {
    return await apiPost(`/stop/${name}`);
  } catch (err) {
    console.warn("Mock stop:", name, err);
    return { success: true };
  }
}

export async function startAllAPI() {
  try {
    return await apiPost("/start-all");
  } catch (err) {
    console.warn("Mock start-all", err);
    return { success: true };
  }
}

export async function stopAllAPI() {
  try {
    return await apiPost("/stopall");
  } catch (err) {
    console.warn("Mock stop-all", err);
    return { success: true };
  }
}

export const mockProcesses: Process[] = [
  { name: "tp1", host: "localhost", port: 5010, status: "up", pid: null, mem: "120 MB" },
  { name: "tp2", host: "localhost", port: 5011, status: "down", pid: null, mem: null },
  { name: "rdb1", host: "localhost", port: 5020, status: "up", pid: null, mem: "256 MB" },
  { name: "rdb2", host: "localhost", port: 5021, status: "up", pid: null, mem: "240 MB" },
  { name: "wdb1", host: "localhost", port: 5030, status: "down", pid: null, mem: null },
  { name: "wdb2", host: "localhost", port: 5031, status: "up", pid: null, mem: "512 MB" },
  { name: "hdb1", host: "localhost", port: 5040, status: "up", pid: null, mem: "1.00 GB" },
  { name: "hdb2", host: "localhost", port: 5041, status: "down", pid: null, mem: null },
  { name: "pxfeed", host: "localhost", port: 5050, status: "up", pid: null, mem: "64 MB" },
  { name: "oms", host: "localhost", port: 5060, status: "up", pid: null, mem: "128 MB" },
];
