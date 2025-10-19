
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { revenuePerMemberData } from "@/lib/data"
import { useMemo } from "react"

const chartConfig = {
  arpu: {
    label: "ARPU",
    color: "hsl(var(--primary))",
  },
}

export function RevenuePerMemberChart({ locationId }: { locationId: string }) {
  const data = useMemo(() => {
    const locationData = revenuePerMemberData[locationId] || [];
    if (locationData.length === 0) return [];
    return locationData.map(item => ({
      ...item,
      month: item.month.slice(0, 3)
    }));
  }, [locationId]);

  if (!data || data.length === 0) {
    return (
      <div className="min-h-[250px] h-[250px] w-full flex items-center justify-center text-muted-foreground">
        No ARPU data available for this period.
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] h-[250px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis tickFormatter={(value) => `KES ${value.toLocaleString()}`} />
        <Tooltip cursor={false} content={<ChartTooltipContent formatter={(value) => `KES ${Number(value).toLocaleString()}`} />} />
        <Bar dataKey="arpu" fill="var(--color-arpu)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
