"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RepaymentChartPoint } from "@/modules/analytics/types/analytics.types";
import {
  formatCompactCurrency,
  formatMonthLabel,
  toChartLabel,
  toChartNumber,
} from "./chartUtils";

interface RepaymentChartProps {
  data: RepaymentChartPoint[];
}

export function RepaymentChart({ data }: RepaymentChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Repayment Trend</CardTitle>
        <CardDescription className="text-xs">
          Monthly collections against expected repayment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            barCategoryGap="30%"
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonthLabel}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatCompactCurrency}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={64}
            />
            <Tooltip
              formatter={(value, name) => [
                formatCompactCurrency(toChartNumber(value)),
                name === "collected" ? "Collected" : "Expected",
              ]}
              labelFormatter={(label) => formatMonthLabel(toChartLabel(label))}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: "12px",
              }}
            />
            <Legend
              iconType="square"
              iconSize={8}
              wrapperStyle={{ fontSize: "11px" }}
              formatter={(value) =>
                value === "collected" ? "Collected" : "Expected"
              }
            />
            <Bar
              dataKey="collected"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
            <Bar dataKey="expected" fill="#d97706" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
