"use client";

import React, { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { useApp } from "../../context/AppContext";
import { Transaction, TransactionType } from "../../lib/types";
import { formatINR, formatDate } from "../../lib/utils/formatters";
import {
  Search,
  CheckCircle2,
  X,
  FileText,
  RotateCcw,
  Check,
  ChevronRight,
} from "lucide-react";

export default function ActivityPage() {
  const { transactions } = useApp();

  const [filterType, setFilterType] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filtered = transactions.filter((tx) => {
    const matchesType = filterType === "ALL" || tx.type === filterType;
    const matchesSearch =
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      (tx.referenceId && tx.referenceId.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const getTxBadge = (type: TransactionType) => {
    switch (type) {
      case "DEPOSIT":
        return { label: "DEMO FUNDING", style: "bg-[#E6F9F1] text-[#00A86B] border-[#00A86B]/30" };
      case "PLAN_TRIGGER":
        return { label: "MANDATE SIP", style: "bg-[#0A1D16] text-[#00E599] border-[#0A1D16]" };
      case "REBALANCE_BUY":
      case "REBALANCE_SELL":
        return { label: "REBALANCE", style: "bg-amber-50 text-amber-900 border-amber-200" };
      case "INVESTMENT":
        return { label: "ALLOCATION", style: "bg-[#F4FAF7] text-[#071912] border-[#D3E5DC]" };
      default:
        return { label: type, style: "bg-[#F4FAF7] text-[#587F6E] border-[#D3E5DC]" };
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8 w-full font-sans">
        {/* Editorial Masthead */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D3E5DC]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#00A86B] bg-[#E6F9F1] px-2.5 py-0.5 rounded-full border border-[#00A86B]/20 font-bold">
                AUDIT TRAIL
              </span>
              <span className="text-[10px] font-mono text-[#587F6E]">
                GENERAL LEDGER
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#071912]">
              Activity & Ledger Audit
            </h1>
            <p className="text-xs text-[#587F6E] mt-0.5">
              Double-entry simulated ledger tracking all cash credits, automated SIP executions, and portfolio rebalances
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#0A1D16] bg-white border border-[#D3E5DC] px-3.5 py-1.5 rounded-full shadow-xs">
              {transactions.length} Total Journal Entries
            </span>
          </div>
        </div>

        {/* Search & Ledger Filters */}
        <div className="rounded-3xl border border-[#D3E5DC] bg-white p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#587F6E]" />
              <input
                type="text"
                placeholder="Search ledger entries by description or reference ID (e.g. NVR-DEP-)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-[#D3E5DC] bg-[#EDF6F2]/60 py-2.5 pl-10 pr-4 text-xs font-sans text-[#071912] placeholder:text-[#587F6E] focus:bg-white focus:border-[#0A1D16] focus:outline-none"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-[#EDF6F2] p-1 rounded-full border border-[#D3E5DC]">
              {["ALL", "PLAN_TRIGGER", "DEPOSIT", "REBALANCE_BUY"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                    filterType === t
                      ? "bg-[#0A1D16] text-[#00E599] shadow-xs"
                      : "text-[#587F6E] hover:text-[#071912]"
                  }`}
                >
                  {t === "PLAN_TRIGGER" ? "Mandate SIP" : t === "REBALANCE_BUY" ? "Rebalance" : t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ledger Entries Table */}
        <div className="rounded-3xl border border-[#D3E5DC] bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#F4FAF7] text-[#587F6E] font-mono text-[10px] uppercase tracking-wider border-b border-[#D3E5DC]">
                <tr>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Classification</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Reference Voucher</th>
                  <th className="py-3.5 px-4 text-right">Amount (INR)</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D3E5DC]">
                {filtered.map((tx) => {
                  const badge = getTxBadge(tx.type);

                  return (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className="hover:bg-[#EDF6F2]/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-mono text-[#587F6E] whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${badge.style}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#071912]">
                        {tx.description}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#587F6E]">
                        {tx.referenceId || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#071912] tabular-nums">
                        {formatINR(tx.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#00A86B] font-bold">
                          <Check className="h-3 w-3 stroke-[3]" />
                          <span>POSTED</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTx(tx);
                          }}
                          className="p-1 rounded-lg text-[#587F6E] hover:text-[#0A1D16] hover:bg-[#EDF6F2]"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Voucher Receipt Modal */}
        {selectedTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 border border-[#D3E5DC] shadow-2xl space-y-4 font-sans">
              <div className="flex items-center justify-between pb-3 border-b border-[#D3E5DC]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#00A86B] font-bold block">
                    General Ledger Voucher
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-[#071912]">
                    Audit Record: {selectedTx.referenceId || selectedTx.id}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="p-1 rounded-full text-[#587F6E] hover:bg-[#EDF6F2]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-[#F4FAF7] border border-[#D3E5DC] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#587F6E]">Journal Date:</span>
                    <span className="font-bold text-[#071912]">{formatDate(selectedTx.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#587F6E]">Classification:</span>
                    <span className="font-bold text-[#0A1D16]">{selectedTx.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#587F6E]">Voucher Status:</span>
                    <span className="font-bold text-[#00A86B]">COMPLETED & VERIFIED</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A1D16] text-white flex justify-between items-center">
                  <span className="text-zinc-400">Total Cleared Amount:</span>
                  <span className="font-serif text-xl font-bold text-[#00E599]">
                    {formatINR(selectedTx.amount)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedTx(null)}
                className="w-full py-2.5 rounded-full bg-[#0A1D16] text-[#00E599] font-mono text-xs font-bold hover:bg-[#122E23] transition-all shadow-xs"
              >
                Close Audit Voucher
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
