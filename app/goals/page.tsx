"use client";

import React, { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { useApp } from "../../context/AppContext";
import { formatINR } from "../../lib/utils/formatters";
import {
  Target,
  PlusCircle,
  Calendar,
  X,
  Trash2,
  CheckCircle2,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function GoalsPage() {
  const { goals, addGoal, deleteGoal, totalPortfolioValue } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState<number>(2500000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(15000);
  const [targetDate, setTargetDate] = useState("2032-12-31");
  const [category, setCategory] = useState<"WEALTH" | "RETIREMENT" | "EMERGENCY" | "PURCHASE">("WEALTH");

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addGoal({
      name,
      targetAmount,
      currentAmount: totalPortfolioValue,
      monthlyContribution,
      targetDate,
      category,
    });

    setName("");
    setIsModalOpen(false);
  };

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto font-sans">
        {/* Editorial Masthead */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D3E5DC]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#00A86B] bg-[#E6F9F1] px-2.5 py-0.5 rounded-full border border-[#00A86B]/20 font-bold">
                LIFECYCLE PLANNING
              </span>
              <span className="text-[10px] font-mono text-[#587F6E]">
                MILESTONES
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#071912]">
              Financial Goals & Milestones
            </h1>
            <p className="text-xs text-[#587F6E] mt-0.5">
              Tie simulated automated stock investing mandates to concrete financial life targets
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0A1D16] text-xs font-mono uppercase font-bold text-[#00E599] hover:bg-[#122E23] transition-all shadow-sm"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Establish New Goal</span>
          </button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

            return (
              <div
                key={goal.id}
                className="rounded-3xl border border-[#D3E5DC] bg-white p-6 shadow-xs space-y-4 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#00A86B] font-bold">
                      {goal.category}
                    </span>
                    <h3 className="font-serif text-xl font-semibold text-[#071912] mt-0.5">
                      {goal.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1.5 rounded-full text-[#587F6E] hover:text-[#E63946] hover:bg-[#FDF0F1] transition-colors"
                    title="Delete goal"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#587F6E]">Progress: {pct}%</span>
                    <span className="font-bold text-[#071912]">
                      {formatINR(goal.currentAmount)} / {formatINR(goal.targetAmount)}
                    </span>
                  </div>

                  <div className="w-full bg-[#EDF6F2] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#00E599] h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#D3E5DC] flex items-center justify-between text-xs font-mono text-[#587F6E]">
                  <span>Target Date: {goal.targetDate}</span>
                  <span className="font-bold text-[#071912]">{formatINR(goal.monthlyContribution)}/mo</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Goal Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 border border-[#D3E5DC] shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#D3E5DC]">
                <h3 className="font-serif text-xl font-semibold text-[#071912]">
                  New Financial Target
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full text-[#587F6E] hover:bg-[#EDF6F2]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddGoal} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-[#071912]">Goal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Higher Education Fund"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-[#D3E5DC] bg-[#EDF6F2]/40 p-2.5 text-xs text-[#071912] focus:bg-white focus:border-[#0A1D16] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#071912]">Target Corpus (INR)</label>
                  <input
                    type="number"
                    required
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(Number(e.target.value))}
                    className="w-full rounded-2xl border border-[#D3E5DC] bg-[#EDF6F2]/40 p-2.5 text-xs text-[#071912] focus:bg-white focus:border-[#0A1D16] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#071912]">Monthly Allocated Contribution</label>
                  <input
                    type="number"
                    required
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    className="w-full rounded-2xl border border-[#D3E5DC] bg-[#EDF6F2]/40 p-2.5 text-xs text-[#071912] focus:bg-white focus:border-[#0A1D16] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-[#D3E5DC] text-xs font-semibold text-[#587F6E] hover:bg-[#EDF6F2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#00E599] hover:bg-[#1AFF9F] text-[#052619] text-xs font-bold transition-all shadow-xs"
                  >
                    Save Milestone
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
