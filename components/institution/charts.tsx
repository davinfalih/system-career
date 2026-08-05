"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie, Legend } from "recharts";

const COLORS = ["#e11d48", "#f43f5e", "#0ea5e9", "#f59e0b"];

export function TracerStudyChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#71717a" }} />
          <YAxis tick={{ fontSize: 11, fill: "#71717a" }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #e4e4e7", boxShadow: "0 8px 28px rgba(0,0,0,.08)", fontSize: 13 }}
          />
          <Bar dataKey="value" name="Lulusan" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PlacementDonut({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #e4e4e7", boxShadow: "0 8px 28px rgba(0,0,0,.08)", fontSize: 13 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
