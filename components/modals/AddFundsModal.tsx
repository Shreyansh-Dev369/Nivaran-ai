"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { formatINR } from "../../lib/utils/formatters";
import { Check, X, ArrowRight, ShieldCheck, Plus, Sparkles } from "lucide-react";

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddFundsModal({ isOpen, onClose }: AddFundsModalProps) {
  const { addDemoFunds, cashBalance } = useApp();
  const [amount, setAmount] = useState<number>(25000);
  const [customInput, setCustomInput] = useState<string>("25000");
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptTx, setReceiptTx] = useState<{ id: string; amount: number; referenceId?: string } | null>(null);

  if (!isOpen) return null;

  const presets = [10000, 25000, 50000, 100000];

  const handlePresetSelect = (val: number) => {
    setAmount(val);
    setCustomInput(val.toString());
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setCustomInput(raw);
    const parsed = parseInt(raw, 10);
    setAmount(!isNaN(parsed) ? parsed : 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || amount > 10000000) return;

    const tx = addDemoFunds(amount, `Simulated Demo Capital Top-up (${formatINR(amount)})`);
    setReceiptTx({ id: tx.id, amount: tx.amount, referenceId: tx.referenceId });
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setReceiptTx(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-3xl border border-[#D3E5DC] p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between pb-4 border-b border-[#D3E5DC]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00A86B] font-bold">
              Cash Ledger Top-Up
            </span>
            <h3 className="font-serif text-2xl text-[#071912] font-semibold mt-0.5">
              {isSuccess ? "Simulated Receipt" : "Add Demo Cash"}
            </h3>
          </div>
          <button
            onClick={handleReset}
            className="p-1 rounded-full text-[#587F6E] hover:bg-[#EDF6F2] focus:outline-none"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div className="rounded-2xl border border-[#D3E5DC] bg-[#F4FAF7] p-3.5 space-y-1 font-mono text-[11px] text-[#587F6E]">
              <span className="font-bold text-[#0A1D16] uppercase tracking-wider block">
                Simulation Protocol
              </span>
              <p>
                Credits are held strictly in an internal ledger. No real payment gateway, UPI ID, or bank account is debited.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#587F6E] block font-semibold">
                Select Allocation Amount
              </span>
              <div className="grid grid-cols-4 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className={`py-2 px-1 text-center font-mono text-xs rounded-xl border transition-all ${
                      amount === preset
                        ? "bg-[#0A1D16] text-[#00E599] border-[#0A1D16] font-bold shadow-xs"
                        : "bg-white text-[#18382C] border-[#D3E5DC] hover:bg-[#EDF6F2]"
                    }`}
                  >
                    {formatINR(preset, { compact: true })}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="custom-amount" className="font-mono text-[11px] uppercase tracking-wider text-[#587F6E] block font-semibold">
                Custom Rupee Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm font-bold text-[#071912]">
                  ₹
                </span>
                <input
                  id="custom-amount"
                  type="text"
                  value={customInput}
                  onChange={handleCustomChange}
                  className="w-full rounded-2xl border border-[#D3E5DC] bg-[#EDF6F2]/40 py-2.5 pl-8 pr-4 font-mono text-base font-bold text-[#071912] focus:bg-white focus:border-[#0A1D16] focus:outline-none"
                  placeholder="Enter amount..."
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0A1D16] text-white flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-400">Current Demo Cash:</span>
              <span className="font-bold text-[#00E599] text-sm tabular-nums">
                {formatINR(cashBalance)}
              </span>
            </div>

            <button
              type="submit"
              disabled={amount <= 0}
              className="w-full py-3 rounded-full bg-[#00E599] hover:bg-[#1AFF9F] disabled:opacity-50 text-[#052619] font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Confirm Demo Deposit ({formatINR(amount)})</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-xs font-sans">
            <div className="p-4 rounded-2xl bg-[#E6F9F1] border border-[#00E599]/40 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00E599] text-[#061610] flex items-center justify-center shrink-0">
                <Check className="h-4 w-4 stroke-[3]" />
              </div>
              <div>
                <h4 className="font-bold text-[#0A1D16] text-sm">Deposit Simulated Successfully</h4>
                <p className="text-[11px] text-[#587F6E] font-mono">
                  Ref: {receiptTx?.referenceId}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F4FAF7] border border-[#D3E5DC] space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[#587F6E]">Credited Amount:</span>
                <span className="font-bold text-[#071912]">{formatINR(receiptTx?.amount || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#587F6E]">New Cash Balance:</span>
                <span className="font-bold text-[#00A86B]">{formatINR(cashBalance)}</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 rounded-full bg-[#0A1D16] text-[#00E599] font-mono text-xs font-bold hover:bg-[#122E23] transition-all shadow-xs"
            >
              Return to Console
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
