// src/context/ProcessContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { Process } from "../types/Process";
import { processApi } from "../api/processApi";

type ProcessContextType = {
  processes: Process[];
  refresh: () => Promise<void>;
  start: (name: string) => Promise<void>;
  stop: (name: string) => Promise<void>;
  startAll: () => Promise<void>;
  stopAll: () => Promise<void>;
};

const ProcessContext = createContext<ProcessContextType>({
  processes: [],
  refresh: async () => {},
  start: async () => {},
  stop: async () => {},
  startAll: async () => {},
  stopAll: async () => {},
});

export function ProcessProvider({ children }: { children: React.ReactNode }) {
  const [processes, setProcesses] = useState<Process[]>([]);

  const refresh = async () => {
    try {
      const data = await processApi.getAll();
      setProcesses(data);
    } catch {
      // keep whatever we have (or empty) if API is down
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const start = async (name: string) => {
    // optimistic local update
    setProcesses((prev) =>
      prev.map((p) =>
        p.name === name
          ? {
              ...p,
              status: "up",
              pid: p.pid ?? Math.floor(1000 + Math.random() * 9000),
            }
          : p
      )
    );

    try {
      await processApi.start(name);
      await refresh(); // sync actual pid/status from backend if available
    } catch {}
  };

  const stop = async (name: string) => {
    setProcesses((prev) =>
      prev.map((p) => (p.name === name ? { ...p, status: "down", pid: null } : p))
    );

    try {
      await processApi.stop(name);
      await refresh();
    } catch {}
  };

  const startAll = async () => {
    setProcesses((prev) =>
      prev.map((p) =>
        p.status === "down"
          ? { ...p, status: "up", pid: p.pid ?? Math.floor(1000 + Math.random() * 9000) }
          : p
      )
    );

    try {
      await processApi.startAll();
      await refresh();
    } catch {}
  };

  const stopAll = async () => {
    setProcesses((prev) => prev.map((p) => (p.status === "up" ? { ...p, status: "down", pid: null } : p)));

    try {
      await processApi.stopAll();
      await refresh();
    } catch {}
  };

  return (
    <ProcessContext.Provider value={{ processes, refresh, start, stop, startAll, stopAll }}>
      {children}
    </ProcessContext.Provider>
  );
}

export const useProcesses = () => useContext(ProcessContext);
