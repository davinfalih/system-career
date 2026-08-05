"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Loader2,
  Mail,
  Send,
  UserX,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { MatchRing } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export type BoardApplication = {
  id: string;
  status: string;
  matchScore: number | null;
  createdAt: string;
  job: { id: string; title: string };
  user: {
    id: string;
    name: string;
    email: string;
    major: string | null;
    gpa: number | null;
    graduationYear: number | null;
    institution: string | null;
    headline: string | null;
    skills: string[];
    education: { school: string; degree?: string; major?: string }[];
    experiences: { role: string; company?: string; description?: string }[];
    projects: { name: string; description?: string }[];
  };
  interview: { scheduledAt: string; link: string | null } | null;
};

const STATUS_LABELS: Record<string, string> = {
  SUBMITTED: "Terkirim",
  UNDER_REVIEW: "Ditinjau",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  ACCEPTED: "Diterima",
  REJECTED: "Ditolak",
};

const STATUS_VARIANTS: Record<string, "default" | "success" | "warning" | "info" | "danger"> = {
  SUBMITTED: "info",
  UNDER_REVIEW: "warning",
  SCREENING: "warning",
  INTERVIEW: "info",
  ACCEPTED: "success",
  REJECTED: "danger",
};

const NEXT_STATUS: Record<string, string[]> = {
  SUBMITTED: ["UNDER_REVIEW", "REJECTED"],
  UNDER_REVIEW: ["SCREENING", "INTERVIEW", "REJECTED"],
  SCREENING: ["INTERVIEW", "REJECTED"],
  INTERVIEW: ["ACCEPTED", "REJECTED"],
  ACCEPTED: [],
  REJECTED: [],
};

