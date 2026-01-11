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
        message: isError
          ? `${p.name} reported an error`
          : `${p.name} heartbeat ok`,
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
 *   GET /logs/:name  -> returns { tail: ... }
 *
 * Behavior:
 * - no spam: treat "kdb error" as "logs unavailable" and emit once per process
 * - status event (type: "log_status") emitted when availability changes
 */
export function connectLogStream(
  processes: Process[],
  emit: (log: LogEntry) => void,
  opts?: { pollMs?: number }
) {
  const pollMs = opts?.pollMs ?? 2000;
  console.log("Real logs enabled (polling)", { pollMs });

  const lastSeen: Record<string, string> = {};

  const status: Record<
    string,
    { available: boolean; lastError?: string; hadAnySuccess: boolean }
  > = {};

  function emitStatus(pname: string, available: boolean, error?: string) {
    const prev = status[pname];
    const wasAvailable = prev?.available ?? true;
    const prevErr = prev?.lastError;

    status[pname] = {
      available,
      lastError: error,
      hadAnySuccess: prev?.hadAnySuccess ?? false,
    };

    // emit only when availability changes OR error string changes while unavailable
    if (
      wasAvailable !== available ||
      (!available && error && error !== prevErr)
    ) {
      emit({
        type: "log_status",
        timestamp: new Date().toISOString(),
        level: available ? "INFO" : "ERROR",
        channel: pname,
        message: JSON.stringify({ available, error: error ?? null }),
      });
    }
  }

  function normalizeTail(resp: any): string {
    const tail = (resp && (resp.tail ?? resp)) as unknown;

    if (Array.isArray(tail)) return tail.join("\n");
    if (typeof tail === "string") return tail;
    if (tail == null) return "";
    return JSON.stringify(tail);
  }

  function isKdbErrorText(text: string) {
    return text.toLowerCase().includes("kdb error");
  }

  let stopped = false;

  async function pollOne(p: Process) {
    if (stopped) return;

    try {
      const resp = await apiGet(`/logs/${encodeURIComponent(p.name)}`);
      const text = normalizeTail(resp);

      // Backend "kdb error: tail" case -> treat as unavailable, emit once per process
      if (text && isKdbErrorText(text)) {
        const prev = status[p.name];
        const firstTimeUnavailable = !prev || prev.available !== false;

        emitStatus(p.name, false, text);

        if (firstTimeUnavailable) {
          emit({
            timestamp: new Date().toISOString(),
            level: "ERROR",
            channel: p.name,
            message: "Logs unavailable (backend tail not ready)",
          });
        }

        return; // important: don't append raw kdb error every poll
      }

      // Mark available on first success (or recovery)
      const prev = status[p.name];
      if (!prev || prev.available === false) {
        emitStatus(p.name, true);

        if (prev?.available === false) {
          emit({
            timestamp: new Date().toISOString(),
            level: "INFO",
            channel: p.name,
            message: `Logs reconnected for ${p.name}`,
          });
        }
      }

      status[p.name] = {
        available: true,
        lastError: undefined,
        hadAnySuccess: true,
      };

      // Store first snapshot silently (no spamming old history)
      const prevText = lastSeen[p.name] ?? "";
      if (!prevText && text) {
        lastSeen[p.name] = text;
        return;
      }

      if (text && text !== prevText) {
        const newPart =
          prevText && text.startsWith(prevText)
            ? text.slice(prevText.length)
            : text;

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
      const errText =
        (typeof e?.message === "string" && e.message) ||
        (typeof e === "string" ? e : "Failed to fetch logs");

      const prev = status[p.name];
      const firstTimeUnavailable = !prev || prev.available !== false;

      emitStatus(p.name, false, errText);

      if (firstTimeUnavailable) {
        emit({
          timestamp: new Date().toISOString(),
          level: "ERROR",
          message: `Logs unavailable for ${p.name}`,
          channel: p.name,
        });
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
