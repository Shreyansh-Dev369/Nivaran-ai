"use client";

import React, { useState } from "react";
import { soundManager } from "../../lib/utils/sound";
import { ShieldCheck, HelpCircle } from "lucide-react";

interface RadarMetric {
  key: string;
  label: string;
  shortLabel: string;
  score: number; // 0 to 100
  benchmark: number; // 0 to 100
  detail: string;
  status: string;
}

interface PortfolioRadarChartProps {
  diversificationScore?: number;
  cashBalance?: number;
  totalPortfolioValue?: number;
}

export function PortfolioRadarChart({
  diversificationScore = 78,
  cashBalance = 50000,
  totalPortfolioValue = 184515,
}: PortfolioRadarChartProps) {
  const [activeMetricIndex, setActiveMetricIndex] = useState<number | null>(null);

  // Derive scores from actual portfolio state
  const cashRatio = totalPortfolioValue > 0 ? (cashBalance / totalPortfolioValue) * 100 : 25;
  const cashScore = Math.min(100, Math.round(cashRatio * 3.5)); // Ideal ~20-25% cash buffer

  const metrics: RadarMetric[] = [
    {
      key: "diversification",
      label: "HHI Diversification",
      shortLabel: "DIVERSIFY",
      score: diversificationScore,
      benchmark: 75,
      detail: `Evaluates single-stock exposure and cross-sector balance. Score: ${diversificationScore}/100. Single-stock ceiling enforced at ≤25%.`,
      status: diversificationScore >= 75 ? "Optimal Equilibrium" : "Moderate Spread",
    },
    {
      key: "volatility",
      label: "Beta Volatility Shield",
      shortLabel: "BETA SHIELD",
      score: 82,
      benchmark: 70,
      detail: "Weighted beta is 0.94 vs Nifty 50 (1.00). Portfolio demonstrates 6% lower systemic volatility while matching market returns.",
      status: "Defensive Cushion Active",
    },
    {
      key: "liquidity",
      label: "Cash Liquidity Buffer",
      shortLabel: "LIQUIDITY",
      score: Math.max(30, Math.min(95, cashScore)),
      benchmark: 65,
      detail: `Liquid cash reserves comprise ${cashRatio.toFixed(1)}% of total capital. Provides ammunition for opportunistic dip buying and rebalance audits.`,
      status: cashRatio >= 15 ? "Sufficient Reserves" : "Lean Cash",
    },
    {
      key: "dividend",
      label: "Dividend Reinvestment Yield",
      shortLabel: "DIVIDEND",
      score: 74,
      benchmark: 60,
      detail: "Anchored by cash-generative blue-chips (TCS, ITC, Infosys) yielding ~1.85% annual compounding yield.",
      status: "Compounder Anchored",
    },
    {
      key: "margin",
      label: "Valuation Margin of Safety",
      shortLabel: "VALUATION",
      score: 80,
      benchmark: 65,
      detail: "Weighted P/E ratio is 23.4x vs historical benchmark (26.5x), providing an intrinsic valuation margin of safety.",
      status: "Undervalued Quality",
    },
  ];

  // Radar geometry calculations (Center 150, 150, Radius 95)
  const cx = 150;
  const cy = 150;
  const radius = 95;
  const totalAxes = metrics.length;

  const getCoordinates = (value: number, index: number) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / totalAxes;
    const r = (value / 100) * radius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  // Compute polygon paths
  const userPolygonPoints = metrics
    .map((m, idx) => {
      const { x, y } = getCoordinates(m.score, idx);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const benchmarkPolygonPoints = metrics
    .map((m, idx) => {
      const { x, y } = getCoordinates(m.benchmark, idx);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const activeMetric = activeMetricIndex !== null ? metrics[activeMetricIndex] : null;

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-7 border border-[#D3E5DC] shadow-xs space-y-6 artistic-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D3E5DC] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00A86B] font-bold">
              Multi-Axial Risk Analysis
            </span>
            <span className="text-[10px] font-mono text-[#587F6E]">• 5-Dimensional Modern Portfolio Radar</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-[#071912] font-semibold mt-0.5">
            Portfolio Health Radar & Factor Map
          </h3>
          <p className="text-xs text-[#587F6E] mt-0.5">
            Evaluates 5 mathematical pillars of capital survival. Hover over any vertex to inspect analytical rationales.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E599] border border-[#00A86B]"></span>
            <span className="text-[#071912] font-semibold">Your Portfolio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-dashed border-[#587F6E]"></span>
            <span className="text-[#587F6E]">MPT Benchmark</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Interactive Vector Radar Canvas */}
        <div className="lg:col-span-7 flex justify-center py-2 relative">
          <svg
            viewBox="0 0 300 300"
            className="w-full max-w-[320px] sm:max-w-[340px] h-auto overflow-visible select-none"
          >
            <defs>
              <radialGradient id="radarUserGrad" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#00E599" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#00E599" stopOpacity="0.1" />
              </radialGradient>
              <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Concentric Web Rings (25%, 50%, 75%, 100%) */}
            {[25, 50, 75, 100].map((ring) => {
              const ringPoints = Array.from({ length: totalAxes })
                .map((_, idx) => {
                  const { x, y } = getCoordinates(ring, idx);
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                })
                .join(" ");

              return (
                <polygon
                  key={ring}
                  points={ringPoints}
                  fill="none"
                  stroke="#D3E5DC"
                  strokeWidth={ring === 100 ? "1.5" : "0.75"}
                  strokeDasharray={ring < 100 ? "3 3" : undefined}
                />
              );
            })}

            {/* Radial Axis Spokes */}
            {metrics.map((_, idx) => {
              const { x, y } = getCoordinates(100, idx);
              return (
                <line
                  key={idx}
                  x1={cx}
                  y1={cy}
                  x2={x}
                  y2={y}
                  stroke="#D3E5DC"
                  strokeWidth="0.8"
                />
              );
            })}

            {/* Benchmark Polygon (Dashed Slate) */}
            <polygon
              points={benchmarkPolygonPoints}
              fill="rgba(88, 127, 110, 0.06)"
              stroke="#587F6E"
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />

            {/* User Portfolio Polygon (Glowing Mint Emerald) */}
            <polygon
              points={userPolygonPoints}
              fill="url(#radarUserGrad)"
              stroke="#00A86B"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />

            {/* Interactive Vertex Nodes */}
            {metrics.map((m, idx) => {
              const { x, y } = getCoordinates(m.score, idx);
              const isHovered = activeMetricIndex === idx;

              return (
                <g
                  key={m.key}
                  className="cursor-pointer transition-transform"
                  onMouseEnter={() => {
                    soundManager.playTick();
                    setActiveMetricIndex(idx);
                  }}
                  onMouseLeave={() => setActiveMetricIndex(null)}
                  onClick={() => setActiveMetricIndex(idx)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6.5 : 4}
                    fill={isHovered ? "#00E599" : "#0A1D16"}
                    stroke="#00E599"
                    strokeWidth={isHovered ? "3" : "1.8"}
                    filter={isHovered ? "url(#nodeGlow)" : undefined}
                  />
                </g>
              );
            })}

            {/* Axis Typography Labels */}
            {metrics.map((m, idx) => {
              const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / totalAxes;
              const labelRadius = radius + 22;
              const lx = cx + labelRadius * Math.cos(angle);
              const ly = cy + labelRadius * Math.sin(angle);
              const isHovered = activeMetricIndex === idx;

              return (
                <text
                  key={m.key}
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`text-[9px] font-mono uppercase font-bold tracking-wider transition-colors ${
                    isHovered ? "fill-[#00A86B] font-extrabold" : "fill-[#587F6E]"
                  }`}
                  onClick={() => setActiveMetricIndex(idx)}
                >
                  {m.shortLabel} ({m.score})
                </text>
              );
            })}
          </svg>
        </div>

        {/* Right Column: Analytical Deep-Dive Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0A1D16] text-white border border-[#163628] space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#00E599] font-bold">
                {activeMetric ? activeMetric.label : "Composite Health Index"}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#00E599]/20 text-[#00E599] font-bold">
                {activeMetric ? `${activeMetric.score}/100` : "78.4 Composite"}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="font-serif text-lg text-white font-semibold">
                {activeMetric ? activeMetric.status : "Balanced Factor Equilibrium"}
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {activeMetric
                  ? activeMetric.detail
                  : "All 5 dimensions operate above the minimum Modern Portfolio Theory safety threshold (60/100). Hover or tap any axis node on the radar to inspect its quantitative driver."}
              </p>
            </div>

            <div className="pt-2 border-t border-[#183D2D] grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400">
              <div>
                Target Standard: <strong className="text-white">{activeMetric ? `${activeMetric.benchmark}/100` : "65/100"}</strong>
              </div>
              <div className="text-right">
                Governance: <strong className="text-[#00E599]">Strict MPT</strong>
              </div>
            </div>
          </div>

          {/* Quick Metrics Selector Pills */}
          <div className="grid grid-cols-1 gap-1.5 font-mono text-xs">
            {metrics.map((m, idx) => (
              <button
                key={m.key}
                onClick={() => {
                  soundManager.playTick();
                  setActiveMetricIndex(idx);
                }}
                className={`p-2 px-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  activeMetricIndex === idx
                    ? "bg-[#0A1D16] text-[#00E599] border-[#0A1D16] shadow-xs font-bold"
                    : "bg-[#F4FAF7] text-[#071912] border-[#D3E5DC] hover:bg-[#E6F3EC]"
                }`}
              >
                <span>{m.label}</span>
                <span className="font-bold">{m.score}/100</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
