"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { formatINR } from "../../lib/utils/formatters";
import { BrandLogo } from "../ui/BrandLogo";
import {
  LayoutDashboard,
  PieChart,
  TrendingUp,
  Sliders,
  History,
  Sparkles,
  Target,
  Bell,
  Settings,
  User,
  Plus,
  Gift,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();
  const { cashBalance, notifications, setIsAddFundsOpen } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const primaryNav = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Portfolio Holdings", href: "/portfolio", icon: PieChart },
    { label: "Equities Universe", href: "/markets", icon: TrendingUp },
    { label: "Investment Plan", href: "/investment-plan", icon: Sliders },
    { label: "Activity Ledger", href: "/activity", icon: History },
    { label: "Health & Insights", href: "/insights", icon: Sparkles },
    { label: "Financial Goals", href: "/goals", icon: Target },
    { label: "Notifications", href: "/notifications", icon: Bell, badge: unreadCount },
  ];

  const secondaryNav = [
    { label: "Investor Profile", href: "/profile", icon: User },
    { label: "Settings & Reset", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-[#D3E5DC] bg-[#F4FAF7] min-h-screen shrink-0 justify-between font-sans">
      <div className="flex flex-col">
        {/* Masthead Header */}
        <div className="h-16 flex items-center px-6 border-b border-[#D3E5DC] bg-white">
          <BrandLogo size="md" />
        </div>

        {/* Navigation Links */}
        <nav className="p-3.5 space-y-1">
          <span className="px-3 text-[10px] font-mono uppercase tracking-[0.18em] text-[#587F6E] block mb-2 font-semibold">
            Workspace
          </span>

          {primaryNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-[#0A1D16] text-white font-semibold shadow-sm"
                    : "text-[#18382C] hover:text-[#0A1D16] hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? "text-[#00E599]" : "text-[#587F6E]"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-[#00E599] text-[#061610] font-bold"
                        : "bg-[#00E599]/20 text-[#0F3525] font-semibold"
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}

          <div className="pt-4">
            <span className="px-3 text-[10px] font-mono uppercase tracking-[0.18em] text-[#587F6E] block mb-2 font-semibold">
              Account
            </span>
            {secondaryNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-[#0A1D16] text-white font-semibold"
                      : "text-[#18382C] hover:text-[#0A1D16] hover:bg-white"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? "text-[#00E599]" : "text-[#587F6E]"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Bottom Tactical Modules: Cash Balance + Invite Promo */}
      <div className="p-3.5 space-y-3">
        {/* Invite Friend Card - Directly inspired by Image 1 */}
        <Link
          href="/dashboard#invite"
          className="group block p-3.5 rounded-2xl bg-gradient-to-br from-[#0A1D16] to-[#122F24] text-white border border-[#193F30] shadow-sm relative overflow-hidden transition-all hover:border-[#00E599]/40"
        >
          {/* Subtle metallic liquid sphere graphic representation */}
          <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full bg-gradient-to-tr from-[#00E599]/20 to-emerald-400/10 blur-sm pointer-events-none group-hover:scale-125 transition-transform duration-300"></div>

          <div className="relative z-10 flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#00E599]/20 text-[#00E599] shrink-0 mt-0.5">
              <Gift className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-white leading-tight">
                Invite friends, get ₹500
              </div>
              <p className="text-[10px] text-zinc-300 mt-0.5 leading-normal">
                Earn simulated equity credits for each peer invited.
              </p>
            </div>
          </div>
        </Link>

        {/* Demo Cash Ledger Balance Card */}
        <div className="p-3.5 rounded-2xl border border-[#D3E5DC] bg-white shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#587F6E] font-medium">
              Demo Cash Balance
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#00E599]"></span>
          </div>
          <div className="font-serif text-lg text-[#071912] font-semibold tabular-nums">
            {formatINR(cashBalance)}
          </div>
          <button
            onClick={() => setIsAddFundsOpen(true)}
            className="w-full mt-2 py-1.5 px-3 rounded-lg bg-[#EDF6F2] hover:bg-[#00E599] text-[#0A1D16] text-[11px] font-sans font-semibold transition-colors flex items-center justify-center gap-1.5 border border-[#D3E5DC]"
          >
            <Plus className="h-3 w-3" />
            <span>Simulate Deposit</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
