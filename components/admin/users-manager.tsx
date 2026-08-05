"use client";

import { useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  company: string | null;
  institution: string | null;
  createdAt: string;
};

const ROLE_LABELS: Record<string, string> = {
  STUDENT: "Mahasiswa",
  COMPANY: "Perusahaan",
  INSTITUTION: "Institusi",
  ADMIN: "Admin",
};

export function UsersManager({ initialUsers }: { initialUsers: User[] }) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const filtered = useMemo(() => {
    return initialUsers.filter(
      (u) =>
        (roleFilter === "ALL" || u.role === roleFilter) &&
        (u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()))
    );
  }, [initialUsers, query, roleFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    initialUsers.forEach((u) => (c[u.role] = (c[u.role] ?? 0) + 1));
    return c;
  }, [initialUsers]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">Kelola Pengguna</h1>
        <p className="mt-1 text-sm text-zinc-500">Daftar pengguna terdaftar di platform.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="card p-3 text-center">
          <p className="text-lg font-extrabold text-zinc-800">{initialUsers.length}</p>
          <p className="text-[11px] text-zinc-500">Total</p>
        </div>
        {Object.entries(ROLE_LABELS).map(([key, label]) => (
          <div key={key} className="card p-3 text-center">
            <p className="text-lg font-extrabold text-zinc-800">{counts[key] ?? 0}</p>
            <p className="text-[11px] text-zinc-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-zinc-200 px-3.5">
          <Search className="h-4 w-4 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau email..."
            className="w-full bg-transparent py-2.5 text-sm focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(["ALL", "STUDENT", "COMPANY", "INSTITUTION", "ADMIN"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                roleFilter === r ? "bg-brand-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {r === "ALL" ? "Semua" : ROLE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-5 py-3">Pengguna</th>
                <th className="px-5 py-3">Peran</th>
                <th className="px-5 py-3">Afiliasi</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Daftar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-400">Tidak ada pengguna ditemukan.</td>
                </tr>
              )}
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-zinc-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-600">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-800">{u.name}</p>
                        <p className="text-xs text-zinc-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={u.role === "ADMIN" ? "warning" : u.role === "COMPANY" ? "default" : u.role === "INSTITUTION" ? "info" : "success"}>
                      {ROLE_LABELS[u.role]}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-zinc-600">{u.company ?? u.institution ?? "—"}</td>
                  <td className="px-5 py-3">
                    {u.verified ? (
                      <Badge variant="success">Terverifikasi</Badge>
                    ) : (
                      <Badge variant="neutral">Belum</Badge>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs text-zinc-500">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-xs text-zinc-400">
        <Users className="h-3.5 w-3.5" /> Menampilkan maksimal 100 pengguna terbaru.
      </p>
    </div>
  );
}
