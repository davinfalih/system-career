"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

export function SkillTrendChart({ data }: { data: { name: string; user: number; industry: number }[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="user" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e11d48" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#e11d48" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="industry" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#71717a" }} />
          <YAxis tick={{ fontSize: 12, fill: "#71717a" }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e4e4e7",
              boxShadow: "0 8px 28px rgba(0,0,0,.08)",
              fontSize: 13,
            }}
          />
          <Legend />
          <Area type="monotone" dataKey="user" name="Skill Kamu" stroke="#e11d48" strokeWidth={2} fill="url(#user)" />
          <Area type="monotone" dataKey="industry" name="Kebutuhan Industri" stroke="#0ea5e9" strokeWidth={2} fill="url(#industry)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ApplicationsChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="apps" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e11d48" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#e11d48" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#71717a" }} />
          <YAxis tick={{ fontSize: 12, fill: "#71717a" }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #e4e4e7", boxShadow: "0 8px 28px rgba(0,0,0,.08)", fontSize: 13 }}
          />
          <Area type="monotone" dataKey="value" name="Lamaran" stroke="#e11d48" strokeWidth={2} fill="url(#apps)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PlatformGrowthChart({ data }: { data: { name: string; users: number; jobs: number }[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e11d48" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#e11d48" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient id="gJobs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#71717a" }} />
          <YAxis tick={{ fontSize: 12, fill: "#71717a" }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #e4e4e7", boxShadow: "0 8px 28px rgba(0,0,0,.08)", fontSize: 13 }}
          />
          <Legend />
          <Bar dataKey="users" name="Pengguna" fill="url(#gUsers)" radius={[6, 6, 0, 0]} />
          <Bar dataKey="jobs" name="Lowongan" fill="url(#gJobs)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
