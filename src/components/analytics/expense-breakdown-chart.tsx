
"use client"

import { Pie, PieChart, Tooltip, Cell } from "recharts"
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { expenseBreakdownData } from "@/lib/data"
import { useMemo } from "react"
import { FinancialBreakdown } from "@/lib/types"

const COLORS = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE", "#8884d8"];

export function ExpenseBreakdownChart({ locationId }: { locationId: string }) {
  const { data, config } = useMemo(() => {
    const locationData: FinancialBreakdown[] = expenseBreakdownData[locationId] || [];
    const chartData = locationData.map((item, index) => ({
      ...item,
      fill: COLORS[index % COLORS.length]
    }));

    const chartConfig = locationData.reduce((acc, item, index) => {
      acc[item.name] = {
        label: item.name,
        color: COLORS[index % COLORS.length]
      };
      return acc;
    }, {} as any);

    return { data: chartData, config: chartConfig };
  }, [locationId]);

  return (
    <ChartContainer config={config} className="min-h-[200px] w-full aspect-square">
      <PieChart>
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent nameKey="name" hideLabel formatter={(value) => `KES ${Number(value).toLocaleString()}`} />}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
      </PieChart>
    </ChartContainer>
  )
}
