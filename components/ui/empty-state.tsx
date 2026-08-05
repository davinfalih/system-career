import { SearchX } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 py-16 text-center">
      <div className="rounded-full bg-white p-4 shadow-card">
        <SearchX className="h-8 w-8 text-brand-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-zinc-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
