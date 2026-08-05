"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, Loader2, Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

type Institution = {
  id: string;
  name: string;
  type: string;
  city: string | null;
  verified: boolean;
  createdAt: string;
  userCount: number;
};

const TYPES: { value: string; label: string }[] = [
  { value: "UNIVERSITY", label: "Universitas" },
  { value: "POLYTECHNIC", label: "Politeknik" },
  { value: "SMK", label: "SMK" },
  { value: "SMA", label: "SMA" },
  { value: "VOCATIONAL", label: "Vokasi" },
];

export function InstitutionManager({ initialInstitutions }: { initialInstitutions: Institution[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [institutions, setInstitutions] = useState(initialInstitutions);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", type: "UNIVERSITY", city: "" });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "Gagal menyimpan", "error");
        return;
      }
      setInstitutions((prev) => [
        { id: data.institution.id, name: data.institution.name, type: data.institution.type, city: data.institution.city, verified: true, createdAt: new Date().toISOString(), userCount: 0 },
        ...prev,
      ]);
      setShowForm(false);
      setForm({ name: "", type: "UNIVERSITY", city: "" });
      showToast("Institusi berhasil ditambahkan!");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Kelola Institusi</h1>
          <p className="mt-1 text-sm text-zinc-500">Tambah & pantau institusi pendidikan yang terdaftar.</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Batal" : "Tambah Institusi"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="card grid gap-4 p-6 sm:grid-cols-2">
          <div>
            <label className="form-label">Nama Institusi</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              placeholder="Universitas Nusantara"
            />
          </div>
          <div>
            <label className="form-label">Tipe</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="input"
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Kota</label>
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="input"
              placeholder="Jakarta"
            />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={saving} className="btn-primary w-full">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Simpan
            </button>
          </div>
        </form>
      )}

      <div className="card overflow-hidden">
        <div className="divide-y divide-zinc-50">
          {institutions.length === 0 && (
            <div className="p-12 text-center text-sm text-zinc-400">Belum ada institusi.</div>
          )}
          {institutions.map((inst) => (
            <div key={inst.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-white">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-zinc-900">{inst.name}</p>
                    {inst.verified ? (
                      <Badge variant="success">Terverifikasi</Badge>
                    ) : (
                      <Badge variant="warning">Belum</Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {TYPES.find((t) => t.value === inst.type)?.label ?? inst.type}
                    {inst.city && ` · ${inst.city}`} · {inst.userCount} mahasiswa · Daftar {formatDate(inst.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
