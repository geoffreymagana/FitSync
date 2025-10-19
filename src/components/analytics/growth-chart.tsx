
"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { membershipGrowthData } from "@/lib/data"
import { useMemo } from "react"

const chartConfig = {
  total: {
    label: "Total Members",
    color: "hsl(var(--primary))",
  },
  new: {
    label: "New Members",
    color: "hsl(var(--accent))",
  },
}

export function GrowthChart({ locationId }: { locationId: string }) {
  const data = useMemo(() => {
    return membershipGrowthData[locationId] || [];
  }, [locationId]);

  if (!data || data.length === 0) {
    return (
      <div className="min-h-[250px] h-[250px] w-full flex items-center justify-center text-muted-foreground">
        No membership data available for this period.
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] h-[250px] w-full">
        <AreaChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
            />
             <YAxis
                tickFormatter={(value) => `${Number(value) / 1000}k`}
                yAxisId="left"
            />
            <YAxis
                orientation="right"
                yAxisId="right"
            />
            <Tooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
                 <linearGradient id="fillNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                </linearGradient>
            </defs>
            <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" fill="url(#fillTotal)" strokeWidth={2} yAxisId="left" />
            <Area type="monotone" dataKey="new" stroke="hsl(var(--accent))" fill="url(#fillNew)" strokeWidth={2} yAxisId="right" />
        </AreaChart>
    </ChartContainer>
  )
}
