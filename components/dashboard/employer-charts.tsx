"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = ["#e11d48", "#f43f5e", "#fb7185", "#fda4af", "#a01221", "#fecdd3", "#e57387", "#c11022"];

export function FunnelChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#71717a" }} />
          <YAxis tick={{ fontSize: 11, fill: "#71717a" }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #e4e4e7", boxShadow: "0 8px 28px rgba(0,0,0,.08)", fontSize: 13 }}
          />
          <Bar dataKey="value" name="Kandidat" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SkillDistributionChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: "#71717a" }} allowDecimals={false} />
          <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11, fill: "#52525b" }} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #e4e4e7", boxShadow: "0 8px 28px rgba(0,0,0,.08)", fontSize: 13 }}
          />
          <Bar dataKey="value" name="Pelamar" fill="#e11d48" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
