// src/store/processStore.ts
import { create } from "zustand";
import type { Process } from "../types/Process";

export type PendingAction = "start" | "stop" | null;

type ProcessState = {
  processes: Process[];
  selectedProcess: string | null;

  pending: Record<string, PendingAction>;

  // MUST EXIST FOR wsRouter + mockWsClient
  isBulkOperation: boolean;
  setBulkMode: (v: boolean) => void;

  setProcesses: (items: Process[]) => void;
  setSelectedProcess: (name: string | null) => void;

  updateStatus: (name: string, status: "up" | "down") => void;
  updateProcess: (updated: Partial<Process> & { name: string }) => void;

  setPending: (name: string, action: PendingAction) => void;
  clearPending: (name: string) => void;
  clearAllPending: () => void;

  startOne: (name: string) => void;
  stopOne: (name: string) => void;

  startAll: () => void;
  stopAll: () => void;
};

export const useProcessStore = create<ProcessState>((set) => ({
  processes: [],
  selectedProcess: null,
  pending: {},

  // REQUIRED FIELD
  isBulkOperation: false,
  setBulkMode: (v) => set({ isBulkOperation: v }),

  setProcesses: (items) =>
    set({
      processes: items,
      pending: {},
      isBulkOperation: false,
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

  setPending: (name, action) =>
    set((s) => ({
      pending: { ...s.pending, [name]: action },
    })),

  clearPending: (name) =>
    set((s) => ({
      pending: { ...s.pending, [name]: null },
    })),

  clearAllPending: () => set({ pending: {} }),

  startOne: (name) =>
    set((s) => ({
      pending: { ...s.pending, [name]: "start" },
      isBulkOperation: false,
    })),

  stopOne: (name) =>
    set((s) => ({
      pending: { ...s.pending, [name]: "stop" },
      isBulkOperation: false,
    })),

  startAll: () =>
    set((s) => {
      const pendingAll: Record<string, PendingAction> = {};
      s.processes.forEach((p) => (pendingAll[p.name] = "start"));

      return {
        pending: pendingAll,
        isBulkOperation: true,
      };
    }),

  stopAll: () =>
    set((s) => {
      const pendingAll: Record<string, PendingAction> = {};
      s.processes.forEach((p) => (pendingAll[p.name] = "stop"));

      return {
        pending: pendingAll,
        isBulkOperation: true,
      };
    }),
}));
