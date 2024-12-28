"use client";

import { TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [{ month: "january", desktop: 1260, mobile: 570 }];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(214.3 31.8% 91.4%)",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(263.4 70% 50.4%)",
  },
} satisfies ChartConfig;

export default function Component() {
  const totalVisitors = chartData[0].desktop + chartData[0].mobile;

  return (
    <Card className="flex flex-col shadow-none border-0">
      <CardHeader className="items-center pb-0">
        <CardTitle>SLEEP TRACER</CardTitle>
        <CardDescription>Track your sleep</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="desktop"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-desktop)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="mobile"
              fill="var(--color-mobile)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col text-sm w-full">
        <div className="flex items-start font-medium leading-none flex-col gap-1">
         <div className="bg-slate-300 rounded-full p-1">13 to 18 years: 8 to 10 hours</div>  
          <div className="bg-slate-300 rounded-full p-1">18 to 64 years: 7 to 9 hours </div>
          <div className="bg-slate-300 rounded-full p-1"> {`>`} 64 years: 7 to 8 hours</div>
          {/* <TrendingUp className="h-4 w-4" /> */}
        </div>
      </CardFooter>
    </Card>
  );
}
