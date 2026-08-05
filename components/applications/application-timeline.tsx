"use client";

import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = [
  { key: "SUBMITTED", label: "Terkirim", icon: CheckCircle2 },
  { key: "SCREENING", label: "Screening", icon: Loader2 },
  { key: "INTERVIEW", label: "Wawancara", icon: CheckCircle2 },
  { key: "ACCEPTED", label: "Diterima", icon: CheckCircle2 },
  { key: "REJECTED", label: "Ditolak", icon: Loader2 },
];

const STAGE_ORDER = ["SUBMITTED", "UNDER_REVIEW", "SCREENING", "INTERVIEW"];

export function ApplicationTimeline({ status }: { status: string }) {
  if (status === "REJECTED") {
    return (
      <div className="flex items-center gap-2 text-sm text-rose-600">
        <XIcon />
        <span className="font-semibold">Lamaran ditolak</span>
      </div>
    );
  }

  const currentIndex = STAGE_ORDER.indexOf(status);
  const reached = currentIndex === -1 ? STAGE_ORDER.length - 1 : currentIndex;

  return (
    <div className="flex items-center">
      {STAGE_ORDER.slice(0, 4).map((stage, i) => {
        const active = i <= reached;
        const isLast = i === 3;
        return (
          <div key={stage} className={cn("flex items-center", !isLast && "flex-1")}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 transition",
                  active ? "border-brand-600 bg-brand-600 text-white" : "border-zinc-200 bg-white text-zinc-300",
                  status === stage && "ring-4 ring-brand-500/20"
                )}
              >
                {active && status === stage ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : active ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
              </div>
              <span className={cn("mt-1.5 text-[10px] font-semibold", active ? "text-brand-700" : "text-zinc-400")}>
                {STAGES.find((s) => s.key === stage)?.label ?? stage}
              </span>
            </div>
            {!isLast && (
              <div className={cn("mx-1 mb-5 h-0.5 flex-1 rounded", active && !(reached === i) ? "bg-brand-500" : "bg-zinc-200")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function XIcon() {
  return <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600">×</span>;
}
