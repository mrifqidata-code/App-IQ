"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function RadarScoreChart({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="#94a3b8" strokeOpacity={0.4} />
          <PolarAngleAxis dataKey="label" tick={{ fill: "currentColor", fontSize: 12 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar dataKey="value" stroke={color} fill={color} fillOpacity={0.35} strokeWidth={2} />
          <Tooltip formatter={(v) => [`${v}/100`, ""]} separator="" />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

const discColors: Record<string, string> = { D: "#ef4444", I: "#f59e0b", S: "#10b981", C: "#3b82f6" };

export function DiscBarChart({ data }: { data: { key: string; label: string; value: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#94a3b8" strokeOpacity={0.25} />
          <XAxis dataKey="key" tick={{ fill: "currentColor", fontSize: 14, fontWeight: 700 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: "currentColor", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "#94a3b8", fillOpacity: 0.1 }}
            formatter={(v) => [`${v}%`, ""]}
            labelFormatter={(k) => data.find((d) => d.key === k)?.label ?? k}
            separator=""
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.key} fill={discColors[d.key]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
