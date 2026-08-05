"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, Loader2, Save } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export function CompanySettingsForm({
  company,
}: {
  company: {
    name: string;
    description: string;
    industry: string;
    location: string;
    website: string | null;
    verified: boolean;
  };
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: company.name,
    description: company.description,
    industry: company.industry,
    location: company.location,
    website: company.website ?? "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "Gagal menyimpan", "error");
        return;
      }
      showToast("Profil perusahaan diperbarui!");
      router.refresh();
    } catch {
      showToast("Terjadi kesalahan", "error");
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "input";

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-7">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-brand-50 p-3 text-brand-600">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <h2 className="font-bold">Profil Perusahaan</h2>
          <p className="text-xs text-zinc-500">Informasi ini tampil di halaman lowonganmu.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Nama Perusahaan</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className="label">Industri</label>
          <input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className="label">Lokasi</label>
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className="label">Website</label>
          <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className={inputCls} placeholder="https://..." />
        </div>
      </div>
      <div>
        <label className="label">Deskripsi Perusahaan</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} className={`${inputCls} resize-none`} />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-400">
          Status verifikasi:{" "}
          <span className={company.verified ? "font-semibold text-emerald-600" : "font-semibold text-amber-600"}>
            {company.verified ? "Terverifikasi" : "Menunggu verifikasi"}
          </span>
        </p>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
