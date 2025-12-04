// src/store/processStore.ts
import { create } from "zustand";
import type { Process } from "../types/Process";
import type { WSProcessUpdate } from "../types/wsTypes";

type ProcessStore = {
  processes: Process[];
  selectedProcess: string | null;

  setProcesses: (items: Process[]) => void;
  setSelectedProcess: (name: string | null) => void;

  applyWsUpdate: (update: WSProcessUpdate) => void;

  startOne: (name: string) => void;
  stopOne: (name: string) => void;

  startAll: () => void;
  stopAll: () => void;
};

export const useProcessStore = create<ProcessStore>((set, get) => ({
  processes: [],
  selectedProcess: null,

  setProcesses: (items) => set({ processes: items }),
  setSelectedProcess: (name) => set({ selectedProcess: name }),

  applyWsUpdate: (u) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.name === u.name
          ? {
              ...p,
              status: u.status,
              pid: u.pid,
              mem: u.mem,
            }
          : p
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
      processes: state.processes.map((p) => ({
        ...p,
        status: "up",
      })),
    })),

  stopAll: () =>
    set((state) => ({
      processes: state.processes.map((p) => ({
        ...p,
        status: "down",
      })),
    })),
}));
