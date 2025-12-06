// src/store/toastStore.ts
import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning";

export type ToastMessage = {
  id: string;
  type: ToastType;
  text: string;
  group?: string; // optional grouping
};

type ToastState = {
  toasts: ToastMessage[];

  push: (type: ToastType, text: string) => void;
  pushGroup: (groupId: string, type: ToastType, text: string) => void;
  remove: (id: string) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  push: (type, text) =>
    set((s) => ({
      toasts: [
        ...s.toasts,
        { id: Math.random().toString(36).slice(2), type, text }
      ],
    })),

  // prevents spam → replaces existing toast in same group
  pushGroup: (groupId, type, text) =>
    set((s) => {
      const others = s.toasts.filter((t) => t.group !== groupId);
      return {
        toasts: [
          ...others,
          {
            id: groupId, // fixed id → always same slot
            group: groupId,
            type,
            text,
          },
        ],
      };
    }),

  remove: (id) =>
    set((s) => ({
      toasts: s.toasts.filter((t) => t.id !== id),
    })),
}));
