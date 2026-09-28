import { create } from "zustand";
import type { ToastKind, ToastMessage } from "../components/common/Toast";

interface ToastState {
  toasts: ToastMessage[];
  push: (kind: ToastKind, title: string, description?: string) => void;
  remove: (id: number) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (kind, title, description) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: Date.now() + Math.random(), kind, title, description },
      ],
    })),
  remove: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));