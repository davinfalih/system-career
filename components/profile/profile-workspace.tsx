"use client";

import { useState } from "react";
import { FileUp, ListChecks, PencilLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { CvUploadTab } from "./cv-upload-tab";
import { GuidedBuilderTab } from "./guided-builder-tab";
import { EditProfileTab } from "./edit-profile-tab";

export type Education = { school: string; degree?: string; major?: string; startYear?: number; endYear?: number };
export type Experience = { role: string; company?: string; start?: string; end?: string; description?: string };
export type Project = { name: string; description?: string; link?: string };

export type ProfileWorkspaceData = {
  user: {
    name: string;
    email: string;
    major: string | null;
    graduationYear: number | null;
    gpa: number | null;
    nim: string | null;
    institutionId: string | null;
  };
  profile: {
    headline: string | null;
    bio: string | null;
    location: string | null;
    phone: string | null;
    skills: string[];
    education: Education[];
    experiences: Experience[];
    projects: Project[];
    cvScore: number;
    atsScore: number;
  } | null;
  hasAIReview: boolean;
};

const TABS = [
  { id: "upload", label: "Unggah CV", icon: FileUp, desc: "Analisis CV dengan AI" },
  { id: "builder", label: "Builder Terpandu", icon: ListChecks, desc: "Belum punya CV? Isi di sini" },
  { id: "edit", label: "Edit Profil", icon: PencilLine, desc: "Perbarui data manual" },
];

export function ProfileWorkspace({
  initialData,
  institutions,
  skillOptions,
}: {
  initialData: ProfileWorkspaceData;
  institutions: { id: string; name: string; type: string }[];
  skillOptions: string[];
}) {
  const [activeTab, setActiveTab] = useState<"upload" | "builder" | "edit">("upload");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">Profil & CV</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Unggah CV untuk analisis AI, gunakan builder terpandu, atau edit profil secara manual.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition",
              activeTab === tab.id
                ? "border-brand-600 bg-brand-50"
                : "border-zinc-200 bg-white hover:border-brand-200"
            )}
          >
            <div className={cn(
              "rounded-xl p-2.5 transition",
              activeTab === tab.id ? "bg-brand-600 text-white" : "bg-zinc-100 text-zinc-500"
            )}>
              <tab.icon className="h-5 w-5" />
            </div>
            <div>
              <p className={cn("text-sm font-bold", activeTab === tab.id ? "text-brand-700" : "text-zinc-800")}>
                {tab.label}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">{tab.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="card p-6">
        {activeTab === "upload" && (
          <CvUploadTab initialData={initialData} />
        )}
        {activeTab === "builder" && (
          <GuidedBuilderTab initialData={initialData} skillOptions={skillOptions} />
        )}
        {activeTab === "edit" && (
          <EditProfileTab
            initialData={initialData}
            institutions={institutions}
            skillOptions={skillOptions}
          />
        )}
      </div>
    </div>
  );
}
