"use client";

import React from "react";
import Link from "next/link";
import { PublicHeader } from "../../components/layout/PublicHeader";
import { PublicFooter } from "../../components/layout/PublicFooter";
import {
  ShieldCheck,
  Lock,
  FileCheck,
  AlertTriangle,
  Server,
  ArrowRight,
} from "lucide-react";

export default function SafetyPage() {
  const boundaries = [
    {
      index: "01",
      title: "Zero Real Capital Transferred",
      desc: "NIVARAN does not connect to actual banking gateways, NEFT/RTGS, or UPI payment rails. All portfolio balances, simulated investments, and cash ledger top-ups operate within an isolated, deterministic browser database.",
      tag: "DEMO LEDGER ONLY",
    },
    {
      index: "02",
      title: "No Brokerage Routing or Market Orders",
      desc: "No stock purchase or sale orders are routed to the National Stock Exchange of India (NSE) or Bombay Stock Exchange (BSE). All transactions are simulated locally for algorithmic and educational demonstration purposes.",
      tag: "LOCAL SIMULATION",
    },
    {
      index: "03",
      title: "Zero Sensitive Credentials Requested",
      desc: "We will never ask you for bank account passwords, UPI PINs, PAN card OTPs, Demat account credentials, or credit card numbers. Your demo password remains safely stored within your local browser session.",
      tag: "CREDENTIAL PROTECTION",
    },
    {
      index: "04",
      title: "Educational Purpose & Regulatory Transparency",
      desc: "NIVARAN is an academic engineering capstone project designed to demonstrate intuitive wealth-management UX and explainable rules-based portfolio generation. It does not provide personalized investment advice and is not registered with SEBI.",
      tag: "ACADEMIC SCOPE",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#EDF6F2] text-[#071912] selection:bg-[#00E599] selection:text-[#061610]">
      <PublicHeader />

      <main className="flex-1">
        {/* Editorial Masthead */}
        <section className="py-20 sm:py-24 border-b border-charcoal-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#F4F4EE] border border-charcoal-200">
              <span className="h-1.5 w-1.5 rounded-full bg-forest-700"></span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-charcoal-700">
                DISCLOSURES & DEMONSTRATION BOUNDARIES
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl font-normal tracking-tight text-charcoal-950">
              Safety, Privacy & Simulation Boundaries
            </h1>
            <p className="font-sans text-sm sm:text-base text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
              We believe financial software must be fundamentally honest. Here are the clear, non-negotiable architectural boundaries of this demonstration platform.
            </p>
          </div>
        </section>

        {/* Boundaries Grid */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {boundaries.map((b) => (
                <div
                  key={b.index}
                  className="border border-charcoal-200 bg-white p-8 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-forest-800 bg-forest-50 px-2 py-0.5 rounded border border-forest-100">
                      DISCLOSURE {b.index}
                    </span>
                    <span className="font-mono text-[10px] uppercase text-charcoal-400">
                      {b.tag}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-normal text-charcoal-950">
                    {b.title}
                  </h3>
                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Official Academic Disclosure Box */}
            <div className="border border-charcoal-200 bg-white p-8 sm:p-10 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-charcoal-200">
                <FileCheck className="h-4 w-4 text-forest-800" />
                <h3 className="font-serif text-xl font-normal text-charcoal-950">
                  Official Academic & Regulatory Clarification
                </h3>
              </div>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                The securities referenced across this application (such as Reliance Industries, Tata Consultancy Services, HDFC Bank, Infosys, Larsen & Toubro, etc.) are included strictly for illustrative modeling purposes. Their historical pricing points, financial metrics, valuation multiples, and dividend yields represent realistic market samples but should never be construed as real-time investment advice, buy/sell recommendations, or price targets.
              </p>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Past performance is not indicative of future returns. Mutual fund and direct equity investments in India are subject to market risks; read all scheme-related offer documents carefully before making real-money investments in the Indian markets.
              </p>
            </div>

            <div className="text-center pt-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded bg-forest-800 px-6 py-2.5 text-xs font-medium text-white hover:bg-forest-900 transition-colors shadow-xs"
              >
                <span>Launch Interactive Demo Platform</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
