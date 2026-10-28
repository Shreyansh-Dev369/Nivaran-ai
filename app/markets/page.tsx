"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "../../components/layout/AppShell";
import { useApp } from "../../context/AppContext";
import { INDIAN_STOCKS, STOCK_SECTORS } from "../../lib/data/stocks";
import { formatINR, formatMarketCapCr } from "../../lib/utils/formatters";
import { SectorHeatmap } from "../../components/markets/SectorHeatmap";
import { MiniSparkline } from "../../components/charts/MiniSparkline";
import {
  Search,
  Star,
  ArrowUpDown,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function MarketsPage() {
  const { watchlist, toggleWatchlist } = useApp();

  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("ALL");
  const [selectedExchange, setSelectedExchange] = useState<"ALL" | "NSE" | "BSE">("ALL");
  const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"CAP" | "CHANGE" | "PRICE" | "NAME">("CAP");

  const filtered = INDIAN_STOCKS.filter((s) => {
    const matchesSearch =
      s.symbol.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase());
    const matchesSector = selectedSector === "ALL" || s.sector === selectedSector;
    const matchesExchange = selectedExchange === "ALL" || s.exchange === selectedExchange;
    const matchesWatchlist = !showWatchlistOnly || watchlist.includes(s.symbol);

    return matchesSearch && matchesSector && matchesExchange && matchesWatchlist;
  });

  filtered.sort((a, b) => {
    if (sortBy === "CAP") return b.marketCapCr - a.marketCapCr;
    if (sortBy === "CHANGE") return b.changePercent - a.changePercent;
    if (sortBy === "PRICE") return b.currentPrice - a.currentPrice;
    if (sortBy === "NAME") return a.name.localeCompare(b.name);
    return 0;
  });

  // Top Movers (highest absolute percentage shift)
  const topMovers = [...INDIAN_STOCKS]
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 4);

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8 w-full font-sans">
        {/* Masthead Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D3E5DC]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00A86B] font-bold">
                Market Discovery
              </span>
              <span className="text-[10px] font-mono text-[#587F6E]">• NSE & BSE Universe</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#071912] font-semibold mt-0.5">
              Eligible Indian Equities
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWatchlistOnly(!showWatchlistOnly)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono uppercase font-bold border transition-all ${
                showWatchlistOnly
                  ? "bg-[#0A1D16] text-[#00E599] border-[#0A1D16] shadow-xs"
                  : "bg-white text-[#18382C] border-[#D3E5DC] hover:bg-[#EDF6F2]"
              }`}
            >
              <Star className={`h-3.5 w-3.5 ${showWatchlistOnly ? "fill-[#00E599] text-[#00E599]" : "text-[#587F6E]"}`} />
              <span>Watchlist ({watchlist.length})</span>
            </button>
          </div>
        </div>

        {/* SECTOR CAPITALIZATION HEATMAP */}
        <div className="scroll-reveal">
          <SectorHeatmap
            selectedSector={selectedSector}
            onSelectSector={setSelectedSector}
          />
        </div>

        {/* TOP MOVERS CARDS ROW - Directly inspired by Images 3 & 5 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#071912] flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-[#00A86B]" />
              <span>Top Market Movers Today</span>
            </span>
            <span className="text-[10px] font-mono text-[#587F6E]">By Percentage Shift</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {topMovers.map((stock) => {
              const isUp = stock.change >= 0;

              return (
                <Link
                  key={stock.symbol}
                  href={`/stocks/${stock.symbol}`}
                  className="p-4 rounded-2xl bg-white border border-[#D3E5DC] shadow-xs hover:border-[#00E599] transition-all group artistic-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-xl bg-[#0A1D16] text-[#00E599] flex items-center justify-center font-mono font-bold text-xs group-hover:scale-105 transition-transform">
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isUp ? "bg-[#E6F9F1] text-[#00A86B]" : "bg-[#FDF0F1] text-[#E63946]"
                      }`}
                    >
                      {isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%
                    </span>
                  </div>

                  <div className="font-bold text-xs text-[#071912] truncate">{stock.name}</div>
                  <div className="text-[10px] font-mono text-[#587F6E]">{stock.symbol}</div>

                  <div className="mt-2 pt-2 border-t border-[#EDF6F2] flex items-center justify-between font-mono text-xs">
                    <span className="font-serif font-bold text-[#071912]">
                      {formatINR(stock.currentPrice, { showPaise: true })}
                    </span>
                    <span className="text-[10px] text-[#587F6E]">Beta {stock.beta}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* SEARCH & FILTERS STRIP */}
        <div className="rounded-3xl bg-white p-5 border border-[#D3E5DC] shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input with Rounded Pill */}
            <div className="sm:col-span-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#587F6E]" />
              <input
                type="text"
                placeholder="Search securities by company or ticker (e.g. Reliance, TCS, HDFC)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-[#D3E5DC] bg-[#EDF6F2]/60 py-2.5 pl-10 pr-4 text-xs font-sans text-[#071912] placeholder:text-[#587F6E] focus:bg-white focus:border-[#0A1D16] focus:outline-none transition-all"
              />
            </div>

            {/* Exchange Toggle */}
            <div className="sm:col-span-3 flex bg-[#EDF6F2] p-1 rounded-full border border-[#D3E5DC] font-mono text-xs">
              {(["ALL", "NSE", "BSE"] as const).map((ex) => (
                <button
                  key={ex}
                  onClick={() => setSelectedExchange(ex)}
                  className={`flex-1 py-1 rounded-full font-semibold uppercase tracking-wider transition-all ${
                    selectedExchange === ex
                      ? "bg-[#0A1D16] text-[#00E599] shadow-xs"
                      : "text-[#587F6E] hover:text-[#071912]"
                  }`}
                >
                  {ex}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="sm:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full rounded-full border border-[#D3E5DC] bg-[#EDF6F2]/60 py-2.5 px-4 text-xs font-mono text-[#071912] focus:bg-white focus:border-[#0A1D16] focus:outline-none cursor-pointer"
              >
                <option value="CAP">Sort: Market Cap</option>
                <option value="CHANGE">Sort: Day Change %</option>
                <option value="PRICE">Sort: Share Price</option>
                <option value="NAME">Sort: Company Name</option>
              </select>
            </div>
          </div>

          {/* Sector Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-xs">
            <button
              onClick={() => setSelectedSector("ALL")}
              className={`px-3 py-1 rounded-full shrink-0 font-semibold transition-all ${
                selectedSector === "ALL"
                  ? "bg-[#0A1D16] text-[#00E599] shadow-xs"
                  : "bg-[#EDF6F2] text-[#587F6E] hover:text-[#071912]"
              }`}
            >
              All Sectors
            </button>
            {STOCK_SECTORS.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-3 py-1 rounded-full shrink-0 font-semibold transition-all ${
                  selectedSector === sec
                    ? "bg-[#0A1D16] text-[#00E599] shadow-xs"
                    : "bg-[#EDF6F2] text-[#587F6E] hover:text-[#071912]"
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* EQUITIES TABLE */}
        <div className="rounded-3xl bg-white border border-[#D3E5DC] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#F4FAF7] text-[#587F6E] font-mono text-[10px] uppercase tracking-wider border-b border-[#D3E5DC]">
                <tr>
                  <th className="py-3.5 px-3 w-8"></th>
                  <th className="py-3.5 px-4">Security & Sector</th>
                  <th className="py-3.5 px-4 text-right">Market Cap</th>
                  <th className="py-3.5 px-4 text-right">LTP (INR)</th>
                  <th className="py-3.5 px-4 text-right">Day Shift</th>
                  <th className="py-3.5 px-3 text-center hidden md:table-cell">30D Trend</th>
                  <th className="py-3.5 px-4 text-right">P/E</th>
                  <th className="py-3.5 px-4 text-right">Div. Yield</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D3E5DC]">
                {filtered.map((stock) => {
                  const isUp = stock.change >= 0;
                  const isFav = watchlist.includes(stock.symbol);

                  return (
                    <tr
                      key={stock.symbol}
                      className="hover:bg-[#EDF6F2]/40 transition-colors group"
                    >
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => toggleWatchlist(stock.symbol)}
                          className="p-1 hover:text-amber-500 transition-colors"
                          aria-label={`Toggle ${stock.symbol} in watchlist`}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              isFav
                                ? "fill-amber-400 text-amber-500"
                                : "text-[#587F6E]/50 hover:text-[#587F6E]"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/stocks/${stock.symbol}`}
                          className="flex items-center gap-3 group-hover:text-[#0A1D16]"
                        >
                          <div className="w-8 h-8 rounded-xl bg-[#0A1D16] text-[#00E599] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                            {stock.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <span className="font-bold text-[#071912] group-hover:underline block">
                              {stock.name}
                            </span>
                            <span className="font-mono text-[10px] text-[#587F6E]">
                              {stock.symbol} • {stock.sector} • Beta {stock.beta}
                            </span>
                          </div>
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#587F6E]">
                        {formatMarketCapCr(stock.marketCapCr)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#071912] tabular-nums">
                        {formatINR(stock.currentPrice, { showPaise: true })}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isUp
                              ? "bg-[#E6F9F1] text-[#00A86B]"
                              : "bg-[#FDF0F1] text-[#E63946]"
                          }`}
                        >
                          {isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center hidden md:table-cell">
                        <MiniSparkline changePercent={stock.changePercent} />
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#587F6E]">
                        {stock.peRatio}x
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#00A86B] font-semibold">
                        {stock.divYield}%
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          href={`/stocks/${stock.symbol}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EDF6F2] hover:bg-[#00E599] text-[#0A1D16] text-xs font-semibold transition-colors"
                        >
                          <span>Analyze</span>
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
