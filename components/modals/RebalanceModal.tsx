"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { calculateRebalanceProposals } from "../../lib/utils/simulation-engine";
import { formatINR } from "../../lib/utils/formatters";
import { X, ArrowRight, RefreshCw, Check } from "lucide-react";

interface RebalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RebalanceModal({ isOpen, onClose }: RebalanceModalProps) {
  const { holdings, totalHoldingsValue, plan, rebalancePortfolio } = useApp();
  const [isSuccess, setIsSuccess] = useState(false);
  const [resultMsg, setResultMsg] = useState("");

  if (!isOpen) return null;

  const threshold = plan?.rebalanceThreshold || 5;
  const proposals = calculateRebalanceProposals(holdings, totalHoldingsValue, threshold);
  const actionable = proposals.filter((p) => p.action !== "HOLD");

  const handleExecute = () => {
    const res = rebalancePortfolio();
    setResultMsg(res.message);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl border border-[#D3E5DC] p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between pb-4 border-b border-[#D3E5DC]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00A86B] font-bold">
              Algorithmic Drift Control
            </span>
            <h3 className="font-serif text-2xl text-[#071912] font-semibold mt-0.5">
              Portfolio Rebalance Schedule
            </h3>
            <p className="text-xs text-[#587F6E] font-sans mt-0.5">
              Active drift tolerance threshold: <strong className="font-mono text-[#071912]">±{threshold}%</strong>
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-[#587F6E] hover:bg-[#EDF6F2] focus:outline-none"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!isSuccess ? (
          <div className="space-y-4 text-xs font-sans">
            <p className="text-[#587F6E] leading-relaxed">
              When market price movements cause actual holdings to deviate from your target plan weights, rebalancing trims overweighted equities and accumulates underweighted quality to restore risk equilibrium.
            </p>

            {/* Drift Table */}
            <div className="rounded-2xl border border-[#D3E5DC] bg-[#F4FAF7] overflow-hidden">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#EDF6F2] text-[#587F6E] font-mono text-[10px] uppercase tracking-wider border-b border-[#D3E5DC]">
                  <tr>
                    <th className="py-2.5 px-3">Ticker</th>
                    <th className="py-2.5 px-3 text-right">Current %</th>
                    <th className="py-2.5 px-3 text-right">Target %</th>
                    <th className="py-2.5 px-3 text-right">Drift</th>
                    <th className="py-2.5 px-3 text-right">Proposed Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D3E5DC] bg-white">
                  {proposals.map((prop) => (
                    <tr key={prop.symbol} className="hover:bg-[#EDF6F2]/30 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#071912]">
                        {prop.symbol}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-[#587F6E]">
                        {prop.currentWeight}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-[#587F6E]">
                        {prop.targetWeight}%
                      </td>
                      <td
                        className={`py-2.5 px-3 text-right font-mono tabular-nums font-semibold ${
                          Math.abs(prop.drift) >= threshold
                            ? prop.drift > 0
                              ? "text-[#E63946]"
                              : "text-[#00A86B]"
                            : "text-[#587F6E]"
                        }`}
                      >
                        {prop.drift > 0 ? "+" : ""}
                        {prop.drift}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {prop.action === "SELL" ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FDF0F1] text-[#E63946]">
                            TRIM {formatINR(Math.abs(prop.amountDelta))}
                          </span>
                        ) : prop.action === "BUY" ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F9F1] text-[#00A86B]">
                            ADD {formatINR(Math.abs(prop.amountDelta))}
                          </span>
                        ) : (
                          <span className="text-[#587F6E] text-[10px]">Within Band</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="font-mono text-[11px] text-[#587F6E]">
                {actionable.length > 0
                  ? `${actionable.length} position adjustments identified.`
                  : "All current holdings are within target tolerance."}
              </span>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-full border border-[#D3E5DC] text-xs font-semibold text-[#587F6E] hover:bg-[#EDF6F2]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecute}
                  disabled={actionable.length === 0}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full bg-[#0A1D16] text-[#00E599] text-xs font-mono font-bold hover:bg-[#122E23] disabled:opacity-50 transition-all shadow-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Execute Rebalance</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs font-sans">
            <div className="p-4 rounded-2xl bg-[#E6F9F1] border border-[#00E599]/40 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00E599] text-[#061610] flex items-center justify-center shrink-0">
                <Check className="h-4 w-4 stroke-[3]" />
              </div>
              <div>
                <h4 className="font-bold text-[#0A1D16] text-sm">Portfolio Equilibrium Restored</h4>
                <p className="text-[11px] text-[#587F6E] font-mono mt-0.5">{resultMsg}</p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 rounded-full bg-[#0A1D16] text-[#00E599] font-mono text-xs font-bold hover:bg-[#122E23] transition-all shadow-xs"
            >
              Return to Holdings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
