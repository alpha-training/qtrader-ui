// src/store/uiStore.ts
import { create } from "zustand";

type UIStore = {
  selectedChannel: string | null;
  setSelectedChannel: (name: string | null) => void;
};

export const useUIStore = create<UIStore>((set) => ({
  selectedChannel: "All",
  setSelectedChannel: (name) => set({ selectedChannel: name }),
}));
