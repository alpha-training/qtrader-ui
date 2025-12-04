import { create } from "zustand";

type PrefsStore = {
  confirmStart: boolean;
  confirmStop: boolean;
  confirmStartAll: boolean;
  confirmStopAll: boolean;

  setConfirmStart: (v: boolean) => void;
  setConfirmStop: (v: boolean) => void;
  setConfirmStartAll: (v: boolean) => void;
  setConfirmStopAll: (v: boolean) => void;
};

export const usePrefs = create<PrefsStore>((set) => ({
  confirmStart: false,
  confirmStop: false,
  confirmStartAll: false,
  confirmStopAll: false,

  setConfirmStart: (v) => set({ confirmStart: v }),
  setConfirmStop: (v) => set({ confirmStop: v }),
  setConfirmStartAll: (v) => set({ confirmStartAll: v }),
  setConfirmStopAll: (v) => set({ confirmStopAll: v }),
}));
