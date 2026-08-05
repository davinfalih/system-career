import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

const variants: Record<string, string> = {
  default: "bg-brand-50 text-brand-700 ring-brand-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  info: "bg-sky-50 text-sky-700 ring-sky-200",
  danger: "bg-rose-50 text-rose-700 ring-rose-200",
  neutral: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  outline: "bg-white text-zinc-600 ring-zinc-300",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span className={cn("badge ring-1", variants[variant], className)}>
      {children}
    </span>
  );
}
