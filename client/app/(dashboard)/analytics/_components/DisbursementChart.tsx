"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
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
import type { DisbursementChartPoint } from "@/modules/analytics/types/analytics.types";
import {
  formatCompactCurrency,
  formatMonthLabel,
  toChartLabel,
  toChartNumber,
} from "./chartUtils";

interface DisbursementChartProps {
  data: DisbursementChartPoint[];
}

export function DisbursementChart({ data }: DisbursementChartProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Disbursement Trend
        </CardTitle>
        <CardDescription className="text-xs">
          Principal disbursed over the last 180 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="disbursementGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.22} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
            <XAxis
              dataKey="date"
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
              formatter={(value) => [
                formatCompactCurrency(toChartNumber(value)),
                "Disbursed",
              ]}
              labelFormatter={(label) => formatMonthLabel(toChartLabel(label))}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="totalAmount"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#disbursementGrad)"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
