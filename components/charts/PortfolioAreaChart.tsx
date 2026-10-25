"use client";

import React, { useState } from "react";
import { formatINR, formatPercent } from "../../lib/utils/formatters";

interface ChartPoint {
  date: string;
  value: number;
  benchmarkNifty: number;
  benchmarkSensex: number;
  pctReturn: number;
  x: number;
  y: number;
}

interface PortfolioAreaChartProps {
  currentValue: number;
  initialInvested: number;
}

export function PortfolioAreaChart({
  currentValue,
  initialInvested,
}: PortfolioAreaChartProps) {
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M" | "6M" | "1Y" | "ALL">("1M");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [showBenchmarks, setShowBenchmarks] = useState(true);

  if (initialInvested === 0 && currentValue === 0) {
    return (
      <div className="h-64 w-full flex flex-col items-center justify-center p-6 text-center rounded-3xl border border-[#D3E5DC] bg-white space-y-2 font-sans shadow-xs">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00A86B] font-bold">
          Ledger Initialized
        </span>
        <h4 className="font-serif text-lg text-[#071912] font-medium">
          No Active Investments Recorded
        </h4>
        <p className="text-xs text-[#587F6E] max-w-sm leading-relaxed">
          Simulated trajectory charts will populate deterministically once your automated plan deploys funds into qualifying Indian equities.
        </p>
      </div>
    );
  }

  const pointsCount = timeframe === "1D" ? 12 : timeframe === "1W" ? 18 : timeframe === "1M" ? 24 : timeframe === "6M" ? 36 : 48;
  const startMultiplier = timeframe === "1D" ? 0.995 : timeframe === "1W" ? 0.985 : timeframe === "1M" ? 0.94 : timeframe === "6M" ? 0.88 : 0.82;
  const startValue = Math.round(initialInvested * startMultiplier);
  const totalDelta = currentValue - startValue;

  const width = 640;
  const height = 230;
  const padLeft = 10;
  const padRight = 10;
  const padTop = 30;
  const padBottom = 30;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  // Generate deterministic points with benchmark comparison
  const rawPoints: { date: string; value: number; benchmarkNifty: number; benchmarkSensex: number; pctReturn: number }[] = [];
  const now = new Date("2026-10-24T12:00:00Z");
  const dayStep = timeframe === "1Y" || timeframe === "ALL" ? 4 : timeframe === "6M" ? 3 : timeframe === "1M" ? 1 : 0.25;

  for (let i = 0; i < pointsCount; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - (pointsCount - 1 - i) * dayStep);

    const progress = i / (pointsCount - 1);
    const sineWave = Math.sin(i * 0.45) * (initialInvested * 0.015);
    const val = i === pointsCount - 1 ? currentValue : Math.round(startValue + totalDelta * progress + sineWave);

    const pct = ((val - startValue) / (startValue || 1)) * 100;
    const niftyVal = startValue * (1 + (pct * 0.65 - 1.2) / 100);
    const sensexVal = startValue * (1 + (pct * 0.55 + 0.4) / 100);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dateLabel = timeframe === "1D" ? `${9 + Math.floor(i * 0.5)}:00` : `${d.getDate()} ${monthNames[d.getMonth()]}`;

    rawPoints.push({
      date: dateLabel,
      value: val,
      benchmarkNifty: Math.round(niftyVal),
      benchmarkSensex: Math.round(sensexVal),
      pctReturn: pct,
    });
  }

  const allVals = [
    ...rawPoints.map((p) => p.value),
    ...rawPoints.map((p) => p.benchmarkNifty),
    ...rawPoints.map((p) => p.benchmarkSensex),
  ];
  const minVal = Math.min(...allVals) * 0.99;
  const maxVal = Math.max(...allVals) * 1.01;
  const valRange = maxVal - minVal || 1;

  const points: ChartPoint[] = rawPoints.map((p, i) => {
    const x = padLeft + (i / (pointsCount - 1)) * plotWidth;
    const y = padTop + plotHeight - ((p.value - minVal) / valRange) * plotHeight;
    return { ...p, x, y };
  });

  // Main Portfolio Curve (Electric Mint)
  const linePath = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}` : `${acc} L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }, "");
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(padTop + plotHeight).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padTop + plotHeight).toFixed(1)} Z`;

  // Nifty 50 line (Coral)
  const niftyPath = points.reduce((acc, p, idx) => {
    const y = padTop + plotHeight - ((p.benchmarkNifty - minVal) / valRange) * plotHeight;
    return idx === 0 ? `M ${p.x.toFixed(1)} ${y.toFixed(1)}` : `${acc} L ${p.x.toFixed(1)} ${y.y ? y.toFixed(1) : y.toFixed(1)}`;
  }, "");

  // Sensex line (Amber)
  const sensexPath = points.reduce((acc, p, idx) => {
    const y = padTop + plotHeight - ((p.benchmarkSensex - minVal) / valRange) * plotHeight;
    return idx === 0 ? `M ${p.x.toFixed(1)} ${y.toFixed(1)}` : `${acc} L ${p.x.toFixed(1)} ${y.toFixed(1)}`;
  }, "");

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  return (
    <div className="w-full space-y-3 font-sans">
      {/* Chart Controls & Timeframe Pills - Direct inspiration from Images 3 & 5 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Comparative Legend */}
        <div className="flex items-center gap-3 text-[11px] font-sans">
          <button
            type="button"
            onClick={() => setShowBenchmarks(!showBenchmarks)}
            className="flex items-center gap-1.5 font-semibold text-[#071912] hover:text-[#00A86B] transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E599] inline-block shadow-[0_0_6px_#00E599]"></span>
            <span>Portfolio</span>
            <span className="text-[#00A86B] font-mono text-[10px] font-bold">
              +{activePoint.pctReturn.toFixed(2)}%
            </span>
          </button>

          {showBenchmarks && (
            <>
              <div className="flex items-center gap-1.5 text-[#587F6E]">
                <span className="w-2 h-2 rounded-full bg-[#FF6B6B] inline-block"></span>
                <span>Nifty 50</span>
                <span className="text-[#E63946] font-mono text-[10px] font-medium">-0.49%</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[#587F6E]">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B] inline-block"></span>
                <span>Sensex</span>
                <span className="text-[#D97706] font-mono text-[10px] font-medium">+0.12%</span>
              </div>
            </>
          )}
        </div>

        {/* Timeframe Filter Pills */}
        <div className="flex items-center gap-1 bg-[#EDF6F2] p-1 rounded-full border border-[#D3E5DC]">
          {(["1D", "1W", "1M", "6M", "1Y", "ALL"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-[10px] font-mono rounded-full font-semibold transition-all duration-150 ${
                timeframe === tf
                  ? "bg-[#0A1D16] text-[#00E599] shadow-xs"
                  : "text-[#587F6E] hover:text-[#071912]"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive SVG Chart Canvas */}
      <div className="relative w-full overflow-hidden select-none">
        {/* Floating Scrubber Badge (Direct inspiration from Image 3 & 5) */}
        {activePoint && (
          <div
            className="absolute z-20 pointer-events-none transition-all duration-75 ease-out -translate-x-1/2"
            style={{
              left: `${(activePoint.x / width) * 100}%`,
              top: `${Math.max(4, (activePoint.y / height) * 100 - 18)}%`,
            }}
          >
            <div className="bg-[#0A1D16] text-[#00E599] border border-[#163628] shadow-lg px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold flex items-center gap-1 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-ping"></span>
              <span>{formatINR(activePoint.value)}</span>
              <span className="text-white/70 text-[9px]">({formatPercent(activePoint.pctReturn)})</span>
            </div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 sm:h-56 touch-none"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = ((e.clientX - rect.left) / rect.width) * width;
            let closestIdx = 0;
            let minDiff = Infinity;
            points.forEach((p, idx) => {
              const diff = Math.abs(p.x - relX);
              if (diff < minDiff) {
                minDiff = diff;
                closestIdx = idx;
              }
            });
            setHoverIndex(closestIdx);
          }}
          onMouseLeave={() => setHoverIndex(null)}
          onTouchMove={(e) => {
            if (e.touches.length > 0) {
              const rect = e.currentTarget.getBoundingClientRect();
              const relX = ((e.touches[0].clientX - rect.left) / rect.width) * width;
              let closestIdx = 0;
              let minDiff = Infinity;
              points.forEach((p, idx) => {
                const diff = Math.abs(p.x - relX);
                if (diff < minDiff) {
                  minDiff = diff;
                  closestIdx = idx;
                }
              });
              setHoverIndex(closestIdx);
            }
          }}
        >
          <defs>
            <linearGradient id="mintAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E599" stopOpacity="0.28" />
              <stop offset="60%" stopColor="#00E599" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#00E599" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Subtle Horizontal Guide Lines */}
          <line x1={padLeft} y1={padTop} x2={width - padRight} y2={padTop} stroke="#D3E5DC" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <line x1={padLeft} y1={padTop + plotHeight * 0.5} x2={width - padRight} y2={padTop + plotHeight * 0.5} stroke="#D3E5DC" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <line x1={padLeft} y1={padTop + plotHeight} x2={width - padRight} y2={padTop + plotHeight} stroke="#D3E5DC" strokeWidth="1" opacity="0.8" />

          {/* Area Fill */}
          <path d={areaPath} fill="url(#mintAreaGrad)" />

          {/* Benchmark curves */}
          {showBenchmarks && (
            <>
              <path d={niftyPath} fill="none" stroke="#FF6B6B" strokeWidth="1.2" strokeOpacity="0.6" strokeDasharray="2 2" />
              <path d={sensexPath} fill="none" stroke="#F59E0B" strokeWidth="1.2" strokeOpacity="0.5" strokeDasharray="2 2" />
            </>
          )}

          {/* Main Portfolio Stroke */}
          <path d={linePath} fill="none" stroke="#00E599" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Vertical Tracking Cursor */}
          {activePoint && (
            <>
              <line
                x1={activePoint.x}
                y1={padTop}
                x2={activePoint.x}
                y2={padTop + plotHeight}
                stroke="#0A1D16"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.4"
              />
              {/* Outer pulsing ring */}
              <circle cx={activePoint.x} cy={activePoint.y} r="6" fill="#00E599" opacity="0.3" />
              {/* Core interactive dot */}
              <circle cx={activePoint.x} cy={activePoint.y} r="3.5" fill="#0A1D16" stroke="#00E599" strokeWidth="2" />
            </>
          )}

          {/* X Axis Labels */}
          {points.filter((_, i) => i === 0 || i === Math.floor(points.length / 2) || i === points.length - 1).map((p, idx) => (
            <text
              key={idx}
              x={p.x}
              y={height - 8}
              textAnchor={idx === 0 ? "start" : idx === 1 ? "middle" : "end"}
              fill="#587F6E"
              fontSize="10"
              fontFamily="monospace"
            >
              {p.date}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
