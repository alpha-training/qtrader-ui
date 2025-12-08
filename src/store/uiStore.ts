import { create } from "zustand";

type UIState = {
  wsStatus: "connected" | "connecting" | "disconnected" | "reconnecting";
  setWsStatus: (s: UIState["wsStatus"]) => void;
};

export const useUIStore = create<UIState>((set) => ({
  wsStatus: "connecting",
  setWsStatus: (s) => set({ wsStatus: s }),
}));
