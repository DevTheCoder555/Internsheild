"use client";

import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export function Toaster() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-[420px]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-lg transition-all animate-in slide-in-from-right",
            t.type === "success" && "border-green-500/30 bg-green-500/10 text-green-200",
            t.type === "error" && "border-red-500/30 bg-red-500/10 text-red-200",
            t.type === "warning" && "border-yellow-500/30 bg-yellow-500/10 text-yellow-200",
            t.type === "info" && "border-blue-500/30 bg-blue-500/10 text-blue-200"
          )}
        >
          <div className="flex-1">
            <p className="text-sm font-semibold">{t.title}</p>
            {t.description && <p className="mt-1 text-sm opacity-80">{t.description}</p>}
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
