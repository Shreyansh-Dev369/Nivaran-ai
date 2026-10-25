"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PieChart,
  TrendingUp,
  Sliders,
  Menu,
  X,
  History,
  Sparkles,
  Target,
  Bell,
  Settings,
  User,
  ArrowLeftRight,
  ShieldAlert,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { notifications } = useApp();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const mainTabs = [
    { label: "Portfolio", href: "/dashboard", icon: LayoutDashboard },
    { label: "Markets", href: "/markets", icon: TrendingUp },
    { label: "Holdings", href: "/portfolio", icon: PieChart },
    { label: "Plan", href: "/investment-plan", icon: Sliders },
  ];

  const moreTabs = [
    { label: "Activity Ledger", href: "/activity", icon: History, desc: "Double-entry simulated ledger receipts" },
    { label: "Health & Risk", href: "/insights", icon: Sparkles, desc: "HHI diversification & stress tests" },
    { label: "Financial Goals", href: "/goals", icon: Target, desc: "Wealth compounding progress tracker" },
    { label: "Notifications", href: "/notifications", icon: Bell, badge: unreadCount, desc: "Alerts & rebalance drift signals" },
    { label: "Investor Profile", href: "/profile", icon: User, desc: "Tier 1 KYC & verification status" },
    { label: "Platform Settings", href: "/settings", icon: Settings, desc: "Currency formats & demo data reset" },
  ];

  return (
    <>
      {/* Floating Tactical Dock - Directly inspired by images 3, 4, 5 */}
      <div className="md:hidden fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none">
        <nav
          className="pointer-events-auto max-w-sm mx-auto bg-[#0A1D16]/95 backdrop-blur-xl border border-[#18392B] rounded-full px-2 py-1.5 shadow-2xl shadow-black/30 flex items-center justify-around"
          aria-label="Mobile Navigation Dock"
        >
          {mainTabs.map((tab) => {
            const isActive =
              pathname === tab.href ||
              (tab.href !== "/dashboard" && pathname.startsWith(tab.href));
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-200 ${
                  isActive
                    ? "text-[#00E599]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <div className="relative">
                  <Icon className={`h-4 w-4 transition-transform ${isActive ? "scale-110 stroke-[2.3]" : "stroke-[1.8]"}`} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#00E599] rounded-full shadow-[0_0_6px_#00E599]"></span>
                  )}
                </div>
                <span className={`text-[9px] font-sans font-medium mt-1 tracking-tight ${isActive ? "text-[#00E599] font-bold" : "text-zinc-400"}`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMoreMenuOpen(true)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-200 ${
              moreMenuOpen
                ? "text-[#00E599]"
                : "text-zinc-400 hover:text-white"
            }`}
            aria-label="Open secondary navigation menu"
          >
            <div className="relative">
              <Menu className="h-4 w-4 stroke-[1.8]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-[#00E599] rounded-full animate-pulse"></span>
              )}
            </div>
            <span className="text-[9px] font-sans font-medium mt-1 tracking-tight text-zinc-400">
              More
            </span>
          </button>
        </nav>
      </div>

      {/* Slide-up Tactical Drawer for Mobile */}
      {moreMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm font-sans animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setMoreMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full bg-[#0A1D16] text-white p-6 pb-10 rounded-t-3xl border-t border-[#1C4232] shadow-2xl animate-in slide-in-from-bottom duration-250 max-h-[85vh] overflow-y-auto">
            {/* Grab handle */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-4 border-b border-[#163628]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#00E599]"></span>
                <span className="font-serif text-lg text-white font-medium">NIVARA Platform Suite</span>
              </div>
              <button
                onClick={() => setMoreMenuOpen(false)}
                className="p-1.5 rounded-full bg-[#122A20] text-zinc-300 hover:text-white hover:bg-[#18382B]"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="py-4 grid grid-cols-1 gap-2">
              {moreTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = pathname === tab.href;

                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    onClick={() => setMoreMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isActive
                        ? "bg-[#102B20] border-[#00E599]/40 text-[#00E599]"
                        : "bg-[#0E241B] border-[#163628] text-zinc-200 hover:bg-[#143224]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isActive ? "bg-[#00E599] text-[#061610]" : "bg-[#163628] text-zinc-300"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold">{tab.label}</div>
                        <div className="text-[10px] text-zinc-400">{tab.desc}</div>
                      </div>
                    </div>

                    {tab.badge && tab.badge > 0 ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00E599] text-[#061610]">
                        {tab.badge}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-500">→</span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#163628] flex items-center justify-between text-[11px] text-zinc-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E599]"></span>
                Tier 1 Demo Engine
              </span>
              <Link
                href="/safety"
                onClick={() => setMoreMenuOpen(false)}
                className="text-[#00E599] hover:underline"
              >
                Disclosures
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
