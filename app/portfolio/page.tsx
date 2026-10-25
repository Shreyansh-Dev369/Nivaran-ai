"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "../../components/layout/AppShell";
import { useApp } from "../../context/AppContext";
import { formatINR, formatPercent } from "../../lib/utils/formatters";
import { AllocationDonutChart } from "../../components/charts/AllocationDonutChart";
import { RebalanceModal } from "../../components/modals/RebalanceModal";
import { AddFundsModal } from "../../components/modals/AddFundsModal";
import { calculateDiversificationScore } from "../../lib/utils/simulation-engine";
import {
  TrendingUp,
  RefreshCw,
  PlusCircle,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Filter,
  Layers,
  SlidersHorizontal,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function PortfolioPage() {
  const {
    cashBalance,
    holdings,
    totalInvested,
    totalHoldingsValue,
    totalPortfolioValue,
    totalUnrealizedPnl,
    totalUnrealizedPnlPercent,
    plan,
    resetDemoData,
  } = useApp();

  const [selectedSector, setSelectedSector] = useState<string>("ALL");
  const [isRebalanceOpen, setIsRebalanceOpen] = useState(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);

  const diversification = calculateDiversificationScore(holdings, cashBalance, totalPortfolioValue);

  // Filter holdings
  const filteredHoldings =
    selectedSector === "ALL"
      ? holdings
      : holdings.filter((h) => h.sector === selectedSector);

  const allSectors = ["ALL", ...Array.from(new Set(holdings.map((h) => h.sector)))];

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8 font-sans">
        {/* Masthead Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D3E5DC]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#00A86B] bg-[#E6F9F1] px-2.5 py-0.5 rounded-full border border-[#00A86B]/20 font-bold">
                PORTFOLIO STATEMENT
              </span>
              <span className="text-[10px] font-mono text-[#587F6E]">
                NSE / BSE DEMO LEDGER
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#071912]">
              Holdings & Asset Allocation
            </h1>
            <p className="text-xs text-[#587F6E] mt-0.5">
              Deterministic position tracking, model target drift, and simulated liquidity reserves
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddFundsOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D3E5DC] bg-white text-xs font-semibold text-[#071912] hover:bg-[#EDF6F2] transition-colors shadow-xs"
            >
              <PlusCircle className="h-3.5 w-3.5 text-[#00A86B]" />
              <span>Credit Demo Cash</span>
            </button>
            <button
              onClick={() => setIsRebalanceOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0A1D16] text-xs font-semibold text-[#00E599] hover:bg-[#122E23] transition-all shadow-sm"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Simulate Rebalance</span>
            </button>
          </div>
        </div>

        {/* Panoramic Summary Canvas */}
        <div className="rounded-3xl bg-white border border-[#D3E5DC] shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#D3E5DC]">
            <div className="p-6 space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#587F6E] font-semibold">
                Net Portfolio Valuation
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#071912] tabular-nums">
                {formatINR(totalPortfolioValue)}
              </div>
              <div className="text-[11px] text-[#587F6E] flex items-center justify-between">
                <span>Holdings + Demo Cash</span>
                <span className="font-mono text-[10px] text-[#00A86B] font-bold">100.0%</span>
              </div>
            </div>

            <div className="p-6 space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#587F6E] font-semibold">
                Active Capital Deployed
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#071912] tabular-nums">
                {formatINR(totalInvested)}
              </div>
              <div className="text-[11px] text-[#587F6E]">
                Across {holdings.length} securities ({Math.round((totalHoldingsValue / (totalPortfolioValue || 1)) * 100)}% equity)
              </div>
            </div>

            <div className="p-6 space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#587F6E] font-semibold">
                Unrealized Performance
              </div>
              <div
                className={`font-serif text-2xl sm:text-3xl font-semibold tabular-nums ${
                  totalUnrealizedPnl >= 0 ? "text-[#00A86B]" : "text-[#E63946]"
                }`}
              >
                {totalUnrealizedPnl >= 0 ? "+" : ""}
                {formatINR(totalUnrealizedPnl)}
              </div>
              <div
                className={`text-[11px] font-mono font-bold ${
                  totalUnrealizedPnl >= 0 ? "text-[#00A86B]" : "text-[#E63946]"
                }`}
              >
                {totalUnrealizedPnl >= 0 ? "+" : ""}
                {formatPercent(totalUnrealizedPnlPercent)} overall return
              </div>
            </div>

            <div className="p-6 bg-[#F4FAF7] space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#0A1D16] font-semibold">
                Simulated Liquidity Reserves
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1D16] tabular-nums">
                {formatINR(cashBalance)}
              </div>
              <div className="text-[11px] text-[#587F6E]">
                Available for automated SIP executions
              </div>
            </div>
          </div>
        </div>

        {holdings.length === 0 ? (
          <div className="rounded-3xl border border-[#D3E5DC] bg-white p-10 text-center space-y-4 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00A86B] font-bold block">
              Ledger Initialized • Zero Equity Positions
            </span>
            <h3 className="font-serif text-2xl text-[#071912] font-semibold">
              No Current Holdings Recorded in Ledger
            </h3>
            <p className="text-xs text-[#587F6E] max-w-md mx-auto leading-relaxed">
              You have {formatINR(cashBalance)} in available demo cash. Create your automated investment plan to deploy capital across NSE/BSE equities.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/investment-plan/create"
                className="px-6 py-3 rounded-full bg-[#0A1D16] text-[#00E599] text-xs font-mono font-bold hover:bg-[#122E23] transition-all shadow-xs inline-flex items-center gap-1.5"
              >
                <span>Formulate Investment Plan</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={resetDemoData}
                className="px-5 py-3 rounded-full border border-[#D3E5DC] text-xs font-semibold text-[#071912] hover:bg-[#EDF6F2] transition-colors"
              >
                Restore Arjun Sharma Baseline (₹1.84L)
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Dual Column: Allocation Donut & Target Drift Audit */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sector Profile */}
              <div className="lg:col-span-5 rounded-3xl border border-[#D3E5DC] bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#D3E5DC]">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-[#071912]">
                        Sector Diversification
                      </h3>
                      <p className="text-xs text-[#587F6E]">
                        Exposure across Indian economic pillars
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-[#00A86B] bg-[#E6F9F1] px-2.5 py-0.5 rounded-full border border-[#00A86B]/20">
                        Score {diversification.score}/100
                      </span>
                    </div>
                  </div>

                  <div className="py-4">
                    <AllocationDonutChart
                      holdings={holdings}
                      cashBalance={cashBalance}
                      totalValue={totalPortfolioValue}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D3E5DC] grid grid-cols-2 gap-2 text-xs text-[#587F6E]">
                  <div className="p-3 rounded-xl bg-[#F4FAF7] border border-[#D3E5DC]">
                    <span className="text-[10px] font-mono uppercase text-[#587F6E] block font-semibold">
                      Top Sector
                    </span>
                    <span className="font-bold text-[#071912] text-xs">
                      {diversification.maxSectorName} ({diversification.maxSectorWeight}%)
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F4FAF7] border border-[#D3E5DC]">
                    <span className="text-[10px] font-mono uppercase text-[#587F6E] block font-semibold">
                      Concentration Risk
                    </span>
                    <span className="font-bold text-[#00A86B] text-xs">
                      {diversification.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Model Weights vs Target Drift */}
              <div className="lg:col-span-7 rounded-3xl border border-[#D3E5DC] bg-white p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#D3E5DC]">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-[#071912]">
                      Position Weight vs. Target Drift
                    </h3>
                    <p className="text-xs text-[#587F6E]">
                      Enforcing ≤25% cap with ±5% rebalance drift bands
                    </p>
                  </div>
                  <button
                    onClick={() => setIsRebalanceOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EDF6F2] hover:bg-[#00E599] text-[#0A1D16] text-xs font-semibold transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Rebalance</span>
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {holdings.map((h) => {
                    const drift = h.currentWeight - h.targetWeight;
                    const isExceeded = Math.abs(drift) > 5;

                    return (
                      <div key={h.symbol} className="p-3 rounded-2xl bg-[#F4FAF7] border border-[#D3E5DC] space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-[#071912]">{h.name} ({h.symbol})</span>
                          <div className="flex items-center gap-2">
                            <span>Actual: <strong>{h.currentWeight.toFixed(1)}%</strong></span>
                            <span>Target: {h.targetWeight.toFixed(1)}%</span>
                            <span
                              className={`px-1.5 py-0.2 rounded-full font-bold text-[10px] ${
                                isExceeded
                                  ? "bg-[#FDF0F1] text-[#E63946]"
                                  : "bg-[#E6F9F1] text-[#00A86B]"
                              }`}
                            >
                              {drift >= 0 ? "+" : ""}{drift.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        {/* Visual weight bar */}
                        <div className="w-full bg-[#D3E5DC] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isExceeded ? "bg-[#E63946]" : "bg-[#00E599]"}`}
                            style={{ width: `${Math.min(100, h.currentWeight * 3)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Holdings Detailed Table */}
            <div className="rounded-3xl border border-[#D3E5DC] bg-white shadow-xs overflow-hidden space-y-3 p-6 sm:p-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D3E5DC]">
                <h3 className="font-serif text-xl font-semibold text-[#071912]">
                  Individual Position Ledger
                </h3>

                {/* Sector filter pills */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {allSectors.map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setSelectedSector(sec)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        selectedSector === sec
                          ? "bg-[#0A1D16] text-[#00E599] shadow-xs"
                          : "bg-[#EDF6F2] text-[#587F6E] hover:text-[#071912]"
                      }`}
                    >
                      {sec}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-[#F4FAF7] text-[#587F6E] font-mono text-[10px] uppercase tracking-wider border-b border-[#D3E5DC]">
                    <tr>
                      <th className="py-3 px-3">Company & Ticker</th>
                      <th className="py-3 px-3">Sector</th>
                      <th className="py-3 px-3 text-right">Shares</th>
                      <th className="py-3 px-3 text-right">Avg Price</th>
                      <th className="py-3 px-3 text-right">LTP</th>
                      <th className="py-3 px-3 text-right">Current Value</th>
                      <th className="py-3 px-3 text-right">Unrealized P&L</th>
                      <th className="py-3 px-3 text-center">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D3E5DC]">
                    {filteredHoldings.map((h) => {
                      const isUp = h.unrealizedPnl >= 0;

                      return (
                        <tr key={h.symbol} className="hover:bg-[#EDF6F2]/40 transition-colors">
                          <td className="py-3.5 px-3">
                            <Link href={`/stocks/${h.symbol}`} className="font-bold text-[#071912] hover:underline flex items-center gap-2">
                              <span className="w-7 h-7 rounded-lg bg-[#0A1D16] text-[#00E599] flex items-center justify-center font-mono font-bold text-[10px]">
                                {h.symbol.slice(0, 2)}
                              </span>
                              <span>{h.name}</span>
                            </Link>
                          </td>
                          <td className="py-3.5 px-3 text-[#587F6E]">{h.sector}</td>
                          <td className="py-3.5 px-3 text-right font-mono font-semibold text-[#071912]">{h.shares}</td>
                          <td className="py-3.5 px-3 text-right font-mono text-[#587F6E]">{formatINR(h.averageBuyPrice)}</td>
                          <td className="py-3.5 px-3 text-right font-mono font-bold text-[#071912]">{formatINR(h.currentPrice)}</td>
                          <td className="py-3.5 px-3 text-right font-mono font-bold text-[#071912]">{formatINR(h.currentValue)}</td>
                          <td className="py-3.5 px-3 text-right font-mono">
                            <span className={`font-bold ${isUp ? "text-[#00A86B]" : "text-[#E63946]"}`}>
                              {isUp ? "+" : ""}{formatINR(h.unrealizedPnl)} ({formatPercent(h.unrealizedPnlPercent)})
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <Link
                              href={`/stocks/${h.symbol}`}
                              className="inline-flex p-1.5 rounded-lg bg-[#EDF6F2] hover:bg-[#00E599] text-[#0A1D16] transition-colors"
                            >
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      <AddFundsModal isOpen={isAddFundsOpen} onClose={() => setIsAddFundsOpen(false)} />
      <RebalanceModal isOpen={isRebalanceOpen} onClose={() => setIsRebalanceOpen(false)} />
    </AppShell>
  );
}
