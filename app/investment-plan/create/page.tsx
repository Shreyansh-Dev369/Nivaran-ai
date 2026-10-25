"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "../../../components/layout/AppShell";
import { useApp } from "../../../context/AppContext";
import {
  InvestmentHorizon,
  PlanFrequency,
  RiskTolerance,
  StockSector,
} from "../../../lib/types";
import { STOCK_SECTORS } from "../../../lib/data/stocks";
import { generateAllocationProposal } from "../../../lib/utils/simulation-engine";
import { formatINR } from "../../../lib/utils/formatters";
import {
  ArrowLeft,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Sliders,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  FileText,
  PieChart,
  Lock,
} from "lucide-react";

type PlannerStep = "AMOUNT" | "PREFERENCES" | "PROPOSAL" | "RATIONALE" | "REVIEW" | "CONFIRMATION";

export default function CreatePlanPage() {
  const router = useRouter();
  const { createPlan, cashBalance, addDemoFunds, executeContribution } = useApp();

  // Active Wizard Step
  const [currentStep, setCurrentStep] = useState<PlannerStep>("AMOUNT");

  // Step A: Capital & Amount
  const [amount, setAmount] = useState<number>(25000);
  const [frequency, setFrequency] = useState<PlanFrequency>("MONTHLY");

  // Step B: Investor Preferences & Mandate
  const [planName, setPlanName] = useState("Core Indian Growth Plan");
  const [horizon, setHorizon] = useState<InvestmentHorizon>("LONG");
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>("BALANCED");
  const [preferredSectors, setPreferredSectors] = useState<StockSector[]>([
    "Technology",
    "Banking & Finance",
    "Energy & Utilities",
  ]);
  const [excludedSectors, setExcludedSectors] = useState<StockSector[]>([]);
  const [maxCap, setMaxCap] = useState<number>(25);
  const [rebalanceThreshold] = useState<number>(5);

  // Step E: Explicit Confirmation
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  // Step F: Execution Voucher Receipt
  const [executionReceipt, setExecutionReceipt] = useState<{
    referenceId: string;
    deployedAmount: number;
    executedDate: string;
    stocksCount: number;
  } | null>(null);

  const togglePreferredSector = (sec: StockSector) => {
    if (preferredSectors.includes(sec)) {
      if (preferredSectors.length > 1) {
        setPreferredSectors(preferredSectors.filter((s) => s !== sec));
      }
    } else {
      setPreferredSectors([...preferredSectors, sec]);
      setExcludedSectors(excludedSectors.filter((s) => s !== sec));
    }
  };

  const toggleExcludedSector = (sec: StockSector) => {
    if (excludedSectors.includes(sec)) {
      setExcludedSectors(excludedSectors.filter((s) => s !== sec));
    } else {
      setExcludedSectors([...excludedSectors, sec]);
      setPreferredSectors(preferredSectors.filter((s) => s !== sec));
    }
  };

  // Generate deterministic allocation based on current constraints
  const allocations = generateAllocationProposal({
    amount,
    horizon,
    riskTolerance,
    preferredSectors,
    excludedSectors,
    maxSingleStockCap: maxCap,
  });

  const totalPercentage = allocations.reduce((sum, a) => sum + a.percentage, 0);
  const totalAllocatedAmount = allocations.reduce((sum, a) => sum + a.targetAmount, 0);
  const remainingCashProjected = cashBalance - amount;
  const isSufficientFunds = cashBalance >= amount;

  const handleQuickTopUp = () => {
    const deficit = Math.max(25000, amount - cashBalance + 10000);
    addDemoFunds(deficit, `Quick Planner Top-up (${formatINR(deficit)})`);
  };

  const handleAuthoriseAndDeploy = () => {
    if (!isConfirmed) return;
    setIsExecuting(true);

    // Ensure sufficient demo cash
    if (cashBalance < amount) {
      addDemoFunds(amount - cashBalance + 5000, "Automated Plan Initial Top-up");
    }

    setTimeout(() => {
      createPlan({
        name: planName,
        frequency,
        simulatedAmount: amount,
        horizon,
        riskTolerance,
        preferredSectors,
        excludedSectors,
        maxSingleStockCap: maxCap,
        rebalanceThreshold,
        allocations,
      });

      const res = executeContribution(amount);
      setIsExecuting(false);
      setExecutionReceipt({
        referenceId: "NVR-DEP-" + Math.floor(100000 + Math.random() * 900000),
        deployedAmount: amount,
        executedDate: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        stocksCount: allocations.length,
      });
      setCurrentStep("CONFIRMATION");
    }, 600);
  };

  const stepsList: { id: PlannerStep; label: string; sub: string }[] = [
    { id: "AMOUNT", label: "Step A", sub: "Amount & Ledger" },
    { id: "PREFERENCES", label: "Step B", sub: "Risk & Sectors" },
    { id: "PROPOSAL", label: "Step C", sub: "Allocation" },
    { id: "RATIONALE", label: "Step D", sub: "Stock Thesis" },
    { id: "REVIEW", label: "Step E", sub: "Authorisation" },
  ];

  return (
    <AppShell>
      <div className="space-y-8 max-w-5xl mx-auto font-sans">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/investment-plan"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-ink-500 hover:text-pine-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Mandate Manager</span>
          </Link>
          <span className="text-[10px] font-mono text-ink-400 uppercase tracking-wider">
            Systematic Portfolio Planner
          </span>
        </div>

        {/* Masthead */}
        <div className="pb-4 border-b border-hairline space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pine-900 font-semibold block">
            Automated Investment Workflow
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink-950 font-normal">
            Formulate Your Investment Plan
          </h1>
          <p className="text-xs text-ink-500 font-mono">
            Define contribution amount, configure risk constraints, review algorithmic selection, and authorise simulated execution.
          </p>
        </div>

        {/* Stepper Navigation Header (Steps A through E) */}
        {currentStep !== "CONFIRMATION" && (
          <div className="border border-hairline bg-paper overflow-x-auto no-scrollbar">
            <div className="flex divide-x divide-hairline min-w-[600px]">
              {stepsList.map((s, idx) => {
                const isActive = currentStep === s.id;
                const isPassed =
                  stepsList.findIndex((x) => x.id === currentStep) > idx;

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentStep(s.id)}
                    className={`flex-1 p-3 text-left transition-colors flex items-center justify-between ${
                      isActive
                        ? "bg-pine-900 text-ivory"
                        : isPassed
                        ? "bg-sage-50 text-pine-950 hover:bg-sage-100"
                        : "bg-paper text-ink-600 hover:bg-paper-subtle"
                    }`}
                  >
                    <div>
                      <span className={`block text-[10px] font-mono uppercase tracking-wider ${isActive ? "text-sage-200" : "text-ink-400"}`}>
                        {s.label}
                      </span>
                      <span className="text-xs font-serif font-medium">{s.sub}</span>
                    </div>
                    {isPassed && <Check className="h-3.5 w-3.5 text-pine-800" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP A: SET THE AMOUNT (Available Balance, Amount, Remainder, Validation) */}
        {/* ========================================================================= */}
        {currentStep === "AMOUNT" && (
          <div className="border border-hairline bg-paper p-6 sm:p-8 space-y-6">
            <div className="space-y-1 pb-3 border-b border-hairline">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pine-900 font-semibold block">
                Step A • Capital Deployment
              </span>
              <h2 className="font-serif text-2xl text-ink-950 font-normal">
                Define Investment Amount & Cadence
              </h2>
              <p className="text-xs text-ink-500 font-sans">
                Specify the rupee amount to allocate into Indian equities and verify your available demo cash balance.
              </p>
            </div>

            {/* Financial Ledger Health Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-hairline bg-ivory p-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-ink-400 block">Available Demo Cash</span>
                <p className="text-xl font-serif font-semibold text-ink-950 tabular-nums">
                  {formatINR(cashBalance)}
                </p>
                <span className="text-[10px] text-ink-500">Uncommitted liquid reserve</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase text-ink-400 block">Amount to Invest</span>
                <p className="text-xl font-serif font-semibold text-pine-900 tabular-nums">
                  {formatINR(amount)}
                </p>
                <span className="text-[10px] text-ink-500">Per {frequency.toLowerCase()} cadence</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase text-ink-400 block">Remaining After Allocation</span>
                <p className={`text-xl font-serif font-semibold tabular-nums ${remainingCashProjected >= 0 ? "text-ink-950" : "text-loss"}`}>
                  {formatINR(Math.max(0, remainingCashProjected))}
                </p>
                <span className={`text-[10px] ${remainingCashProjected >= 0 ? "text-profit" : "text-loss"}`}>
                  {remainingCashProjected >= 0 ? "Reserve balance retained" : "Deficit: Add demo funds"}
                </span>
              </div>
            </div>

            {/* Validation State Banner */}
            {!isSufficientFunds ? (
              <div className="border border-loss/30 bg-loss-bg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-loss">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>
                    Validation Warning: Intended investment ({formatINR(amount)}) exceeds available demo cash ({formatINR(cashBalance)}).
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickTopUp}
                  className="px-3 py-1.5 bg-loss text-white uppercase tracking-wider text-[11px] font-bold shrink-0 hover:bg-red-800 transition-colors"
                >
                  Simulate Demo Credit (+{formatINR(amount - cashBalance + 10000)})
                </button>
              </div>
            ) : (
              <div className="border border-pine-900/20 bg-sage-50 p-3.5 flex items-center gap-2 text-xs font-mono text-pine-950">
                <Check className="h-4 w-4 text-pine-800 shrink-0" />
                <span>
                  Validation Confirmed: Sufficient demo cash available. {formatINR(remainingCashProjected)} will remain in liquid reserve after execution.
                </span>
              </div>
            )}

            {/* Amount Inputs & Presets */}
            <div className="space-y-4">
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-700 font-semibold">
                Select Investment Amount
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "₹10,000", val: 10000 },
                  { label: "₹25,000", val: 25000 },
                  { label: "₹50,000", val: 50000 },
                  { label: "₹1,00,000", val: 100000 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setAmount(preset.val)}
                    className={`py-2 px-1 text-center font-mono text-xs border transition-colors ${
                      amount === preset.val
                        ? "bg-pine-900 text-ivory border-pine-900 font-bold"
                        : "bg-ivory text-ink-700 border-hairline hover:bg-white"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="relative pt-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-ink-400 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min={500}
                  value={amount}
                  onChange={(e) => setAmount(Math.max(500, parseInt(e.target.value) || 0))}
                  className="w-full border border-hairline bg-ivory py-2.5 pl-8 pr-4 text-xs font-mono font-bold text-ink-950 tabular-nums focus:border-pine-900 focus:outline-none"
                  aria-label="Investment Amount"
                />
              </div>
            </div>

            {/* Frequency Selection */}
            <div className="space-y-2 pt-2 border-t border-hairline">
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-700 font-semibold">
                Contribution Frequency Cadence
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["MONTHLY", "WEEKLY", "ONE_TIME"] as const).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequency(freq)}
                    className={`py-2 text-[11px] font-mono uppercase tracking-wider border transition-colors ${
                      frequency === freq
                        ? "bg-pine-900 text-ivory border-pine-900 font-bold"
                        : "bg-ivory text-ink-600 border-hairline hover:bg-white"
                    }`}
                  >
                    {freq === "MONTHLY" ? "Monthly SIP" : freq === "WEEKLY" ? "Weekly SIP" : "One-Time Deployment"}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Row */}
            <div className="pt-4 border-t border-hairline flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep("PREFERENCES")}
                className="px-6 py-2.5 bg-pine-900 text-ivory text-xs font-mono uppercase tracking-wider font-semibold hover:bg-pine-950 transition-colors inline-flex items-center gap-1.5"
              >
                <span>Proceed to Step B: Set Preferences</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP B: SET PREFERENCES (Sectors, Horizon, Risk Tolerance, Exclusions)     */}
        {/* ========================================================================= */}
        {currentStep === "PREFERENCES" && (
          <div className="border border-hairline bg-paper p-6 sm:p-8 space-y-6">
            <div className="space-y-1 pb-3 border-b border-hairline">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pine-900 font-semibold block">
                Step B • Mandate Parameters
              </span>
              <h2 className="font-serif text-2xl text-ink-950 font-normal">
                Configure Investor Preferences & Risk Mandate
              </h2>
              <p className="text-xs text-ink-500 font-sans">
                Choose your risk tolerance, compounding horizon, and preferred Indian sectors to guide algorithmic stock selection.
              </p>
            </div>

            {/* Plan Name */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-700 mb-1 font-semibold">
                Plan Designation Name
              </label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="w-full border border-hairline bg-ivory px-3.5 py-2 text-xs font-medium text-ink-950 focus:border-pine-900 focus:outline-none"
              />
            </div>

            {/* Risk Tolerance Profile */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-700 font-semibold">
                Risk Mandate Profile
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "CONSERVATIVE" as RiskTolerance,
                    label: "Conservative",
                    desc: "High dividend yield, low Beta (<0.8), defensive anchors (IT, FMCG, Banking).",
                  },
                  {
                    id: "BALANCED" as RiskTolerance,
                    label: "Balanced",
                    desc: "Core blend of market leaders with capital appreciation and moderate Beta (~1.0).",
                  },
                  {
                    id: "GROWTH" as RiskTolerance,
                    label: "Growth",
                    desc: "Higher exposure to expanding sectors (Auto, Tech, Industrials) with higher Beta.",
                  },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setRiskTolerance(tier.id)}
                    className={`p-3.5 border text-left transition-colors ${
                      riskTolerance === tier.id
                        ? "border-pine-900 bg-ivory shadow-2xs"
                        : "border-hairline bg-paper-subtle hover:bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-center font-serif text-sm font-medium text-ink-950">
                      <span>{tier.label}</span>
                      {riskTolerance === tier.id && <Check className="h-3.5 w-3.5 text-pine-900" />}
                    </div>
                    <p className="text-[11px] text-ink-500 mt-1 leading-snug">{tier.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Compounding Horizon */}
            <div className="space-y-2 pt-2 border-t border-hairline">
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-700 font-semibold">
                Investment Horizon
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "SHORT" as InvestmentHorizon, label: "1-3 Years", sub: "Capital preservation" },
                  { id: "MEDIUM" as InvestmentHorizon, label: "3-5 Years", sub: "Balanced compounding" },
                  { id: "LONG" as InvestmentHorizon, label: "5+ Years", sub: "Maximum equity growth" },
                ].map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setHorizon(h.id)}
                    className={`p-2.5 text-left border transition-colors ${
                      horizon === h.id
                        ? "bg-pine-900 text-ivory border-pine-900"
                        : "bg-ivory text-ink-700 border-hairline hover:bg-white"
                    }`}
                  >
                    <span className="font-mono text-xs font-bold block">{h.label}</span>
                    <span className={`text-[10px] ${horizon === h.id ? "text-sage-200" : "text-ink-400"}`}>
                      {h.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Indian Sectors */}
            <div className="space-y-2 pt-2 border-t border-hairline">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="uppercase tracking-wider text-ink-700 font-semibold">Preferred Indian Sectors</span>
                <span className="text-ink-400">{preferredSectors.length} of 7 chosen</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {STOCK_SECTORS.map((sec) => {
                  const isSelected = preferredSectors.includes(sec);
                  return (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => togglePreferredSector(sec)}
                      className={`px-3 py-1.5 text-xs font-mono border transition-colors flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-pine-900 text-ivory border-pine-900 font-semibold"
                          : "bg-ivory text-ink-600 border-hairline hover:bg-white"
                      }`}
                    >
                      <span>{sec}</span>
                      {isSelected && <Check className="h-3 w-3" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Excluded Sectors */}
            <div className="space-y-2 pt-2 border-t border-hairline">
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-700 font-semibold">
                Optional Sector Exclusions
              </label>
              <div className="flex flex-wrap gap-2">
                {STOCK_SECTORS.map((sec) => {
                  const isExcluded = excludedSectors.includes(sec);
                  return (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => toggleExcludedSector(sec)}
                      className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
                        isExcluded
                          ? "bg-loss-bg text-loss border-loss/30 font-semibold"
                          : "bg-ivory text-ink-400 border-hairline hover:bg-white"
                      }`}
                    >
                      {isExcluded ? `✕ Excluded: ${sec}` : sec}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Concentration Cap */}
            <div className="space-y-2 pt-2 border-t border-hairline font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="uppercase tracking-wider text-ink-700 font-semibold">
                  Enforced Single-Stock Cap Ceiling
                </span>
                <span className="font-bold text-pine-900 text-sm tabular-nums">≤{maxCap}%</span>
              </div>
              <input
                type="range"
                min={15}
                max={35}
                step={5}
                value={maxCap}
                onChange={(e) => setMaxCap(parseInt(e.target.value))}
                className="w-full accent-pine-900"
              />
              <p className="text-[10px] text-ink-400 font-sans">
                Prevents portfolio concentration by capping any single stock at a maximum of {maxCap}% of deployed capital.
              </p>
            </div>

            {/* Navigation */}
            <div className="pt-4 border-t border-hairline flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep("AMOUNT")}
                className="px-4 py-2 border border-hairline text-xs font-mono uppercase tracking-wider text-ink-700 hover:bg-paper"
              >
                Back to Amount
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep("PROPOSAL")}
                className="px-6 py-2.5 bg-pine-900 text-ivory text-xs font-mono uppercase tracking-wider font-semibold hover:bg-pine-950 inline-flex items-center gap-1.5"
              >
                <span>Generate Step C: Proposed Allocation</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP C: GENERATE PROPOSED ALLOCATION (Equities, Rupee, Percentages, Sum)  */}
        {/* ========================================================================= */}
        {currentStep === "PROPOSAL" && (
          <div className="border border-hairline bg-paper p-6 sm:p-8 space-y-6">
            <div className="space-y-1 pb-3 border-b border-hairline">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pine-900 font-semibold block">
                Step C • Deterministic Allocation
              </span>
              <h2 className="font-serif text-2xl text-ink-950 font-normal">
                Proposed Indian Equity Allocation Ledger
              </h2>
              <p className="text-xs text-ink-500 font-sans">
                The engine has computed an exact portfolio distribution across qualifying NSE/BSE securities summing deterministically to {totalPercentage}.0%.
              </p>
            </div>

            {/* Allocation Table */}
            <div className="border border-hairline bg-ivory overflow-hidden">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-paper-subtle text-ink-500 font-mono text-[10px] uppercase tracking-wider border-b border-hairline">
                  <tr>
                    <th className="py-3 px-4">Company & Ticker</th>
                    <th className="py-3 px-4">Exchange & Sector</th>
                    <th className="py-3 px-4 text-right">Target Weight</th>
                    <th className="py-3 px-4 text-right">Rupee Commitment</th>
                    <th className="py-3 px-4 text-right">Estimated Shares</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {allocations.map((item) => (
                    <tr key={item.symbol} className="hover:bg-paper-subtle transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          href={`/stocks/${item.symbol}`}
                          className="font-mono font-bold text-ink-950 hover:text-pine-900"
                        >
                          {item.symbol}
                        </Link>
                        <span className="block text-[11px] text-ink-500 font-sans">{item.name}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-mono border border-hairline bg-paper text-ink-700">
                          {item.sector}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-ink-900 tabular-nums">
                        {item.percentage}%
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-pine-900 tabular-nums">
                        {formatINR(item.targetAmount)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-ink-700 tabular-nums">
                        ~{item.estimatedShares} sh
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Table Reconciliation Ledger Footer */}
              <div className="p-4 border-t border-hairline bg-paper-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono text-ink-600 gap-2">
                <span>
                  Sum of Weightings: <strong className="font-bold text-pine-900">{totalPercentage}.0%</strong> • Total Deployed: <strong className="font-bold text-ink-950">{formatINR(totalAllocatedAmount)}</strong>
                </span>
                <span className="text-[11px] text-ink-400">
                  Enforces ≤{maxCap}% single-stock concentration cap
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div className="pt-4 border-t border-hairline flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep("PREFERENCES")}
                className="px-4 py-2 border border-hairline text-xs font-mono uppercase tracking-wider text-ink-700 hover:bg-paper"
              >
                Back to Preferences
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep("RATIONALE")}
                className="px-6 py-2.5 bg-pine-900 text-ivory text-xs font-mono uppercase tracking-wider font-semibold hover:bg-pine-950 inline-flex items-center gap-1.5"
              >
                <span>Inspect Step D: Selection Thesis</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP D: EXPLAIN THE PROPOSAL (Holding Rationale & Structural Headwinds)    */}
        {/* ========================================================================= */}
        {currentStep === "RATIONALE" && (
          <div className="border border-hairline bg-paper p-6 sm:p-8 space-y-6">
            <div className="space-y-1 pb-3 border-b border-hairline">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pine-900 font-semibold block">
                Step D • Explainability & Rationale
              </span>
              <h2 className="font-serif text-2xl text-ink-950 font-normal">
                Why Each Security Was Selected
              </h2>
              <p className="text-xs text-ink-500 font-sans">
                Every rupee allocated to an equity is bound by rules-based constraints rather than arbitrary hunches. Inspect the investment thesis and structural headwinds for each holding.
              </p>
            </div>

            <div className="space-y-4 font-sans text-xs">
              {allocations.map((a) => (
                <div key={a.symbol} className="border border-hairline bg-ivory p-5 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-ink-950">{a.symbol}</span>
                      <span className="text-ink-400 font-sans">({a.name})</span>
                      <span className="inline-block px-1.5 py-0.5 text-[9px] font-mono border border-hairline bg-paper text-ink-600">
                        {a.sector}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-pine-900 font-semibold tabular-nums">
                      {a.percentage}% Target Allocation ({formatINR(a.targetAmount)})
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <p className="text-ink-700 leading-relaxed">
                      <strong className="text-ink-900 font-semibold font-mono text-[11px] uppercase tracking-wider block mb-0.5">
                        Algorithmic Selection Rationale:
                      </strong>
                      {a.rationale}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-hairline/60 font-mono text-[11px] text-loss flex items-start gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span><strong>Structural Headwind:</strong> {a.riskFactor}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="border border-hairline bg-paper-subtle p-4 text-[11px] font-mono text-ink-600 leading-relaxed">
              <strong>Academic Educational Disclosure:</strong> Selection scores are computed deterministically from simulated balance-sheet metrics. NIVARA does not guarantee investment returns or provide certified SEBI financial advice.
            </div>

            {/* Navigation */}
            <div className="pt-4 border-t border-hairline flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep("PROPOSAL")}
                className="px-4 py-2 border border-hairline text-xs font-mono uppercase tracking-wider text-ink-700 hover:bg-paper"
              >
                Back to Allocation Table
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep("REVIEW")}
                className="px-6 py-2.5 bg-pine-900 text-ivory text-xs font-mono uppercase tracking-wider font-semibold hover:bg-pine-950 inline-flex items-center gap-1.5"
              >
                <span>Proceed to Step E: Review & Authorise</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP E: REVIEW AND AUTHORISE (Amount, Holdings, Fees, Remaining, Consent) */}
        {/* ========================================================================= */}
        {currentStep === "REVIEW" && (
          <div className="border border-hairline bg-paper p-6 sm:p-8 space-y-6">
            <div className="space-y-1 pb-3 border-b border-hairline">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pine-900 font-semibold block">
                Step E • Review & Pre-Execution Voucher
              </span>
              <h2 className="font-serif text-2xl text-ink-950 font-normal">
                Authorise Simulated Equity Allocation
              </h2>
              <p className="text-xs text-ink-500 font-sans">
                Review the plan summary, transparent cost accounting, and confirm simulated execution into the local ledger.
              </p>
            </div>

            {/* Voucher Summary Card */}
            <div className="border border-hairline bg-ivory p-6 space-y-5">
              <div className="flex justify-between items-start border-b border-hairline pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400 block">
                    Mandate Voucher
                  </span>
                  <h3 className="font-serif text-xl text-ink-950 font-medium">{planName}</h3>
                  <p className="text-xs font-mono text-ink-500 mt-0.5">
                    Risk Mandate: {riskTolerance} • Horizon: {horizon} • Cadence: {frequency}
                  </p>
                </div>
                <span className="font-mono text-xs uppercase px-2.5 py-1 bg-sage-100 text-pine-900 border border-sage-200 font-bold">
                  Pre-Execution Ready
                </span>
              </div>

              {/* Accounting Breakdown */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-ink-600">
                  <span>Gross Allocation Amount</span>
                  <span className="font-bold text-ink-950 tabular-nums">{formatINR(amount)}</span>
                </div>
                <div className="flex justify-between text-ink-600">
                  <span>Simulated Brokerage Fee</span>
                  <span className="text-profit font-semibold">₹0.00 (Demo Sandbox)</span>
                </div>
                <div className="flex justify-between text-ink-600">
                  <span>Securities Transaction Tax (STT)</span>
                  <span className="text-profit font-semibold">₹0.00 (Demo Sandbox)</span>
                </div>
                <div className="flex justify-between text-ink-600">
                  <span>Stamp Duty & Exchange Turnover</span>
                  <span className="text-profit font-semibold">₹0.00 (Demo Sandbox)</span>
                </div>
                <div className="border-t border-hairline pt-2 flex justify-between text-sm font-bold text-ink-950">
                  <span>Net Ledger Debit</span>
                  <span className="tabular-nums text-pine-900">{formatINR(amount)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-ink-500 pt-1">
                  <span>Projected Demo Cash Remaining</span>
                  <span className="tabular-nums">{formatINR(Math.max(0, remainingCashProjected))}</span>
                </div>
              </div>

              {/* Holdings List Digest */}
              <div className="pt-2 border-t border-hairline space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400 block">
                  Holdings to be acquired ({allocations.length} securities)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
                  {allocations.map((a) => (
                    <div key={a.symbol} className="border border-hairline bg-paper p-2 space-y-0.5">
                      <span className="font-bold text-ink-950 block">{a.symbol}</span>
                      <span className="text-pine-900 font-semibold">{a.percentage}%</span>
                      <span className="text-[10px] text-ink-500 block tabular-nums">{formatINR(a.targetAmount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Explicit Confirmation Checkbox */}
            <div className="border border-hairline bg-paper-subtle p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="h-4 w-4 rounded-none border-hairline text-pine-900 mt-0.5 focus:ring-pine-800"
                />
                <div className="text-xs font-sans text-ink-800 leading-snug">
                  <span className="font-semibold block font-mono text-[11px] uppercase tracking-wider text-ink-950 mb-0.5">
                    Explicit Confirmation Required
                  </span>
                  I confirm that I have reviewed the proposed stock allocations, concentration caps, and risk disclosures. I understand that NIVARA is an educational simulation platform operating with zero real capital transfers.
                </div>
              </label>
            </div>

            {/* Action Row */}
            <div className="pt-4 border-t border-hairline flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep("RATIONALE")}
                className="px-4 py-2 border border-hairline text-xs font-mono uppercase tracking-wider text-ink-700 hover:bg-paper"
              >
                Back to Rationales
              </button>

              <button
                type="button"
                onClick={handleAuthoriseAndDeploy}
                disabled={!isConfirmed || isExecuting}
                className="px-6 py-3 bg-pine-900 text-ivory text-xs font-mono uppercase tracking-wider font-semibold hover:bg-pine-950 disabled:opacity-50 transition-colors inline-flex items-center gap-2 shadow-2xs"
              >
                {isExecuting ? (
                  <span>Executing Ledger Transactions...</span>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    <span>Authorise & Deploy Simulated Allocation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP F: CONFIRM AND TRACK (Updated Portfolio, Holdings, Ledger Receipt)   */}
        {/* ========================================================================= */}
        {currentStep === "CONFIRMATION" && executionReceipt && (
          <div className="border border-hairline bg-paper p-8 sm:p-10 text-center space-y-6 animate-in fade-in duration-200">
            <div className="mx-auto h-12 w-12 bg-sage-100 border border-sage-200 text-pine-900 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pine-900 font-bold block">
                Execution Vouchers Recorded
              </span>
              <h2 className="font-serif text-3xl text-ink-950 font-normal">
                Simulated Allocation Successfully Deployed
              </h2>
              <p className="text-xs text-ink-500 font-mono">
                Reference ID: <strong className="text-ink-800">{executionReceipt.referenceId}</strong> • Timestamp: {executionReceipt.executedDate}
              </p>
            </div>

            <div className="max-w-md mx-auto border border-hairline bg-ivory p-5 divide-y divide-hairline text-xs font-sans text-left">
              <div className="py-2 flex justify-between font-mono">
                <span className="text-ink-500">Capital Deployed</span>
                <span className="font-bold text-pine-900 tabular-nums">{formatINR(executionReceipt.deployedAmount)}</span>
              </div>
              <div className="py-2 flex justify-between font-mono">
                <span className="text-ink-500">Securities Added to Holdings</span>
                <span className="font-bold text-ink-950">{executionReceipt.stocksCount} Equities</span>
              </div>
              <div className="py-2 flex justify-between font-mono">
                <span className="text-ink-500">Available Demo Cash Balance</span>
                <span className="font-bold text-ink-950 tabular-nums">{formatINR(cashBalance)}</span>
              </div>
              <div className="py-2 flex justify-between font-mono">
                <span className="text-ink-500">Mandate Status</span>
                <span className="font-semibold text-profit">ACTIVE (MONTHLY SIP)</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 py-2.5 bg-pine-900 text-ivory text-xs font-mono uppercase tracking-wider font-semibold hover:bg-pine-950 transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <span>Track in Portfolio Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/portfolio"
                className="w-full sm:w-auto px-5 py-2.5 border border-hairline text-xs font-mono uppercase tracking-wider text-ink-800 hover:bg-white transition-colors"
              >
                Inspect Holdings Ledger
              </Link>
              <Link
                href="/activity"
                className="w-full sm:w-auto px-5 py-2.5 border border-hairline text-xs font-mono uppercase tracking-wider text-ink-800 hover:bg-white transition-colors"
              >
                View Audit Ledger
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
