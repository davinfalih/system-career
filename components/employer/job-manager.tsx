"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";

export type ManagedJob = {
  id: string;
  title: string;
  type: string;
  mode: string;
  location: string | null;
  salary: string | null;
  description: string;
  mustHaveSkills: string[];
  niceToHaveSkills: string[];
  majorRequired: string | null;
  minGpa: number | null;
  forFreshGrads: boolean;
  status: string;
  deadline: Date | string | null;
  applicationCount: number;
  createdAt: string;
};

const TYPE_LABELS: Record<string, string> = {
  INTERNSHIP: "Magang",
  FULL_TIME: "Full-Time",
  PART_TIME: "Part-Time",
  PROJECT_BASED: "Project-Based",
};

const MODE_LABELS: Record<string, string> = {
  REMOTE: "Remote",
  ONSITE: "Onsite",
  HYBRID: "Hybrid",
};

const EMPTY_FORM = {
  title: "",
  type: "INTERNSHIP",
  mode: "REMOTE",
  location: "",
  salary: "",
  description: "",
  mustHaveSkills: [] as string[],
  niceToHaveSkills: [] as string[],
  majorRequired: "",
  minGpa: "",
  forFreshGrads: true,
  status: "OPEN",
  deadline: "",
};

export function JobManager({ initialJobs }: { initialJobs: ManagedJob[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [jobs, setJobs] = useState<ManagedJob[]>(initialJobs);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [skillInputs, setSkillInputs] = useState({ must: "", nice: "" });

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSkillInputs({ must: "", nice: "" });
    setShowForm(true);
  }

  function openEdit(job: ManagedJob) {
    setEditingId(job.id);
    setForm({
      title: job.title,
      type: job.type,
      mode: job.mode,
      location: job.location ?? "",
      salary: job.salary ?? "",
      description: job.description,
      mustHaveSkills: job.mustHaveSkills,
      niceToHaveSkills: job.niceToHaveSkills,
      majorRequired: job.majorRequired ?? "",
      minGpa: job.minGpa?.toString() ?? "",
      forFreshGrads: job.forFreshGrads,
      status: job.status,
      deadline: job.deadline ? String(job.deadline).slice(0, 10) : "",
    });
    setSkillInputs({ must: "", nice: "" });
    setShowForm(true);
  }

  function addSkill(key: "must" | "nice") {
    const value = skillInputs[key].trim();
    if (!value) return;
    setForm((f) => ({
      ...f,
      [key === "must" ? "mustHaveSkills" : "niceToHaveSkills"]: [
        ...(key === "must" ? f.mustHaveSkills : f.niceToHaveSkills),
        value,
      ],
    }));
    setSkillInputs((s) => ({ ...s, [key]: "" }));
  }

  function removeSkill(key: "must" | "nice", skill: string) {
    setForm((f) => ({
      ...f,
      [key === "must" ? "mustHaveSkills" : "niceToHaveSkills"]: (key === "must" ? f.mustHaveSkills : f.niceToHaveSkills).filter((s) => s !== skill),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        minGpa: form.minGpa ? Number(form.minGpa) : undefined,
        deadline: form.deadline || undefined,
      };
      const url = editingId ? `/api/jobs/${editingId}` : "/api/jobs";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "Gagal menyimpan", "error");
        return;
      }
      showToast(editingId ? "Lowongan diperbarui" : "Lowongan berhasil dibuat!");
      setShowForm(false);
      router.refresh();
    } catch {
      showToast("Terjadi kesalahan", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus lowongan ini?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (!res.ok) {
        showToast("Gagal menghapus", "error");
        return;
      }
      setJobs((j) => j.filter((x) => x.id !== id));
      showToast("Lowongan dihapus");
      router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  const inputCls = "input";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Kelola Lowongan</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Buat dan kelola lowongan magang atau kerja untuk timmu.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          Buat Lowongan
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="card flex flex-col items-center p-14 text-center">
          <BriefcaseIcon />
          <p className="mt-4 font-semibold text-zinc-700">Belum ada lowongan</p>
          <p className="mt-1 text-sm text-zinc-500">Buat lowongan pertamamu untuk mulai menerima kandidat.</p>
          <button onClick={openCreate} className="btn-primary mt-5">
            <Plus className="h-4 w-4" />
            Buat Lowongan
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-zinc-900">{job.title}</h3>
                  <Badge variant={job.status === "OPEN" ? "success" : job.status === "DRAFT" ? "neutral" : "danger"}>
                    {job.status === "OPEN" ? "Aktif" : job.status === "DRAFT" ? "Draft" : "Ditutup"}
                  </Badge>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                  <span>{TYPE_LABELS[job.type]}</span>
                  <span>· {MODE_LABELS[job.mode]}</span>
                  <span>· {job.location ?? "Remote"}</span>
                  <span>· {job.applicationCount} kandidat</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {job.mustHaveSkills.slice(0, 4).map((s) => (
                    <span key={s} className="badge bg-brand-50 text-brand-700 ring-1 ring-brand-200">{s}</span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => openEdit(job)} className="btn-secondary !px-3.5">
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  disabled={deleting === job.id}
                  className="rounded-xl border border-rose-200 px-3.5 text-rose-600 transition hover:bg-rose-50"
                >
                  {deleting === job.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl animate-fade-up">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">{editingId ? "Edit Lowongan" : "Buat Lowongan Baru"}</h2>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Judul Posisi *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="cth. Front-End Developer Intern" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Tipe</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputCls}>
                    <option value="INTERNSHIP">Magang</option>
                    <option value="FULL_TIME">Full-Time</option>
                    <option value="PART_TIME">Part-Time</option>
                    <option value="PROJECT_BASED">Project-Based</option>
                  </select>
                </div>
                <div>
                  <label className="label">Mode</label>
                  <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className={inputCls}>
                    <option value="REMOTE">Remote</option>
                    <option value="ONSITE">Onsite</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="label">Lokasi</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputCls} placeholder="Jakarta / Remote" />
                </div>
                <div>
                  <label className="label">Estimasi Gaji</label>
                  <input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} className={inputCls} placeholder="Rp 3.000.000" />
                </div>
              </div>

              <div>
                <label className="label">Deskripsi *</label>
                <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className={`${inputCls} resize-none`} placeholder="Deskripsi pekerjaan, tanggung jawab, dan benefit..." />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Must-Have Skills</label>
                  <div className="flex gap-2">
                    <input
                      value={skillInputs.must}
                      onChange={(e) => setSkillInputs({ ...skillInputs, must: e.target.value })}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill("must"); } }}
                      className={inputCls}
                      placeholder="cth. JavaScript"
                    />
                    <button type="button" onClick={() => addSkill("must")} className="btn-secondary shrink-0">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {form.mustHaveSkills.map((s) => (
                      <span key={s} className="badge bg-brand-600 text-white">
                        {s}
                        <button type="button" onClick={() => removeSkill("must", s)} className="ml-1 opacity-70"><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Nice-To-Have Skills</label>
                  <div className="flex gap-2">
                    <input
                      value={skillInputs.nice}
                      onChange={(e) => setSkillInputs({ ...skillInputs, nice: e.target.value })}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill("nice"); } }}
                      className={inputCls}
                      placeholder="cth. Git"
                    />
                    <button type="button" onClick={() => addSkill("nice")} className="btn-secondary shrink-0">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {form.niceToHaveSkills.map((s) => (
                      <span key={s} className="badge bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200">
                        {s}
                        <button type="button" onClick={() => removeSkill("nice", s)} className="ml-1 opacity-70"><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="label">Jurusan Wajib</label>
                  <input value={form.majorRequired} onChange={(e) => setForm({ ...form, majorRequired: e.target.value })} className={inputCls} placeholder="cth. Informatika" />
                </div>
                <div>
                  <label className="label">IPK Minimal</label>
                  <input type="number" step="0.01" min={0} max={4} value={form.minGpa} onChange={(e) => setForm({ ...form, minGpa: e.target.value })} className={inputCls} placeholder="3.0" />
                </div>
                <div>
                  <label className="label">Batas Lamaran</label>
                  <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className={inputCls} />
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
                <input type="checkbox" checked={form.forFreshGrads} onChange={(e) => setForm({ ...form, forFreshGrads: e.target.checked })} className="h-4 w-4 accent-brand-600" />
                Buka untuk fresh graduate / tanpa pengalaman
              </label>

              <div className="flex justify-end gap-3 border-t border-zinc-100 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Batal</button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Buat Lowongan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function BriefcaseIcon() {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
      <Plus className="h-7 w-7" />
    </div>
  );
}
