// src/context/ProcessContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { Process } from "../types/Process";
import {
  fetchProcesses,
  startProcessAPI,
  stopProcessAPI,
  startAllAPI,
  stopAllAPI,
  mockProcesses,
} from "../api/processes";

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
  // 1) start with mock data so UI always works
  const [processes, setProcesses] = useState<Process[]>(mockProcesses);

  // 2) single attempt to load from real API (if backend is up)
  const refresh = async () => {
    try {
      const data = await fetchProcesses();
      setProcesses(data);
    } catch {
      // API offline → keep current local state
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  // --- local helpers (optimistic) --------------------

  const start = async (name: string) => {
    // optimistic local update
    setProcesses(prev =>
      prev.map(p =>
        p.name === name
          ? {
              ...p,
              status: "up",
              pid: p.pid ?? Math.floor(1000 + Math.random() * 9000),
            }
          : p
      )
    );

    // best-effort API call
    try {
      await startProcessAPI(name);
    } catch {
      // ignore for now – UI already updated
    }
  };

  const stop = async (name: string) => {
    setProcesses(prev =>
      prev.map(p =>
        p.name === name ? { ...p, status: "down", pid: null } : p
      )
    );

    try {
      await stopProcessAPI(name);
    } catch {}
  };

  const startAll = async () => {
    setProcesses(prev =>
      prev.map(p =>
        p.status === "down"
          ? {
              ...p,
              status: "up",
              pid: p.pid ?? Math.floor(1000 + Math.random() * 9000),
            }
          : p
      )
    );

    try {
      await startAllAPI();
    } catch {}
  };

  const stopAll = async () => {
    setProcesses(prev =>
      prev.map(p =>
        p.status === "up" ? { ...p, status: "down", pid: null } : p
      )
    );

    try {
      await stopAllAPI();
    } catch {}
  };

  return (
    <ProcessContext.Provider
      value={{ processes, refresh, start, stop, startAll, stopAll }}
    >
      {children}
    </ProcessContext.Provider>
  );
}

export const useProcesses = () => useContext(ProcessContext);
