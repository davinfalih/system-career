"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Briefcase, Loader2, Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

type Company = {
  id: string;
  name: string;
  slug: string;
  industry: string;
  location: string;
  website: string | null;
  verified: boolean;
  createdAt: string;
  jobCount: number;
};

export function CompanyManager({ initialCompanies }: { initialCompanies: Company[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [companies, setCompanies] = useState(initialCompanies);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", industry: "", location: "", website: "" });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "Gagal menyimpan", "error");
        return;
      }
      setCompanies((prev) => [
        {
          id: data.company.id,
          name: data.company.name,
          slug: data.company.slug,
          industry: data.company.industry,
          location: data.company.location,
          website: data.company.website,
          verified: true,
          createdAt: new Date().toISOString(),
          jobCount: 0,
        },
        ...prev,
      ]);
      setShowForm(false);
      setForm({ name: "", industry: "", location: "", website: "" });
      showToast("Perusahaan berhasil ditambahkan!");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Kelola Perusahaan</h1>
          <p className="mt-1 text-sm text-zinc-500">Kelola perusahaan mitra yang membuka lowongan.</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Batal" : "Tambah Perusahaan"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="card grid gap-4 p-6 sm:grid-cols-2">
          <div>
            <label className="form-label">Nama Perusahaan</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              placeholder="PT Teknologi Maju"
            />
          </div>
          <div>
            <label className="form-label">Industri</label>
            <input
              required
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              className="input"
              placeholder="Teknologi"
            />
          </div>
          <div>
            <label className="form-label">Lokasi</label>
            <input
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="input"
              placeholder="Jakarta"
            />
          </div>
          <div>
            <label className="form-label">Website</label>
            <input
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="input"
              placeholder="https://..."
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Simpan
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {companies.length === 0 && (
          <div className="card p-12 text-center text-sm text-zinc-400 sm:col-span-3">Belum ada perusahaan.</div>
        )}
        {companies.map((c) => (
          <div key={c.id} className="card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-rose-600 text-white">
                <Briefcase className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-bold text-zinc-900">{c.name}</p>
                  {c.verified ? (
                    <Badge variant="success">Terverifikasi</Badge>
                  ) : (
                    <Badge variant="warning">Belum</Badge>
                  )}
                </div>
                <p className="truncate text-xs text-zinc-500">{c.industry}</p>
              </div>
            </div>
            <div className="mt-4 space-y-1 text-xs text-zinc-500">
              <p>📍 {c.location}</p>
              <p>💼 {c.jobCount} lowongan</p>
              <p>📅 Daftar {formatDate(c.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
