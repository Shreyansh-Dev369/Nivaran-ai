"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo } from "../ui/BrandLogo";

export function PublicFooter() {
  return (
    <footer className="border-t border-[#D3E5DC] bg-white text-[#587F6E]">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Manifesto Column */}
          <div className="md:col-span-5 space-y-4">
            <BrandLogo size="md" />
            <p className="font-serif italic text-sm text-[#071912] leading-relaxed max-w-sm">
              &ldquo;Invest with a plan. Understand every decision. Track your progress.&rdquo;
            </p>
            <p className="text-xs text-[#587F6E] leading-relaxed font-sans max-w-sm">
              Designed as a transparent alternative to the speculative hysteria of day-trading apps. Built for deliberate wealth creation in Indian equities.
            </p>
          </div>

          {/* Nav Links Column */}
          <div className="md:col-span-3 space-y-3 font-sans">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#071912] font-bold">
              Platform Architecture
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/how-it-works" className="hover:text-[#0A1D16] transition-colors">
                  Methodology & Execution
                </Link>
              </li>
              <li>
                <Link href="/investment-approach" className="hover:text-[#0A1D16] transition-colors">
                  Investment Philosophy
                </Link>
              </li>
              <li>
                <Link href="/markets" className="hover:text-[#0A1D16] transition-colors">
                  Eligible Indian Equities
                </Link>
              </li>
              <li>
                <Link href="/investment-plan/create" className="hover:text-[#0A1D16] transition-colors">
                  Plan Generator
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-[#0A1D16] transition-colors">
                  Simulation Boundaries
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic & Regulatory Notice Column */}
          <div className="md:col-span-4 space-y-3 font-sans">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#071912] font-bold">
              Academic Project Notice
            </h4>
            <p className="text-[11px] text-[#587F6E] leading-relaxed">
              NIVARA is built strictly for educational evaluation. Securities referenced (such as Reliance, TCS, HDFC Bank, Infosys, and L&T) are illustrative samples.
            </p>
            <p className="text-[11px] text-[#587F6E] leading-relaxed">
              Not registered with SEBI. No real orders are routed, no real funds are accepted, and no guaranteed returns are promised.
            </p>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="mt-12 pt-6 border-t border-[#D3E5DC] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#587F6E] gap-4">
          <p>© 2026 NIVARA Technologies. Academic Demonstration.</p>
          <div className="flex gap-6">
            <Link href="/safety" className="hover:text-[#071912]">Privacy Notice</Link>
            <Link href="/safety" className="hover:text-[#071912]">Terms of Simulation</Link>
            <Link href="/safety" className="hover:text-[#071912]">Disclosures</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
