import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { ReactNode } from 'react';

export interface ToastType {
  type: 'info' | 'success' | 'error' | 'warning';
  title: string;
  message: ReactNode;
}

export type ToastTypeWithId = ToastType & { id: string };

interface ToastMessage {
  title: string;
  message?: string | null;
}

interface ToastState {
  toasts: ToastTypeWithId[];
  open: (toast: ToastType) => void;
  close: (id: string) => void;
  success: (toast: ToastMessage) => void;
  info: (toast: ToastMessage) => void;
  warning: (toast: ToastMessage) => void;
  error: (toast: ToastMessage) => void;
}

const useToastStore = create<ToastState>((set, get, store) => ({
  toasts: [],
  open: (toast: ToastType) => {
    const newToast = { id: uuid(), ...toast };
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
  },
  close: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  success: ({ title, message }: ToastMessage) => {
    get().open({ type: 'success', title, message });
  },
  info: ({ title, message }: ToastMessage) => {
    get().open({ type: 'info', title, message });
  },
  warning: ({ title, message }: ToastMessage) => {
    get().open({ type: 'warning', title, message });
  },
  error: ({ title, message }: ToastMessage) => {
    get().open({ type: 'error', title, message });
  },
}));

export default useToastStore;
