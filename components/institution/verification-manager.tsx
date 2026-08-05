"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CheckCircle2, Loader2, Search, ShieldCheck, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

type Student = {
  id: string;
  name: string;
  email: string;
  nim: string | null;
  major: string | null;
  gpa: number | null;
  graduationYear: number | null;
  verified: boolean;
  createdAt: string;
  skillCount: number;
  applicationCount: number;
};

export function VerificationManager({ initialStudents }: { initialStudents: Student[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [students, setStudents] = useState(initialStudents);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | "VERIFIED" | "PENDING">("ALL");
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return students
      .filter((s) => (filter === "VERIFIED" ? s.verified : filter === "PENDING" ? !s.verified : true))
      .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()) || (s.nim ?? "").toLowerCase().includes(query.toLowerCase()));
  }, [students, query, filter]);

  const pendingCount = students.filter((s) => !s.verified).length;
  const verifiedCount = students.length - pendingCount;

  async function toggleVerify(student: Student) {
    setUpdating(student.id);
    try {
      const res = await fetch("/api/institution/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: student.id, verified: !student.verified }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "Gagal", "error");
        return;
      }
      setStudents((prev) => prev.map((s) => (s.id === student.id ? { ...s, verified: data.verified } : s)));
      showToast(student.verified ? "Verifikasi dicabut" : `${student.name} berhasil diverifikasi!`);
      router.refresh();
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">Verifikasi Mahasiswa</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Pastikan mahasiswa yang terdaftar memang berasal dari institusimu.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <p className="text-2xl font-extrabold text-zinc-800">{students.length}</p>
          <p className="text-xs text-zinc-500">Total Mahasiswa</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-extrabold text-emerald-600">{verifiedCount}</p>
          <p className="text-xs text-zinc-500">Terverifikasi</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-extrabold text-amber-600">{pendingCount}</p>
          <p className="text-xs text-zinc-500">Menunggu</p>
        </div>
      </div>

      <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-zinc-200 px-3.5">
          <Search className="h-4 w-4 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau NIM/NISN..."
            className="w-full bg-transparent py-2.5 text-sm focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(["ALL", "PENDING", "VERIFIED"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                filter === f ? "bg-brand-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {f === "ALL" ? "Semua" : f === "PENDING" ? "Menunggu" : "Terverifikasi"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="card p-12 text-center text-sm text-zinc-400">Tidak ada mahasiswa ditemukan.</div>
        )}
        {filtered.map((s) => (
          <div key={s.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-rose-600 text-sm font-bold text-white">
                {s.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-zinc-900">{s.name}</p>
                  {s.verified ? (
                    <Badge variant="success"><CheckCircle2 className="h-3 w-3" /> Terverifikasi</Badge>
                  ) : (
                    <Badge variant="warning">Menunggu</Badge>
                  )}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-zinc-500">
                  <span>{s.nim ?? "—"}</span>
                  {s.major && <span>· {s.major}</span>}
                  {s.gpa != null && <span>· IPK {s.gpa}</span>}
                  <span>· {s.skillCount} skill · {s.applicationCount} lamaran</span>
                </div>
                <p className="mt-0.5 text-[11px] text-zinc-400">{s.email} · Daftar {formatDate(s.createdAt)}</p>
              </div>
            </div>
            <button
              onClick={() => toggleVerify(s)}
              disabled={updating === s.id}
              className={s.verified ? "btn-danger" : "btn-primary"}
            >
              {updating === s.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : s.verified ? (
                <XCircle className="h-4 w-4" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              {s.verified ? "Cabut Verifikasi" : "Verifikasi"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
