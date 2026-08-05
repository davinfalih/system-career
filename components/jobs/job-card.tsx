import Link from "next/link";
import { Briefcase, Building2, Calendar, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";

export type JobWithCompany = {
  id: string;
  title: string;
  type: string;
  mode: string;
  location: string | null;
  salary: string | null;
  description: string;
  forFreshGrads: boolean;
  createdAt: Date;
  company: { name: string; industry: string; verified: boolean };
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

export function JobCard({ job }: { job: JobWithCompany }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="card group flex flex-col p-6 transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
          <Briefcase className="h-6 w-6" />
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          <Badge variant={job.forFreshGrads ? "success" : "neutral"}>
            {job.forFreshGrads ? "Fresh Grad" : "Experienced"}
          </Badge>
          <Badge variant="default">{TYPE_LABELS[job.type] ?? job.type}</Badge>
        </div>
      </div>

      <h3 className="mt-4 text-base font-bold text-zinc-900 group-hover:text-brand-700">
        {job.title}
      </h3>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-500">
        <span className="flex items-center gap-1">
          <Building2 className="h-3.5 w-3.5" />
          {job.company.name}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {job.location ?? "Remote"}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {MODE_LABELS[job.mode] ?? job.mode}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 flex-1 text-sm text-zinc-600">{job.description}</p>

      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
        <p className="text-sm font-semibold text-brand-600">{job.salary ?? "Dibicarakan"}</p>
        <span className="flex items-center gap-1 text-xs text-zinc-400">
          <Calendar className="h-3.5 w-3.5" />
          {timeAgo(job.createdAt)}
        </span>
      </div>
    </Link>
  );
}
