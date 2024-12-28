"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, YAxis, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { entry: "1", mood: "😄", value: 5, label: "Very Happy" },
  { entry: "2", mood: "😊", value: 4, label: "Happy" },
  { entry: "3", mood: "😐", value: 3, label: "Neutral" },
  { entry: "4", mood: "😔", value: 2, label: "Sad" },
  { entry: "5", mood: "😢", value: 1, label: "Very Sad" },
  { entry: "6", mood: "😌", value: 4, label: "Relaxed" },
  { entry: "7", mood: "😤", value: 2, label: "Frustrated" },
  { entry: "8", mood: "😰", value: 2, label: "Anxious" },
  { entry: "9", mood: "🥱", value: 3, label: "Tired" },
  { entry: "10", mood: "🤗", value: 5, label: "Grateful" }
]

const chartConfig = {
  mood: {
    label: "Mental Wellbeing",
    color: "hsl(258.3 89.5% 66.3%)",
  }
} satisfies ChartConfig

export default function Component() {
  return (
    <Card className="shadow-none p-0 border-0 w-full">
      <CardHeader>
        <CardTitle>MENTAL WELLNESS TRACKER</CardTitle>
        <CardDescription>Track your emotional journey</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart 
            accessibilityLayer 
            data={chartData}
            margin={{ bottom: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis 
              dataKey="entry" 
              tickLine={false}
              axisLine={false}
              tick={({ x, y, payload }) => (
                <g transform={`translate(${x},${y})`}>
                  <text y={20} x={0} textAnchor="middle" fill="#666">
                    {chartData[payload.index].mood}
                  </text>
                  <text y={40} x={0} textAnchor="middle" fill="#666" fontSize="10">
                    {chartData[payload.index].label}
                  </text>
                </g>
              )}
            />
            <YAxis type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar 
              dataKey="value" 
              fill="var(--color-mood)" 
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
