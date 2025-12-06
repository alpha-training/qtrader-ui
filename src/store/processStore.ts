// src/store/processStore.ts
import { create } from "zustand";
import type { Process } from "../types/Process";
import { wsClient } from "../ws";   // ⭐ ADDED — allows store to call WS

type PendingAction = "start" | "stop" | null;

type ProcessState = {
  processes: Process[];
  selectedProcess: string | null;

  pending: Record<string, PendingAction>;

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

  setProcesses: (items) =>
    set({
      processes: items,
      pending: {}, // reset pending when list refreshes
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

  // ---------------------------------------------------
  // Pending helpers
  // ---------------------------------------------------
  setPending: (name, action) =>
    set((state) => ({
      pending: { ...state.pending, [name]: action },
    })),

  clearPending: (name) =>
    set((state) => ({
      pending: { ...state.pending, [name]: null },
    })),

  clearAllPending: () => set({ pending: {} }),

  // ---------------------------------------------------
  // Start/Stop with WS integration
  // ---------------------------------------------------
  startOne: (name) =>
    set((state) => {
      wsClient.processStart?.(name);   // ⭐ send WS start
      return {
        pending: { ...state.pending, [name]: "start" },
      };
    }),

  stopOne: (name) =>
    set((state) => {
      wsClient.processStop?.(name);    // ⭐ send WS stop
      return {
        pending: { ...state.pending, [name]: "stop" },
      };
    }),

  startAll: () =>
    set((state) => {
      const next: Record<string, PendingAction> = {};

      for (const p of state.processes) {
        next[p.name] = "start";
        wsClient.processStart?.(p.name); // ⭐ WS call
      }

      return { pending: next };
    }),

  stopAll: () =>
    set((state) => {
      const next: Record<string, PendingAction> = {};

      for (const p of state.processes) {
        next[p.name] = "stop";
        wsClient.processStop?.(p.name); // ⭐ WS call
      }

      return { pending: next };
    }),
}));
