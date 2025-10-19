
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { subscriptionsByPlanData } from "@/lib/data"

const chartConfig = {
  count: {
    label: "Subscriptions",
    color: "hsl(var(--primary))",
  },
}

export function SubscriptionByPlanChart() {
  if (!subscriptionsByPlanData || subscriptionsByPlanData.length === 0) {
    return (
      <div className="min-h-[250px] h-[250px] w-full flex items-center justify-center text-muted-foreground">
        No subscription data available.
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] h-[250px] w-full">
      <BarChart accessibilityLayer data={subscriptionsByPlanData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          className="text-xs"
        />
        <YAxis />
        <Tooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
