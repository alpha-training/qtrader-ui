// src/api/logs.ts
import type { Process } from "../types/Process";
import type { LogEntry } from "../types/LogEntry";
import { apiGet } from "./client";

/**
 * MOCK log stream (kept as-is)
 */
export function connectLogStreamMock(
  processes: Process[],
  emit: (log: LogEntry) => void
) {
  console.warn("Mock WS logs enabled");

  processes.forEach((p) =>
    emit({
      timestamp: new Date().toISOString(),
      level: "INFO",
      message: `Initial heartbeat for ${p.name}`,
      channel: p.name,
    })
  );

  const interval = setInterval(() => {
    processes.forEach((p) => {
      const isError = Math.random() < 0.15;

      emit({
        timestamp: new Date().toISOString(),
        level: isError ? "ERROR" : "INFO",
        message: isError ? `${p.name} reported an error` : `${p.name} heartbeat ok`,
        channel: p.name,
      });
    });
  }, 5000);

  return () => clearInterval(interval);
}

/**
 * REAL log stream (polling)
 *
 * Backend:
 *   GET /logs/:name  -> returns { tail: ... } or an error
 *
 * Improvements:
 * - No error spam: we emit "unavailable" once per process until it recovers
 * - Emits status events (type: "log_status") so UI can show per-process hint
 */
export function connectLogStream(
  processes: Process[],
  emit: (log: LogEntry) => void,
  opts?: { pollMs?: number }
) {
  const pollMs = opts?.pollMs ?? 2000;
  console.log("Real logs enabled (polling)", { pollMs });

  const lastSeen: Record<string, string> = {};

  // Track log availability per process so we don't spam
  const status: Record<
    string,
    { available: boolean; lastError?: string; hadAnySuccess: boolean }
  > = {};

  function emitStatus(pname: string, available: boolean, error?: string) {
    const prev = status[pname];
    const wasAvailable = prev?.available ?? true;

    status[pname] = {
      available,
      lastError: error,
      hadAnySuccess: prev?.hadAnySuccess ?? false,
    };

    // Only emit when the availability changes OR error text changes while unavailable
    if (wasAvailable !== available || (!available && error && error !== prev?.lastError)) {
      emit({
        type: "log_status",
        timestamp: new Date().toISOString(),
        level: available ? "INFO" : "ERROR",
        channel: pname,
        message: JSON.stringify({
          available,
          error: error ?? null,
        }),
      });
    }
  }

  let stopped = false;

  function normalizeTail(resp: any): string {
    const tail = (resp && (resp.tail ?? resp)) as unknown;

    if (Array.isArray(tail)) return tail.join("\n");
    if (typeof tail === "string") return tail;
    if (tail == null) return "";
    return JSON.stringify(tail);
  }

  async function pollOne(p: Process) {
    if (stopped) return;

    try {
      const resp = await apiGet(`/logs/${encodeURIComponent(p.name)}`);
      const text = normalizeTail(resp);
      if (typeof text === "string" && text.toLowerCase().includes("kdb error")) {
        emit({
          timestamp: new Date().toISOString(),
          level: "ERROR",
          channel: p.name,
          message: text,
        });
        return;
      }

      // Mark available on first success (or recovery)
      const prev = status[p.name];
      if (!prev || prev.available === false) {
        emitStatus(p.name, true);
        // optional: one friendly info line on recovery
        if (prev?.available === false) {
          emit({
            timestamp: new Date().toISOString(),
            level: "INFO",
            message: `Logs reconnected for ${p.name}`,
            channel: p.name,
          });
        }
      }

      status[p.name] = {
        available: true,
        lastError: undefined,
        hadAnySuccess: true,
      };

      // Don't spam old history: store first snapshot silently
      const prevText = lastSeen[p.name] ?? "";
      if (!prevText && text) {
        lastSeen[p.name] = text;
        return;
      }

      if (text && text !== prevText) {
        const newPart = prevText && text.startsWith(prevText) ? text.slice(prevText.length) : text;

        const lines = newPart
          .split("\n")
          .map((s) => s.trimEnd())
          .filter(Boolean);

        for (const line of lines) {
          emit({
            timestamp: new Date().toISOString(),
            level: line.toLowerCase().includes("error") ? "ERROR" : "INFO",
            message: line,
            channel: p.name,
          });
        }

        lastSeen[p.name] = text;
      }
    } catch (e: any) {
      // Extract a readable error string (best-effort)
      const errText =
        (typeof e?.message === "string" && e.message) ||
        (typeof e === "string" ? e : "Failed to fetch logs");

      // Emit unavailable status ONCE (no spam every poll)
      const prev = status[p.name];
      if (!prev || prev.available !== false) {
        emitStatus(p.name, false, errText);

        // Optional: show 1 visible log line (once) so user sees something happened
        emit({
          timestamp: new Date().toISOString(),
          level: "ERROR",
          message: `Logs unavailable for ${p.name}`,
          channel: p.name,
        });
      } else {
        // Still unavailable — keep status but do not emit more logs
        emitStatus(p.name, false, errText);
      }
    }
  }

  async function loop() {
    while (!stopped) {
      await Promise.all(processes.map(pollOne));
      await new Promise((r) => setTimeout(r, pollMs));
    }
  }

  loop();

  return () => {
    stopped = true;
  };
}