export function ApplicantsBoard({
  initialApplications,
  jobs,
  institutions,
}: {
  initialApplications: BoardApplication[];
  jobs: { id: string; title: string }[];
  institutions: string[];
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [applications, setApplications] = useState(initialApplications);
  const [jobFilter, setJobFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [institutionFilter, setInstitutionFilter] = useState("");
  const [minMatch, setMinMatch] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [interviewFor, setInterviewFor] = useState<BoardApplication | null>(null);
  const [interviewForm, setInterviewForm] = useState({ scheduledAt: "", link: "", notes: "" });
  const [scheduling, setScheduling] = useState(false);

  const filtered = useMemo(() => {
    return applications
      .filter((a) => (jobFilter ? a.job.id === jobFilter : true))
      .filter((a) => (statusFilter ? a.status === statusFilter : true))
      .filter((a) => (institutionFilter ? a.user.institution === institutionFilter : true))
      .filter((a) => (a.matchScore ?? 0) >= minMatch)
      .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
  }, [applications, jobFilter, statusFilter, institutionFilter, minMatch]);

  async function updateStatus(app: BoardApplication, status: string) {
    setUpdatingId(app.id);
    try {
      const res = await fetch(`/api/applications/${app.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "Gagal update", "error");
        return;
      }
      setApplications((prev) => prev.map((a) => (a.id === app.id ? { ...a, status } : a)));
      if (status === "ACCEPTED") showToast(`Kandidat ${app.user.name} diterima!`);
      if (status === "REJECTED") showToast("Kandidat ditolak", "info");
      if (status === "INTERVIEW") {
        setInterviewFor(app);
        setInterviewForm({ scheduledAt: "", link: "", notes: "" });
      }
      router.refresh();
    } finally {
      setUpdatingId(null);
    }
  }

  async function scheduleInterview(e: React.FormEvent) {
    e.preventDefault();
    if (!interviewFor) return;
    setScheduling(true);
    try {
      const res = await fetch(`/api/applications/${interviewFor.id}/interview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interviewForm),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "Gagal menjadwalkan", "error");
        return;
      }
      setApplications((prev) =>
        prev.map((a) =>
          a.id === interviewFor.id
            ? { ...a, status: "INTERVIEW", interview: { scheduledAt: interviewForm.scheduledAt, link: interviewForm.link || null } }
            : a
        )
      );
      showToast("Wawancara berhasil dijadwalkan!");
      setInterviewFor(null);
      router.refresh();
    } catch {
      showToast("Terjadi kesalahan", "error");
    } finally {
      setScheduling(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">Kandidat & ATS Board</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Pelamar terurut otomatis berdasarkan AI Match Score.
        </p>
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap items-center gap-3 p-4">
        <select value={jobFilter} onChange={(e) => setJobFilter(e.target.value)} className="input !w-auto !py-2 text-xs">
          <option value="">Semua Lowongan</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>{j.title}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input !w-auto !py-2 text-xs">
          <option value="">Semua Status</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select value={institutionFilter} onChange={(e) => setInstitutionFilter(e.target.value)} className="input !w-auto !py-2 text-xs">
          <option value="">Semua Institusi</option>
          {institutions.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Match ≥</span>
          <select value={minMatch} onChange={(e) => setMinMatch(Number(e.target.value))} className="input !w-auto !py-2 text-xs">
            <option value={0}>0%</option>
            <option value={40}>40%</option>
            <option value={60}>60%</option>
            <option value={80}>80%</option>
          </select>
        </div>
        <span className="ml-auto text-xs font-medium text-zinc-500">{filtered.length} kandidat</span>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card flex flex-col items-center p-14 text-center">
            <UserX className="h-10 w-10 text-zinc-300" />
            <p className="mt-3 font-semibold text-zinc-700">Tidak ada kandidat</p>
            <p className="mt-1 text-sm text-zinc-500">Coba ubah filter atau tunggu lamaran masuk.</p>
          </div>
        ) : (
          filtered.map((app) => {
            const expanded = expandedId === app.id;
            const nextStatuses = NEXT_STATUS[app.status] ?? [];
            return (
              <div key={app.id} className="card overflow-hidden">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4 sm:w-72">
                    <MatchRing value={app.matchScore ?? 0} size={56} />
                    <div className="min-w-0">
                      <p className="truncate font-bold text-zinc-900">{app.user.name}</p>
                      <p className="truncate text-xs text-zinc-500">{app.job.title}</p>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-500">
                      {app.user.institution && (
                        <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" />{app.user.institution}</span>
                      )}
                      {app.user.major && <span>· {app.user.major}</span>}
                      {app.user.gpa != null && <span>· GPA {app.user.gpa}</span>}
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {app.user.skills.slice(0, 5).map((s) => (
                        <span key={s} className="badge bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200">{s}</span>
                      ))}
                      {app.user.skills.length > 5 && (
                        <span className="badge bg-zinc-100 text-zinc-500">+{app.user.skills.length - 5}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Badge variant={STATUS_VARIANTS[app.status] ?? "neutral"}>{STATUS_LABELS[app.status] ?? app.status}</Badge>
                    {app.interview && (
                      <span className="flex items-center gap-1 text-[11px] text-brand-600">
                        <CalendarClock className="h-3.5 w-3.5" />
                        {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(app.interview.scheduledAt))}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-zinc-100 bg-zinc-50/60 px-5 py-3">
                  {nextStatuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(app, s)}
                      disabled={updatingId === app.id}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                        s === "ACCEPTED" && "bg-emerald-600 text-white hover:bg-emerald-700",
                        s === "REJECTED" && "bg-rose-100 text-rose-700 hover:bg-rose-200",
                        s === "INTERVIEW" && "bg-sky-600 text-white hover:bg-sky-700",
                        s === "SCREENING" && "bg-amber-500 text-white hover:bg-amber-600",
                        s === "UNDER_REVIEW" && "bg-zinc-700 text-white hover:bg-zinc-800",
                      )}
                    >
                      {updatingId === app.id ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                      {s === "ACCEPTED" ? "Terima" : s === "REJECTED" ? "Tolak" : s === "INTERVIEW" ? "Undang Interview" : STATUS_LABELS[s]}
                    </button>
                  ))}
                  <button
                    onClick={() => setExpandedId(expanded ? null : app.id)}
                    className="ml-auto flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-brand-600"
                  >
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {expanded ? "Tutup" : "Lihat Profil"}
                  </button>
                </div>

                {expanded && (
                  <div className="space-y-4 border-t border-zinc-100 p-5 animate-fade-up">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400">Kontak</p>
                        <a href={`mailto:${app.user.email}`} className="flex items-center gap-2 text-sm text-brand-600 hover:underline">
                          <Mail className="h-4 w-4" />
                          {app.user.email}
                        </a>
                        {app.user.headline && <p className="mt-1 text-sm text-zinc-600">{app.user.headline}</p>}
                      </div>
                      <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400">Pendidikan</p>
                        {app.user.education.length > 0 ? (
                          app.user.education.map((edu, i) => (
                            <p key={i} className="text-sm text-zinc-700">
                              {edu.school} {edu.major && <span className="text-zinc-400">· {edu.major}</span>}
                            </p>
                          ))
                        ) : (
                          <p className="text-sm text-zinc-500">{app.user.institution ?? "Belum diisi"} {app.user.major ? `· ${app.user.major}` : ""}</p>
                        )}
                      </div>
                    </div>
                    {app.user.experiences.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400">Pengalaman</p>
                        {app.user.experiences.map((exp, i) => (
                          <p key={i} className="text-sm text-zinc-700">{exp.role} - {exp.company}</p>
                        ))}
                      </div>
                    )}
                    {app.user.projects.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400">Proyek</p>
                        {app.user.projects.map((p, i) => (
                          <p key={i} className="text-sm text-zinc-700">{p.name}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Interview modal */}
      {interviewFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-fade-up">
            <h2 className="text-lg font-bold">Jadwalkan Wawancara</h2>
            <p className="mt-1 text-sm text-zinc-500">Dengan {interviewFor.user.name} untuk {interviewFor.job.title}</p>
            <form onSubmit={scheduleInterview} className="mt-5 space-y-4">
              <div>
                <label className="label">Tanggal & Waktu *</label>
                <input
                  required
                  type="datetime-local"
                  value={interviewForm.scheduledAt}
                  onChange={(e) => setInterviewForm({ ...interviewForm, scheduledAt: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Link Video Call</label>
                <input
                  value={interviewForm.link}
                  onChange={(e) => setInterviewForm({ ...interviewForm, link: e.target.value })}
                  className="input"
                  placeholder="https://meet.google.com/..."
                />
              </div>
              <div>
                <label className="label">Catatan</label>
                <textarea
                  value={interviewForm.notes}
                  onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                  rows={3}
                  className="input resize-none"
                  placeholder="Siapkan portofolio, dll."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setInterviewFor(null)} className="btn-secondary">Batal</button>
                <button type="submit" disabled={scheduling} className="btn-primary">
                  {scheduling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {scheduling ? "Menjadwalkan..." : "Kirim Undangan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
