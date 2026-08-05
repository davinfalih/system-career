"use client";

import { useRouter } from "next/navigation";
import { CheckCheck } from "lucide-react";

export function MarkReadButton({ disabled }: { disabled: boolean }) {
  const router = useRouter();

  async function handleClick() {
    await fetch("/api/notifications/read", { method: "POST" });
    router.refresh();
  }

  return (
    <button onClick={handleClick} disabled={disabled} className="btn-secondary">
      <CheckCheck className="h-4 w-4" />
      Tandai Dibaca
    </button>
  );
}
