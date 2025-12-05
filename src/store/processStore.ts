// src/store/processStore.ts
import { create } from "zustand";
import type { Process } from "../types/Process";
import type { WSProcessUpdate } from "../types/wsTypes";

type ProcessStore = {
  processes: Process[];
  selectedProcess: string | null;

  setProcesses: (items: Process[]) => void;
  setSelectedProcess: (name: string | null) => void;

  startOne: (name: string) => void;
  stopOne: (name: string) => void;
  startAll: () => void;
  stopAll: () => void;

  applyWsUpdate: (update: WSProcessUpdate) => void;
};

function randomPid() {
  return 2000 + Math.floor(Math.random() * 3000);
}

function defaultMem() {
  return "64 MB / 128 MB";
}

export const useProcessStore = create<ProcessStore>((set) => ({
  processes: [],
  selectedProcess: null,

  setProcesses: (items) => set({ processes: items }),

  setSelectedProcess: (name) => set({ selectedProcess: name }),

  startOne: (name) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.name === name
          ? {
              ...p,
              status: "up",
              pid: p.pid ?? randomPid(),
              mem: p.mem ?? defaultMem(),
            }
          : p
      ),
    })),

  stopOne: (name) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.name === name
          ? { ...p, status: "down", pid: null, mem: null }
          : p
      ),
    })),

  startAll: () =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.status === "up"
          ? p
          : {
              ...p,
              status: "up",
              pid: p.pid ?? randomPid(),
              mem: p.mem ?? defaultMem(),
            }
      ),
    })),

  stopAll: () =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.status === "down"
          ? p
          : { ...p, status: "down", pid: null, mem: null }
      ),
    })),

  applyWsUpdate: (update) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.name === update.name
          ? {
              ...p,
              status: update.status,
              pid: update.pid ?? p.pid,
              mem: update.mem ?? p.mem,
            }
          : p
      ),
    })),
}));
