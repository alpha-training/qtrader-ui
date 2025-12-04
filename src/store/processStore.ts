// src/store/processStore.ts
import { create } from "zustand";
import type { Process } from "../types/Process";

export type ProcessStatus = "up" | "down";

type ProcessUpdate = {
  name: string;
  status: ProcessStatus;
  pid: number | null;
  mem: string | null;
};

type ProcessStore = {
  processes: Process[];
  initMock: () => void;
  startProcess: (name: string) => void;
  stopProcess: (name: string) => void;
  startAll: () => void;
  stopAll: () => void;
  updateFromWS: (update: ProcessUpdate) => void;
};

export const useProcessStore = create<ProcessStore>((set, get) => ({
  processes: [],

  // Initial fake data – EXACTLY so table is not empty
  initMock: () =>
    set({
      processes: [
        {
          name: "tp1",
          host: "localhost",
          port: 5010,
          status: "up",
          pid: 2314,
          mem: "42 MB / 128 MB",
        },
        {
          name: "tp2",
          host: "localhost",
          port: 5011,
          status: "down",
          pid: null,
          mem: null,
        },
        {
          name: "rdb1",
          host: "localhost",
          port: 5020,
          status: "up",
          pid: 3516,
          mem: "64 MB / 256 MB",
        },
        {
          name: "rdb2",
          host: "localhost",
          port: 5021,
          status: "up",
          pid: 3620,
          mem: "71 MB / 256 MB",
        },
        {
          name: "wdb1",
          host: "localhost",
          port: 5030,
          status: "down",
          pid: null,
          mem: null,
        },
        {
          name: "wdb2",
          host: "localhost",
          port: 5031,
          status: "up",
          pid: 4882,
          mem: "58 MB / 256 MB",
        },
        {
          name: "hdb1",
          host: "localhost",
          port: 5040,
          status: "up",
          pid: 2921,
          mem: "92 MB / 512 MB",
        },
        {
          name: "hdb2",
          host: "localhost",
          port: 5041,
          status: "down",
          pid: null,
          mem: null,
        },
        {
          name: "pxfeed",
          host: "localhost",
          port: 5050,
          status: "up",
          pid: 1822,
          mem: "37 MB / 128 MB",
        },
        {
          name: "oms",
          host: "localhost",
          port: 5060,
          status: "up",
          pid: 5781,
          mem: "120 MB / 512 MB",
        },
      ],
    }),

  startProcess: (name: string) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.name === name
          ? {
              ...p,
              status: "up",
              pid: p.pid ?? Math.floor(Math.random() * 5000) + 1000,
            }
          : p
      ),
    })),

  stopProcess: (name: string) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.name === name
          ? {
              ...p,
              status: "down",
              pid: null,
              mem: null,
            }
          : p
      ),
    })),

  startAll: () => {
    const { processes } = get();
    processes.forEach((p) => {
      if (p.status === "down") {
        get().startProcess(p.name);
      }
    });
  },

  stopAll: () => {
    const { processes } = get();
    processes.forEach((p) => {
      if (p.status === "up") {
        get().stopProcess(p.name);
      }
    });
  },

  // Used by wsClient mock updates
  updateFromWS: (update: ProcessUpdate) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.name === update.name
          ? {
              ...p,
              status: update.status,
              pid: update.pid,
              mem: update.mem ?? p.mem ?? null,
            }
          : p
      ),
    })),
}));
