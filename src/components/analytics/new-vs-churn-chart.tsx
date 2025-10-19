
"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { newVsChurnData } from "@/lib/data"
import { useMemo } from "react"

const chartConfig = {
  new: {
    label: "New Members",
    color: "hsl(var(--chart-2))",
  },
  churned: {
    label: "Churned Members",
    color: "hsl(var(--chart-5))",
  },
}

export function NewVsChurnChart({ locationId }: { locationId: string }) {
  const data = useMemo(() => {
    const locationData = newVsChurnData[locationId] || [];
    if (locationData.length === 0) return [];
    return locationData.map(item => ({
      ...item,
      month: item.month.slice(0, 3)
    }));
  }, [locationId]);

  if (!data || data.length === 0) {
    return (
      <div className="min-h-[250px] h-[250px] w-full flex items-center justify-center text-muted-foreground">
        No data available for this period.
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] h-[250px] w-full">
      <LineChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis />
        <Tooltip cursor={false} content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="new" stroke="var(--color-new)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="churned" stroke="var(--color-churned)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  )
}
