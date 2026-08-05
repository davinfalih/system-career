import { getCurrentUser } from "@/lib/session";
import { serverApi, apiFetch } from "@/lib/api";
import { ApplicantsBoard } from "@/components/employer/applicants-board";

export const metadata = { title: "Kandidat / ATS Board" };

export default async function ApplicantsPage() {
  const user = await getCurrentUser();
  if (!user || !user.companyId) return null;

  const [{ data: appsData }, { data: jobsData }, { data: institutionsData }] = await Promise.all([
    serverApi("/employer/applications"),
    serverApi("/employer/jobs"),
    apiFetch("/meta/institutions"),
  ]);

  const applications = appsData.applications;
  const jobs = jobsData.jobs;
  const institutions = institutionsData.institutions;

  const serialized = applications.map((a) => ({
    id: a.id,
    status: a.status,
    matchScore: a.matchScore,
    createdAt: a.createdAt,
    job: { id: a.job.id, title: a.job.title },
    user: {
      id: a.user.id,
      name: a.user.name,
      email: a.user.email,
      major: a.user.major,
      gpa: a.user.gpa,
      graduationYear: a.user.graduationYear,
      institution: a.user.institution?.name ?? null,
      headline: a.user.profile?.headline ?? null,
      skills: safeParse(a.user.profile?.skills ?? "[]", []),
      education: safeParse(a.user.profile?.education ?? "[]", []),
      experiences: safeParse(a.user.profile?.experiences ?? "[]", []),
      projects: safeParse(a.user.profile?.projects ?? "[]", []),
    },
    interview: a.interview ? { scheduledAt: a.interview.scheduledAt, link: a.interview.link } : null,
  }));

  return (
    <ApplicantsBoard
      initialApplications={serialized}
      jobs={jobs.map((j) => ({ id: j.id, title: j.title }))}
      institutions={institutions.map((i) => i.name)}
    />
  );
}

function safeParse(value: string, fallback: unknown) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
