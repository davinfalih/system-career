import Link from "next/link";
import { Briefcase, Building2, CalendarClock, CheckCircle2, Filter, TrendingUp, UserCheck, Users } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { serverApi } from "@/lib/api";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { FunnelChart, SkillDistributionChart } from "@/components/dashboard/employer-charts";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Dashboard HR" };

export default async function EmployerDashboardPage() {
  const user = await getCurrentUser();
  if (!user || !user.companyId) return null;

  const [{ data: statsData }, { data: jobsData }, { data: appsData }] = await Promise.all([
    serverApi("/employer/stats"),
    serverApi("/employer/jobs"),
    serverApi("/employer/applications"),
  ]);

  const company = statsData.company;
  const interviews = statsData.interviews;
  const jobs = jobsData.jobs;
  const applications = appsData.applications;

  const openJobs = jobs.filter((j) => j.status === "OPEN").length;
  const acceptedCount = applications.filter((a) => a.status === "ACCEPTED").length;
  const rejectedCount = applications.filter((a) => a.status === "REJECTED").length;
  const inProgressCount = applications.filter((a) => ["SUBMITTED", "UNDER_REVIEW", "SCREENING", "INTERVIEW"].includes(a.status)).length;

  const funnelData = [
    { name: "Pelamar", value: applications.length },
    { name: "AI Screening", value: applications.filter((a) => ["SCREENING", "UNDER_REVIEW", "INTERVIEW", "ACCEPTED"].includes(a.status)).length },
    { name: "Interview", value: applications.filter((a) => ["INTERVIEW", "ACCEPTED"].includes(a.status)).length },
    { name: "Diterima", value: acceptedCount },
  ];

  const skillsCount = new Map<string, number>();
  applications.forEach((a) => {
    try {
      const skills = JSON.parse(a.user.profile?.skills ?? "[]") as string[];
      skills.forEach((s) => skillsCount.set(s, (skillsCount.get(s) ?? 0) + 1));
    } catch {
      /* ignore */
    }
  });
  const skillData = Array.from(skillsCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">{company?.name ?? "Dashboard"}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Pantau rekrutmen, kandidat, dan performa lowonganmu.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/employer/jobs" className="btn-secondary">
            <Briefcase className="h-4 w-4" />
            Kelola Lowongan
          </Link>
          <Link href="/employer/applicants" className="btn-primary">
            <Users className="h-4 w-4" />
            Lihat Kandidat
          </Link>
        </div>
      </div>

      {!company?.verified && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <Building2 className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Perusahaan belum terverifikasi</p>
            <p className="mt-0.5">
              Lengkapi profil perusahaan dan dokumen legal di menu <Link href="/employer/settings" className="font-semibold underline">Pengaturan</Link> agar lowonganmu terverifikasi.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Briefcase} label="Lowongan Aktif" value={openJobs} hint={`${jobs.length} total`} />
        <StatCard icon={Users} label="Total Kandidat" value={applications.length} hint="Semua lamaran masuk" accent="info" />
        <StatCard icon={UserCheck} label="Proses Berjalan" value={inProgressCount} hint="Menunggu keputusan" accent="warning" />
        <StatCard icon={CheckCircle2} label="Diterima" value={acceptedCount} hint={`${rejectedCount} ditolak`} accent="success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold">Applicant Funnel</h2>
              <p className="text-sm text-zinc-500">Pelamar → AI Screening → Interview → Diterima</p>
            </div>
            <TrendingUp className="h-5 w-5 text-brand-500" />
          </div>
          <FunnelChart data={funnelData} />
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold">Top Skills Pelamar</h2>
              <p className="text-sm text-zinc-500">Skill paling banyak dimiliki pelamar</p>
            </div>
            <Filter className="h-5 w-5 text-brand-500" />
          </div>
          {skillData.length === 0 ? (
            <p className="py-12 text-center text-sm text-zinc-400">Belum ada data skill pelamar.</p>
          ) : (
            <SkillDistributionChart data={skillData} />
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Lowongan Terbaru</h2>
            <Link href="/employer/jobs" className="text-sm font-semibold text-brand-600 hover:text-brand-700">Kelola</Link>
          </div>
          <div className="space-y-3">
            {jobs.slice(0, 5).map((job) => (
              <div key={job.id} className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-800">{job.title}</p>
                  <p className="text-xs text-zinc-500">{job._count.applications} kandidat</p>
                </div>
                <Badge variant={job.status === "OPEN" ? "success" : job.status === "DRAFT" ? "neutral" : "danger"}>
                  {job.status === "OPEN" ? "Aktif" : job.status === "DRAFT" ? "Draft" : "Tutup"}
                </Badge>
              </div>
            ))}
            {jobs.length === 0 && (
              <div className="rounded-xl bg-zinc-50 p-6 text-center text-sm text-zinc-500">
                Belum ada lowongan. <Link href="/employer/jobs" className="font-semibold text-brand-600">Buat sekarang</Link>
              </div>
            )}
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Wawancara Mendatang</h2>
            <Link href="/employer/interviews" className="text-sm font-semibold text-brand-600 hover:text-brand-700">Lihat semua</Link>
          </div>
          <div className="space-y-3">
            {interviews.slice(0, 5).map((inv) => (
              <div key={inv.id} className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-800">{inv.application.user.name}</p>
                  <p className="truncate text-xs text-zinc-500">{inv.application.job.title}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-zinc-500">
                  <CalendarClock className="h-3.5 w-3.5 text-brand-500" />
                  {formatDate(inv.scheduledAt)}
                </span>
              </div>
            ))}
            {interviews.length === 0 && (
              <p className="rounded-xl bg-zinc-50 p-6 text-center text-sm text-zinc-500">Belum ada jadwal wawancara.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
