"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR } from "../../lib/utils/formatters";
import { AnimatedNumber } from "./AnimatedNumber";
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  PieChart,
  BarChart3,
  Calendar,
} from "lucide-react";

type RiskTier = "CONSERVATIVE" | "BALANCED" | "GROWTH";

interface AllocationStock {
  symbol: string;
  name: string;
  weight: number;
  sector: string;
}

const TIER_CONFIG: Record<
  RiskTier,
  {
    name: string;
    expectedReturn: number;
    description: string;
    volatility: string;
    stocks: AllocationStock[];
  }
> = {
  CONSERVATIVE: {
    name: "Conservative Pillar",
    expectedReturn: 10.5,
    description: "Emphasis on dividend champions, low beta (≤0.85), and blue-chip stability.",
    volatility: "Low (Beta 0.76)",
    stocks: [
      { symbol: "TCS", name: "Tata Consultancy Services Ltd", weight: 28, sector: "Technology" },
      { symbol: "HDFCBANK", name: "HDFC Bank Ltd", weight: 25, sector: "Banking & Finance" },
      { symbol: "ITC", name: "ITC Ltd", weight: 25, sector: "Consumer Goods" },
      { symbol: "RELIANCE", name: "Reliance Industries Ltd", weight: 22, sector: "Energy & Utilities" },
    ],
  },
  BALANCED: {
    name: "Balanced Growth",
    expectedReturn: 13.0,
    description: "Optimal balance of defensive anchors and domestic consumer/capex growth engines.",
    volatility: "Moderate (Beta 0.96)",
    stocks: [
      { symbol: "RELIANCE", name: "Reliance Industries Ltd", weight: 25, sector: "Energy & Utilities" },
      { symbol: "TCS", name: "Tata Consultancy Services Ltd", weight: 22, sector: "Technology" },
      { symbol: "HDFCBANK", name: "HDFC Bank Ltd", weight: 20, sector: "Banking & Finance" },
      { symbol: "INFOSYS", name: "Infosys Ltd", weight: 18, sector: "Technology" },
      { symbol: "LT", name: "Larsen & Toubro Ltd", weight: 15, sector: "Industrials" },
    ],
  },
  GROWTH: {
    name: "Growth Maximizer",
    expectedReturn: 15.5,
    description: "High-conviction exposure to digital finance, premium mobility, and expanding tech.",
    volatility: "Dynamic (Beta 1.18)",
    stocks: [
      { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd", weight: 25, sector: "Banking & Finance" },
      { symbol: "TATAMOTORS", name: "Tata Motors Ltd", weight: 24, sector: "Automobile" },
      { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd", weight: 21, sector: "Technology" },
      { symbol: "TITAN", name: "Titan Company Ltd", weight: 16, sector: "Consumer Goods" },
      { symbol: "ICICIBANK", name: "ICICI Bank Ltd", weight: 14, sector: "Banking & Finance" },
    ],
  },
};

export function InteractiveSimulator() {
  const [monthlySIP, setMonthlySIP] = useState<number>(25000);
  const [selectedTier, setSelectedTier] = useState<RiskTier>("BALANCED");
  const [horizonYears, setHorizonYears] = useState<number>(10);

  const activeConfig = TIER_CONFIG[selectedTier];
  const monthlyRate = activeConfig.expectedReturn / 100 / 12;
  const totalMonths = horizonYears * 12;

  // Future Value of monthly SIP: P * [((1 + r)^n - 1) / r] * (1 + r)
  const futureValue =
    monthlySIP *
    ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
    (1 + monthlyRate);

  const totalInvested = monthlySIP * totalMonths;
  const estimatedGains = Math.max(0, futureValue - totalInvested);

  const presets = [10000, 25000, 50000, 75000, 100000];

  return (
    <div className="w-full rounded-3xl border border-[#D3E5DC] bg-white/95 backdrop-blur-xl p-6 sm:p-10 shadow-2xl relative overflow-hidden font-sans">
      {/* Decorative ambient gradient backdrop */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E599]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#123E30]/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[#D3E5DC]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F9F1] border border-[#00E599]/40 text-[#0A1D16] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5 text-[#00A86B]" />
            Interactive Portfolio Simulation Lab
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#071912]">
            Simulate Your Automated Wealth Growth
          </h3>
          <p className="text-xs text-[#587F6E] mt-1 max-w-xl">
            Experience how automated compounding and deterministic stock allocation work together
            under historical risk benchmarks.
          </p>
        </div>

        <Link
          href="/investment-plan/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0A1D16] text-[#00E599] hover:bg-[#14352A] text-xs font-mono font-bold transition-all shadow-md group shrink-0"
        >
          <span>Create Custom Plan</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Left Interactive Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Monthly SIP Amount Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider font-mono text-[#071912] flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4 text-[#00A86B]" />
                Simulated Monthly Contribution
              </label>
              <div className="font-mono text-lg sm:text-xl font-bold text-[#071912] bg-[#EDF6F2] px-3 py-1 rounded-xl border border-[#D3E5DC]">
                {formatINR(monthlySIP)}
                <span className="text-[11px] font-normal text-[#587F6E]"> / mo</span>
              </div>
            </div>

            <input
              type="range"
              min={5000}
              max={100000}
              step={5000}
              value={monthlySIP}
              onChange={(e) => setMonthlySIP(Number(e.target.value))}
              className="w-full h-2 bg-[#D3E5DC] rounded-lg appearance-none cursor-pointer accent-[#0A1D16]"
            />

            {/* Quick preset buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono text-[#587F6E] uppercase mr-1">Presets:</span>
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMonthlySIP(preset)}
                  className={`text-[11px] font-mono px-3 py-1 rounded-full border transition-all ${
                    monthlySIP === preset
                      ? "bg-[#0A1D16] text-[#00E599] border-[#0A1D16] font-bold shadow-xs"
                      : "bg-[#EDF6F2]/70 text-[#18382C] border-[#D3E5DC] hover:bg-white"
                  }`}
                >
                  ₹{(preset / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          {/* Risk Tolerance Selector */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider font-mono text-[#071912] flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#00A86B]" />
              Select Risk Mandate
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(["CONSERVATIVE", "BALANCED", "GROWTH"] as RiskTier[]).map((tier) => {
                const conf = TIER_CONFIG[tier];
                const isSelected = selectedTier === tier;

                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setSelectedTier(tier)}
                    className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#0A1D16] text-white border-[#0A1D16] shadow-lg scale-[1.02]"
                        : "bg-[#EDF6F2]/50 text-[#071912] border-[#D3E5DC] hover:bg-white hover:border-[#00E599]/60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-xs font-mono font-bold uppercase tracking-wider ${
                          isSelected ? "text-[#00E599]" : "text-[#18382C]"
                        }`}
                      >
                        {tier}
                      </span>
                      <span
                        className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isSelected
                            ? "bg-[#00E599]/20 text-[#00E599]"
                            : "bg-[#00A86B]/10 text-[#00A86B]"
                        }`}
                      >
                        ~{conf.expectedReturn}% p.a.
                      </span>
                    </div>
                    <p
                      className={`text-[11px] leading-relaxed ${
                        isSelected ? "text-[#cfe0d8]" : "text-[#587F6E]"
                      }`}
                    >
                      {conf.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Horizon Selector */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider font-mono text-[#071912] flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#00A86B]" />
                Investment Horizon
              </label>
              <span className="font-mono text-xs font-bold text-[#071912]">
                {horizonYears} Years ({totalMonths} Monthly SIPs)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {[3, 5, 10, 15, 20].map((years) => (
                <button
                  key={years}
                  type="button"
                  onClick={() => setHorizonYears(years)}
                  className={`flex-1 text-center py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                    horizonYears === years
                      ? "bg-[#0A1D16] text-[#00E599] border-[#0A1D16] shadow-xs"
                      : "bg-[#EDF6F2]/60 text-[#18382C] border-[#D3E5DC] hover:bg-white"
                  }`}
                >
                  {years}Y
                </button>
              ))}
            </div>
          </div>

          {/* Algorithmic Weight Preview */}
          <div className="rounded-2xl border border-[#D3E5DC] bg-[#EDF6F2]/40 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#071912]">
              <span className="flex items-center gap-1.5">
                <PieChart className="h-3.5 w-3.5 text-[#00A86B]" />
                <span>Deterministic Stock Distribution</span>
              </span>
              <span className="font-mono text-[10px] text-[#587F6E]">
                Single Stock Cap &le; 25%
              </span>
            </div>

            <div className="space-y-2">
              {activeConfig.stocks.map((stock) => {
                const targetAmt = (monthlySIP * stock.weight) / 100;

                return (
                  <div key={stock.symbol} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#071912]">{stock.symbol}</span>
                        <span className="text-[#587F6E] hidden sm:inline">• {stock.sector}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#071912]">{formatINR(targetAmt)}</span>
                        <span className="text-[#00A86B] font-bold">({stock.weight}%)</span>
                      </div>
                    </div>

                    <div className="h-1.5 w-full bg-[#D3E5DC] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#00E599] to-[#0A1D16] rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${stock.weight * 3.5}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Compounding Summary Card */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl bg-gradient-to-br from-[#0A1D16] to-[#061610] text-white p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden border border-[#14352A]">
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00E599] font-bold flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              Projected Corpus at {horizonYears}Y
            </div>
            <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white pt-2">
              <AnimatedNumber value={futureValue} format="inr" compact={false} />
            </div>
            <p className="text-[11px] font-mono text-[#cfe0d8] pt-1">
              Based on historical simulated return benchmark ({activeConfig.expectedReturn}% p.a.)
            </p>
          </div>

          {/* Breakdown Pills */}
          <div className="space-y-3 pt-4 border-t border-[#14352A]">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-xs font-sans text-[#cfe0d8]">Total Principal Invested</div>
              <div className="font-mono text-sm font-bold text-white">
                <AnimatedNumber value={totalInvested} format="inr" />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#00E599]/10 border border-[#00E599]/30">
              <div className="text-xs font-sans text-[#00E599] flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Estimated Wealth Gain
              </div>
              <div className="font-mono text-sm font-bold text-[#00E599]">
                +<AnimatedNumber value={estimatedGains} format="inr" />
              </div>
            </div>
          </div>

          {/* Visual Compounding Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-[10px] font-mono text-[#cfe0d8]">
              <span>Principal: {Math.round((totalInvested / futureValue) * 100)}%</span>
              <span className="text-[#00E599]">Compounding: {Math.round((estimatedGains / futureValue) * 100)}%</span>
            </div>
            <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden flex">
              <div
                className="bg-white/40 h-full transition-all duration-700"
                style={{ width: `${Math.round((totalInvested / futureValue) * 100)}%` }}
              />
              <div
                className="bg-[#00E599] h-full transition-all duration-700"
                style={{ width: `${Math.round((estimatedGains / futureValue) * 100)}%` }}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#14352A]/80">
            <Link
              href="/signup"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#00E599] text-[#061610] hover:bg-[#1affaa] font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-lg shadow-[#00E599]/10 group"
            >
              <span>Deploy This Allocation Simulator</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-[10px] font-mono text-[#587F6E] text-center mt-2.5">
              Simulated demonstration sandbox • Zero real monetary deposits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
