"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, FileCheck2, Loader2, Sparkles, Target, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { recommendCareers, analyzeSkillGap } from "@/lib/ai/recommend";

export function RecommendationWorkspace({
  initialSkills,
}: {
  initialSkills: string[];
}) {
  const { showToast } = useToast();
  const [skills] = useState<string[]>(initialSkills);
  const [dreamRole, setDreamRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [atsText, setAtsText] = useState("");
  const [atsResult, setAtsResult] = useState<{ score: number; strengths: string[]; improvements: string[]; keywordsMatched: string[] } | null>(null);
  const [atsLoading, setAtsLoading] = useState(false);

  const recommendations = useMemo(() => recommendCareers(skills), [skills]);
  const gap = useMemo(() => analyzeSkillGap(skills, dreamRole || undefined), [skills, dreamRole]);

  async function runRecommendations() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills, dreamRole, useAI: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "Gagal", "error");
        return;
      }
      if (data.advice) showToast(data.advice, "info");
    } catch {
      showToast("Gagal memproses rekomendasi", "error");
    } finally {
      setLoading(false);
    }
  }

  async function runATS() {
    if (atsText.trim().length < 10) {
      showToast("Tempel dulu teks CV-mu", "error");
      return;
    }
    setAtsLoading(true);
    try {
      const res = await fetch("/api/ai/ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: atsText }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "Gagal", "error");
        return;
      }
      setAtsResult(data);
    } catch {
      showToast("Gagal menganalisis ATS", "error");
    } finally {
      setAtsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Rekomendasi Karir AI</h1>
          <p className="mt-1 text-sm text-zinc-500">
            AI memetakan skill-mu ke peran industri dan menghitung kecocokan secara otomatis.
          </p>
        </div>
        <button onClick={runRecommendations} disabled={loading} className="btn-primary">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Memproses..." : "Jalankan Analisis AI"}
        </button>
      </div>

      {/* Skill gap hero */}
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-brand-600 to-rose-600 p-6 text-white">
          <h2 className="text-lg font-bold">Skill Gap Analysis</h2>
          <p className="mt-1 text-sm text-white/80">
            {gap[0]?.message ?? "Tambahkan skill di profilmu untuk melihat analisis kecocokan karir."}
          </p>
        </div>
        <div className="p-6">
          {gap[0] && (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-600">Kecocokan dengan {gap[0].role}</span>
                  <span className="font-bold text-brand-600">{gap[0].match}%</span>
                </div>
                <Progress value={gap[0].match} className="h-3" />
                <p className="mt-2 text-xs text-zinc-400">
                  {gap[0].match >= 80 ? "Kamu sangat cocok! Persiapkan portofolio." : gap[0].match >= 50 ? "Cukup cocok. Tingkatkan skill yang kurang." : "Masih butuh banyak persiapan."}
                </p>
              </div>
              <div>
                <p className="mb-3 text-sm font-semibold text-zinc-600">Skill yang perlu dipelajari:</p>
                {gap[0].missingSkills.length === 0 ? (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Tidak ada skill kurang. Kamu siap melamar!
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {gap[0].missingSkills.map((m) => (
                      <Badge key={m.name} variant={m.category === "Required" ? "danger" : "warning"}>
                        <XCircle className="h-3 w-3" />
                        {m.name}
                        {m.category === "Required" ? " · Wajib" : " · Plus"}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dream role input */}
      <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="label">
            <span className="flex items-center gap-2">
              <Target className="h-4 w-4 text-brand-500" />
              Posisi Impianmu
            </span>
          </label>
          <input
            value={dreamRole}
            onChange={(e) => setDreamRole(e.target.value)}
            className="input"
            placeholder="cth. Data Analyst"
            list="role-suggestions"
          />
          <datalist id="role-suggestions">
            {recommendations.map((r) => (
              <option key={r.title} value={r.title} />
            ))}
          </datalist>
        </div>
        <Link href="/dashboard/profile" className="btn-secondary">
          Kelola Skill
        </Link>
      </div>

      {/* Recommendations grid */}
      <div>
        <h2 className="mb-4 text-lg font-bold">Posisi yang Cocok untukmu</h2>
        {recommendations.length === 0 ? (
          <div className="card p-8 text-center">
            <Sparkles className="mx-auto h-10 w-10 text-brand-300" />
            <p className="mt-3 font-semibold text-zinc-700">Belum ada rekomendasi</p>
            <p className="mt-1 text-sm text-zinc-500">
              Tambahkan minimal 2 skill di profilmu untuk melihat rekomendasi karir.
            </p>
            <Link href="/dashboard/profile" className="btn-primary mt-4">Lengkapi Profil</Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((r) => (
              <div key={r.title} className="card flex flex-col p-5 transition hover:shadow-card-hover">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Target className="h-5 w-5" />
                  </div>
                  <Badge variant={r.match >= 80 ? "success" : r.match >= 50 ? "default" : "warning"}>
                    {r.match}% Match
                  </Badge>
                </div>
                <h3 className="mt-3 font-bold text-zinc-900">{r.title}</h3>
                <p className="text-xs text-zinc-500">{r.industry}</p>
                {r.missing.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1.5 text-xs font-medium text-zinc-400">Perlu ditingkatkan:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {r.missing.slice(0, 3).map((m) => (
                        <span key={m} className="badge bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <Link
                  href={`/jobs?q=${encodeURIComponent(r.title.split(" ")[0])}`}
                  className="btn-ghost mt-4 w-full !justify-between"
                >
                  Cari Lowongan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ATS Checker */}
      <div className="card p-6">
        <div className="flex items-center gap-2">
          <FileCheck2 className="h-5 w-5 text-brand-500" />
          <h2 className="font-bold">ATS Score Checker</h2>
        </div>
        <p className="mt-1 text-sm text-zinc-500">
          Tempel teks CV-mu untuk mendapatkan skor efektivitas dan saran perbaikan.
        </p>
        <textarea
          value={atsText}
          onChange={(e) => setAtsText(e.target.value)}
          rows={6}
          className="input mt-4 resize-none"
          placeholder="Tempel isi CV-mu di sini..."
        />
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button onClick={runATS} disabled={atsLoading} className="btn-primary">
            {atsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCheck2 className="h-4 w-4" />}
            {atsLoading ? "Menganalisis..." : "Cek Skor ATS"}
          </button>
          {atsResult && (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span className="font-bold text-brand-600">{atsResult.score}/100</span>
              {atsResult.score >= 70 ? "Sangat bagus!" : atsResult.score >= 50 ? "Cukup baik." : "Perlu banyak perbaikan."}
            </div>
          )}
        </div>

        {atsResult && (
          <div className="mt-5 grid gap-4 lg:grid-cols-2 animate-fade-up">
            <div>
              <p className="mb-2 text-sm font-semibold text-emerald-600">Kelebihan</p>
              <ul className="space-y-2">
                {atsResult.strengths.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-zinc-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-rose-600">Saran Perbaikan</p>
              <ul className="space-y-2">
                {atsResult.improvements.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-zinc-700">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
