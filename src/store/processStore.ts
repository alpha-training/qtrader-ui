import { create } from "zustand";
import type { Process } from "../types/Process";

type ProcessState = {
  processes: Process[];
  selectedProcess: string | null;

  setProcesses: (items: Process[]) => void;
  setSelectedProcess: (name: string | null) => void;

  // NEW:
  updateStatus: (name: string, status: "up" | "down") => void;
  updateProcess: (updated: Partial<Process> & { name: string }) => void;

  startOne: (name: string) => void;
  stopOne: (name: string) => void;
  startAll: () => void;
  stopAll: () => void;
};

export const useProcessStore = create<ProcessState>((set) => ({
  processes: [],
  selectedProcess: null,

  setProcesses: (items) => set({ processes: items }),

  setSelectedProcess: (name) => set({ selectedProcess: name }),

  updateStatus: (name, status) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.name === name ? { ...p, status } : p
      ),
    })),

  updateProcess: (updated) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.name === updated.name ? { ...p, ...updated } : p
      ),
    })),

  startOne: (name) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.name === name ? { ...p, status: "up" } : p
      ),
    })),

  stopOne: (name) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.name === name ? { ...p, status: "down" } : p
      ),
    })),

  startAll: () =>
    set((state) => ({
      processes: state.processes.map((p) => ({ ...p, status: "up" })),
    })),

  stopAll: () =>
    set((state) => ({
      processes: state.processes.map((p) => ({ ...p, status: "down" })),
    })),
}));
