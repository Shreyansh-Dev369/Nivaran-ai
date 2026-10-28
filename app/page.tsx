"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicHeader } from "../components/layout/PublicHeader";
import { PublicFooter } from "../components/layout/PublicFooter";
import { LiveTickerRibbon } from "../components/ui/LiveTickerRibbon";
import { InteractiveSimulator } from "../components/ui/InteractiveSimulator";
import { AnimatedNumber } from "../components/ui/AnimatedNumber";
import { formatINR } from "../lib/utils/formatters";
import {
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Check,
  Sliders,
  PieChart,
  RefreshCw,
  TrendingUp,
  Sparkles,
  Layers,
  ArrowUpRight,
  Gift,
  Target,
  BarChart3,
  Lock,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const lifecycleSteps = [
    {
      num: "01",
      title: "Define Preferences & Risk Tier",
      desc: "Specify your personal investment horizon, financial goals (e.g., retirement or compounding corpus), and preferred Indian economic sectors like IT, banking, energy, and healthcare.",
    },
    {
      num: "02",
      title: "Algorithmic Stock Proposal",
      desc: "The engine screens BSE and NSE-listed equities and proposes an exact portfolio with rupee values, whole estimated shares, and percentages summing deterministically to 100%.",
    },
    {
      num: "03",
      title: "Enforce Diversification Rules",
      desc: "Rigorous constraints safeguard your capital: strict single-stock concentration caps (≤25%), HHI scoring, and automated drift rebalancing tolerance of ±5%.",
    },
    {
      num: "04",
      title: "Automated Monthly Execution",
      desc: "Simulated recurring contributions deploy on schedule. Transparent double-entry ledger vouchers preserve an immutable audit trail with zero real monetary risk.",
    },
  ];

  const faqs = [
    {
      q: "How does NIVARAN differ from conventional trading terminals in India?",
      a: "Trading terminals are engineered for transaction churn, displaying rapid price ticks, derivatives chains, and speculative technical charts. NIVARAN is designed for portfolio capital: you define your financial goals, risk constraints, and sector convictions, and the engine constructs an explainable, diversified equity allocation that automates monthly contributions.",
    },
    {
      q: "How are individual stocks selected for a user's allocation?",
      a: "The engine screens liquid, large-cap Indian companies listed on the NSE and BSE. It scores securities against your chosen risk tier (evaluating Beta, operating cash-flow stability, return on equity, and dividend consistency), enforces a strict single-stock concentration ceiling (≤25%), and distributes capital across complementary sectors.",
    },
    {
      q: "Is real money transferred during this demonstration?",
      a: "No. NIVARAN is an educational prototype developed for university evaluation. All transactions, contributions, and cash balances operate within an isolated, simulated ledger. No real brokerage credentials, bank accounts, or UPI transfers are ever required or initiated.",
    },
    {
      q: "What is portfolio drift, and how does automated rebalancing resolve it?",
      a: "Over time, certain market winners grow faster than others, inadvertently skewing your portfolio toward excessive risk in one company or sector. NIVARAN monitors drift in real time: whenever an asset drifts beyond ±5% from your target weight, the engine proposes an exact rebalancing schedule to restore balance without guessing.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#EDF6F2] text-[#071912] font-sans selection:bg-[#00E599] selection:text-[#061610]">
      <PublicHeader />
      <LiveTickerRibbon />

      <main className="flex-1 space-y-16 sm:space-y-24">
        {/* HERO SECTION - Inspired by Images 3, 4, 5 */}
        <section className="relative overflow-hidden pt-10 sm:pt-16 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Ambient Breathing Aurora */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#00E599]/15 via-emerald-400/10 to-teal-200/5 rounded-full blur-3xl pointer-events-none -z-10 animate-ambient-aurora"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Typographic & Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D3E5DC] text-[11px] font-mono uppercase tracking-wider text-[#0A1D16] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse"></span>
                <span>Automated Equities Architecture</span>
                <span className="text-[#587F6E]">• NSE/BSE Simulated</span>
              </div>

              <div className="space-y-3">
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#071912] font-normal tracking-tight leading-[1.12]">
                  Wealth built by <span className="font-semibold text-[#0A1D16]">mathematical discipline</span>, not market noise.
                </h1>
                <p className="font-serif italic text-lg sm:text-xl text-[#3C6554]">
                  Rule-based Indian stock investing for long-term compounders.
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#4B665A] leading-relaxed max-w-xl">
                Most retail investors underperform not because Indian enterprises fail to compound, but because emotional day-trading, speculative tips, and unchecked concentration erode returns. NIVARAN automates preference-based allocation with deterministic rules.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#0A1D16] hover:bg-[#122E23] text-[#00E599] text-xs font-mono font-bold transition-all shadow-md hover:scale-[1.02]"
                >
                  <span>Launch Live Demo Console</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/investment-plan/create"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#F4FAF7] text-[#071912] border border-[#D3E5DC] text-xs font-sans font-semibold transition-all shadow-xs"
                >
                  <Sliders className="h-4 w-4 text-[#00A86B]" />
                  <span>Interactive Plan Generator</span>
                </Link>
              </div>

              {/* Three Core Safeguards Bar */}
              <div className="pt-6 border-t border-[#D3E5DC] grid grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#587F6E] uppercase tracking-wider block">Single-Stock Cap</span>
                  <strong className="text-[#071912] font-bold text-xs sm:text-sm">≤25% Max Exposure</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#587F6E] uppercase tracking-wider block">Drift Control</span>
                  <strong className="text-[#071912] font-bold text-xs sm:text-sm">±5% Rebalancing</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#587F6E] uppercase tracking-wider block">Demo Ledger</span>
                  <strong className="text-[#00A86B] font-bold text-xs sm:text-sm">100% Risk-Free</strong>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Showcase Card - Directly inspired by Images 3, 4, 5 */}
            <div className="lg:col-span-5 relative">
              {/* Outer Decorative Glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#00E599]/20 to-emerald-400/10 rounded-3xl blur-xl pointer-events-none"></div>

              {/* High-Craft Product Card */}
              <div className="relative rounded-3xl bg-[#0A1D16] text-white p-5 sm:p-6 shadow-2xl border border-[#163628] space-y-4 artistic-card">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#183D2D]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#183D2D] text-[#00E599] flex items-center justify-center font-bold text-xs">
                      A
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Arjun Sharma</div>
                      <div className="text-[9px] font-mono text-zinc-400">NSE Model Portfolio</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/30">
                    Tier 1 Verified
                  </span>
                </div>

                {/* Balance + "Rewards >" Pill Badge */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                    Net Portfolio Valuation
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-3xl sm:text-4xl text-white font-semibold tabular-nums">
                      <AnimatedNumber value={1248920} format="inr" duration={1600} />
                    </span>
                    <span className="inline-flex items-center gap-1 bg-[#00E599] text-[#052619] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm shimmer-badge">
                      Rewards &gt;
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#00E599] font-semibold pt-0.5">
                    <TrendingUp className="h-3 w-3" />
                    <span>+₹1,48,920 (+13.56%)</span>
                    <span className="text-zinc-400 text-[10px] font-normal">All-time</span>
                  </div>
                </div>

                {/* Return Statistics Mini Spline */}
                <div className="rounded-2xl bg-[#071711] p-3 border border-[#143324] space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-zinc-400 uppercase">Trajectory</span>
                    <span className="text-[#00E599] font-bold">● +0.25% vs Nifty</span>
                  </div>
                  <div className="h-16 w-full">
                    <svg viewBox="0 0 280 60" fill="none" className="w-full h-full">
                      <defs>
                        <linearGradient id="landingGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00E599" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#00E599" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 5 50 Q 50 48, 80 40 T 140 32 T 200 20 T 275 8 L 275 60 L 5 60 Z"
                        fill="url(#landingGrad)"
                      />
                      <path
                        d="M 5 50 Q 50 48, 80 40 T 140 32 T 200 20 T 275 8"
                        stroke="#00E599"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                      <circle cx="275" cy="8" r="3" fill="#00E599" />
                    </svg>
                  </div>
                </div>

                {/* Sample Watchlist Row Previews */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#0D241B] border border-[#18392B] text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#00E599] text-[#061610] font-mono font-bold text-[10px] flex items-center justify-center">
                        RE
                      </span>
                      <span className="font-semibold text-white">Reliance Industries</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-white font-bold">₹2,945.60</span>
                      <span className="text-[#00E599] text-[10px] block">+0.94%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#0D241B] border border-[#18392B] text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#00E599] text-[#061610] font-mono font-bold text-[10px] flex items-center justify-center">
                        TC
                      </span>
                      <span className="font-semibold text-white">Tata Consultancy</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-white font-bold">₹3,892.40</span>
                      <span className="text-[#00E599] text-[10px] block">+1.45%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <Link
                    href="/dashboard"
                    className="w-full py-2 px-4 rounded-xl bg-[#00E599] hover:bg-[#1AFF9F] text-[#052619] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Interact with Live Portfolio</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE ALLOCATION SIMULATOR */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-reveal">
          <InteractiveSimulator />
        </section>

        {/* SECTION 3: THE 4 MATHEMATICAL PILLARS */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 scroll-reveal">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00A86B] font-bold">
              Engineering Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#071912] font-semibold">
              The Four Mathematical Safeguards
            </h2>
            <p className="text-xs sm:text-sm text-[#587F6E]">
              Engineered to protect wealth against human emotion, unchecked concentration, and volatility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-3xl bg-white p-6 border border-[#D3E5DC] shadow-xs space-y-3 artistic-card">
              <div className="w-10 h-10 rounded-2xl bg-[#0A1D16] text-[#00E599] flex items-center justify-center font-mono font-bold text-xs">
                01
              </div>
              <h3 className="font-serif text-lg text-[#071912] font-semibold">
                Single-Stock Cap (≤25%)
              </h3>
              <p className="text-xs text-[#587F6E] leading-relaxed">
                No single enterprise can dominate your portfolio, preventing idiosyncratic company disasters from threatening overall wealth.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 border border-[#D3E5DC] shadow-xs space-y-3 artistic-card">
              <div className="w-10 h-10 rounded-2xl bg-[#0A1D16] text-[#00E599] flex items-center justify-center font-mono font-bold text-xs">
                02
              </div>
              <h3 className="font-serif text-lg text-[#071912] font-semibold">
                Drift Rebalancing (±5%)
              </h3>
              <p className="text-xs text-[#587F6E] leading-relaxed">
                When market movements skew allocations beyond target thresholds, one-click rebalancing trims overweights and replenishes defensive value.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 border border-[#D3E5DC] shadow-xs space-y-3 artistic-card">
              <div className="w-10 h-10 rounded-2xl bg-[#0A1D16] text-[#00E599] flex items-center justify-center font-mono font-bold text-xs">
                03
              </div>
              <h3 className="font-serif text-lg text-[#071912] font-semibold">
                Cross-Sector Resilience
              </h3>
              <p className="text-xs text-[#587F6E] leading-relaxed">
                Capital is diversified across technology, banking, energy, consumer, and industrial sectors to smooth out domestic economic cycles.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 border border-[#D3E5DC] shadow-xs space-y-3 artistic-card">
              <div className="w-10 h-10 rounded-2xl bg-[#0A1D16] text-[#00E599] flex items-center justify-center font-mono font-bold text-xs">
                04
              </div>
              <h3 className="font-serif text-lg text-[#071912] font-semibold">
                Double-Entry Audit Vouchers
              </h3>
              <p className="text-xs text-[#587F6E] leading-relaxed">
                Every simulated deposit, allocation split, and rebalance creates verifiable accounting records with decimal-safe paise calculations.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: COMPARISON MATRIX */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 scroll-reveal">
          <div className="rounded-3xl bg-white p-6 sm:p-10 border border-[#D3E5DC] shadow-xs space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00A86B] font-bold block">
                Objective Comparison
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#071912] font-semibold mt-0.5">
                Why NIVARAN Solves the Individual Investor Dilemma
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="border-b border-[#D3E5DC] text-[10px] font-mono uppercase text-[#587F6E]">
                  <tr>
                    <th className="py-3 px-4">Dimension</th>
                    <th className="py-3 px-4 bg-[#EDF6F2] text-[#0A1D16] font-bold rounded-t-xl">
                      NIVARAN Architecture
                    </th>
                    <th className="py-3 px-4">DIY Day-Trading Apps</th>
                    <th className="py-3 px-4">Traditional Mutual Funds</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D3E5DC]">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-[#071912]">Emotional Discipline</td>
                    <td className="py-3.5 px-4 bg-[#EDF6F2] text-[#00A86B] font-bold">100% Automated by Rules</td>
                    <td className="py-3.5 px-4 text-[#E63946]">Vulnerable to fear & greed</td>
                    <td className="py-3.5 px-4 text-[#587F6E]">Passive, but unpersonalized</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-[#071912]">Concentration Control</td>
                    <td className="py-3.5 px-4 bg-[#EDF6F2] text-[#00A86B] font-bold">Strict ≤25% Ceiling Enforced</td>
                    <td className="py-3.5 px-4 text-[#E63946]">Often overconcentrated in 1-2 stocks</td>
                    <td className="py-3.5 px-4 text-[#587F6E]">Over-diversified (50+ stocks)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-[#071912]">Rebalancing Mechanism</td>
                    <td className="py-3.5 px-4 bg-[#EDF6F2] text-[#00A86B] font-bold">Continuous ±5% Drift Monitoring</td>
                    <td className="py-3.5 px-4 text-[#E63946]">Rarely executed manually</td>
                    <td className="py-3.5 px-4 text-[#587F6E]">Opaque internal fund turnover</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-[#071912]">Transparency</td>
                    <td className="py-3.5 px-4 bg-[#EDF6F2] text-[#00A86B] font-bold">Explicit Financial Rationales</td>
                    <td className="py-3.5 px-4 text-[#587F6E]">High noise, speculative chat tips</td>
                    <td className="py-3.5 px-4 text-[#587F6E]">Delayed monthly factsheets</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 5: INTERACTIVE FAQ ACCORDION */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 scroll-reveal">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00A86B] font-bold">
              Frequently Asked Questions
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#071912] font-semibold">
              Understanding the Demonstration
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#D3E5DC] bg-white overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-serif text-base sm:text-lg text-[#071912] font-medium"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#587F6E] transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-[#00A86B]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#4B665A] leading-relaxed font-sans border-t border-[#EDF6F2] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-12 scroll-reveal">
          <div className="rounded-3xl bg-[#0A1D16] text-white p-8 sm:p-12 border border-[#163628] shadow-2xl text-center space-y-5 relative overflow-hidden">
            <div className="relative z-10 max-w-xl mx-auto space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00E599] font-bold block">
                Begin Academic Evaluation
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
                Experience disciplined equities management.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300">
                Explore the full suite of automated contributions, drift rebalancing audits, and real-time market simulations.
              </p>
              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/dashboard"
                  className="px-6 py-3 rounded-full bg-[#00E599] hover:bg-[#1AFF9F] text-[#052619] text-xs font-mono font-bold transition-all shadow-md hover:scale-105"
                >
                  Open Executive Dashboard
                </Link>
                <Link
                  href="/markets"
                  className="px-6 py-3 rounded-full bg-[#133024] hover:bg-[#1C4232] text-white border border-[#1E4A37] text-xs font-sans font-semibold transition-all"
                >
                  Explore Equities Universe
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
