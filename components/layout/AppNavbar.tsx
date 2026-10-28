"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { DemoBadge } from "../ui/DemoBadge";
import { BrandLogo } from "../ui/BrandLogo";
import { MarketStatusBadge } from "../ui/MarketStatusBadge";
import { INDIAN_STOCKS } from "../../lib/data/stocks";
import { formatINR } from "../../lib/utils/formatters";
import {
  Search,
  Bell,
  Plus,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Check,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export function AppNavbar() {
  const router = useRouter();
  const {
    user,
    signOut,
    notifications,
    markAsRead,
    markAllAsRead,
    setIsCommandPaletteOpen,
    setIsAddFundsOpen,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter((n) => !n.read);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? INDIAN_STOCKS.filter(
        (s) =>
          s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.sector.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#D3E5DC] bg-white/90 backdrop-blur-md px-4 sm:px-6 font-sans">
        {/* Left Search & Mobile Logo */}
        <div className="flex items-center gap-3 flex-1 max-w-md min-w-0">
          <div className="md:hidden shrink-0">
            <BrandLogo size="sm" showSubtitle={false} />
          </div>

          <div ref={searchRef} className="relative w-full min-w-0">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#587F6E]" />
              <input
                type="text"
                placeholder="Search markets & Indian stocks (e.g. Reliance, TCS)..."
                value={searchQuery}
                onFocus={() => setIsSearching(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearching(true);
                }}
                className="w-full rounded-full border border-[#D3E5DC] bg-[#EDF6F2]/70 py-2 pl-9 pr-14 text-xs font-sans text-[#071912] placeholder:text-[#587F6E] focus:bg-white focus:border-[#0A1D16] focus:ring-1 focus:ring-[#0A1D16] focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setIsCommandPaletteOpen(true)}
                className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#587F6E] bg-white border border-[#D3E5DC] px-1.5 py-0.5 rounded-md hover:bg-[#EDF6F2] transition-colors"
                title="Open Command Palette (⌘K / Ctrl+K)"
              >
                ⌘K
              </button>
            </div>

            {/* Quick Search Dropdown */}
            {isSearching && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-[#D3E5DC] bg-white shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#587F6E] border-b border-[#D3E5DC]">
                  Equities ({searchResults.length})
                </div>
                {searchResults.length > 0 ? (
                  searchResults.map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => {
                        router.push(`/stocks/${stock.symbol}`);
                        setIsSearching(false);
                        setSearchQuery("");
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-[#EDF6F2] flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#0A1D16] text-[#00E599] flex items-center justify-center font-mono font-bold text-xs">
                          {stock.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#071912] group-hover:text-[#0A1D16]">
                            {stock.name}
                          </div>
                          <div className="text-[10px] font-mono text-[#587F6E]">
                            {stock.symbol} • {stock.sector}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-[#071912]">
                          {formatINR(stock.currentPrice)}
                        </div>
                        <div
                          className={`text-[10px] font-mono ${
                            stock.change >= 0 ? "text-[#00A86B]" : "text-[#E63946]"
                          }`}
                        >
                          {stock.change >= 0 ? "+" : ""}
                          {stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-xs text-[#587F6E] text-center">
                    No securities found matching &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Actions: Demo Indicator, Notification, Add Funds, Avatar */}
        <div className="flex items-center gap-2.5">
          <div className="hidden md:block">
            <MarketStatusBadge />
          </div>

          <div className="hidden lg:block">
            <DemoBadge compact />
          </div>

          <button
            onClick={() => setIsAddFundsOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D3E5DC] bg-[#EDF6F2] hover:bg-[#00E599] text-[#0A1D16] text-xs font-semibold transition-all shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Deposit</span>
          </button>

          {/* Notifications Dropdown */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-full text-[#18382C] hover:bg-[#EDF6F2] transition-colors"
              aria-label="View notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#00E599] ring-2 ring-white"></span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#D3E5DC] bg-white shadow-xl py-2 z-50 animate-in fade-in duration-150">
                <div className="flex items-center justify-between px-4 py-2 border-b border-[#D3E5DC]">
                  <span className="text-xs font-semibold text-[#071912]">Notifications</span>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={() => markAllAsRead()}
                      className="text-[10px] font-mono text-[#00A86B] hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#D3E5DC]">
                  {notifications.slice(0, 4).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-3 text-xs cursor-pointer hover:bg-[#EDF6F2] transition-colors ${
                        !notif.read ? "bg-[#EDF6F2]/40" : ""
                      }`}
                    >
                      <div className="font-semibold text-[#071912] flex items-center justify-between">
                        <span>{notif.title}</span>
                        {!notif.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#00E599]"></span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#587F6E] mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 px-3 border-t border-[#D3E5DC] text-center">
                  <Link
                    href="/notifications"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-xs text-[#0A1D16] font-semibold hover:underline"
                  >
                    View all notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-[#D3E5DC] hover:bg-[#EDF6F2] transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-[#0A1D16] text-[#00E599] flex items-center justify-center font-bold text-[10px]">
                {user?.name ? user.name[0] : "A"}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-[#071912]">
                {user?.name?.split(" ")[0] || "Arjun"}
              </span>
              <ChevronDown className="h-3 w-3 text-[#587F6E]" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#D3E5DC] bg-white shadow-xl py-2 z-50 animate-in fade-in duration-150">
                <div className="px-4 py-2 border-b border-[#D3E5DC]">
                  <div className="text-xs font-semibold text-[#071912]">{user?.name}</div>
                  <div className="text-[10px] font-mono text-[#587F6E] truncate">{user?.email}</div>
                  <div className="text-[9px] font-mono text-[#00A86B] font-bold mt-1">
                    ● {user?.investorTier || "Tier 1 Demo"}
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-[#18382C] hover:bg-[#EDF6F2]"
                  >
                    <User className="h-3.5 w-3.5 text-[#587F6E]" />
                    <span>Investor Profile</span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-[#18382C] hover:bg-[#EDF6F2]"
                  >
                    <Settings className="h-3.5 w-3.5 text-[#587F6E]" />
                    <span>Preferences & Reset</span>
                  </Link>
                </div>

                <div className="border-t border-[#D3E5DC] pt-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[#E63946] hover:bg-[#FDF0F1]"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
