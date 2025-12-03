// src/api/logs.ts
import type { Process } from "../types/Process";
import type { LogEntry } from "../types/LogEntry";

// MOCK WEBSOCKET STREAM
export function connectLogStreamMock(
  processes: Process[],
  emit: (log: LogEntry) => void
) {
  console.warn("Mock WS logs enabled");

  // Emit one initial log per process
  processes.forEach(p => {
    emit({
      timestamp: new Date().toISOString(),
      level: "INFO",
      message: `Initial heartbeat for ${p.name}`,
      channel: p.name,
    });
  });

  const interval = setInterval(() => {
    processes.forEach(p => {
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
