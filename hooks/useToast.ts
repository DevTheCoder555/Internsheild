"use client";

import { useCallback, useEffect, useState } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

let globalToastListeners: Array<(toast: Toast) => void> = [];

export function toast(t: Omit<Toast, "id">) {
  const id = Math.random().toString(36).slice(2);
  const newToast = { ...t, id };
  globalToastListeners.forEach((listener) => listener(newToast));
  return id;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Toast) => {
    setToasts((prev) => [...prev, t]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== t.id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    globalToastListeners.push(addToast);
    return () => {
      globalToastListeners = globalToastListeners.filter((l) => l !== addToast);
    };
  }, [addToast]);

  return { toasts, toast: addToast, removeToast };
}
