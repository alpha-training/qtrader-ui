// src/store/processStore.ts
import { create } from "zustand";
import type { Process } from "../types/Process";

type PendingAction = "start" | "stop" | null;

type ProcessState = {
  processes: Process[];
  selectedProcess: string | null;

  pending: Record<string, PendingAction>;

  setProcesses: (items: Process[]) => void;
  setSelectedProcess: (name: string | null) => void;

  updateStatus: (name: string, status: "up" | "down") => void;
  updateProcess: (updated: Partial<Process> & { name: string }) => void;

  // NEW
  setPending: (name: string, action: PendingAction) => void;
  clearPending: (name: string) => void;
  clearAllPending: () => void;

  // Updated versions
  startOne: (name: string) => void;
  stopOne: (name: string) => void;

  startAll: () => void;
  stopAll: () => void;
};

export const useProcessStore = create<ProcessState>((set) => ({
  processes: [],
  selectedProcess: null,
  pending: {},

  setProcesses: (items) =>
    set({
      processes: items,
      pending: {}, // reset pending when new data arrives
    }),

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

  // -----------------------------------
  // NEW pending state helpers
  // -----------------------------------
  setPending: (name, action) =>
    set((s) => ({
      pending: { ...s.pending, [name]: action },
    })),

  clearPending: (name) =>
    set((s) => ({
      pending: { ...s.pending, [name]: null },
    })),

  clearAllPending: () => set({ pending: {} }),

  // -----------------------------------
  // UPDATED: start/stop actions
  // -----------------------------------
  startOne: (name) =>
    set((state) => ({
      pending: { ...state.pending, [name]: "start" },
      // DO NOT update status here → wait for WS confirmation
    })),

  stopOne: (name) =>
    set((state) => ({
      pending: { ...state.pending, [name]: "stop" },
      // also wait for WS confirmation
    })),

    startAll: () =>
    set((state) => {
      const pendings: Record<string, PendingAction> = {};
      for (const p of state.processes) pendings[p.name] = "start";
      return { pending: pendings };
    }),
  
  stopAll: () =>
    set((state) => {
      const pendings: Record<string, PendingAction> = {};
      for (const p of state.processes) pendings[p.name] = "stop";
      return { pending: pendings };
    }),
}));
