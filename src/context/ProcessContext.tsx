// src/context/ProcessContext.tsx
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  import type { Process } from "../types/Process";
  import { fetchProcesses } from "../api/processes";
  
  type ProcessContextType = {
    processes: Process[];
    setProcesses: React.Dispatch<React.SetStateAction<Process[]>>;
    refreshProcesses: () => Promise<void>;
  };
  
  const ProcessContext = createContext<ProcessContextType>({
    processes: [],
    setProcesses: () => {},
    refreshProcesses: async () => {},
  });
  
  const MOCK_PROCESSES: Process[] = [
    { name: "tp1", host: "localhost", port: 5010, status: "up", pid: null, mem: null },
    { name: "tp2", host: "localhost", port: 5011, status: "down", pid: null, mem: null },
    { name: "rdb1", host: "localhost", port: 5020, status: "up", pid: null, mem: "64 MB / 256 MB" },
    { name: "rdb2", host: "localhost", port: 5021, status: "up", pid: null, mem: "71 MB / 256 MB" },
    { name: "wdb1", host: "localhost", port: 5030, status: "down", pid: null, mem: null },
    { name: "wdb2", host: "localhost", port: 5031, status: "up", pid: null, mem: "58 MB / 256 MB" },
    { name: "hdb1", host: "localhost", port: 5040, status: "up", pid: null, mem: "92 MB / 512 MB" },
    { name: "hdb2", host: "localhost", port: 5041, status: "down", pid: null, mem: null },
    { name: "pxfeed", host: "localhost", port: 5050, status: "up", pid: null, mem: "37 MB / 128 MB" },
    { name: "oms", host: "localhost", port: 5060, status: "up", pid: null, mem: "120 MB / 512 MB" },
  ];
  
  export function ProcessProvider({ children }: { children: React.ReactNode }) {
    const [processes, setProcesses] = useState<Process[]>([]);
  
    const loadProcesses = async () => {
      try {
        const data = await fetchProcesses();
        // If backend returns a valid list – use it
        if (Array.isArray(data) && data.length > 0) {
          setProcesses(data);
        } else if (processes.length === 0) {
          // defensive fallback
          setProcesses(MOCK_PROCESSES);
        }
      } catch (err) {
        console.warn("Failed to fetch processes, using mock data", err);
        if (processes.length === 0) {
          setProcesses(MOCK_PROCESSES);
        }
      }
    };
  
    useEffect(() => {
      // initial load only
      loadProcesses();
      // no polling for now (to not overwrite local Start/Stop changes)
    }, []);
  
    return (
      <ProcessContext.Provider
        value={{
          processes,
          setProcesses,
          refreshProcesses: loadProcesses,
        }}
      >
        {children}
      </ProcessContext.Provider>
    );
  }
  
  export function useProcesses() {
    return useContext(ProcessContext);
  }
  