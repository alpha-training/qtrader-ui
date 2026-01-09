import { create } from "zustand";
import type { Process } from "../types/Process";
import { processApi } from "../api/processApi";

export type PendingAction = "start" | "stop" | null;

type ProcessState = {
  processes: Process[];
  selectedProcess: string | null;
  pending: Record<string, PendingAction>;

  // ✅ NEW (doesn't break anything): track when we started pending + stuck state
  pendingSince: Record<string, number | null>;
  stuck: Record<string, boolean>;

  isBulkOperation: boolean;
  setBulkMode: (v: boolean) => void;

  setProcesses: (items: Process[]) => void;
  setSelectedProcess: (name: string | null) => void;

  setPending: (name: string, action: PendingAction) => void;
  clearPending: (name: string) => void;
  clearAllPending: () => void;

  // ✅ optional helper for UI (Retry button can call this)
  clearStuck: (name: string) => void;

  startOne: (name: string) => Promise<void>;
  stopOne: (name: string) => Promise<void>;
  startAll: () => Promise<void>;
  stopAll: () => Promise<void>;
};

const START_TIMEOUT_MS = 15_000; // after 15s, treat as stuck
const STOP_TIMEOUT_MS = 8_000;   // optional; you can increase/decrease

export const useProcessStore = create<ProcessState>((set, get) => ({
  processes: [],
  selectedProcess: null,
  pending: {},

  pendingSince: {},
  stuck: {},

  isBulkOperation: false,
  setBulkMode: (v) => set({ isBulkOperation: v }),

  /**
   * Poll updates come here. We update `processes` AND
   * we clear pending only when we observe the actual desired state.
   *
   * start pending clears when status becomes "up"
   * stop pending clears when status becomes "down"
   *
   * ✅ NEW: if pending takes too long, mark as stuck + clear pending
   */
  setProcesses: (items) =>
    set((s) => {
      const now = Date.now();
      const nextPending: Record<string, PendingAction> = { ...s.pending };
      const nextPendingSince: Record<string, number | null> = { ...s.pendingSince };
      const nextStuck: Record<string, boolean> = { ...s.stuck };

      for (const p of items) {
        const action = nextPending[p.name];
        const since = nextPendingSince[p.name] ?? null;

        // Clear pending when desired state is reached
        if (action === "start" && p.status === "up") {
          nextPending[p.name] = null;
          nextPendingSince[p.name] = null;
          nextStuck[p.name] = false;
          continue;
        }

        if (action === "stop" && p.status === "down") {
          nextPending[p.name] = null;
          nextPendingSince[p.name] = null;
          nextStuck[p.name] = false;
          continue;
        }

        // ✅ Timeout -> stuck (prevents infinite spinner)
        if (action && since) {
          const timeout = action === "start" ? START_TIMEOUT_MS : STOP_TIMEOUT_MS;
          if (now - since > timeout) {
            nextPending[p.name] = null;
            nextPendingSince[p.name] = null;
            nextStuck[p.name] = true;
          }
        }
      }

      const anyPending = Object.values(nextPending).some(Boolean);

      return {
        processes: items,
        pending: nextPending,
        pendingSince: nextPendingSince,
        stuck: nextStuck,
        // if everything is resolved, drop bulk mode
        isBulkOperation: anyPending ? s.isBulkOperation : false,
      };
    }),

  setSelectedProcess: (name) => set({ selectedProcess: name }),

  setPending: (name, action) =>
    set((s) => ({
      pending: { ...s.pending, [name]: action },
      pendingSince: {
        ...s.pendingSince,
        [name]: action ? Date.now() : null,
      },
      // if user triggers an action again, it's no longer "stuck"
      stuck: { ...s.stuck, [name]: false },
    })),

  clearPending: (name) =>
    set((s) => ({
      pending: { ...s.pending, [name]: null },
      pendingSince: { ...s.pendingSince, [name]: null },
    })),

  clearAllPending: () =>
    set({
      pending: {},
      pendingSince: {},
      isBulkOperation: false,
    }),

  clearStuck: (name) =>
    set((s) => ({ stuck: { ...s.stuck, [name]: false } })),

  /**
   * Single start/stop:
   * - set pending immediately
   * - call API
   * - keep pending until polling shows state change
   */
  startOne: async (name) => {
    get().setPending(name, "start");
    set({ isBulkOperation: false });

    try {
      await processApi.start(name);
    } catch (err) {
      console.error("startOne failed:", name, err);
      // API call failed -> clear immediately + mark stuck
      get().clearPending(name);
      set((s) => ({ stuck: { ...s.stuck, [name]: true } }));
    }
  },

  stopOne: async (name) => {
    get().setPending(name, "stop");
    set({ isBulkOperation: false });

    try {
      await processApi.stop(name);
    } catch (err) {
      console.error("stopOne failed:", name, err);
      get().clearPending(name);
      set((s) => ({ stuck: { ...s.stuck, [name]: true } }));
    }
  },

  /**
   * Bulk start/stop:
   * - set pending for all processes immediately
   * - call API
   * - keep pending per-process until polling confirms state change
   */
  startAll: async () => {
    set((s) => {
      const nextPending = { ...s.pending };
      const nextPendingSince = { ...s.pendingSince };
      const nextStuck = { ...s.stuck };

      s.processes.forEach((p) => {
        nextPending[p.name] = "start";
        nextPendingSince[p.name] = Date.now();
        nextStuck[p.name] = false;
      });

      return { pending: nextPending, pendingSince: nextPendingSince, stuck: nextStuck, isBulkOperation: true };
    });

    try {
      await processApi.startAll();
    } catch (err) {
      console.error("startAll failed:", err);
      // bulk API call failed -> clear all pending, mark all as stuck
      set((s) => {
        const nextStuck = { ...s.stuck };
        s.processes.forEach((p) => (nextStuck[p.name] = true));
        return { pending: {}, pendingSince: {}, isBulkOperation: false, stuck: nextStuck };
      });
    }
  },

  stopAll: async () => {
    set((s) => {
      const nextPending = { ...s.pending };
      const nextPendingSince = { ...s.pendingSince };
      const nextStuck = { ...s.stuck };

      s.processes.forEach((p) => {
        nextPending[p.name] = "stop";
        nextPendingSince[p.name] = Date.now();
        nextStuck[p.name] = false;
      });

      return { pending: nextPending, pendingSince: nextPendingSince, stuck: nextStuck, isBulkOperation: true };
    });

    try {
      await processApi.stopAll();
    } catch (err) {
      console.error("stopAll failed:", err);
      set((s) => {
        const nextStuck = { ...s.stuck };
        s.processes.forEach((p) => (nextStuck[p.name] = true));
        return { pending: {}, pendingSince: {}, isBulkOperation: false, stuck: nextStuck };
      });
    }
  },
}));
