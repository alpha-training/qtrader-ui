// src/context/LogContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import type { LogEntry } from "../types/LogEntry";
import { useProcesses } from "./ProcessContext";
import { connectLogStreamMock } from "../api/logs"; // <-- mock WS emitter for now

type LogContextShape = {
  logs: LogEntry[];
  append: (log: LogEntry) => void;
  clear: () => void;
};

const LogContext = createContext<LogContextShape>({
  logs: [],
  append: () => {},
  clear: () => {},
});

export function LogProvider({ children }: { children: React.ReactNode }) {
  const { processes } = useProcesses();

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const wsRef = useRef<() => void>(); // cleaner

  const append = (log: LogEntry) => {
    setLogs(prev => [...prev, log]);
  };

  const clear = () => setLogs([]);

  useEffect(() => {
    // CLEAN previous mock WS
    wsRef.current?.();

    // CONNECT mock WebSocket
    wsRef.current = connectLogStreamMock(processes, append);

    return () => {
      wsRef.current?.();
    };
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
