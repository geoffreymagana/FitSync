"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { peakHoursData } from "@/lib/data"
import { useMemo } from "react"

const chartConfig = {
  members: {
    label: "Members",
    color: "hsl(var(--accent))",
  },
}

export function PeakHoursChart({ locationId }: { locationId: string }) {
  const data = useMemo(() => {
    return peakHoursData[locationId] || [];
  }, [locationId]);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="hour"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
           tickFormatter={(value) => `${value}`}
        />
        <Tooltip cursor={false} content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="members" stroke="var(--color-members)" strokeWidth={2} />
      </LineChart>
    </ChartContainer>
  )
}
