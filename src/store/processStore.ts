// src/store/processStore.ts
import { create } from "zustand";
import type { Process } from "../types/Process";

type ProcessState = {
  processes: Process[];
  selectedProcess: string | null;

  setProcesses: (list: Process[]) => void;
  updateProcess: (p: Process) => void;
  setSelectedProcess: (name: string | null) => void;

  startOne: (name: string) => void;
  stopOne: (name: string) => void;
  startAll: () => void;
  stopAll: () => void;
};

export const useProcessStore = create<ProcessState>((set) => ({
  processes: [],
  selectedProcess: null,

  setProcesses: (list) => set({ processes: list }),

  updateProcess: (p) =>
    set((state) => ({
      processes: state.processes.map((x) =>
        x.name === p.name ? { ...x, ...p } : x
      ),
    })),

  setSelectedProcess: (name) => set({ selectedProcess: name }),

  startOne: (name) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.name === name ? { ...p, status: "up", pid: 1000 } : p
      ),
    })),

  stopOne: (name) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.name === name ? { ...p, status: "down", pid: null } : p
      ),
    })),

  startAll: () =>
    set((state) => ({
      processes: state.processes.map((p) => ({
        ...p,
        status: "up",
        pid: 1000,
      })),
    })),

  stopAll: () =>
    set((state) => ({
      processes: state.processes.map((p) => ({
        ...p,
        status: "down",
        pid: null,
      })),
    })),
}));
