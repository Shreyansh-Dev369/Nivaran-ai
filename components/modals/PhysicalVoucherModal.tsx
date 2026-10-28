"use client";

import React, { useRef, useEffect } from "react";
import { formatINR } from "../../lib/utils/formatters";
import { soundManager } from "../../lib/utils/sound";
import {
  FileText,
  X,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  QrCode,
  Award,
} from "lucide-react";

interface PhysicalVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucherData?: {
    voucherNumber: string;
    date: string;
    investorName: string;
    transactionType: string;
    amount: number;
    symbol?: string;
    shares?: number;
    pricePerShare?: number;
    debitAccount: string;
    creditAccount: string;
    hash: string;
  };
}

export function PhysicalVoucherModal({
  isOpen,
  onClose,
  voucherData = {
    voucherNumber: "NVR-2026-NSE-08492-X",
    date: "2026-10-28 22:45:10 IST",
    investorName: "Arjun Sharma",
    transactionType: "SIMULATED ALLOCATION DEPLOYMENT",
    amount: 25000,
    symbol: "RELIANCE / TCS / HDFCBANK",
    shares: 12,
    pricePerShare: 2083.33,
    debitAccount: "DEMO_PORTFOLIO_EQUITIES_LEDGER",
    creditAccount: "VIRTUAL_CASH_SETTLEMENT_RESERVE",
    hash: "e9f4c3a1098b671a5c43d21e89f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9",
  },
}: PhysicalVoucherModalProps) {
  const [copied, setCopied] = React.useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyHash = () => {
    soundManager.playTick();
    navigator.clipboard?.writeText(voucherData.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    soundManager.playTick();
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="voucher-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-[#FDFBF7] rounded-3xl shadow-2xl border-2 border-[#D3E5DC] flex flex-col overflow-hidden text-[#071912] font-sans relative"
      >
        {/* Top Control Bar (Non-printed) */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#D3E5DC] bg-[#0A1D16] text-white print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-wider text-[#00E599] font-bold">
              Double-Entry Settlement Voucher
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#183D2D] hover:bg-[#23533E] text-white text-xs font-mono transition-colors"
              title="Print voucher or export to PDF"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={() => {
                soundManager.playTick();
                onClose();
              }}
              className="p-1 rounded-full text-zinc-400 hover:text-white transition-colors"
              aria-label="Close voucher"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PHYSICAL VOUCHER CERTIFICATE BODY */}
        <div className="p-6 sm:p-10 space-y-6 relative overflow-hidden bg-[#FDFBF7]">
          {/* Subtle Guilloche Watermark Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.04] flex items-center justify-center">
            <svg viewBox="0 0 500 500" className="w-full h-full">
              <circle cx="250" cy="250" r="220" stroke="#000" strokeWidth="2" fill="none" strokeDasharray="4 2" />
              <circle cx="250" cy="250" r="180" stroke="#000" strokeWidth="1" fill="none" />
              <circle cx="250" cy="250" r="140" stroke="#000" strokeWidth="2" fill="none" strokeDasharray="3 3" />
              <circle cx="250" cy="250" r="100" stroke="#000" strokeWidth="3" fill="none" />
            </svg>
          </div>

          {/* Certificate Header with Sovereign Guilloche Border */}
          <div className="border-4 border-double border-[#0A1D16] p-5 sm:p-6 rounded-2xl space-y-5 relative bg-white shadow-xs">
            {/* Top Emblem & Serial */}
            <div className="flex items-start justify-between gap-4 border-b-2 border-[#0A1D16] pb-4">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#00A86B] font-bold block">
                  DEMONSTRATION LEDGER PROTOCOL
                </span>
                <h3 id="voucher-title" className="font-serif text-2xl sm:text-3xl text-[#071912] font-bold tracking-tight">
                  NIVARAN CAPITAL
                </h3>
                <span className="text-[10px] font-mono text-[#587F6E]">
                  Sovereign Simulated Settlement Vouchers • Rule-Based Engine
                </span>
              </div>

              <div className="text-right font-mono">
                <span className="text-[9px] text-[#587F6E] uppercase block">Voucher No.</span>
                <strong className="text-xs text-[#071912] font-bold block tracking-wider">
                  {voucherData.voucherNumber}
                </strong>
                <span className="text-[10px] text-[#00A86B] font-semibold">● Decimal-Safe Verified</span>
              </div>
            </div>

            {/* Investor & Transaction Details Grid */}
            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <span className="text-[9px] text-[#587F6E] uppercase block">Beneficiary / Account</span>
                <strong className="text-sm font-serif text-[#071912] font-semibold block mt-0.5">
                  {voucherData.investorName}
                </strong>
                <span className="text-[10px] text-[#587F6E]">ID: USR-DEMO-8829</span>
              </div>

              <div className="text-right">
                <span className="text-[9px] text-[#587F6E] uppercase block">Execution Timestamp</span>
                <span className="text-xs text-[#071912] font-semibold block mt-0.5">
                  {voucherData.date}
                </span>
                <span className="text-[10px] text-[#587F6E]">NSE/BSE Trading Cycle</span>
              </div>
            </div>

            {/* Transaction Specification Box */}
            <div className="p-4 rounded-xl bg-[#F4FAF7] border border-[#D3E5DC] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#587F6E] uppercase">Transaction Operation:</span>
                <strong className="text-[#071912] font-bold">{voucherData.transactionType}</strong>
              </div>

              <div className="flex items-center justify-between border-t border-[#D3E5DC] pt-2">
                <span className="font-serif text-sm text-[#071912] font-semibold">Settled Valuation:</span>
                <span className="font-serif text-2xl sm:text-3xl text-[#00A86B] font-bold tabular-nums">
                  {formatINR(voucherData.amount, { showPaise: true })}
                </span>
              </div>
            </div>

            {/* Double-Entry Ledger Book Attributions */}
            <div className="space-y-1.5 font-mono text-xs">
              <span className="text-[10px] uppercase text-[#587F6E] font-bold block">
                Accounting Journal Entries (Paise Safe):
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-lg bg-[#EDF6F2] border border-[#D3E5DC]">
                <div>
                  <span className="text-zinc-500 uppercase block text-[9px]">DEBIT (+ASSET):</span>
                  <strong className="text-[#071912] truncate block">{voucherData.debitAccount}</strong>
                  <span className="text-[#00A86B] font-bold">+{formatINR(voucherData.amount)}</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500 uppercase block text-[9px]">CREDIT (-CASH):</span>
                  <strong className="text-[#071912] truncate block">{voucherData.creditAccount}</strong>
                  <span className="text-[#E63946] font-bold">-{formatINR(voucherData.amount)}</span>
                </div>
              </div>
            </div>

            {/* Cryptographic SHA-256 Checksum Seal */}
            <div className="pt-2 border-t border-[#D3E5DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="space-y-0.5 min-w-0">
                <span className="text-[9px] uppercase text-[#587F6E] block">SHA-256 Ledger Signature</span>
                <div className="text-[10px] text-zinc-600 truncate max-w-[280px] sm:max-w-sm">
                  {voucherData.hash}
                </div>
              </div>

              <button
                onClick={handleCopyHash}
                className="inline-flex items-center gap-1 text-[10px] font-mono text-[#00A86B] hover:underline shrink-0"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Hash Copied" : "Copy Signature"}</span>
              </button>
            </div>
          </div>

          {/* Academic Simulation Notice */}
          <div className="text-center font-mono text-[10px] text-[#587F6E]">
            Educational prototype voucher generated for academic evaluation. No real monetary liability or broker commitment.
          </div>
        </div>
      </div>
    </div>
  );
}
