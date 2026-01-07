// src/api/processApi.ts
import { mockApi } from "./mockApi";
import type { Process, ProcessStatus } from "../types/Process";
import { apiGet, apiPost } from "./client";
import { config } from "../config";

function toStatus(x: any): ProcessStatus {
  return x === "up" ? "up" : "down";
}

function formatMem(row: any): string | null {
  // backend seems to return used / heap as numbers (bytes)
  const used = row?.used;
  const heap = row?.heap;

  const bytes =
    typeof used === "number" ? used : typeof heap === "number" ? heap : null;

  if (bytes == null) return null;

  // simple readable formatting
  const kb = bytes / 1024;
  const mb = kb / 1024;
  const gb = mb / 1024;

  if (gb >= 1) return `${gb.toFixed(2)} GB`;
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  if (kb >= 1) return `${kb.toFixed(0)} KB`;
  return `${bytes} B`;
}

/**
 * Convert backend /state shape -> frontend Process[]
 *
 * Common backend shape (your curl):
 * { result: [{name, proc, port, pid, status, used, heap, ...}, ...] }
 */
function normalizeProcesses(payload: any): Process[] {
  const data = payload?.result ?? payload;

  // Case 1: Array of rows (your backend output)
  if (Array.isArray(data)) {
    return data
      .filter((r) => r && typeof r.name === "string")
      .map((r) => ({
        name: r.name,
        host: r.host ?? "localhost",
        port: Number(r.port ?? 0),
        status: toStatus(r.status),
        pid: r.pid ?? null,
        mem: formatMem(r),
      
        // ✅ keep these for UI state
        goal: r.goal ?? null,
        attempts: r.attempts ?? null,
        laststart: r.laststart ?? null,
        lastheartbeat: r.lastheartbeat ?? null,
      }))
      .filter((p) => Number.isFinite(p.port) && p.port > 0);
  }

  // Case 2: q table serialized as columns (name/status/pid/port arrays)
  if (data && typeof data === "object" && Array.isArray(data.name)) {
    const names: string[] = data.name;
    const statusArr: any[] = data.status ?? [];
    const pidArr: any[] = data.pid ?? [];
    const portArr: any[] = data.port ?? [];
    const hostArr: any[] = data.host ?? [];
    const usedArr: any[] = data.used ?? [];
    const heapArr: any[] = data.heap ?? [];

    return names
      .map((name, i) => {
        const row = {
          used: usedArr[i],
          heap: heapArr[i],
        };

        return {
          name,
          host: hostArr[i] ?? "localhost",
          port: Number(portArr[i] ?? 0),
          status: toStatus(statusArr[i]),
          pid: pidArr[i] ?? null,
          mem: formatMem(row),
        } as Process;
      })
      .filter((p) => Number.isFinite(p.port) && p.port > 0);
  }

  return [];
}

async function getAllReal(): Promise<Process[]> {
  const payload = await apiGet("/state");
  const procs = normalizeProcesses(payload);
  if (!procs.length) throw new Error("Empty/unknown /state response shape");
  return procs;
}

async function startReal(name: string) {
  return apiPost(`/start/${encodeURIComponent(name)}`);
}

async function stopReal(name: string) {
  return apiPost(`/stop/${encodeURIComponent(name)}`);
}

async function startAllReal() {
  return apiPost("/start-all");
}

async function stopAllReal() {
  return apiPost("/stopall");
}

export const processApi = {
  getAll: (): Promise<Process[]> =>
    config.apiMode === "real" ? getAllReal() : mockApi.getProcesses(),

  start: (name: string) =>
    config.apiMode === "real" ? startReal(name) : mockApi.startProcess(name),

  stop: (name: string) =>
    config.apiMode === "real" ? stopReal(name) : mockApi.stopProcess(name),

  startAll: () =>
    config.apiMode === "real" ? startAllReal() : mockApi.startAll(),

  stopAll: () =>
    config.apiMode === "real" ? stopAllReal() : mockApi.stopAll(),
};
