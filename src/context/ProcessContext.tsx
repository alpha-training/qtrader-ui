import React, { createContext, useContext, useEffect, useState } from "react";
import type { Process } from "../types/Process";

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

export function ProcessProvider({ children }: { children: React.ReactNode }) {
  const [processes, setProcesses] = useState<Process[]>([]);

  // Mock loader (will later be replaced with API)
  const loadProcesses = async () => {
    await new Promise((res) => setTimeout(res, 200));

    setProcesses([
      { name: "tp1", host: "localhost", port: 5010, status: "up" },
      { name: "tp2", host: "localhost", port: 5011, status: "down" },
      { name: "rdb1", host: "localhost", port: 5020, status: "up" },
      { name: "rdb2", host: "localhost", port: 5021, status: "up" },
      { name: "wdb1", host: "localhost", port: 5030, status: "down" },
      { name: "wdb2", host: "localhost", port: 5031, status: "up" },
      { name: "hdb1", host: "localhost", port: 5040, status: "up" },
      { name: "hdb2", host: "localhost", port: 5041, status: "down" },
      { name: "pxfeed", host: "localhost", port: 5050, status: "up" },
      { name: "oms", host: "localhost", port: 5060, status: "up" },
    ]);
  };

  useEffect(() => {
    loadProcesses();
  }, []);

  return (
    <ProcessContext.Provider
      value={{
        processes,
        setProcesses,      // <-- ADDED BACK!
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
