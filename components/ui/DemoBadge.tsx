"use client";

import React, { useState } from "react";
import { ShieldAlert, X, Info } from "lucide-react";

export function DemoBadge({ compact = false }: { compact?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        title="View College Demo Simulation Boundaries"
        className={`inline-flex items-center gap-2 border border-hairline bg-paper text-ink-700 hover:text-ink-950 hover:border-ink-400/60 transition-colors focus:outline-none ${
          compact ? "text-[10px] py-0.5 px-2 tracking-wider" : "text-[11px] py-1 px-2.5 tracking-wider"
        }`}
      >
        <span className="h-1.5 w-1.5 bg-pine-800 rounded-none shrink-0" />
        <span className="font-mono font-medium uppercase">
          {compact ? "Demo Mode" : "Demo • Simulated Ledger"}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 p-4 backdrop-blur-xs">
          <div
            className="w-full max-w-lg bg-ivory border border-hairline p-7 shadow-2xl space-y-5 animate-in fade-in duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between pb-4 border-b border-hairline">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pine-800 font-semibold">
                  Academic Framework
                </span>
                <h3 className="font-serif text-2xl text-ink-950 font-normal">
                  Educational Simulation Boundary
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-ink-400 hover:text-ink-900 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-ink-600 leading-relaxed font-sans">
              <p>
                <strong>NIVARAN</strong> is an original software prototype developed for academic demonstration. It models how preference-based rules can automate blue-chip Indian stock investing without requiring manual day-trading.
              </p>
              <div className="border-l-2 border-pine-800 pl-3.5 py-1 text-ink-800 italic font-serif text-sm">
                &ldquo;Discipline over speculation. Understand every allocation decision.&rdquo;
              </div>
              <ul className="space-y-2 list-disc pl-4 text-ink-600">
                <li>
                  <strong>No Real Capital:</strong> Zero deposits or withdrawals. All cash is held in an internal simulated ledger with virtual credits.
                </li>
                <li>
                  <strong>No Brokerage Orders:</strong> No real order routing to the National Stock Exchange of India (NSE) or Bombay Stock Exchange (BSE).
                </li>
                <li>
                  <strong>Illustrative Sample Equities:</strong> Company valuation metrics and historical prices represent realistic Indian market samples.
                </li>
                <li>
                  <strong>Zero Regulatory Claims:</strong> Not registered with SEBI as an investment adviser or broker.
                </li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 bg-pine-900 text-ivory text-xs font-sans tracking-wide hover:bg-pine-950 transition-colors font-medium"
              >
                Continue Testing Platform
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
