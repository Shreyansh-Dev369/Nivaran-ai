"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { BrandLogo } from "../../components/ui/BrandLogo";
import { DemoBadge } from "../../components/ui/DemoBadge";
import {
  InvestmentHorizon,
  PlanFrequency,
  RiskTolerance,
  StockSector,
} from "../../lib/types";
import { generateAllocationProposal } from "../../lib/utils/simulation-engine";
import { formatINR } from "../../lib/utils/formatters";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const ALL_SECTORS: StockSector[] = [
  "Technology",
  "Banking & Finance",
  "Energy & Utilities",
  "Healthcare & Pharma",
  "Consumer Goods",
  "Industrials",
  "Automobile",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { createPlan, executeContribution, cashBalance, addDemoFunds } = useApp();

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const [goal, setGoal] = useState<string>("Long-Term Wealth Building");
  const [horizon, setHorizon] = useState<InvestmentHorizon>("LONG");
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>("BALANCED");
  const [preferredSectors, setPreferredSectors] = useState<StockSector[]>([
    "Technology",
    "Banking & Finance",
    "Energy & Utilities",
  ]);
  const [amount, setAmount] = useState<number>(25000);
  const [frequency, setFrequency] = useState<PlanFrequency>("MONTHLY");

  const toggleSector = (sec: StockSector) => {
    if (preferredSectors.includes(sec)) {
      if (preferredSectors.length > 1) {
        setPreferredSectors(preferredSectors.filter((s) => s !== sec));
      }
    } else {
      setPreferredSectors([...preferredSectors, sec]);
    }
  };

  const proposedAllocations = generateAllocationProposal({
    amount,
    horizon,
    riskTolerance,
    preferredSectors,
    maxSingleStockCap: 25,
  });

  const handleFinish = (autoDeploy: boolean) => {
    createPlan({
      name: `${riskTolerance.charAt(0) + riskTolerance.slice(1).toLowerCase()} Automated Portfolio`,
      frequency,
      simulatedAmount: amount,
      horizon,
      riskTolerance,
      preferredSectors,
      excludedSectors: [],
      maxSingleStockCap: 25,
      rebalanceThreshold: 5,
      allocations: proposedAllocations,
    });

    if (autoDeploy) {
      if (cashBalance < amount) {
        addDemoFunds(amount - cashBalance + 10000, "Initial Onboarding Demo Funding");
      }
      setTimeout(() => {
        executeContribution(amount);
        router.push("/dashboard");
      }, 300);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-ink-950 font-sans">
      {/* Editorial Header */}
      <header className="border-b border-hairline bg-paper px-6 py-4 sm:px-8 flex items-center justify-between">
        <BrandLogo size="md" />
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono uppercase tracking-wider text-ink-500">
            Step {step} / {totalSteps}
          </span>
          <DemoBadge compact />
        </div>
      </header>

      {/* Progress Line */}
      <div className="h-0.5 w-full bg-hairline">
        <div
          className="h-full bg-pine-900 transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-2xl border border-hairline bg-paper p-7 sm:p-10 space-y-6">
          {/* STEP 1: Objective */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pine-900 font-semibold block">
                  Mandate • 01
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl text-ink-950 font-normal">
                  What is your primary investment objective?
                </h1>
                <p className="text-xs text-ink-500 font-sans">
                  The engine uses this baseline to calibrate duration and defensive cash requirements.
                </p>
              </div>

              <div className="space-y-3 font-sans">
                {[
                  {
                    id: "Long-Term Wealth Building",
                    label: "Long-Term Wealth Creation",
                    sub: "Compounding capital across high-ROE blue-chip Indian enterprises over 5+ years.",
                  },
                  {
                    id: "Retirement Corpus",
                    label: "Retirement Planning",
                    sub: "Building resilient dividend-yielding positions for long-term purchasing power.",
                  },
                  {
                    id: "Major Milestone",
                    label: "Capital Accumulation",
                    sub: "Targeted savings for property acquisition, higher education, or commercial ventures.",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGoal(item.id)}
                    className={`w-full p-4 border text-left transition-colors flex items-start justify-between ${
                      goal === item.id
                        ? "border-pine-900 bg-ivory shadow-2xs"
                        : "border-hairline bg-paper-subtle hover:bg-white"
                    }`}
                  >
                    <div>
                      <p className="font-serif text-base text-ink-950 font-medium">{item.label}</p>
                      <p className="text-xs text-ink-500 mt-1">{item.sub}</p>
                    </div>
                    {goal === item.id && (
                      <Check className="h-4 w-4 text-pine-900 shrink-0 mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Horizon */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pine-900 font-semibold block">
                  Mandate • 02
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl text-ink-950 font-normal">
                  What is your target investment horizon?
                </h1>
                <p className="text-xs text-ink-500 font-sans">
                  Longer compounding horizons allow the algorithm to absorb interim cyclical volatility.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
                {[
                  { id: "SHORT" as InvestmentHorizon, label: "Short Term", span: "1 to 3 Years", note: "Capital preservation priority" },
                  { id: "MEDIUM" as InvestmentHorizon, label: "Medium Term", span: "3 to 5 Years", note: "Balanced growth and dividends" },
                  { id: "LONG" as InvestmentHorizon, label: "Long Term", span: "5+ Years", note: "Maximum equity compounding" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setHorizon(item.id)}
                    className={`p-4 border text-left transition-colors ${
                      horizon === item.id
                        ? "border-pine-900 bg-ivory shadow-2xs"
                        : "border-hairline bg-paper-subtle hover:bg-white"
                    }`}
                  >
                    <p className="font-serif text-base text-ink-950 font-medium">{item.label}</p>
                    <p className="font-mono text-xs text-pine-900 font-semibold mt-1">{item.span}</p>
                    <p className="text-[11px] text-ink-500 mt-2">{item.note}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Risk Tier */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pine-900 font-semibold block">
                  Mandate • 03
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl text-ink-950 font-normal">
                  Select your risk tolerance profile
                </h1>
                <p className="text-xs text-ink-500 font-sans">
                  Determines the upper bound on stock Beta and sector cyclicality.
                </p>
              </div>

              <div className="space-y-3 font-sans">
                {[
                  {
                    id: "CONSERVATIVE" as RiskTolerance,
                    label: "Conservative Mandate",
                    desc: "Focus on defensive mega-caps, high dividend yield (>1.5%), low market Beta (<0.8), and balance-sheet strength.",
                  },
                  {
                    id: "BALANCED" as RiskTolerance,
                    label: "Balanced Mandate",
                    desc: "Core blend of market anchors and growth drivers. Moderate volatility with long-term capital appreciation.",
                  },
                  {
                    id: "GROWTH" as RiskTolerance,
                    label: "Growth Mandate",
                    desc: "Higher exposure to expanding sectors (Technology, Consumer Durables, Automotive) with higher Beta tolerance.",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRiskTolerance(item.id)}
                    className={`w-full p-4 border text-left transition-colors flex items-start justify-between ${
                      riskTolerance === item.id
                        ? "border-pine-900 bg-ivory shadow-2xs"
                        : "border-hairline bg-paper-subtle hover:bg-white"
                    }`}
                  >
                    <div>
                      <p className="font-serif text-base text-ink-950 font-medium">{item.label}</p>
                      <p className="text-xs text-ink-600 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                    {riskTolerance === item.id && (
                      <Check className="h-4 w-4 text-pine-900 shrink-0 mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Preferred Sectors */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pine-900 font-semibold block">
                  Mandate • 04
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl text-ink-950 font-normal">
                  Select your preferred Indian sectors
                </h1>
                <p className="text-xs text-ink-500 font-sans">
                  Choose at least 2 sectors you believe have durable structural tailwinds.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                {ALL_SECTORS.map((sec) => {
                  const isSelected = preferredSectors.includes(sec);
                  return (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => toggleSector(sec)}
                      className={`p-3 border text-left transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-pine-900 text-ivory border-pine-900 font-bold"
                          : "bg-paper-subtle text-ink-700 border-hairline hover:bg-white"
                      }`}
                    >
                      <span>{sec}</span>
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Contribution */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pine-900 font-semibold block">
                  Mandate • 05
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl text-ink-950 font-normal">
                  Simulated contribution amount & frequency
                </h1>
                <p className="text-xs text-ink-500 font-sans">
                  Set the recurring capital deployment cadence for automated execution.
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <label className="block uppercase tracking-wider text-ink-700 font-semibold">
                  Contribution Frequency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "MONTHLY" as PlanFrequency, label: "Monthly SIP" },
                    { id: "WEEKLY" as PlanFrequency, label: "Weekly SIP" },
                    { id: "ONE_TIME" as PlanFrequency, label: "One-Time" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFrequency(f.id)}
                      className={`py-2 text-center uppercase tracking-wider border transition-colors ${
                        frequency === f.id
                          ? "bg-pine-900 text-ivory border-pine-900 font-bold"
                          : "bg-paper-subtle text-ink-700 border-hairline hover:bg-white"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="pt-2 space-y-2">
                  <label className="block uppercase tracking-wider text-ink-700 font-semibold">
                    Amount (INR)
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[10000, 25000, 50000, 100000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(val)}
                        className={`py-1.5 border text-center font-bold ${
                          amount === val
                            ? "bg-pine-900 text-ivory border-pine-900"
                            : "bg-paper-subtle text-ink-700 border-hairline hover:bg-white"
                        }`}
                      >
                        {formatINR(val, { compact: true })}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-ink-400">₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Math.max(500, parseInt(e.target.value) || 0))}
                      className="w-full border border-hairline bg-ivory py-2 pl-8 pr-4 text-xs font-bold text-ink-950 tabular-nums focus:border-pine-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Review Proposal */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pine-900 font-semibold block">
                  Mandate • 06
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl text-ink-950 font-normal">
                  Review your proposed automated allocation
                </h1>
                <p className="text-xs text-ink-500 font-sans">
                  Deterministic distribution summing to exactly 100.0% ({formatINR(amount)}) across {proposedAllocations.length} securities.
                </p>
              </div>

              <div className="border border-hairline bg-ivory overflow-hidden">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-paper-subtle text-ink-500 font-mono text-[10px] uppercase tracking-wider border-b border-hairline">
                    <tr>
                      <th className="py-2.5 px-3">Ticker</th>
                      <th className="py-2.5 px-3">Sector</th>
                      <th className="py-2.5 px-3 text-right">Target Weight</th>
                      <th className="py-2.5 px-3 text-right">Rupees (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {proposedAllocations.map((item) => (
                      <tr key={item.symbol} className="hover:bg-paper-subtle">
                        <td className="py-2.5 px-3 font-mono font-bold text-ink-950">
                          {item.symbol}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[10px] text-ink-600">
                          {item.sector}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-ink-950 tabular-nums">
                          {item.percentage}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-pine-900 tabular-nums">
                          {formatINR(item.targetAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border border-hairline bg-paper p-3 text-[11px] font-mono text-ink-600">
                Notice: Simulation demonstration only. Not a certified SEBI suitability assessment.
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="pt-4 border-t border-hairline flex items-center justify-between font-mono text-xs">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 border border-hairline text-ink-700 hover:bg-white uppercase tracking-wider flex items-center gap-1.5"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Previous</span>
              </button>
            ) : <div />}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2 bg-pine-900 text-ivory hover:bg-pine-950 uppercase tracking-wider flex items-center gap-1.5 font-semibold"
              >
                <span>Continue</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleFinish(false)}
                  className="px-4 py-2 border border-hairline uppercase tracking-wider text-ink-800 hover:bg-white"
                >
                  Save Plan
                </button>
                <button
                  type="button"
                  onClick={() => handleFinish(true)}
                  className="px-5 py-2 bg-pine-900 text-ivory hover:bg-pine-950 uppercase tracking-wider font-semibold flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Deploy Simulation</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
