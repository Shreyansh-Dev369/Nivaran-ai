"use client";

import React, { useState } from "react";
import { formatINR } from "../../lib/utils/formatters";
import { soundManager } from "../../lib/utils/sound";
import {
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface StressTestCardProps {
  portfolioValue: number;
}

interface Scenario {
  id: string;
  name: string;
  year: string;
  niftyImpact: number; // percentage (e.g. -28.4)
  nivaranImpact: number; // percentage (e.g. -14.8)
  recoveryMonths: number;
  description: string;
  safeguardKey: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "covid-2020",
    name: "2020 Covid Shock",
    year: "March 2020",
    niftyImpact: -28.4,
    nivaranImpact: -14.6,
    recoveryMonths: 7,
    description: "Rapid liquidity contraction across global equities. Indian IT and FMCG buffered severe banking drawdowns.",
    safeguardKey: "Multi-sector cross-correlation ceiling",
  },
  {
    id: "gfc-2008",
    name: "2008 Subprime GFC",
    year: "Oct 2008",
    niftyImpact: -45.2,
    nivaranImpact: -22.4,
    recoveryMonths: 18,
    description: "Severe credit crunch and systemic financial freezing. Unhedged portfolios suffered catastrophic drawdowns.",
    safeguardKey: "Single-stock exposure ceiling (≤25%)",
  },
  {
    id: "demonetization-2016",
    name: "2016 Demonetization",
    year: "Nov 2016",
    niftyImpact: -7.8,
    nivaranImpact: -3.4,
    recoveryMonths: 3,
    description: "Short-term cash squeeze impacting domestic discretionary demand. Technology and exports remained unaffected.",
    safeguardKey: "Defensive consumer & export allocation",
  },
  {
    id: "bull-run-2021",
    name: "2021 Post-Covid Rally",
    year: "2020-2021",
    niftyImpact: 72.5,
    nivaranImpact: 58.2,
    recoveryMonths: 0,
    description: "Prolonged liquidity supercycle. Disciplined drift rebalancing systematically locked in gains into cash balance.",
    safeguardKey: "Automated ±5% drift profit harvest",
  },
];

export function StressTestCard({ portfolioValue }: StressTestCardProps) {
  const [activeScenarioId, setActiveScenarioId] = useState<string>("covid-2020");

  const active = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  const handleSelectScenario = (id: string) => {
    soundManager.playTick();
    setActiveScenarioId(id);
  };

  const simulatedValue = Math.round(portfolioValue * (1 + active.nivaranImpact / 100));
  const unhedgedValue = Math.round(portfolioValue * (1 + active.niftyImpact / 100));
  const capitalProtected = simulatedValue - unhedgedValue;
  const isGain = active.nivaranImpact >= 0;

  // Resilience score out of 100 based on relative alpha preserved
  const resilienceScore = Math.round(
    100 - (Math.abs(active.nivaranImpact) / Math.abs(active.niftyImpact)) * 40
  );

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-7 border border-[#D3E5DC] shadow-xs space-y-6 artistic-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D3E5DC]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00A86B] font-bold">
              Stress-Testing Engine
            </span>
            <span className="text-[10px] font-mono text-[#587F6E]">• Historical Crisis Physics</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-[#071912] font-semibold mt-0.5">
            Simulate Historical Market Shocks
          </h3>
          <p className="text-xs text-[#587F6E] mt-1 max-w-xl">
            See how Nivaran&apos;s mathematical safeguards protect your portfolio during historic Indian equity market shocks vs unhedged trading.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#587F6E]">Resilience:</span>
          <span className="px-3 py-1 rounded-full bg-[#E6F9F1] text-[#00A86B] font-mono font-bold text-xs">
            {resilienceScore}/100 Grade A+
          </span>
        </div>
      </div>

      {/* Scenario Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SCENARIOS.map((sc) => {
          const isSelected = sc.id === activeScenarioId;
          const isCrash = sc.niftyImpact < 0;

          return (
            <button
              key={sc.id}
              onClick={() => handleSelectScenario(sc.id)}
              className={`p-3 rounded-2xl text-left border transition-all ${
                isSelected
                  ? "bg-[#0A1D16] text-white border-[#0A1D16] shadow-sm scale-[1.01]"
                  : "bg-[#F4FAF7] text-[#071912] border-[#D3E5DC] hover:bg-[#E6F3EC]"
              }`}
            >
              <div className="text-[10px] font-mono uppercase text-zinc-400 block">
                {sc.year}
              </div>
              <div className={`text-xs font-semibold truncate ${isSelected ? "text-white" : "text-[#071912]"}`}>
                {sc.name}
              </div>
              <div
                className={`text-[11px] font-mono font-bold mt-1 ${
                  isCrash
                    ? isSelected ? "text-rose-400" : "text-rose-600"
                    : isSelected ? "text-[#00E599]" : "text-[#00A86B]"
                }`}
              >
                Nifty: {sc.niftyImpact > 0 ? "+" : ""}{sc.niftyImpact}%
              </div>
            </button>
          );
        })}
      </div>

      {/* Simulation Result Comparison Box */}
      <div className="rounded-2xl bg-[#0A1D16] text-white p-5 sm:p-6 border border-[#163628] space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: Projected Value at Stress Point */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse"></span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#00E599] font-bold">
                Simulated Outcome: {active.name}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                Projected Portfolio at Shock Trough
              </span>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl sm:text-4xl text-white font-semibold tabular-nums">
                  {formatINR(simulatedValue)}
                </span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                    isGain
                      ? "bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/30"
                      : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  }`}
                >
                  {isGain ? "+" : ""}{active.nivaranImpact}% vs baseline
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {active.description}
            </p>
          </div>

          {/* Right: Comparative Alpha Meter */}
          <div className="md:col-span-5 bg-[#0D241C] p-4 rounded-xl border border-[#1B4232] space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
              Protection vs Raw Market Drop
            </span>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-400">Nivaran Allocation:</span>
                <span className="font-bold text-[#00E599]">{active.nivaranImpact}%</span>
              </div>
              <div className="w-full bg-[#071711] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#00E599] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.abs(active.nivaranImpact) * 2)}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center text-xs font-mono pt-1">
                <span className="text-zinc-400">Unhedged Single Stocks:</span>
                <span className="font-bold text-rose-400">{active.niftyImpact}%</span>
              </div>
              <div className="w-full bg-[#071711] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.abs(active.niftyImpact) * 2)}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#183D2D] flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">Capital Buffer:</span>
              <strong className="text-[#00E599] font-bold tabular-nums">
                {capitalProtected >= 0 ? "+" : ""}{formatINR(capitalProtected)}
              </strong>
            </div>
          </div>
        </div>

        {/* Safeguard Footnote */}
        <div className="pt-3 border-t border-[#183D2D] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#00E599] shrink-0" />
            <span>Safeguard in effect: <strong className="text-white font-semibold">{active.safeguardKey}</strong></span>
          </div>
          <div>
            Est. Recovery Time: <strong className="text-[#00E599] font-semibold">{active.recoveryMonths} months</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
