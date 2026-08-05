import { cn } from "@/lib/utils";

export function Avatar({
  name,
  src,
  className,
  size = "md",
}: {
  name: string;
  src?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-lg" };
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover", sizes[size], className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-rose-600 font-bold text-white",
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
