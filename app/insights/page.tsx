"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "../../components/layout/AppShell";
import { useApp } from "../../context/AppContext";
import { formatINR } from "../../lib/utils/formatters";
import { calculateDiversificationScore } from "../../lib/utils/simulation-engine";
import {
  Activity,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ChevronRight,
} from "lucide-react";

export default function InsightsPage() {
  const { holdings, totalHoldingsValue, totalPortfolioValue, cashBalance, plan } = useApp();

  const diversification = calculateDiversificationScore(holdings, cashBalance, totalPortfolioValue);

  // Stress test scenarios
  const [activeScenario, setActiveScenario] = useState<"CORRECTION" | "TECH_RALLY" | "BANKING_SURGE">("CORRECTION");

  const scenarios = {
    CORRECTION: {
      name: "Broad Indian Market Correction (-10%)",
      desc: "Simulates an across-the-board 10% pullback in Nifty 50 caused by global macro headwinds and foreign institutional capital outflows.",
      impactPercent: -8.4,
      impactValue: -Math.round(totalHoldingsValue * 0.084),
      analysis:
        "Your portfolio exhibits defensive resilience. Exposure to liquid cash reserves (" +
        formatINR(cashBalance) +
        ") and mega-cap dividend anchors cushions downside drawdown compared to an unhedged 100% equity day-trading account.",
    },
    TECH_RALLY: {
      name: "Global IT Services & AI Deal Expansion (+15%)",
      desc: "Simulates a 15% valuation re-rating in Indian Technology stalwarts (TCS, Infosys) driven by enterprise digital transformation budgets.",
      impactPercent: +5.8,
      impactValue: +Math.round(totalHoldingsValue * 0.058),
      analysis:
        "Technology comprises a core portion of your equity holdings. An IT rally produces capital appreciation, though it may trigger a rebalancing alert once sector weight expands beyond your target model.",
    },
    BANKING_SURGE: {
      name: "Domestic Credit Expansion & Capex Surge (+12%)",
      desc: "Simulates accelerated credit growth and margin expansion across Indian private banking stalwarts (HDFC Bank, ICICI Bank).",
      impactPercent: +3.9,
      impactValue: +Math.round(totalHoldingsValue * 0.039),
      analysis:
        "Banking represents a cornerstone of Indian GDP growth. Healthy credit expansion bolsters operating returns on equity while maintaining conservative loan-to-deposit ratios.",
    },
  };

  const currentScenario = scenarios[activeScenario];

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8 w-full font-sans">
        {/* Editorial Masthead */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D3E5DC]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#00A86B] bg-[#E6F9F1] px-2.5 py-0.5 rounded-full border border-[#00A86B]/20 font-bold">
                PORTFOLIO HEALTH
              </span>
              <span className="text-[10px] font-mono text-[#587F6E]">
                DECISION EXPLAINABILITY
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#071912]">
              Health, Risk & Rationale
            </h1>
            <p className="text-xs text-[#587F6E] mt-0.5">
              Deterministic diversification scoring, single-stock exposure governance, and macroeconomic stress simulations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#00A86B] bg-[#E6F9F1] px-3.5 py-1.5 rounded-full border border-[#00A86B]/20">
              HHI Rating: {diversification.rating}
            </span>
          </div>
        </div>

        {/* 3-Pillar Risk Metrics Ledger */}
        <div className="rounded-3xl border border-[#D3E5DC] bg-white shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D3E5DC]">
            <div className="p-6 space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#587F6E] font-semibold">
                  Diversification Score
                </span>
                <span className="font-mono text-[10px] text-[#00A86B] bg-[#E6F9F1] px-2 py-0.5 rounded-full font-bold">
                  HHI Model
                </span>
              </div>
              <div className="font-mono text-3xl font-bold text-[#071912] tabular-nums">
                {diversification.score}
                <span className="text-sm font-normal text-[#587F6E]">/100</span>
              </div>
              <p className="text-xs font-bold text-[#00A86B]">
                Rating: {diversification.rating}
              </p>
              <p className="text-[11px] text-[#587F6E] leading-relaxed">
                Measured using Herfindahl-Hirschman index concentration across sectors and individual equities.
              </p>
            </div>

            <div className="p-6 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#587F6E] font-semibold block">
                Single-Stock Concentration
              </span>
              <div className="font-mono text-3xl font-bold text-[#071912] tabular-nums">
                {diversification.topStockWeight}%
              </div>
              <p className="text-xs font-bold text-[#00A86B]">
                Policy Ceiling: ≤{plan?.maxSingleStockCap || 25}%
              </p>
              <p className="text-[11px] text-[#587F6E] leading-relaxed">
                No individual security is permitted to create catastrophic single-company capital risk.
              </p>
            </div>

            <div className="p-6 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#587F6E] font-semibold block">
                Top Sector Concentration
              </span>
              <div className="font-mono text-3xl font-bold text-[#071912] tabular-nums">
                {diversification.maxSectorWeight}%
              </div>
              <p className="text-xs font-bold text-[#0A1D16]">
                Dominant: {diversification.maxSectorName || "Unallocated"}
              </p>
              <p className="text-[11px] text-[#587F6E] leading-relaxed">
                {holdings.length > 0
                  ? `Diversified across ${holdings.length} securities to mitigate cyclical downturns.`
                  : "Create an investment plan to distribute capital across sectors."}
              </p>
            </div>
          </div>
        </div>

        {/* Explainable Decision Engine Memo */}
        <div className="rounded-3xl border border-[#D3E5DC] bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#D3E5DC]">
            <BookOpen className="h-5 w-5 text-[#00A86B]" />
            <h2 className="font-serif text-xl font-semibold text-[#071912]">
              Plain-Language Allocation Memo: Why Your Money is Here
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#4B665A] leading-relaxed max-w-3xl">
            NIVARAN is built on explicit, verifiable financial principles rather than opaque black-box speculation. Every simulated rupee follows transparent rules:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-5 rounded-2xl bg-[#F4FAF7] border border-[#D3E5DC] space-y-1.5">
              <span className="font-mono text-xs font-bold text-[#071912] uppercase tracking-wider block">
                01 / Mega-Cap Cashflow Moats
              </span>
              <p className="text-xs text-[#587F6E] leading-relaxed">
                Reliance Industries and TCS are allocated cornerstone weights due to their resilient domestic operating cash generation, modest debt-to-equity ratios, and steady dividend yields.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F4FAF7] border border-[#D3E5DC] space-y-1.5">
              <span className="font-mono text-xs font-bold text-[#071912] uppercase tracking-wider block">
                02 / Financial Intermediation Compounding
              </span>
              <p className="text-xs text-[#587F6E] leading-relaxed">
                HDFC Bank captures domestic credit growth. Underwriting discipline and industry-leading net NPA quality match your {plan?.riskTolerance.toLowerCase() || "balanced"} risk mandate.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F4FAF7] border border-[#D3E5DC] space-y-1.5">
              <span className="font-mono text-xs font-bold text-[#071912] uppercase tracking-wider block">
                03 / Physical Infrastructure Capex
              </span>
              <p className="text-xs text-[#587F6E] leading-relaxed">
                Larsen & Toubro provides exposure to national infrastructure buildout without exposing the portfolio to unhedged single-project real estate speculation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F4FAF7] border border-[#D3E5DC] space-y-1.5">
              <span className="font-mono text-xs font-bold text-[#071912] uppercase tracking-wider block">
                04 / Systematic Liquidity Buffer
              </span>
              <p className="text-xs text-[#587F6E] leading-relaxed">
                Maintaining {formatINR(cashBalance)} in the demo cash ledger provides disciplined dry powder for future automated monthly investments at favorable market valuations.
              </p>
            </div>
          </div>
        </div>

        {/* Macroeconomic Scenario Stress Testing */}
        <div className="rounded-3xl border border-[#D3E5DC] bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#D3E5DC]">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#00A86B]" />
                <h3 className="font-serif text-xl font-semibold text-[#071912]">
                  Scenario Stress Simulation
                </h3>
              </div>
              <p className="text-xs text-[#587F6E] mt-0.5">
                Evaluate deterministic portfolio sensitivity against historical domestic market shocks
              </p>
            </div>

            {/* Scenario toggle pills */}
            <div className="flex items-center gap-1 bg-[#EDF6F2] p-1 rounded-full border border-[#D3E5DC]">
              {(["CORRECTION", "TECH_RALLY", "BANKING_SURGE"] as const).map((scen) => (
                <button
                  key={scen}
                  onClick={() => setActiveScenario(scen)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeScenario === scen
                      ? "bg-[#0A1D16] text-[#00E599] shadow-xs"
                      : "text-[#587F6E] hover:text-[#071912]"
                  }`}
                >
                  {scen === "CORRECTION"
                    ? "Correction (-10%)"
                    : scen === "TECH_RALLY"
                    ? "Tech Surge (+15%)"
                    : "Credit Capex (+12%)"}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#D3E5DC] bg-[#F4FAF7] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-lg font-semibold text-[#071912]">
                {currentScenario.name}
              </h4>
              <span
                className={`font-mono text-xs font-bold px-3 py-1 rounded-full ${
                  currentScenario.impactPercent >= 0
                    ? "bg-[#E6F9F1] text-[#00A86B]"
                    : "bg-[#FDF0F1] text-[#E63946]"
                }`}
              >
                {currentScenario.impactPercent >= 0 ? "+" : ""}
                {currentScenario.impactPercent}% Est. Impact ({formatINR(currentScenario.impactValue)})
              </span>
            </div>

            <p className="text-xs text-[#587F6E] leading-relaxed">
              {currentScenario.desc}
            </p>

            <div className="pt-2 border-t border-[#D3E5DC] text-xs text-[#071912] font-sans">
              <strong>Defensive Assessment:</strong> {currentScenario.analysis}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
