"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "../../components/layout/AppShell";
import { useApp } from "../../context/AppContext";
import { formatINR, formatPercent, formatDate } from "../../lib/utils/formatters";
import { PortfolioAreaChart } from "../../components/charts/PortfolioAreaChart";
import { AllocationDonutChart } from "../../components/charts/AllocationDonutChart";
import { RebalanceModal } from "../../components/modals/RebalanceModal";
import { AddFundsModal } from "../../components/modals/AddFundsModal";
import { AnimatedNumber } from "../../components/ui/AnimatedNumber";
import { calculateDiversificationScore } from "../../lib/utils/simulation-engine";
import { INDIAN_STOCKS } from "../../lib/data/stocks";
import {
  ArrowRight,
  Plus,
  Play,
  Pause,
  RefreshCw,
  Check,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Gift,
  Copy,
  BarChart3,
  ArrowUpRight,
  ArrowDownLeft,
  Sliders,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Share2,
} from "lucide-react";

export default function DashboardPage() {
  const {
    user,
    cashBalance,
    holdings,
    totalInvested,
    totalHoldingsValue,
    totalPortfolioValue,
    totalUnrealizedPnl,
    totalUnrealizedPnlPercent,
    plan,
    pausePlan,
    resumePlan,
    executeContribution,
    watchlist,
    toggleWatchlist,
    showToast,
  } = useApp();

  const [isRebalanceOpen, setIsRebalanceOpen] = useState(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [marketFilter, setMarketFilter] = useState<"WATCHLIST" | "MOVERS" | "ALL">("WATCHLIST");
  const [referralCopied, setReferralCopied] = useState(false);

  const diversification = calculateDiversificationScore(holdings, cashBalance, totalPortfolioValue);

  const handleRunContribution = () => {
    const res = executeContribution();
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 5000);
  };

  const copyReferralCode = () => {
    navigator.clipboard?.writeText("NIVARAN-ELITE-2026");
    setReferralCopied(true);
    showToast({
      title: "Referral Link Copied!",
      message: "Share with peers to simulate equity reward vouchers.",
      type: "success",
    });
    setTimeout(() => setReferralCopied(false), 3000);
  };

  const isGain = totalUnrealizedPnl >= 0;

  // Watchlist & Movers dataset
  const displayedStocks =
    marketFilter === "WATCHLIST"
      ? INDIAN_STOCKS.filter((s) => watchlist.includes(s.symbol))
      : marketFilter === "MOVERS"
      ? [...INDIAN_STOCKS].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)).slice(0, 5)
      : INDIAN_STOCKS.slice(0, 6);

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8 font-sans">
        {/* MASTHEAD: Welcome & Quick Context */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00A86B] font-bold">
                Investor Console
              </span>
              <span className="text-[10px] font-mono text-[#587F6E]">• NSE/BSE Simulated Model</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#071912] font-semibold mt-0.5">
              Welcome back, {user?.name?.split(" ")[0] || "Arjun"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddFundsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#D3E5DC] bg-white hover:bg-[#EDF6F2] text-xs font-sans font-semibold text-[#071912] transition-all shadow-xs"
            >
              <Plus className="h-3.5 w-3.5 text-[#00A86B]" />
              <span>Simulate Deposit</span>
            </button>
            <button
              onClick={() => setIsRebalanceOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0A1D16] text-[#00E599] text-xs font-sans font-semibold hover:bg-[#122E23] transition-all shadow-sm"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Rebalance</span>
            </button>
          </div>
        </div>

        {feedback && (
          <div className="rounded-2xl border border-[#00E599]/40 bg-[#E6F9F1] p-4 text-xs font-mono text-[#0A1D16] flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-[#00A86B] shrink-0" />
              <span>{feedback}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="underline uppercase tracking-wider text-[10px] font-bold">
              Dismiss
            </button>
          </div>
        )}

        {/* PRIMARY HERO CARD - Directly inspired by images 3, 4, 5 & 1 */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0A1D16] via-[#0D241C] to-[#071711] text-white p-6 sm:p-8 shadow-xl shadow-[#0A1D16]/10 border border-[#163628] relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E599]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#183D2D]">
            {/* Left: User Identity & Big Portfolio Value */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#183D2D] text-[#00E599] flex items-center justify-center font-bold text-xs border border-[#23533E]">
                  {user?.name ? user.name[0] : "A"}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white leading-tight">
                    {user?.name || "Arjun Sharma"}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400">
                    {user?.email || "arjun.sharma@example.com"}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00E599] font-bold block mb-1">
                  Net Portfolio Valuation
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-semibold tabular-nums tracking-tight">
                    <AnimatedNumber value={totalPortfolioValue} format="inr" duration={1200} />
                  </span>

                  {/* Signature "Rewards >" Pill Badge - Direct from Image 3 & 5 */}
                  <Link
                    href="#invite"
                    className="inline-flex items-center gap-1 bg-[#00E599] hover:bg-[#1AFF9F] text-[#052619] text-xs font-bold px-3 py-1 rounded-full shadow-sm shadow-[#00E599]/20 transition-all hover:scale-105 shimmer-badge"
                  >
                    <span>Rewards</span>
                    <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </Link>
                </div>
              </div>

              {/* Real-time Unrealized Return Pill */}
              <div className="flex items-center gap-2 pt-1 font-mono text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00E599]/15 text-[#00E599] font-semibold border border-[#00E599]/30">
                  <TrendingUp className="h-3 w-3" />
                  <span>{isGain ? "+" : ""}{formatINR(totalUnrealizedPnl)} ({formatPercent(totalUnrealizedPnlPercent)})</span>
                </span>
                <span className="text-zinc-400 text-[11px]">All-time simulated return</span>
              </div>
            </div>

            {/* Right: Quick Action Trio (Analytics, Withdraw, Deposit) - Direct from Image 1 & 3 */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Link
                href="/insights"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#133024] hover:bg-[#1C4232] text-white text-xs font-sans font-semibold border border-[#1E4A37] transition-all hover:border-[#00E599]/40"
              >
                <BarChart3 className="h-4 w-4 text-[#00E599]" />
                <span>Analytics</span>
              </Link>
              <button
                onClick={() => {
                  showToast({
                    title: "Simulated Withdrawal",
                    message: "Simulation protocol requires holding balance for ongoing rebalancing checks.",
                    type: "info",
                  });
                }}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#133024] hover:bg-[#1C4232] text-white text-xs font-sans font-semibold border border-[#1E4A37] transition-all hover:border-[#00E599]/40"
              >
                <ArrowUpRight className="h-4 w-4 text-zinc-300" />
                <span>Withdraw</span>
              </button>
              <button
                onClick={() => setIsAddFundsOpen(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#00E599] hover:bg-[#1AFF9F] text-[#052619] text-xs font-sans font-bold shadow-md shadow-[#00E599]/20 transition-all hover:scale-[1.02]"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>Deposit</span>
              </button>
            </div>
          </div>

          {/* Sub-strip: Financial Attribution Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs font-mono">
            <div>
              <span className="text-zinc-400 text-[10px] uppercase tracking-wider block">Principal Invested</span>
              <p className="text-base font-serif text-white font-semibold tabular-nums mt-0.5">
                <AnimatedNumber value={totalInvested} format="inr" duration={1200} />
              </p>
            </div>
            <div>
              <span className="text-zinc-400 text-[10px] uppercase tracking-wider block">Available Demo Cash</span>
              <p className="text-base font-serif text-[#00E599] font-semibold tabular-nums mt-0.5">
                <AnimatedNumber value={cashBalance} format="inr" duration={1200} />
              </p>
            </div>
            <div>
              <span className="text-zinc-400 text-[10px] uppercase tracking-wider block">Active Mandate</span>
              <p className="text-base font-serif text-white font-semibold mt-0.5">
                {plan?.riskTolerance || "Balanced"}
              </p>
            </div>
            <div>
              <span className="text-zinc-400 text-[10px] uppercase tracking-wider block">Diversification Score</span>
              <p className="text-base font-serif text-[#00E599] font-semibold tabular-nums mt-0.5">
                <AnimatedNumber value={diversification.score} format="integer" duration={1000} />/100
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: RETURN STATISTICS INTERACTIVE CHART + ALLOCATION DONUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Return Statistics Chart (Directly inspired by Images 3 & 5) */}
          <div className="lg:col-span-8 rounded-3xl bg-white p-6 sm:p-7 border border-[#D3E5DC] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D3E5DC] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#00A86B] font-bold block">
                  Performance Attributions
                </span>
                <h3 className="font-serif text-xl text-[#071912] font-semibold">
                  Return Statistics
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#587F6E]">
                <span>Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-[#E6F9F1] text-[#00A86B] font-bold text-[10px]">
                  Optimal Drift (≤5%)
                </span>
              </div>
            </div>

            <PortfolioAreaChart
              currentValue={totalPortfolioValue}
              initialInvested={totalInvested}
            />
          </div>

          {/* Right Column: Asset Allocation Donut */}
          <div className="lg:col-span-4 rounded-3xl bg-white p-6 sm:p-7 border border-[#D3E5DC] shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#00A86B] font-bold block">
                Target Equilibrium
              </span>
              <h3 className="font-serif text-xl text-[#071912] font-semibold">
                Sector Weightings
              </h3>
              <p className="text-xs text-[#587F6E] mt-1 font-mono">
                Enforcing ≤25% single-stock concentration cap
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center min-h-[220px]">
              <AllocationDonutChart
                holdings={holdings}
                cashBalance={cashBalance}
                totalValue={totalPortfolioValue}
              />
            </div>

            <Link
              href="/portfolio"
              className="w-full py-2.5 px-4 rounded-xl bg-[#EDF6F2] hover:bg-[#0A1D16] text-[#071912] hover:text-[#00E599] text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Inspect All Holdings</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* SECTION 3: INVITE A FRIEND CARD & ACTIVE PLAN ENGINE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="invite">
          {/* "Invite a friend & Earn $10/₹500" - Direct inspiration from Image 1 */}
          <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-[#0A1D16] to-[#123326] text-white p-6 sm:p-7 border border-[#193F30] shadow-md relative overflow-hidden flex flex-col justify-between">
            {/* Metallic Liquid Torus Sculpture 3D Representation */}
            <div className="absolute right-0 bottom-0 w-44 h-44 pointer-events-none opacity-80">
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                  <radialGradient id="liquidSilver" cx="35%" cy="35%" r="70%">
                    <stop offset="0%" stopColor="#E2E8F0" />
                    <stop offset="25%" stopColor="#94A3B8" />
                    <stop offset="60%" stopColor="#1E293B" />
                    <stop offset="85%" stopColor="#00E599" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </radialGradient>
                </defs>
                <path
                  d="M100 20 C145 20, 180 55, 180 100 C180 145, 145 180, 100 180 C55 180, 20 145, 20 100 C20 55, 55 20, 100 20 Z M100 55 C75 55, 55 75, 55 100 C55 125, 75 145, 100 145 C125 145, 145 125, 145 100 C145 75, 125 55, 100 55 Z"
                  fill="url(#liquidSilver)"
                  className="filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform rotate-12"
                />
              </svg>
            </div>

            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00E599]/20 text-[#00E599] text-[10px] font-mono font-bold">
                <Gift className="h-3 w-3" />
                <span>COMMUNITY REWARD</span>
              </div>
              <h3 className="font-serif text-2xl text-white font-semibold leading-snug max-w-xs">
                Invite a friend and you can both get ₹500 in equity credits.
              </h3>
              <p className="text-xs text-zinc-300 max-w-xs leading-relaxed">
                Empower your peers to practice disciplined, rules-driven investing with zero real financial risk.
              </p>
            </div>

            <div className="relative z-10 pt-6 space-y-2">
              <div className="flex items-center gap-2 bg-[#06140F] border border-[#1E4736] rounded-2xl p-1.5 pl-3">
                <span className="font-mono text-xs font-bold text-[#00E599] select-all">
                  NIVARAN-ELITE-2026
                </span>
                <button
                  type="button"
                  onClick={copyReferralCode}
                  className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00E599] hover:bg-[#1AFF9F] text-[#052619] text-xs font-bold transition-all shadow-xs"
                >
                  {referralCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{referralCopied ? "Copied" : "Copy Link"}</span>
                </button>
              </div>
              <p className="text-[10px] font-mono text-zinc-400">
                3 invites completed • ₹1,500 demo credits added to ledger
              </p>
            </div>
          </div>

          {/* Active Investment Plan Engine */}
          <div className="lg:col-span-7 rounded-3xl bg-white p-6 sm:p-7 border border-[#D3E5DC] shadow-xs space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D3E5DC]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#00A86B] font-bold block">
                    Execution Schedule
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <h3 className="font-serif text-xl text-[#071912] font-semibold">
                      {plan?.name || "NIVARAN Core Balanced Model"}
                    </h3>
                    <span
                      className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                        plan?.status === "ACTIVE"
                          ? "bg-[#E6F9F1] text-[#00A86B] border border-[#00A86B]/30"
                          : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                      }`}
                    >
                      {plan?.status || "ACTIVE"}
                    </span>
                  </div>
                </div>

                {/* Plan Action Buttons */}
                <div className="flex items-center gap-2">
                  {plan?.status === "ACTIVE" ? (
                    <>
                      <button
                        onClick={handleRunContribution}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0A1D16] text-[#00E599] text-xs font-mono font-bold hover:bg-[#122E23] transition-all shadow-xs"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        <span>Run Contribution</span>
                      </button>
                      <button
                        onClick={pausePlan}
                        className="px-3 py-1.5 rounded-full border border-[#D3E5DC] text-xs font-mono text-[#587F6E] hover:bg-[#EDF6F2]"
                      >
                        Pause
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={resumePlan}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0A1D16] text-[#00E599] text-xs font-mono font-bold"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>Resume Plan</span>
                    </button>
                  )}
                  <Link
                    href="/investment-plan"
                    className="p-1.5 rounded-full border border-[#D3E5DC] text-[#587F6E] hover:bg-[#EDF6F2]"
                    title="Configure Plan"
                  >
                    <Sliders className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Target Allocation Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-4">
                {plan?.allocations.map((alloc) => (
                  <div key={alloc.symbol} className="rounded-2xl border border-[#D3E5DC] bg-[#F4FAF7] p-3 space-y-1">
                    <div className="flex justify-between items-center font-mono">
                      <span className="font-bold text-[#071912] text-xs">{alloc.symbol}</span>
                      <span className="text-[#00A86B] font-bold text-xs">{alloc.percentage}%</span>
                    </div>
                    <p className="text-[10px] text-[#587F6E] truncate">{alloc.sector}</p>
                    <p className="text-[11px] font-mono font-semibold text-[#071912] tabular-nums">
                      {formatINR(alloc.targetAmount)}/mo
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#D3E5DC] flex items-center justify-between text-xs text-[#587F6E] font-mono">
              <span>Next Automated Cycle: 1 Nov 2026</span>
              <Link href="/investment-plan" className="text-[#0A1D16] font-semibold hover:underline flex items-center gap-1">
                <span>Manage Mandate Rules</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* SECTION 4: WATCHLIST & TOP MOVERS (Directly inspired by Images 3 & 5) */}
        <div className="rounded-3xl bg-white p-6 sm:p-7 border border-[#D3E5DC] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D3E5DC]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#00A86B] font-bold block">
                Indian Equities Discovery
              </span>
              <h3 className="font-serif text-xl text-[#071912] font-semibold">
                Watchlist & Market Dynamics
              </h3>
            </div>

            {/* Segmented Filter Pills (Watchlist / Top Movers / All) */}
            <div className="flex items-center gap-1 bg-[#EDF6F2] p-1 rounded-full border border-[#D3E5DC]">
              <button
                onClick={() => setMarketFilter("WATCHLIST")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  marketFilter === "WATCHLIST"
                    ? "bg-[#0A1D16] text-[#00E599] shadow-xs"
                    : "text-[#587F6E] hover:text-[#071912]"
                }`}
              >
                Watchlist ({watchlist.length})
              </button>
              <button
                onClick={() => setMarketFilter("MOVERS")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  marketFilter === "MOVERS"
                    ? "bg-[#0A1D16] text-[#00E599] shadow-xs"
                    : "text-[#587F6E] hover:text-[#071912]"
                }`}
              >
                Top Movers
              </button>
              <button
                onClick={() => setMarketFilter("ALL")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  marketFilter === "ALL"
                    ? "bg-[#0A1D16] text-[#00E599] shadow-xs"
                    : "text-[#587F6E] hover:text-[#071912]"
                }`}
              >
                All Screened
              </button>
            </div>
          </div>

          {/* Stock List Grid (Styling inspired by Images 3 & 5) */}
          <div className="divide-y divide-[#D3E5DC]">
            {displayedStocks.map((stock) => {
              const isUp = stock.change >= 0;
              const isFav = watchlist.includes(stock.symbol);

              return (
                <div
                  key={stock.symbol}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-[#EDF6F2]/50 px-2 rounded-2xl transition-colors group"
                >
                  {/* Left: Brand Squircle Glyph + Names */}
                  <Link
                    href={`/stocks/${stock.symbol}`}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-[#0A1D16] text-[#00E599] flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-[#071912] group-hover:text-[#0A1D16] truncate">
                        {stock.name}
                      </div>
                      <div className="text-[10px] font-mono text-[#587F6E] flex items-center gap-2">
                        <span>{stock.symbol}</span>
                        <span>•</span>
                        <span>{stock.sector}</span>
                      </div>
                    </div>
                  </Link>

                  {/* Center: Mini Sparkline SVG (Inspired by Images 3 & 5) */}
                  <div className="hidden sm:block w-24 h-8 shrink-0">
                    <svg viewBox="0 0 100 30" className="w-full h-full">
                      <path
                        d={
                          isUp
                            ? "M 5 22 Q 25 25, 45 15 T 75 12 T 95 6"
                            : "M 5 8 Q 25 6, 45 18 T 75 22 T 95 26"
                        }
                        fill="none"
                        stroke={isUp ? "#00A86B" : "#E63946"}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* Right: Price & Change Pill */}
                  <div className="flex items-center gap-3 text-right shrink-0">
                    <div>
                      <div className="font-serif text-sm font-semibold text-[#071912] tabular-nums">
                        {formatINR(stock.currentPrice, { showPaise: true })}
                      </div>
                      <div
                        className={`text-[10px] font-mono font-semibold ${
                          isUp ? "text-[#00A86B]" : "text-[#E63946]"
                        }`}
                      >
                        {isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    <Link
                      href={`/stocks/${stock.symbol}`}
                      className="p-2 rounded-xl bg-[#EDF6F2] text-[#0A1D16] hover:bg-[#00E599] transition-colors"
                      title="Inspect security"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/markets"
              className="text-xs font-mono font-semibold text-[#0A1D16] hover:text-[#00A86B] underline underline-offset-4"
            >
              Explore Full Indian Equities Universe ({INDIAN_STOCKS.length} Screened Securities) →
            </Link>
          </div>
        </div>
      </div>

      {/* Add Funds Modal */}
      <AddFundsModal
        isOpen={isAddFundsOpen}
        onClose={() => setIsAddFundsOpen(false)}
      />

      {/* Rebalance Modal */}
      <RebalanceModal
        isOpen={isRebalanceOpen}
        onClose={() => setIsRebalanceOpen(false)}
      />
    </AppShell>
  );
}
