import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  color,
}: {
  value: number;
  className?: string;
  color?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-zinc-100", className)}>
      <div
        className={cn(
          "h-full rounded-full bg-brand-500 transition-all duration-500",
          color
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function MatchRing({ value, size = 80 }: { value: number; size?: number }) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, value) / 100) * circumference;
  const color = value >= 80 ? "#059669" : value >= 50 ? "#e11d48" : "#f59e0b";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f4f4f5"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset .8s ease" }}
        />
      </svg>
      <span className="absolute text-lg font-bold text-zinc-800">{value}%</span>
    </div>
  );
}
