"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/providers/session-provider";
import { Bookmark, CheckCircle2, Loader2, Send } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export function JobActions({
  jobId,
  alreadyApplied,
  matchScore,
  bookmarked: initialBookmarked,
}: {
  jobId: string;
  alreadyApplied: boolean;
  matchScore?: number | null;
  bookmarked: boolean;
}) {
  const { user: sessionUser } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [applying, setApplying] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [applied, setApplied] = useState(alreadyApplied);

  async function handleApply() {
    if (!sessionUser) {
      router.push("/login?callbackUrl=" + encodeURIComponent(`/jobs/${jobId}`));
      return;
    }
    setApplying(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "Gagal melamar", "error");
      } else {
        setApplied(true);
        showToast("Lamaran terkirim! Pantau statusmu di Dashboard.");
        router.refresh();
      }
    } catch {
      showToast("Terjadi kesalahan", "error");
    } finally {
      setApplying(false);
    }
  }

  async function handleBookmark() {
    if (!sessionUser) {
      router.push("/login");
      return;
    }
    setBookmarking(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/bookmark`, { method: "POST" });
      const data = await res.json();
      setBookmarked(data.bookmarked);
      showToast(data.bookmarked ? "Lowongan tersimpan" : "Bookmark dihapus", "info");
      router.refresh();
    } finally {
      setBookmarking(false);
    }
  }

  if (applied) {
    return (
      <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
        <CheckCircle2 className="h-5 w-5" />
        Berhasil Dilamar
        {matchScore != null && <span className="font-medium text-emerald-600">· Match {matchScore}%</span>}
      </div>
    );
  }

  return (
    <div className="flex w-full gap-2">
      <button onClick={handleApply} disabled={applying} className="btn-primary flex-1">
        {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {applying ? "Mengirim..." : "Lamar Sekarang"}
        {matchScore != null && !applying && <span className="text-xs opacity-90">· Match {matchScore}%</span>}
      </button>
      <button
        onClick={handleBookmark}
        disabled={bookmarking}
        title={bookmarked ? "Hapus bookmark" : "Simpan lowongan"}
        className={`rounded-xl border px-4 transition ${
          bookmarked
            ? "border-brand-300 bg-brand-50 text-brand-600"
            : "border-zinc-200 bg-white text-zinc-500 hover:border-brand-300 hover:text-brand-600"
        }`}
      >
        {bookmarking ? <Loader2 className="h-5 w-5 animate-spin" /> : <Bookmark className="h-5 w-5" fill={bookmarked ? "currentColor" : "none"} />}
      </button>
    </div>
  );
}
