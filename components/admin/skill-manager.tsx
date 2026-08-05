"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Layers, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";

type Skill = {
  id: string;
  name: string;
  category: string;
  demand: number;
};

export function SkillManager({ initialSkills }: { initialSkills: Skill[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [skills, setSkills] = useState(initialSkills);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState({ name: "", category: "HARD", demand: "50" });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(editing ? "/api/admin/skills" : "/api/admin/skills", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editing ? { id: editing.id, demand: Number(form.demand), category: form.category } : form
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "Gagal menyimpan", "error");
        return;
      }
      if (editing) {
        setSkills((prev) =>
          prev.map((s) => (s.id === editing.id ? { ...s, demand: data.skill.demand, category: data.skill.category } : s))
        );
        setEditing(null);
        showToast("Skill diperbarui!");
      } else {
        setSkills((prev) => [
          { id: data.skill.id, name: data.skill.name, category: data.skill.category, demand: data.skill.demand },
          ...prev,
        ]);
        showToast("Skill berhasil ditambahkan!");
      }
      setShowForm(false);
      setForm({ name: "", category: "HARD", demand: "50" });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function remove(skill: Skill) {
    if (!confirm(`Hapus skill "${skill.name}"?`)) return;
    const res = await fetch(`/api/admin/skills?id=${skill.id}`, { method: "DELETE" });
    if (res.ok) {
      setSkills((prev) => prev.filter((s) => s.id !== skill.id));
      showToast("Skill dihapus.");
      router.refresh();
    } else {
      showToast("Gagal menghapus", "error");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Kelola Skill Master Data</h1>
          <p className="mt-1 text-sm text-zinc-500">Atur daftar skill & kebutuhan industri untuk rekomendasi AI.</p>
        </div>
        <button
          onClick={() => {
            setShowForm((v) => !v);
            setEditing(null);
            setForm({ name: "", category: "HARD", demand: "50" });
          }}
          className="btn-primary"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Batal" : "Tambah Skill"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="card grid gap-4 p-6 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <label className="form-label">Nama Skill</label>
            <input
              required
              disabled={!!editing}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input disabled:opacity-50"
              placeholder="React.js"
            />
          </div>
          <div>
            <label className="form-label">Kategori</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input"
            >
              <option value="HARD">Hard Skill</option>
              <option value="SOFT">Soft Skill</option>
            </select>
          </div>
          <div>
            <label className="form-label">Demand (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={form.demand}
              onChange={(e) => setForm({ ...form, demand: e.target.value })}
              className="input"
            />
          </div>
          <div className="sm:col-span-4">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing ? "Perbarui" : "Simpan"}
            </button>
          </div>
        </form>
      )}

      <div className="card overflow-hidden">
        <div className="divide-y divide-zinc-50">
          {skills.length === 0 && (
            <div className="p-12 text-center text-sm text-zinc-400">Belum ada skill.</div>
          )}
          {skills.map((s) => (
            <div key={s.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-zinc-900">{s.name}</p>
                  <p className="text-xs text-zinc-500">
                    Demand: <span className="font-semibold text-zinc-700">{s.demand}%</span>
                  </p>
                </div>
                <Badge variant={s.category === "HARD" ? "default" : "info"}>
                  {s.category === "HARD" ? "Hard" : "Soft"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden h-2 w-40 overflow-hidden rounded-full bg-zinc-100 sm:block">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-rose-500" style={{ width: `${s.demand}%` }} />
                </div>
                <button
                  onClick={() => {
                    setEditing(s);
                    setForm({ name: s.name, category: s.category, demand: String(s.demand) });
                    setShowForm(true);
                  }}
                  className="btn-secondary"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => remove(s)} className="btn-danger">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
