"use client";

import React, { useState, useSyncExternalStore } from "react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { StockHistoryPoint } from "../../lib/types";
import { formatINR } from "../../lib/utils/formatters";
import { TrendingUp, Activity } from "lucide-react";

const emptySubscribe = () => () => {};

interface StockHistoryChartProps {
  history: StockHistoryPoint[];
  currentPrice: number;
  change: number;
  changePercent: number;
}

export function StockHistoryChart({
  history,
  currentPrice,
  change,
  changePercent,
}: StockHistoryChartProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [range, setRange] = useState<"1D" | "1W" | "1M" | "6M" | "1Y" | "ALL">("1M");
  const [chartType, setChartType] = useState<"area" | "line">("area");

  const sliceCount = range === "1D" ? 6 : range === "1W" ? 10 : range === "1M" ? 18 : range === "6M" ? 25 : 30;
  const filteredData = history.slice(-sliceCount);

  const isUp = change >= 0;
  const strokeColor = isUp ? "#00E599" : "#E63946";

  if (!isMounted) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-white rounded-3xl border border-[#D3E5DC] font-mono text-xs text-[#587F6E]">
        <span>Loading market trajectory...</span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-3xl sm:text-4xl text-[#071912] font-semibold tabular-nums">
              {formatINR(currentPrice, { showPaise: true })}
            </span>
            <div
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                isUp
                  ? "bg-[#E6F9F1] text-[#00A86B]"
                  : "bg-[#FDF0F1] text-[#E63946]"
              }`}
            >
              <span>{isUp ? "+" : ""}{formatINR(change, { showPaise: true })}</span>
              <span>({isUp ? "+" : ""}{changePercent.toFixed(2)}%)</span>
            </div>
          </div>
          <p className="text-xs text-[#587F6E] mt-1 font-mono">
            Past {range} Performance • Real-time Simulation Engine
          </p>
        </div>

        {/* Controls: Chart Style + Timeframe - Inspired by Image 1 */}
        <div className="flex items-center gap-2">
          {/* Chart mode toggle */}
          <div className="hidden sm:flex items-center bg-[#EDF6F2] p-1 rounded-full border border-[#D3E5DC]">
            <button
              onClick={() => setChartType("area")}
              className={`px-2.5 py-1 text-[11px] font-sans font-semibold rounded-full transition-all ${
                chartType === "area"
                  ? "bg-[#0A1D16] text-[#00E599] shadow-xs"
                  : "text-[#587F6E] hover:text-[#071912]"
              }`}
            >
              Spline
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`px-2.5 py-1 text-[11px] font-sans font-semibold rounded-full transition-all ${
                chartType === "line"
                  ? "bg-[#0A1D16] text-[#00E599] shadow-xs"
                  : "text-[#587F6E] hover:text-[#071912]"
              }`}
            >
              Line
            </button>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center gap-1 bg-[#EDF6F2] p-1 rounded-full border border-[#D3E5DC]">
            {(["1D", "1W", "1M", "6M", "1Y", "ALL"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`px-2.5 py-1 text-[10px] font-mono rounded-full font-semibold transition-all ${
                  range === r
                    ? "bg-[#0A1D16] text-[#00E599] shadow-xs"
                    : "text-[#587F6E] hover:text-[#071912]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="detailGainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00E599" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00E599" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="detailLossGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E63946" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#E63946" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="date"
              stroke="#587F6E"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(str) => {
                const parts = str.split("-");
                return parts.length >= 3 ? `${parts[2]}/${parts[1]}` : str;
              }}
            />
            <YAxis
              domain={["auto", "auto"]}
              stroke="#587F6E"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${Math.round(v)}`}
              orientation="right"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as StockHistoryPoint;
                  return (
                    <div className="rounded-xl border border-[#163628] bg-[#0A1D16] p-2.5 text-white shadow-xl text-xs font-mono">
                      <div className="text-[10px] text-zinc-400">{data.date}</div>
                      <div className="font-bold text-[#00E599] text-sm mt-0.5">
                        {formatINR(data.price, { showPaise: true })}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={2.5}
              fillOpacity={chartType === "area" ? 1 : 0}
              fill={isUp ? "url(#detailGainGrad)" : "url(#detailLossGrad)"}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
