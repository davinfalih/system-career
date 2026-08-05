"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const ToastContext = createContext<{
  showToast: (message: string, type?: ToastType) => void;
}>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-80 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border bg-white p-3.5 shadow-card-hover animate-fade-up",
              t.type === "success" && "border-emerald-200",
              t.type === "error" && "border-rose-200",
              t.type === "info" && "border-sky-200"
            )}
          >
            {t.type === "success" && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />}
            {t.type === "error" && <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />}
            {t.type === "info" && <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />}
            <p className="text-sm text-zinc-800">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToastSafe() {
  return useContext(ToastContext);
}
