"use client";

import React from "react";
import Link from "next/link";
import { PublicHeader } from "../../components/layout/PublicHeader";
import { PublicFooter } from "../../components/layout/PublicFooter";
import {
  Sliders,
  PieChart,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Layers,
  Check,
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      clause: "CLAUSE 01 / MANDATE FORMULATION",
      title: "Establish Your Investment Preferences",
      desc: "Complete an unhurried, preference-based questionnaire specifying your investment horizon (Conservative, Balanced, or Growth), risk boundaries, monthly allocation target, and industrial sectors of interest (e.g., Technology, Banking, Energy, FMCG).",
      highlights: [
        "Jargon-free questionnaire design",
        "Deterministic risk calibration",
        "Sector exclusion controls",
      ],
    },
    {
      num: "02",
      clause: "CLAUSE 02 / DETERMINISTIC ENGINE",
      title: "Rule-Based Indian Stock Allocation",
      desc: "The NIVARA engine scans qualifying Indian blue-chip equities listed on the NSE and BSE. It distributes capital across eligible companies while strictly enforcing maximum single-stock caps (typically 20% to 25%) and guaranteeing a mathematical 100% total allocation.",
      highlights: [
        "Explainable stock selection rationale",
        "Enforced single-stock caps",
        "100% mathematical integrity",
      ],
    },
    {
      num: "03",
      clause: "CLAUSE 03 / AUTOMATED CADENCE",
      title: "Simulated Automated Recurring Execution",
      desc: "Rather than spending hours researching and placing individual manual buy orders every month, your approved plan can be executed on a simulated recurring schedule (e.g., monthly SIP), debiting your demo cash ledger and crediting holdings.",
      highlights: [
        "Simulated monthly SIP execution",
        "Whole-share allocation math",
        "Double-entry ledger audit vouchers",
      ],
    },
    {
      num: "04",
      clause: "CLAUSE 04 / DRIFT GOVERNANCE",
      title: "Continuous Drift Monitoring & Rebalancing",
      desc: "As market prices fluctuate, high-performing equities naturally expand while others contract, skewing your intended asset distribution. NIVARA monitors portfolio drift in real time and alerts you when positions deviate by more than ±5%, providing one-click rebalance execution.",
      highlights: [
        "Real-time drift variance tracking",
        "Pre-trade execution preview",
        "Strict risk alignment restoration",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#EDF6F2] text-[#071912] selection:bg-[#00E599] selection:text-[#061610]">
      <PublicHeader />

      <main className="flex-1">
        {/* Editorial Broadsheet Masthead */}
        <section className="py-20 sm:py-24 border-b border-charcoal-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#F4F4EE] border border-charcoal-200">
              <span className="h-1.5 w-1.5 rounded-full bg-forest-700"></span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-charcoal-700">
                SYSTEM ARCHITECTURE & WORKFLOW
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl font-normal tracking-tight text-charcoal-950">
              How the NIVARA Platform Operates
            </h1>
            <p className="font-sans text-sm sm:text-base text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
              An unhurried, transparent mechanism for preference-based investing in Indian equities—from mandate creation to automated execution and drift control.
            </p>
          </div>
        </section>

        {/* Step-by-Step Editorial Ledger */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
            {steps.map((s) => (
              <div
                key={s.num}
                className="border border-charcoal-200 bg-white p-6 sm:p-10 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
              >
                <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-charcoal-200 pb-4 md:pb-0 md:pr-6 space-y-2">
                  <span className="font-mono text-4xl font-light text-forest-800 tabular-nums block">
                    {s.num}
                  </span>
                  <span className="font-mono text-[10px] tracking-wider uppercase text-charcoal-500 block">
                    {s.clause}
                  </span>
                </div>

                <div className="md:col-span-9 space-y-4">
                  <h2 className="font-serif text-2xl font-normal text-charcoal-950">
                    {s.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                    {s.desc}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2">
                    {s.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F4F4EE] border border-charcoal-200 font-mono text-[11px] text-charcoal-800"
                      >
                        <Check className="h-3 w-3 text-forest-700" />
                        <span>{h}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Bottom Callout Canvas */}
            <div className="border border-charcoal-200 bg-white p-8 sm:p-12 text-center space-y-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-forest-800 block">
                EXPERIENCE THE SIMULATION
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-charcoal-950">
                Ready to formulate your investment mandate?
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 max-w-md mx-auto leading-relaxed">
                Walk through our 3-minute questionnaire, generate a transparent portfolio of NSE/BSE stocks, and monitor simulated growth.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/investment-plan/create"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-forest-800 px-6 py-2.5 text-xs font-medium text-white hover:bg-forest-900 transition-colors shadow-xs"
                >
                  <span>Build Investment Plan</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded border border-charcoal-300 bg-white px-6 py-2.5 text-xs font-medium text-charcoal-800 hover:bg-[#F4F4EE] transition-colors"
                >
                  <span>Enter Dashboard</span>
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
