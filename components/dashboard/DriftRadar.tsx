"use client";

import React from "react";
import { Holding } from "../../lib/types";
import { formatPercent } from "../../lib/utils/formatters";
import { soundManager } from "../../lib/utils/sound";
import {
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Sliders,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface DriftRadarProps {
  holdings: Holding[];
  totalHoldingsValue: number;
  onOpenRebalance: () => void;
}

export function DriftRadar({
  holdings,
  totalHoldingsValue,
  onOpenRebalance,
}: DriftRadarProps) {
  // Compute drift against target model weight
  const driftList = holdings.map((h) => {
    const currentWeight = totalHoldingsValue > 0 ? (h.currentValue / totalHoldingsValue) * 100 : 0;
    const targetWeight = h.targetWeight || 20.0;
    const driftDelta = currentWeight - targetWeight;
    const absDrift = Math.abs(driftDelta);

    let status: "OPTIMAL" | "ATTENTION" | "DRIFTED" = "OPTIMAL";
    if (absDrift >= 5.0) {
      status = "DRIFTED";
    } else if (absDrift >= 3.0) {
      status = "ATTENTION";
    }

    return {
      symbol: h.symbol,
      name: h.name,
      sector: h.sector,
      currentWeight: Math.round(currentWeight * 10) / 10,
      targetWeight: Math.round(targetWeight * 10) / 10,
      driftDelta: Math.round(driftDelta * 10) / 10,
      absDrift: Math.round(absDrift * 10) / 10,
      status,
    };
  });

  const hasExceededTolerance = driftList.some((d) => d.status === "DRIFTED");
  const attentionCount = driftList.filter((d) => d.status !== "OPTIMAL").length;

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-7 border border-[#D3E5DC] shadow-xs space-y-5 artistic-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D3E5DC] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00A86B] font-bold">
              Mathematical Equilibrium
            </span>
            <span className="text-[10px] font-mono text-[#587F6E]">• Continuous ±5% Drift Calibration</span>
          </div>
          <h3 className="font-serif text-xl text-[#071912] font-semibold mt-0.5">
            Asset Allocation Drift Radar
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playTick();
              onOpenRebalance();
            }}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono font-bold transition-all shadow-xs ${
              hasExceededTolerance
                ? "bg-[#0A1D16] text-[#00E599] hover:bg-[#122E23] animate-pulse"
                : "bg-[#EDF6F2] hover:bg-[#0A1D16] text-[#071912] hover:text-[#00E599]"
            }`}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{hasExceededTolerance ? "Rebalance Required" : "Audit Rebalance"}</span>
          </button>
        </div>
      </div>

      {/* Overview Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#F4FAF7] border border-[#D3E5DC] text-xs font-mono">
        <div className="flex items-center gap-2">
          {hasExceededTolerance ? (
            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-[#00A86B] shrink-0" />
          )}
          <span className="text-[#071912]">
            {hasExceededTolerance
              ? "Drift threshold (±5%) breached on active holdings. Automated balancing recommended."
              : "All active assets reside within the optimal ±5% Modern Portfolio Theory tolerance."}
          </span>
        </div>

        <span className="text-[10px] uppercase font-bold text-[#587F6E]">
          {attentionCount} {attentionCount === 1 ? "Holding Flagged" : "Holdings Flagged"}
        </span>
      </div>

      {/* Holdings Drift Calibration List */}
      <div className="space-y-3">
        {driftList.map((item) => {
          const isOver = item.driftDelta > 0;

          return (
            <div
              key={item.symbol}
              className="p-3.5 sm:p-4 rounded-2xl border border-[#D3E5DC] bg-white shadow-xs hover:border-[#00E599] transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-[#0A1D16] text-[#00E599] font-mono font-bold text-xs flex items-center justify-center">
                    {item.symbol.slice(0, 2)}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#071912]">{item.symbol}</span>
                      <span className="text-[10px] font-mono text-[#587F6E] hidden sm:inline">
                        • {item.sector}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#587F6E] truncate max-w-[200px] sm:max-w-xs">
                      {item.name}
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-[#587F6E] text-[11px]">
                      Target: {item.targetWeight}%
                    </span>
                    <span className="font-bold text-[#071912]">
                      Actual: {item.currentWeight}%
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold block ${
                      item.status === "DRIFTED"
                        ? "text-rose-600"
                        : item.status === "ATTENTION"
                        ? "text-amber-600"
                        : "text-[#00A86B]"
                    }`}
                  >
                    Drift: {isOver ? "+" : ""}{item.driftDelta}% ({item.status})
                  </span>
                </div>
              </div>

              {/* Visual Progress Drift Target Bar */}
              <div className="space-y-1">
                <div className="relative w-full bg-[#EDF6F2] h-2.5 rounded-full overflow-hidden">
                  {/* Target Marker Flag at targetWeight % */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#071912] z-10"
                    style={{ left: `${Math.min(100, item.targetWeight * 3)}%` }}
                    title={`Target Equilibrium: ${item.targetWeight}%`}
                  ></div>

                  {/* Actual Weight Bar */}
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.status === "DRIFTED"
                        ? "bg-rose-500"
                        : item.status === "ATTENTION"
                        ? "bg-amber-400"
                        : "bg-[#00E599]"
                    }`}
                    style={{ width: `${Math.min(100, item.currentWeight * 3)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-[#587F6E]">
                  <span>0%</span>
                  <span>Target Marker (|)</span>
                  <span>Max Cap (25%)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
