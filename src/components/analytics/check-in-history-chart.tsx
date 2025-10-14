"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { checkInHistoryData } from "@/lib/data"
import { useMemo } from "react"
import { format, parseISO } from "date-fns"

const chartConfig = {
  checkIns: {
    label: "Check-ins",
    color: "hsl(var(--primary))",
  },
}

export function CheckInHistoryChart({ locationId }: { locationId: string }) {
  const data = useMemo(() => {
    return (checkInHistoryData[locationId] || []).map(item => ({
      ...item,
      date: format(parseISO(item.date), "MMM d")
    }));
  }, [locationId]);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis />
        <Tooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="checkIns" fill="var(--color-checkIns)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
