"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "../../components/layout/AppShell";
import { useApp } from "../../context/AppContext";
import { formatINR, formatDate } from "../../lib/utils/formatters";
import { RebalanceModal } from "../../components/modals/RebalanceModal";
import { AddFundsModal } from "../../components/modals/AddFundsModal";
import {
  Sliders,
  Play,
  Pause,
  RefreshCw,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Trash2,
  Edit3,
  Clock,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function InvestmentPlanPage() {
  const {
    plan,
    pausePlan,
    resumePlan,
    stopPlan,
    executeContribution,
    cashBalance,
  } = useApp();

  const [isRebalanceOpen, setIsRebalanceOpen] = useState(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isStopConfirmOpen, setIsStopConfirmOpen] = useState(false);

  const handleRunContribution = () => {
    const res = executeContribution();
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 6000);
  };

  const handleStop = () => {
    stopPlan();
    setIsStopConfirmOpen(false);
    setFeedback("Investment mandate stopped. Simulated automated contributions have been halted.");
  };

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto font-sans">
        {/* Editorial Masthead */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D3E5DC]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#00A86B] bg-[#E6F9F1] px-2.5 py-0.5 rounded-full border border-[#00A86B]/20 font-bold">
                ACTIVE MANDATE
              </span>
              <span className="text-[10px] font-mono text-[#587F6E]">
                RULES-BASED SYSTEM
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#071912]">
              Automated Investment Plan
            </h1>
            <p className="text-xs text-[#587F6E] mt-0.5">
              Preference-driven deterministic rules governing simulated recurring purchases and rebalance thresholds
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/investment-plan/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D3E5DC] bg-white text-xs font-semibold text-[#071912] hover:bg-[#EDF6F2] transition-colors shadow-xs"
            >
              <Edit3 className="h-3.5 w-3.5 text-[#00A86B]" />
              <span>Modify Mandate</span>
            </Link>
            <button
              onClick={() => setIsRebalanceOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0A1D16] text-xs font-semibold text-[#00E599] hover:bg-[#122E23] transition-all shadow-sm"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Audit Rebalance</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className="rounded-2xl border border-[#00E599]/40 bg-[#E6F9F1] p-4 text-xs font-mono text-[#0A1D16] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#00A86B] shrink-0" />
              <span className="font-semibold">{feedback}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-[#00A86B] font-mono text-xs hover:underline uppercase font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {plan ? (
          <>
            {/* Plan Overview & Governance Canvas */}
            <div className="rounded-3xl border border-[#D3E5DC] bg-white shadow-xs overflow-hidden">
              <div className="p-6 border-b border-[#D3E5DC] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-serif text-2xl font-semibold text-[#071912]">
                      {plan.name}
                    </h2>
                    <span
                      className={`font-mono text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold border ${
                        plan.status === "ACTIVE"
                          ? "bg-[#E6F9F1] text-[#00A86B] border-[#00A86B]/30"
                          : plan.status === "PAUSED"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {plan.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#587F6E] mt-1 font-mono">
                    Established on {formatDate(plan.createdAt)} • {plan.frequency} Simulated Cadence
                  </p>
                </div>

                {/* Plan Action Triggers */}
                <div className="flex items-center gap-2 font-mono">
                  {plan.status === "ACTIVE" ? (
                    <>
                      <button
                        onClick={handleRunContribution}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0A1D16] text-[#00E599] text-xs font-mono font-bold hover:bg-[#122E23] transition-all shadow-xs"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>Run Contribution</span>
                      </button>
                      <button
                        onClick={pausePlan}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#D3E5DC] text-xs font-mono text-[#587F6E] hover:bg-[#EDF6F2]"
                      >
                        <Pause className="h-3.5 w-3.5" />
                        <span>Pause</span>
                      </button>
                    </>
                  ) : plan.status === "PAUSED" ? (
                    <button
                      onClick={resumePlan}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0A1D16] text-[#00E599] text-xs font-mono font-bold hover:bg-[#122E23] transition-all shadow-xs"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Resume Plan</span>
                    </button>
                  ) : (
                    <Link
                      href="/investment-plan/create"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0A1D16] text-[#00E599] text-xs font-mono font-bold hover:bg-[#122E23] transition-all shadow-xs"
                    >
                      <span>Re-activate Mandate</span>
                    </Link>
                  )}

                  {plan.status !== "STOPPED" && (
                    <button
                      onClick={() => setIsStopConfirmOpen(true)}
                      className="p-2 rounded-full border border-[#D3E5DC] text-[#587F6E] hover:text-[#E63946] hover:bg-[#FDF0F1] transition-colors"
                      title="Stop Plan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Mandate Parameters Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#D3E5DC] bg-[#F4FAF7]">
                <div className="p-5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#587F6E] font-semibold block">
                    Contribution Amount
                  </span>
                  <p className="font-serif text-2xl font-bold text-[#071912] tabular-nums mt-1">
                    {formatINR(plan.simulatedAmount)}
                  </p>
                  <p className="text-[11px] text-[#587F6E] mt-0.5 font-mono">
                    per {plan.frequency.toLowerCase()} cadence
                  </p>
                </div>

                <div className="p-5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#587F6E] font-semibold block">
                    Risk Mandate
                  </span>
                  <p className="font-serif text-2xl font-bold text-[#00A86B] mt-1">
                    {plan.riskTolerance}
                  </p>
                  <p className="text-[11px] text-[#587F6E] mt-0.5 font-mono">
                    Horizon: {plan.horizon}
                  </p>
                </div>

                <div className="p-5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#587F6E] font-semibold block">
                    Single-Stock Cap
                  </span>
                  <p className="font-serif text-2xl font-bold text-[#071912] tabular-nums mt-1">
                    ≤{plan.maxSingleStockCap}%
                  </p>
                  <p className="text-[11px] text-[#587F6E] mt-0.5 font-mono">
                    Concentration ceiling
                  </p>
                </div>

                <div className="p-5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#587F6E] font-semibold block">
                    Drift Rebalance Band
                  </span>
                  <p className="font-serif text-2xl font-bold text-[#00A86B] tabular-nums mt-1">
                    ±{plan.rebalanceThreshold}%
                  </p>
                  <p className="text-[11px] text-[#587F6E] mt-0.5 font-mono">
                    Automated audit trigger
                  </p>
                </div>
              </div>
            </div>

            {/* Target Allocations List */}
            <div className="rounded-3xl border border-[#D3E5DC] bg-white p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#D3E5DC]">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[#071912]">
                    Target Allocation Composition
                  </h3>
                  <p className="text-xs text-[#587F6E]">
                    Deterministic {plan.allocations.length}-stock portfolio guaranteed to sum exactly to 100%
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-[#00A86B] bg-[#E6F9F1] px-2.5 py-0.5 rounded-full border border-[#00A86B]/20">
                  SUM: 100%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {plan.allocations.map((alloc) => (
                  <div
                    key={alloc.symbol}
                    className="p-4 rounded-2xl border border-[#D3E5DC] bg-[#F4FAF7] space-y-2 hover:border-[#00E599] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-[#071912]">{alloc.symbol}</span>
                      <span className="font-mono font-bold text-xs text-[#00A86B] bg-white px-2 py-0.5 rounded-full border border-[#D3E5DC]">
                        {alloc.percentage}%
                      </span>
                    </div>

                    <p className="text-xs text-[#587F6E] truncate">{alloc.name}</p>
                    <p className="text-[10px] font-mono text-[#587F6E]">{alloc.sector}</p>

                    <div className="pt-2 border-t border-[#D3E5DC] flex items-center justify-between text-xs font-mono">
                      <span className="text-[#587F6E]">Per Contribution:</span>
                      <span className="font-bold text-[#071912]">{formatINR(alloc.targetAmount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-[#D3E5DC] bg-white p-12 text-center space-y-4 shadow-xs">
            <h3 className="font-serif text-2xl font-semibold text-[#071912]">No Active Investment Plan</h3>
            <p className="text-xs text-[#587F6E] max-w-md mx-auto">
              Design a preference-driven automated investment plan to start systematic simulated investments in Indian blue-chips.
            </p>
            <Link
              href="/investment-plan/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0A1D16] text-[#00E599] font-mono text-xs font-bold hover:bg-[#122E23] transition-all shadow-xs"
            >
              <span>Create Plan Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Confirmation Modal for Stopping Plan */}
        {isStopConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 border border-[#D3E5DC] shadow-2xl space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#071912]">Stop Investment Plan?</h3>
              <p className="text-xs text-[#587F6E]">
                This will halt automated recurring simulated purchases. Your existing portfolio holdings and cash ledger will remain intact.
              </p>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setIsStopConfirmOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#D3E5DC] text-xs font-semibold text-[#587F6E] hover:bg-[#EDF6F2]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStop}
                  className="px-5 py-2 rounded-full bg-[#E63946] text-white text-xs font-bold hover:bg-red-700 transition-all shadow-xs"
                >
                  Confirm Stop
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddFundsModal isOpen={isAddFundsOpen} onClose={() => setIsAddFundsOpen(false)} />
      <RebalanceModal isOpen={isRebalanceOpen} onClose={() => setIsRebalanceOpen(false)} />
    </AppShell>
  );
}
