// src/store/wsStore.ts
import { create } from "zustand";

export type WsStatus = "connecting" | "connected" | "reconnecting" | "closed";

interface WsState {
  status: WsStatus;
  setConnecting: () => void;
  setConnected: () => void;
  setReconnecting: () => void;
  setClosed: () => void;
}

export const useWsStore = create<WsState>((set) => ({
  status: "connecting",

  setConnecting: () => set({ status: "connecting" }),
  setConnected: () => set({ status: "connected" }),
  setReconnecting: () => set({ status: "reconnecting" }),
  setClosed: () => set({ status: "closed" }),
}));
