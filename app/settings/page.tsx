"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../components/layout/AppShell";
import { useApp } from "../../context/AppContext";
import {
  RotateCcw,
  Bell,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, resetDemoData, resetToEmptyState, signOut } = useApp();

  const [notifSip, setNotifSip] = useState(true);
  const [notifRebalance, setNotifRebalance] = useState(true);
  const [notifMarket, setNotifMarket] = useState(false);
  const [resetModalMode, setResetModalMode] = useState<"BASELINE" | "EMPTY" | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleResetBaseline = () => {
    resetDemoData();
    setResetModalMode(null);
    setFeedback("Restored Arjun Sharma baseline portfolio (₹12.48L) with active holdings.");
    setTimeout(() => {
      setFeedback(null);
      router.push("/dashboard");
    }, 1200);
  };

  const handleResetEmpty = () => {
    resetToEmptyState();
    setResetModalMode(null);
    setFeedback("Initialized fresh sandbox account: ₹0 holdings and ₹1,00,000 available demo cash.");
    setTimeout(() => {
      setFeedback(null);
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto font-sans">
        {/* Editorial Masthead */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D3E5DC]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#00A86B] bg-[#E6F9F1] px-2.5 py-0.5 rounded-full border border-[#00A86B]/20 font-bold">
                SYSTEM CONFIGURATION
              </span>
              <span className="text-[10px] font-mono text-[#587F6E]">
                SANDBOX CONTROL
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#071912]">
              Platform Settings & Preferences
            </h1>
            <p className="text-xs text-[#587F6E] mt-0.5">
              Configure accounting notation standards, notification triggers, and evaluator sandbox states
            </p>
          </div>
        </div>

        {feedback && (
          <div className="rounded-2xl border border-[#00E599]/40 bg-[#E6F9F1] p-4 text-xs text-[#0A1D16] flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#00A86B] shrink-0" />
            <span className="font-semibold">{feedback}</span>
          </div>
        )}

        {/* Sandbox State Reset Module */}
        <div className="rounded-3xl border border-[#D3E5DC] bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#D3E5DC]">
            <RotateCcw className="h-5 w-5 text-[#00A86B]" />
            <h2 className="font-serif text-xl font-semibold text-[#071912]">
              Evaluation Sandbox States
            </h2>
          </div>
          <p className="text-xs text-[#587F6E] leading-relaxed">
            Quickly toggle between different evaluation states to test deterministic allocation generation, rebalance alerts, or cold-start onboarding.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl border border-[#D3E5DC] bg-[#F4FAF7] space-y-3">
              <h4 className="font-serif text-base font-semibold text-[#071912]">
                Restore Arjun Sharma Baseline
              </h4>
              <p className="text-xs text-[#587F6E]">
                Populates an active ₹12.48L portfolio with 5 diversified Indian equities, target drift parameters, and scheduled SIP history.
              </p>
              <button
                type="button"
                onClick={() => setResetModalMode("BASELINE")}
                className="w-full py-2.5 rounded-full bg-[#0A1D16] text-[#00E599] font-mono text-xs font-bold hover:bg-[#122E23] transition-all shadow-xs"
              >
                Restore Baseline State
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-[#D3E5DC] bg-[#F4FAF7] space-y-3">
              <h4 className="font-serif text-base font-semibold text-[#071912]">
                Initialize Clean Sandbox
              </h4>
              <p className="text-xs text-[#587F6E]">
                Resets the ledger to ₹0 holdings and credits ₹1,00,000 in uncommitted demo cash to test plan formulation from scratch.
              </p>
              <button
                type="button"
                onClick={() => setResetModalMode("EMPTY")}
                className="w-full py-2.5 rounded-full border border-[#D3E5DC] bg-white text-[#071912] font-mono text-xs font-semibold hover:bg-[#EDF6F2] transition-colors"
              >
                Initialize Clean Sandbox
              </button>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {resetModalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 border border-[#D3E5DC] shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-serif text-lg font-bold text-[#071912]">
                  Confirm State Modification
                </h3>
              </div>
              <p className="text-xs text-[#587F6E]">
                {resetModalMode === "BASELINE"
                  ? "This will overwrite current holdings with the default 5-stock Indian equities portfolio."
                  : "This will clear all current holdings and reset demo cash to ₹1,00,000."}
              </p>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setResetModalMode(null)}
                  className="px-4 py-2 rounded-full border border-[#D3E5DC] text-xs font-semibold text-[#587F6E] hover:bg-[#EDF6F2]"
                >
                  Cancel
                </button>
                <button
                  onClick={resetModalMode === "BASELINE" ? handleResetBaseline : handleResetEmpty}
                  className="px-5 py-2 rounded-full bg-[#0A1D16] text-[#00E599] font-mono text-xs font-bold hover:bg-[#122E23] transition-all shadow-xs"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
