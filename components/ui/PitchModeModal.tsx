"use client";

import React, { useState, useEffect, useRef } from "react";
import { soundManager } from "../../lib/utils/sound";
import {
  GraduationCap,
  X,
  Layers,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Database,
  ArrowRight,
  Code2,
  Lock,
  Sparkles,
  HelpCircle,
  Play,
} from "lucide-react";

interface PitchModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PitchModeModal({ isOpen, onClose }: PitchModeModalProps) {
  const [activeTab, setActiveTab] = useState<
    "ARCHITECTURE" | "ALGORITHMS" | "WORKFLOW" | "VIVA_QA"
  >("ARCHITECTURE");

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pitch-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-[#D3E5DC] flex flex-col overflow-hidden text-[#071912] font-sans"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D3E5DC] bg-[#0A1D16] text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#183D2D] text-[#00E599] flex items-center justify-center font-bold">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00E599] font-bold">
                  Academic Evaluation Mode
                </span>
                <span className="text-[9px] font-mono text-zinc-400">• College Demonstration Guide</span>
              </div>
              <h2 id="pitch-modal-title" className="font-serif text-lg font-semibold text-white">
                Nivaran Engineering Architecture & Viva Walkthrough
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playTick();
              onClose();
            }}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-[#183D2D] transition-colors"
            aria-label="Close presentation guide"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-[#EDF6F2] border-b border-[#D3E5DC] overflow-x-auto text-xs font-mono font-semibold">
          {[
            { id: "ARCHITECTURE", label: "01. Architecture & Stack", icon: Layers },
            { id: "ALGORITHMS", label: "02. Financial Mathematics", icon: Cpu },
            { id: "WORKFLOW", label: "03. Demonstration Flow", icon: Play },
            { id: "VIVA_QA", label: "04. Viva Examiner Q&A", icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundManager.playTick();
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  isSelected
                    ? "bg-[#0A1D16] text-[#00E599] shadow-xs"
                    : "text-[#587F6E] hover:text-[#071912]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* TAB 1: SYSTEM ARCHITECTURE */}
          {activeTab === "ARCHITECTURE" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-[#071912] font-semibold">
                  Modular Full-Stack Enterprise Architecture
                </h3>
                <p className="text-xs text-[#587F6E] mt-1 leading-relaxed">
                  Engineered with strict separation of concerns, persistent data layer, and secure stateless JWT authorization.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                {/* Frontend Pillar */}
                <div className="p-4 rounded-2xl bg-[#F4FAF7] border border-[#D3E5DC] space-y-2">
                  <div className="flex items-center gap-2 text-[#00A86B] font-bold">
                    <Code2 className="h-4 w-4" />
                    <span>Frontend Client</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-[#4B665A]">
                    <li>• Next.js 16 App Router (Turbopack)</li>
                    <li>• TypeScript 5 strict type checking</li>
                    <li>• Tailwind CSS & CSS Scroll-Driven Viewport Timelines</li>
                    <li>• Web Audio API synthesized haptic ticks</li>
                  </ul>
                </div>

                {/* Backend Pillar */}
                <div className="p-4 rounded-2xl bg-[#F4FAF7] border border-[#D3E5DC] space-y-2">
                  <div className="flex items-center gap-2 text-[#00A86B] font-bold">
                    <Cpu className="h-4 w-4" />
                    <span>FastAPI REST Engine</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-[#4B665A]">
                    <li>• Python FastAPI with Pydantic v2 schemas</li>
                    <li>• Stateless HS256 JWT Bearer token authentication</li>
                    <li>• Server-side token validation & user data isolation</li>
                    <li>• CORS middleware configured for academic evaluation</li>
                  </ul>
                </div>

                {/* Database Pillar */}
                <div className="p-4 rounded-2xl bg-[#F4FAF7] border border-[#D3E5DC] space-y-2">
                  <div className="flex items-center gap-2 text-[#00A86B] font-bold">
                    <Database className="h-4 w-4" />
                    <span>Persistence Layer</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-[#4B665A]">
                    <li>• SQLAlchemy 2.0 ORM with Alembic migrations</li>
                    <li>• Local dev SQLite persistence (`backend/nivaran.db`)</li>
                    <li>• Supabase PostgreSQL schema with RLS DDL (`supabase_schema.sql`)</li>
                    <li>• Pre-seeded NSE/BSE stocks & demo investor records</li>
                  </ul>
                </div>
              </div>

              {/* Data Flow Diagram Card */}
              <div className="rounded-2xl bg-[#0A1D16] text-white p-5 border border-[#163628] font-mono text-xs space-y-2">
                <div className="text-[#00E599] font-bold uppercase tracking-wider text-[10px]">
                  Request & Ledger Flow
                </div>
                <div className="text-zinc-300 leading-relaxed text-[11px]">
                  Browser Client → API Proxy (`/api/*`) → FastAPI Endpoint → JWT Dependency (`get_current_user`) → SQLAlchemy Session → Double-Entry Ledger Transaction → 200 OK Response
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FINANCIAL MATHEMATICS */}
          {activeTab === "ALGORITHMS" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-[#071912] font-semibold">
                  Rule-Based Portfolio Mathematics
                </h3>
                <p className="text-xs text-[#587F6E] mt-1 leading-relaxed">
                  Nivaran replaces speculative human trading with transparent, deterministic mathematical rules.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-[#D3E5DC] bg-white space-y-2">
                  <span className="font-mono font-bold text-xs text-[#00A86B] block">
                    1. Decimal-Safe Currency Math
                  </span>
                  <p className="text-xs text-[#587F6E] leading-relaxed">
                    All financial calculations operate in integer <strong>paise</strong> internally (1 Rupee = 100 Paise) to completely eliminate IEEE 754 floating-point rounding errors during multi-stock split allocations.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-[#D3E5DC] bg-white space-y-2">
                  <span className="font-mono font-bold text-xs text-[#00A86B] block">
                    2. Concentration Governance (≤25%)
                  </span>
                  <p className="text-xs text-[#587F6E] leading-relaxed">
                    The recommendation engine strictly caps any single stock exposure to $\le 25\%$ of total portfolio value, preventing idiosyncratic corporate failures from threatening overall corpus wealth.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-[#D3E5DC] bg-white space-y-2">
                  <span className="font-mono font-bold text-xs text-[#00A86B] block">
                    3. Herfindahl-Hirschman Index (HHI)
                  </span>
                  <p className="text-xs text-[#587F6E] leading-relaxed">
                    Measures portfolio concentration ($HHI = \sum s_i^2$). Portfolios scoring below 2,500 receive a Diversification Rating of &ldquo;Superior&rdquo;, validating multi-sector distribution.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-[#D3E5DC] bg-white space-y-2">
                  <span className="font-mono font-bold text-xs text-[#00A86B] block">
                    4. Continuous ±5% Drift Calibration
                  </span>
                  <p className="text-xs text-[#587F6E] leading-relaxed">
                    When asset weights drift $\ge 5\%$ from target equilibrium due to market price movements, the automated rebalancer trims overweights and buys undervalued defensive anchors.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DEMONSTRATION FLOW */}
          {activeTab === "WORKFLOW" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-[#071912] font-semibold">
                  Step-by-Step Examiner Demonstration Workflow
                </h3>
                <p className="text-xs text-[#587F6E] mt-1 leading-relaxed">
                  Follow this structured sequence to demonstrate working software live to your professors.
                </p>
              </div>

              <div className="space-y-3 font-sans">
                {[
                  { step: "01", title: "Landing Page & Interactive Simulator", desc: "Showcase the Live Ticker Ribbon (20 NSE/BSE stocks) and drag the monthly compounding slider to demonstrate real-time deterministic calculations." },
                  { step: "02", title: "Quick Demo Authentication", desc: "Click 'Sign In' and use the 1-click Quick Demo Login button (arjun.sharma@example.com) to establish a verified JWT session." },
                  { step: "03", title: "Executive Dashboard & Live Counters", desc: "Highlight the animated number counters, net portfolio valuation, return statistics area chart, and asset allocation donut." },
                  { step: "04", title: "Virtual Deposit Execution", desc: "Open 'Simulate Deposit', add ₹25,000 in virtual funds, and show that available cash balance and ledger vouchers update immediately." },
                  { step: "05", title: "Crisis Stress-Testing Simulation", desc: "Click between the 2020 Covid Crash (-28.4%) and 2008 GFC (-45.2%) on the Stress Test Card to showcase capital preservation." },
                  { step: "06", title: "Automated Rebalancing Execution", desc: "Click 'Rebalance' to inspect asset drift proposals and execute trades restoring portfolio weights to target equilibrium." },
                  { step: "07", title: "Double-Entry Audit Trail", desc: "Navigate to Activity to display the immutable double-entry ledger vouchers proving accounting integrity." },
                ].map((s) => (
                  <div key={s.step} className="p-3.5 rounded-2xl bg-[#F4FAF7] border border-[#D3E5DC] flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#0A1D16] text-[#00E599] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {s.step}
                    </span>
                    <div>
                      <h4 className="font-semibold text-xs text-[#071912]">{s.title}</h4>
                      <p className="text-[11px] text-[#587F6E] mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: VIVA EXAMINER Q&A */}
          {activeTab === "VIVA_QA" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-[#071912] font-semibold">
                  Viva Examiner Q&A Cheat Sheet
                </h3>
                <p className="text-xs text-[#587F6E] mt-1 leading-relaxed">
                  Answers to the most common conceptual and technical questions asked by project evaluators.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: "Q: Why did you choose a rule-based algorithm rather than a machine-learning / deep-learning black-box model?",
                    a: "A: Modern financial regulations (like SEBI in India and MiFID II in Europe) require full explainability and mathematical auditability for retail investments. Black-box ML models are prone to hallucinatory drift and overfitting during market regime changes. Rule-based Modern Portfolio Theory (MPT) with single-stock caps and drift triggers provides 100% deterministic, explainable governance with zero hidden bias.",
                  },
                  {
                    q: "Q: How do you prevent financial rounding errors when splitting rupee amounts across multiple stocks?",
                    a: "A: All currency math is computed using integer paise (1 Rupee = 100 Paise). When generating whole-share purchase allocations, the engine calculates integer shares (quantity = floor(allocationAmount / stockPrice)) and deposits any remainder back into the user's unallocated cash balance, ensuring zero leaked paise.",
                  },
                  {
                    q: "Q: How do you enforce security and prevent User A from viewing or modifying User B's portfolio?",
                    a: "A: The client never passes user_id in the request payload as proof of identity. Every authenticated endpoint verifies the cryptographic signature of the Bearer JWT token on the server, extracts the verified subject ID, and scopes database queries strictly to that authenticated user.",
                  },
                  {
                    q: "Q: How does the application handle database persistence across restarts?",
                    a: "A: In local development, the backend uses an ACID-compliant SQLite database via SQLAlchemy 2.0 ORM, with pre-seeded demo records for Arjun Sharma. For cloud production, a complete PostgreSQL DDL script with Row-Level Security (RLS) is provided in `backend/supabase_schema.sql`.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#F4FAF7] border border-[#D3E5DC] space-y-1.5">
                    <h4 className="font-serif text-sm font-bold text-[#071912]">{item.q}</h4>
                    <p className="text-xs text-[#4B665A] leading-relaxed font-sans">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#D3E5DC] bg-[#F4FAF7] text-xs font-mono">
          <span className="text-[#587F6E]">
            Nivaran • Academic Investment Simulation Platform
          </span>
          <button
            onClick={() => {
              soundManager.playTick();
              onClose();
            }}
            className="px-4 py-2 rounded-full bg-[#0A1D16] text-[#00E599] font-bold hover:bg-[#122E23] transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
