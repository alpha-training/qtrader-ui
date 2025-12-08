// src/protocol/normalizeProcess.ts
import type { Process } from "../types/Process";

/**
 * Normalizes ANY backend process shape into our internal Process type.
 * Safe even if backend adds/renames fields later.
 */
export function normalizeProcess(raw: any): Process {
  if (!raw) {
    return {
      name: "unknown",
      host: "unknown",
      port: 0,
      status: "down",
      pid: null,
      mem: null,
    };
  }

  // Some backends use booleans, ints, or other status forms
  const status = normalizeStatus(raw.status);

  return {
    name: raw.name ?? raw.id ?? "unknown",
    host: raw.host ?? raw.hostname ?? "localhost",
    port: Number(raw.port ?? raw.p ?? 0),
    status,
    pid: raw.pid !== undefined ? Number(raw.pid) : null,
    mem:
      raw.mem ??
      raw.memory ??
      raw.heap ??
      raw.heapUsed ??
      null,
  };
}

/**
 * Normalize arbitrary backend status formats into "up" | "down".
 */
function normalizeStatus(rawStatus: any): "up" | "down" {
  if (rawStatus === "up" || rawStatus === "down") return rawStatus;

  if (rawStatus === true || rawStatus === 1 || rawStatus === "running") {
    return "up";
  }

  if (rawStatus === false || rawStatus === 0 || rawStatus === "stopped") {
    return "down";
  }

  return "down"; // safe fallback
}
