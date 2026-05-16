"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LoanStatusBreakdown } from "@/modules/analytics/types/analytics.types";

interface LoanStatusChartProps {
  data: LoanStatusBreakdown[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#d19900",
  applied: "#2563eb",
  sanctioned: "#0f766e",
  disbursed: "#16a34a",
  closed: "#64748b",
  rejected: "#dc2626",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  applied: "Applied",
  sanctioned: "Sanctioned",
  disbursed: "Disbursed",
  closed: "Closed",
  rejected: "Rejected",
};

export function LoanStatusChart({ data }: LoanStatusChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    name: STATUS_LABELS[item.status] ?? item.status,
    fill: STATUS_COLORS[item.status] ?? "#64748b",
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Status Breakdown
        </CardTitle>
        <CardDescription className="text-xs">
          Distribution by current loan state
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="44%"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={3}
              dataKey="count"
            >
              {chartData.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value ?? 0, String(name)]}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: "12px",
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
