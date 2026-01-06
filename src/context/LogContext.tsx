// src/context/LogContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

import type { LogEntry } from "../types/LogEntry";
import { useProcesses } from "./ProcessContext";
import { connectLogStreamMock, connectLogStream } from "../api/logs";
import { config } from "../config";

interface LogContextShape {
  logs: LogEntry[];
  append: (log: LogEntry) => void;
  clear: () => void;
}

const LogContext = createContext<LogContextShape>({
  logs: [],
  append: () => {},
  clear: () => {},
});

export function LogProvider({ children }: { children: React.ReactNode }) {
  const { processes } = useProcesses();

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const stopRef = useRef<(() => void) | null>(null);

  const append = (log: LogEntry) => {
    setLogs((prev) => [...prev, log]);
  };

  const clear = () => setLogs([]);

  useEffect(() => {
    // cleanup old stream
    stopRef.current?.();

    // start stream based on mode
    stopRef.current =
      config.apiMode === "real"
        ? connectLogStream(processes, append, { pollMs: 2000 })
        : connectLogStreamMock(processes, append);

    return () => stopRef.current?.();
  }, [processes]);

  return (
    <LogContext.Provider value={{ logs, append, clear }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLogs() {
  return useContext(LogContext);
}
