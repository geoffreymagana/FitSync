
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { topSellingItemsData } from "@/lib/data"
import { useMemo } from "react"

const chartConfig = {
  unitsSold: {
    label: "Units Sold",
    color: "hsl(var(--primary))",
  },
}

export function TopSellingItemsChart({ locationId }: { locationId: string }) {
  const data = useMemo(() => {
    return topSellingItemsData[locationId] || [];
  }, [locationId]);

  if (!data || data.length === 0) {
    return (
      <div className="min-h-[250px] h-[250px] w-full flex items-center justify-center text-muted-foreground">
        No sales data available.
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] h-[250px] w-full">
      <BarChart accessibilityLayer data={data} layout="vertical">
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          className="text-xs"
          width={80}
        />
        <XAxis dataKey="unitsSold" type="number" hide />
        <Tooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="unitsSold" fill="var(--color-unitsSold)" radius={4} layout="vertical" />
      </BarChart>
    </ChartContainer>
  )
}
