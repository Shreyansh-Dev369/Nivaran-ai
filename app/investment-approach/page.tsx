"use client";

import React from "react";
import Link from "next/link";
import { PublicHeader } from "../../components/layout/PublicHeader";
import { PublicFooter } from "../../components/layout/PublicFooter";
import {
  Compass,
  PieChart,
  ShieldCheck,
  Scale,
  Percent,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  BookOpen,
} from "lucide-react";

export default function InvestmentApproachPage() {
  const principles = [
    {
      index: "01",
      title: "Hard Single-Stock Concentration Caps",
      desc: "Even established blue-chip giants can face prolonged stagnation or sector-specific headwinds. NIVARAN enforces strict single-stock ceilings (typically 20% to 25%), preventing catastrophic single-company drawdown.",
      tag: "CONCENTRATION RISK",
    },
    {
      index: "02",
      title: "Cross-Sector Economic Calibration",
      desc: "Economic cycles rotate: IT services thrive during enterprise tech transformations, banking captures domestic credit demand, and FMCG supplies steady dividend income. NIVARAN distributes allocations across at least 3 to 5 core industries.",
      tag: "CYCLICAL PROTECTION",
    },
    {
      index: "03",
      title: "Beta & Volatility Sensitivity Profiling",
      desc: "Our quantitative model evaluates each security's Beta (correlation to Nifty 50) and trailing volatility. Conservative portfolios emphasize lower-Beta cash generators, while Growth mandates incorporate higher-beta industry leaders.",
      tag: "VOLATILITY CALIBRATION",
    },
    {
      index: "04",
      title: "Threshold-Driven Rebalancing Governance",
      desc: "Rather than initiating arbitrary calendar trades that rack up friction costs, NIVARAN utilizes a disciplined ±5% drift threshold. Simulated trades are only proposed when market movement meaningfully skews intended risk parameters.",
      tag: "DRIFT THRESHOLD",
    },
  ];

  const glossary = [
    {
      term: "Asset Allocation",
      definition:
        "The strategic apportionment of an investor's capital across individual equities or sectors to balance risk against anticipated return.",
    },
    {
      term: "Portfolio Diversification",
      definition:
        "Spreading capital across multiple companies and unrelated economic sectors so that poor results in one asset do not devastate overall net worth.",
    },
    {
      term: "Weight Drift",
      definition:
        "The natural mathematical divergence of a portfolio's actual asset proportions from its target mandate as individual share prices rise and fall.",
    },
    {
      term: "Rebalancing",
      definition:
        "The systematic discipline of trimming overweight positions and redeploying into underweight securities to restore the investor's intended risk mandate.",
    },
    {
      term: "Systematic Beta",
      definition:
        "A statistical gauge of an equity's price sensitivity relative to the broader benchmark (e.g. Nifty 50). A Beta < 1.0 implies lower volatility than the general market.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#EDF6F2] text-[#071912] selection:bg-[#00E599] selection:text-[#061610]">
      <PublicHeader />

      <main className="flex-1">
        {/* Editorial Masthead */}
        <section className="py-20 sm:py-24 border-b border-charcoal-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#F4F4EE] border border-charcoal-200">
              <span className="h-1.5 w-1.5 rounded-full bg-forest-700"></span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-charcoal-700">
                INVESTMENT PHILOSOPHY & QUANTITATIVE DISCIPLINE
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl font-normal tracking-tight text-charcoal-950">
              Our Investment Approach
            </h1>
            <p className="font-sans text-sm sm:text-base text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
              Why preference-driven, rules-based equity investing consistently protects ordinary people from the emotional traps of day-trading and speculation.
            </p>
          </div>
        </section>

        {/* 4 Pillars Grid */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-forest-800">
                THE FOUR PILLARS
              </span>
              <h2 className="font-serif text-3xl font-normal text-charcoal-950">
                Grounded in Modern Portfolio Theory
              </h2>
              <p className="text-xs text-charcoal-600">
                Calibrated specifically for Indian market liquidity and NSE/BSE blue-chip equity fundamentals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {principles.map((p) => (
                <div
                  key={p.index}
                  className="border border-charcoal-200 bg-white p-8 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-forest-800 bg-forest-50 px-2 py-0.5 rounded border border-forest-100">
                      PILLAR {p.index}
                    </span>
                    <span className="font-mono text-[10px] uppercase text-charcoal-400">
                      {p.tag}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-normal text-charcoal-950">
                    {p.title}
                  </h3>
                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plain Language Glossary Ledger */}
        <section className="py-16 sm:py-20 bg-white border-t border-charcoal-200">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-forest-800">
                CLARITY OVER JARGON
              </span>
              <h2 className="font-serif text-3xl font-normal text-charcoal-950">
                Financial Lexicon for the Informed Investor
              </h2>
              <p className="text-xs text-charcoal-600">
                Unambiguous definitions of core quantitative investing concepts.
              </p>
            </div>

            <div className="border border-charcoal-200 divide-y divide-charcoal-200 bg-[#FBFBF8]">
              {glossary.map((item) => (
                <div key={item.term} className="p-5 sm:p-6 space-y-1">
                  <h4 className="font-mono text-xs font-bold text-charcoal-950 uppercase tracking-wide">
                    {item.term}
                  </h4>
                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <Link
                href="/investment-plan/create"
                className="inline-flex items-center gap-2 rounded bg-forest-800 px-6 py-2.5 text-xs font-medium text-white hover:bg-forest-900 transition-colors shadow-xs"
              >
                <span>Formulate Your Personalized Plan</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
