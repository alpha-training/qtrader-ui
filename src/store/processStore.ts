import { create } from "zustand";
import type { Process } from "../types/Process";
import { processApi } from "../api/processApi";


export type PendingAction = "start" | "stop" | null;

type ProcessState = {
  processes: Process[];
  selectedProcess: string | null;
  pending: Record<string, PendingAction>;

  isBulkOperation: boolean;
  setBulkMode: (v: boolean) => void;

  setProcesses: (items: Process[]) => void;
  setSelectedProcess: (name: string | null) => void;

  setPending: (name: string, action: PendingAction) => void;
  clearPending: (name: string) => void;
  clearAllPending: () => void;

  startOne: (name: string) => Promise<void>;
  stopOne: (name: string) => Promise<void>;
  startAll: () => Promise<void>;
  stopAll: () => Promise<void>;
};

export const useProcessStore = create<ProcessState>((set, get) => ({
  processes: [],
  selectedProcess: null,
  pending: {},

  isBulkOperation: false,
  setBulkMode: (v) => set({ isBulkOperation: v }),

  setProcesses: (items) =>
  set((s) => ({
    processes: items,
    // ✅ keep pending state for any existing process names
    pending: Object.fromEntries(
      items.map((p) => [p.name, s.pending[p.name] ?? null])
    ),
    // ✅ don't reset bulk mode on every poll
    isBulkOperation: s.isBulkOperation,
  })),

  setSelectedProcess: (name) => set({ selectedProcess: name }),

  setPending: (name, action) =>
    set((s) => ({ pending: { ...s.pending, [name]: action } })),

  clearPending: (name) =>
    set((s) => ({ pending: { ...s.pending, [name]: null } })),

  clearAllPending: () => set({ pending: {} }),

  startOne: async (name) => {
    set((s) => ({
      pending: { ...s.pending, [name]: "start" },
      isBulkOperation: false,
    }));
  
    try {
      await processApi.start(name);
    } finally {
      set((s) => ({ pending: { ...s.pending, [name]: null } }));
    }
  },
  
  stopOne: async (name) => {
    set((s) => ({
      pending: { ...s.pending, [name]: "stop" },
      isBulkOperation: false,
    }));
  
    try {
      await processApi.stop(name);
    } finally {
      set((s) => ({ pending: { ...s.pending, [name]: null } }));
    }
  },
  
  startAll: async () => {
    set((s) => {
      const pendingAll: Record<string, PendingAction> = {};
      s.processes.forEach((p) => (pendingAll[p.name] = "start"));
      return { pending: { ...s.pending, ...pendingAll }, isBulkOperation: true };
    });
  
    try {
      await processApi.startAll();
    } finally {
      set((s) => {
        const cleared = { ...s.pending };
        s.processes.forEach((p) => (cleared[p.name] = null));
        return { pending: cleared, isBulkOperation: false };
      });
    }
  },
  
  stopAll: async () => {
    set((s) => {
      const pendingAll: Record<string, PendingAction> = {};
      s.processes.forEach((p) => (pendingAll[p.name] = "stop"));
      return { pending: { ...s.pending, ...pendingAll }, isBulkOperation: true };
    });
  
    try {
      await processApi.stopAll();
    } finally {
      set((s) => {
        const cleared = { ...s.pending };
        s.processes.forEach((p) => (cleared[p.name] = null));
        return { pending: cleared, isBulkOperation: false };
      });
    }
  },
}));
