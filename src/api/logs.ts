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

  // Emit initial log for each process
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
 * REAL log stream (simple polling)
 *
 * Backend you currently have:
 *   GET /logs/:name  -> returns { tail: ... } OR an array of lines/entries
 *
 * This polls each process every `pollMs` and emits new lines.
 * It’s a pragmatic "works now" bridge until backend exposes a proper WS to the UI.
 */
export function connectLogStream(
  processes: Process[],
  emit: (log: LogEntry) => void,
  opts?: { pollMs?: number }
) {
  const pollMs = opts?.pollMs ?? 2000;
  console.log("Real logs enabled (polling)", { pollMs });

  // Keep track of last seen content per channel so we only emit new lines
  const lastSeen: Record<string, string> = {};

  let stopped = false;

  async function pollOne(p: Process) {
    try {
      // Your backend: GET /logs/:name
      const resp = await apiGet(`/logs/${encodeURIComponent(p.name)}`);

      // Accept a few possible shapes
      // - { tail: string }
      // - { tail: string[] }
      // - string
      // - string[]
      const tail =
        (resp && (resp.tail ?? resp)) as unknown;

      let text = "";
      if (Array.isArray(tail)) text = tail.join("\n");
      else if (typeof tail === "string") text = tail;
      else text = JSON.stringify(tail);

      const prev = lastSeen[p.name] ?? "";
      if (text && text !== prev) {
        // Emit only the new part (best-effort)
        const newPart =
          prev && text.startsWith(prev) ? text.slice(prev.length) : text;

        // Split into lines and emit
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
      } else if (!prev && text) {
        // First poll: store without spamming old history,
        // but emit one "connected" message so UI shows activity.
        lastSeen[p.name] = text;
        emit({
          timestamp: new Date().toISOString(),
          level: "INFO",
          message: `Connected to logs for ${p.name}`,
          channel: p.name,
        });
      }
    } catch (e) {
      emit({
        timestamp: new Date().toISOString(),
        level: "ERROR",
        message: `Failed to fetch logs for ${p.name}`,
        channel: p.name,
      });
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
