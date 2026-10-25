"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "../ui/BrandLogo";
import { DemoBadge } from "../ui/DemoBadge";
import { Menu, X, ArrowRight, ShieldCheck } from "lucide-react";

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Philosophy", href: "/investment-approach" },
    { label: "Safety & Disclosures", href: "/safety" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D3E5DC] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Demo Pill */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <BrandLogo size="md" />
          <div className="hidden sm:block">
            <DemoBadge compact />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-sans tracking-wide">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1 ${
                  isActive
                    ? "text-[#0A1D16] font-bold border-b-2 border-[#00E599]"
                    : "text-[#587F6E] hover:text-[#071912] font-semibold"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Trigger */}
        <div className="hidden md:flex items-center gap-3 text-xs font-sans">
          <Link
            href="/login"
            className="text-[#18382C] hover:text-[#0A1D16] font-semibold px-3 py-1.5 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 bg-[#0A1D16] hover:bg-[#122E23] px-4 py-2 rounded-full text-[#00E599] text-xs font-mono font-bold transition-all shadow-sm hover:scale-[1.02]"
          >
            <span>Demo Console</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-[#18382C] hover:bg-[#EDF6F2] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#D3E5DC] bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-2 text-xs font-sans">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-[#18382C] hover:text-[#0A1D16] font-semibold border-b border-[#EDF6F2]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2 flex flex-col gap-2 font-mono text-xs">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-center text-[#18382C] rounded-xl border border-[#D3E5DC] hover:bg-[#EDF6F2]"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-center bg-[#0A1D16] text-[#00E599] font-bold rounded-xl shadow-xs"
            >
              Open Demo Console
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
