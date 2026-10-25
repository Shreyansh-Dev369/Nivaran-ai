"use client";

import React, { useSyncExternalStore } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatINR } from "../../lib/utils/formatters";
import { Holding } from "../../lib/types";

interface DonutItem {
  name: string;
  value: number;
  percentage: number;
}

interface AllocationDonutChartProps {
  data?: DonutItem[];
  holdings?: Holding[];
  cashBalance?: number;
  totalValue?: number;
  centerLabel?: string;
  centerSublabel?: string;
}

const PALETTE = [
  "#0A1D16", // Velvet Forest Obsidian
  "#00E599", // Radiant Mint
  "#143D2D", // Deep Pine
  "#00A86B", // Emerald
  "#235D47", // Medium Pine
  "#587F6E", // Muted Pine
  "#7C3AED", // Accent Lavender / Violet
  "#3B82F6", // Clean Blue
];

const emptySubscribe = () => () => {};

export function AllocationDonutChart({
  data,
  holdings,
  cashBalance = 0,
  totalValue = 0,
  centerLabel,
  centerSublabel = "Total Equities",
}: AllocationDonutChartProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  let chartData: DonutItem[] = [];

  if (data && data.length > 0) {
    chartData = data;
  } else if (holdings && holdings.length > 0) {
    const total = totalValue || holdings.reduce((sum, h) => sum + h.currentValue, 0) + cashBalance;
    const sectorMap: Record<string, number> = {};
    holdings.forEach((h) => {
      sectorMap[h.sector] = (sectorMap[h.sector] || 0) + h.currentValue;
    });

    chartData = Object.entries(sectorMap).map(([name, value]) => ({
      name,
      value: Math.round(value),
      percentage: Math.max(1, Math.round((value / (total || 1)) * 100)),
    }));

    if (cashBalance > 0) {
      chartData.push({
        name: "Demo Cash Liquidity",
        value: Math.round(cashBalance),
        percentage: Math.max(1, Math.round((cashBalance / (total || 1)) * 100)),
      });
    }
  }

  if (!isMounted || chartData.length === 0) {
    return (
      <div className="h-52 w-full flex items-center justify-center bg-white rounded-2xl border border-[#D3E5DC] font-mono text-xs text-[#587F6E]">
        <span>No active sector allocations</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center space-y-4 font-sans">
      <div className="relative h-48 w-full max-w-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as DonutItem;
                  return (
                    <div className="rounded-xl border border-[#163628] bg-[#0A1D16] text-white p-2.5 shadow-xl font-sans text-xs space-y-1">
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="font-mono text-[#00E599] font-bold tabular-nums">
                        {item.percentage}% ({formatINR(item.value)})
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={chartData}
              innerRadius={56}
              outerRadius={78}
              paddingAngle={3}
              dataKey="value"
              stroke="transparent"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-serif text-base font-bold text-[#071912] tabular-nums leading-none">
            {centerLabel || "100%"}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#587F6E] mt-0.5">
            {centerSublabel}
          </span>
        </div>
      </div>

      {/* Structured Legend Table */}
      <div className="w-full divide-y divide-[#D3E5DC] border-t border-[#D3E5DC] text-xs font-sans">
        {chartData.slice(0, 5).map((item, idx) => (
          <div key={item.name} className="py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}
              />
              <span className="text-[#071912] truncate text-xs">{item.name}</span>
            </div>
            <span className="font-mono text-[#0A1D16] font-bold tabular-nums shrink-0 ml-2">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
