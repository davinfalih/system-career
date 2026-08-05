"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import type { ProfileWorkspaceData, Education, Experience, Project } from "./profile-workspace";

export function EditProfileTab({
  initialData,
  institutions,
  skillOptions,
}: {
  initialData: ProfileWorkspaceData;
  institutions: { id: string; name: string; type: string }[];
  skillOptions: string[];
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const profile = initialData.profile;
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    headline: profile?.headline ?? "",
    bio: profile?.bio ?? "",
    location: profile?.location ?? "",
    phone: profile?.phone ?? "",
    major: initialData.user.major ?? "",
    graduationYear: initialData.user.graduationYear ?? new Date().getFullYear(),
    gpa: initialData.user.gpa ?? undefined,
    institutionId: initialData.user.institutionId ?? "",
  });
  const [skills, setSkills] = useState<string[]>(profile?.skills ?? []);
  const [skillInput, setSkillInput] = useState("");
  const [education, setEducation] = useState<Education[]>(profile?.education ?? []);
  const [experiences, setExperiences] = useState<Experience[]>(profile?.experiences ?? []);
  const [projects, setProjects] = useState<Project[]>(profile?.projects ?? []);

  function update(key: string, value: string | number | undefined) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addSkill() {
    const clean = skillInput.trim();
    if (clean && !skills.includes(clean)) {
      setSkills((s) => [...s, clean]);
    }
    setSkillInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          gpa: form.gpa ? Number(form.gpa) : undefined,
          graduationYear: Number(form.graduationYear),
          institutionId: form.institutionId || undefined,
          skills,
          education,
          experiences,
          projects,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "Gagal menyimpan", "error");
        return;
      }
      showToast("Profil berhasil diperbarui!");
      router.refresh();
    } catch {
      showToast("Terjadi kesalahan", "error");
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "input";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-lg font-bold">Edit Profil</h2>
        <p className="mt-1 text-sm text-zinc-500">Perbarui data diri, skill, pendidikan, dan pengalamanmu.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Headline</label>
          <input value={form.headline} onChange={(e) => update("headline", e.target.value)} className={inputCls} placeholder="cth. Front-End Developer" />
        </div>
        <div>
          <label className="label">Jurusan</label>
          <input value={form.major} onChange={(e) => update("major", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="label">Institusi</label>
          <select value={form.institutionId} onChange={(e) => update("institutionId", e.target.value)} className={inputCls}>
            <option value="">-- Pilih institusi --</option>
            {institutions.map((i) => (
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Lokasi / Kota</label>
          <input value={form.location} onChange={(e) => update("location", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="label">Nomor HP</label>
          <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Tahun Lulus</label>
            <input type="number" value={form.graduationYear} onChange={(e) => update("graduationYear", Number(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className="label">IPK</label>
            <input type="number" step="0.01" min={0} max={4} value={form.gpa ?? ""} onChange={(e) => update("gpa", e.target.value ? Number(e.target.value) : undefined)} className={inputCls} placeholder="0 - 4.00" />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="label">Bio Singkat</label>
          <textarea value={form.bio} onChange={(e) => update("bio", e.target.value)} rows={3} className={`${inputCls} resize-none`} />
        </div>
      </div>

      {/* Skills */}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">Keahlian</p>
        <div className="flex gap-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
            className={inputCls}
            placeholder="Ketik skill lalu Enter"
            list="edit-skills"
          />
          <datalist id="edit-skills">
            {skillOptions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          <button type="button" onClick={addSkill} className="btn-secondary shrink-0">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s} className="badge bg-brand-50 text-brand-700 ring-1 ring-brand-200">
              {s}
              <button type="button" onClick={() => setSkills((prev) => prev.filter((x) => x !== s))} className="ml-1 text-brand-400 hover:text-brand-700">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Pendidikan</p>
          <button type="button" onClick={() => setEducation((e) => [...e, { school: "", degree: "", major: "" }])} className="btn-secondary !py-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" /> Tambah
          </button>
        </div>
        <div className="space-y-3">
          {education.length === 0 && <p className="rounded-xl bg-zinc-50 p-4 text-sm text-zinc-500">Belum ada data pendidikan.</p>}
          {education.map((edu, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-zinc-100 bg-zinc-50/60 p-4 sm:grid-cols-4">
              <input value={edu.school} onChange={(e) => setEducation((prev) => prev.map((x, idx) => (idx === i ? { ...x, school: e.target.value } : x)))} placeholder="Sekolah / Kampus" className={inputCls} />
              <input value={edu.major ?? ""} onChange={(e) => setEducation((prev) => prev.map((x, idx) => (idx === i ? { ...x, major: e.target.value } : x)))} placeholder="Jurusan" className={inputCls} />
              <input type="number" value={edu.endYear ?? ""} onChange={(e) => setEducation((prev) => prev.map((x, idx) => (idx === i ? { ...x, endYear: e.target.value ? Number(e.target.value) : undefined } : x)))} placeholder="Tahun lulus" className={inputCls} />
              <button type="button" onClick={() => setEducation((prev) => prev.filter((_, idx) => idx !== i))} className="rounded-xl border border-zinc-200 px-3 text-zinc-400 hover:text-rose-500">
                <Trash2 className="mx-auto h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Experiences */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Pengalaman</p>
          <button type="button" onClick={() => setExperiences((e) => [...e, { role: "", company: "" }])} className="btn-secondary !py-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" /> Tambah
          </button>
        </div>
        <div className="space-y-3">
          {experiences.length === 0 && <p className="rounded-xl bg-zinc-50 p-4 text-sm text-zinc-500">Belum ada pengalaman.</p>}
          {experiences.map((exp, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-zinc-100 bg-zinc-50/60 p-4 sm:grid-cols-2">
              <input value={exp.role} onChange={(e) => setExperiences((prev) => prev.map((x, idx) => (idx === i ? { ...x, role: e.target.value } : x)))} placeholder="Posisi" className={inputCls} />
              <input value={exp.company ?? ""} onChange={(e) => setExperiences((prev) => prev.map((x, idx) => (idx === i ? { ...x, company: e.target.value } : x)))} placeholder="Perusahaan" className={inputCls} />
              <input value={exp.description ?? ""} onChange={(e) => setExperiences((prev) => prev.map((x, idx) => (idx === i ? { ...x, description: e.target.value } : x)))} placeholder="Deskripsi / pencapaian" className={`${inputCls} sm:col-span-2`} />
              <button type="button" onClick={() => setExperiences((prev) => prev.filter((_, idx) => idx !== i))} className="rounded-xl border border-zinc-200 px-3 text-zinc-400 hover:text-rose-500">
                <Trash2 className="mx-auto h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Proyek</p>
          <button type="button" onClick={() => setProjects((p) => [...p, { name: "" }])} className="btn-secondary !py-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" /> Tambah
          </button>
        </div>
        <div className="space-y-3">
          {projects.length === 0 && <p className="rounded-xl bg-zinc-50 p-4 text-sm text-zinc-500">Belum ada proyek.</p>}
          {projects.map((proj, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-zinc-100 bg-zinc-50/60 p-4 sm:grid-cols-2">
              <input value={proj.name} onChange={(e) => setProjects((prev) => prev.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)))} placeholder="Nama proyek" className={inputCls} />
              <div className="flex gap-2">
                <input value={proj.link ?? ""} onChange={(e) => setProjects((prev) => prev.map((x, idx) => (idx === i ? { ...x, link: e.target.value } : x)))} placeholder="Link (opsional)" className={inputCls} />
                <button type="button" onClick={() => setProjects((prev) => prev.filter((_, idx) => idx !== i))} className="shrink-0 rounded-xl border border-zinc-200 px-3 text-zinc-400 hover:text-rose-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saving ? "Menyimpan..." : "Simpan Profil"}
      </button>
    </form>
  );
}
