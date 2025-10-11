"use client"

import { Pie, PieChart, Tooltip, Cell } from "recharts"
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { classOccupancyData } from "@/lib/data"
import { useMemo } from "react"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function ClassOccupancyChart({ locationId }: { locationId: string }) {
  const { data, config } = useMemo(() => {
    const locationData = classOccupancyData[locationId] || [];
    const chartData = locationData.map((item, index) => ({
        name: item.name,
        value: item.booked,
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
      <PieChart accessibilityLayer>
        <Tooltip cursor={false} content={<ChartTooltipContent nameKey="name" hideLabel />} />
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
