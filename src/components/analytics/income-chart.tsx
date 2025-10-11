"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { monthlyIncomeData } from "@/lib/data"
import { useMemo } from "react"

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--primary))",
  },
}

export function IncomeChart({ locationId }: { locationId: string }) {
  const data = useMemo(() => {
    return monthlyIncomeData[locationId] || [];
  }, [locationId]);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          tickFormatter={(value) => `KES ${Number(value) / 1000}k`}
        />
        <Tooltip cursor={false} content={<ChartTooltipContent formatter={(value, name, props) => `KES ${Number(value).toLocaleString()}`} />} />
        <Bar dataKey="income" fill="var(--color-income)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
