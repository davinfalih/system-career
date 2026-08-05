import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = "brand",
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  accent?: "brand" | "success" | "warning" | "info";
  className?: string;
}) {
  const accents = {
    brand: "bg-brand-50 text-brand-600",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    info: "bg-sky-50 text-sky-600",
  };
  return (
    <div className={cn("card p-5", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-zinc-400">{hint}</p>}
        </div>
        <div className={cn("rounded-xl p-3", accents[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
